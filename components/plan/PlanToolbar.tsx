"use client";

import React from "react";
import {
  AlertCircle,
  CalendarPlus,
  Check,
  Copy,
  Download,
  Pencil,
  Printer,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Menu } from "@/components/ui/Menu";

interface PlanToolbarProps {
  onReset: () => void;
  onShare: () => void;
  onExportCalendar: () => void;
  onCopySummary: () => void;
  onExportJson: () => void;
  onPrint: () => void;
  copied: "summary" | "link" | null;
  copyError: "summary" | "link" | null;
}

export function PlanToolbar({
  onReset,
  onShare,
  onExportCalendar,
  onCopySummary,
  onExportJson,
  onPrint,
  copied,
  copyError,
}: PlanToolbarProps) {
  const shareLabel =
    copyError === "link"
      ? "Could not copy"
      : copied === "link"
        ? "Link copied"
        : "Share";

  const summaryIcon =
    copyError === "summary" ? AlertCircle : copied === "summary" ? Check : Copy;

  return (
    <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Button
        variant="quiet"
        size="sm"
        onClick={onReset}
        className="-ml-2 w-fit"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        Edit details
      </Button>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={onShare}>
          {copied === "link" ? (
            <Check className="h-3.5 w-3.5 text-positive" aria-hidden="true" />
          ) : copyError === "link" ? (
            <AlertCircle className="h-3.5 w-3.5 text-danger" aria-hidden="true" />
          ) : (
            <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {shareLabel}
        </Button>

        <Button size="sm" onClick={onExportCalendar}>
          <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
          Add to calendar
        </Button>

        <Menu
          label="More"
          actions={[
            {
              label:
                copyError === "summary"
                  ? "Could not copy summary"
                  : copied === "summary"
                    ? "Summary copied"
                    : "Copy summary",
              icon: summaryIcon,
              onSelect: onCopySummary,
            },
            { label: "Download data", icon: Download, onSelect: onExportJson },
            { label: "Print plan", icon: Printer, onSelect: onPrint },
          ]}
        />
      </div>
    </div>
  );
}
