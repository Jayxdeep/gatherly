import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EventInputSchema, EventPlanSchema } from "@/lib/schemas/event";
import { SYSTEM_INSTRUCTION, generateEventPrompt } from "@/lib/ai/prompts";
import { generateDeterministicPlan } from "@/lib/ai/fallbackEngine";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Strict Input Validation with Zod
    const validationResult = EventInputSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid event input parameters",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const input = validationResult.data;
    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Execution via Gemini API if key is present
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: SYSTEM_INSTRUCTION,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const prompt = generateEventPrompt(input);
        const response = await model.generateContent(prompt);
        const candidate = response.response?.candidates?.[0];
        const finishReason = candidate?.finishReason;

        // Inspect candidate finish reason for safety or recitation blocks
        const blockedReasons = ["SAFETY", "RECITATION", "BLOCKLIST", "PROHIBITED_CONTENT", "SPII"];
        if (!candidate || (finishReason && blockedReasons.includes(finishReason))) {
          console.warn(
            `[Gatherly AI Proxy] Gemini generation blocked by policy (finishReason: ${finishReason || "NO_CANDIDATE"}). Falling back to deterministic engine.`
          );
          const fallbackPlan = generateDeterministicPlan(input);
          return NextResponse.json({
            success: true,
            source: "engine-fallback",
            plan: fallbackPlan,
            notice: `Generated via deterministic engine due to content policy (${finishReason || "RESTRICTED"}).`,
          });
        }

        // Safely extract text
        let responseText = "";
        try {
          responseText = response.response.text();
        } catch (textExtractErr) {
          console.warn(
            "[Gatherly AI Proxy] response.text() threw (likely safety flag). Falling back:",
            textExtractErr
          );
          const fallbackPlan = generateDeterministicPlan(input);
          return NextResponse.json({
            success: true,
            source: "engine-fallback",
            plan: fallbackPlan,
          });
        }

        // Strip any residual markdown markers if present
        const cleanedJson = responseText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/```$/, "")
          .trim();

        const rawJson = JSON.parse(cleanedJson);

        // Enforce isUrgentMode rule strictly
        if (input.daysRemaining < 7) {
          rawJson.isUrgentMode = true;
        }

        // Validate LLM output against the Master Output Schema
        const validatedPlan = EventPlanSchema.parse(rawJson);

        return NextResponse.json({
          success: true,
          source: "gemini",
          plan: validatedPlan,
        });
      } catch (geminiError) {
        console.warn(
          "Gemini API request failed or returned non-conforming structure. Falling back to deterministic orchestration engine:",
          geminiError
        );
        // Resilient fallback to deterministic engine
        const fallbackPlan = generateDeterministicPlan(input);
        return NextResponse.json({
          success: true,
          source: "engine-fallback",
          plan: fallbackPlan,
        });
      }
    }

    // 3. Deterministic Engine if no API key is configured
    const plan = generateDeterministicPlan(input);
    return NextResponse.json({
      success: true,
      source: "engine",
      plan,
    });
  } catch (error) {
    console.error("Unhandled error in /api/planner:", error);
    return NextResponse.json(
      {
        error: "Internal server error occurred while orchestrating event plan.",
      },
      { status: 500 }
    );
  }
}
