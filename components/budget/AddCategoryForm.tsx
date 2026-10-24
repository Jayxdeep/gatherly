"use client";

import React, { useId, useState } from "react";
import type { BudgetItem } from "@/lib/schemas/event";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Controls";

type Priority = BudgetItem["priority"];

interface AddCategoryFormProps {
  onAdd: (name: string, percentage: number, priority: Priority) => void;
  onCancel: () => void;
}

export function AddCategoryForm({ onAdd, onCancel }: AddCategoryFormProps) {
  const formId = useId();
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState(5);
  const [priority, setPriority] = useState<Priority>("Flexible");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim()) return;
        onAdd(name.trim(), Number(percentage), priority);
        setName("");
        setPercentage(5);
        setPriority("Flexible");
      }}
      className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px_150px_auto] sm:items-end"
    >
      <Field label="Category name" htmlFor={`${formId}-name`}>
        <Input
          id={`${formId}-name`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Photographer, favours, transport"
          maxLength={60}
          required
          autoFocus
        />
      </Field>

      <Field label="Share" htmlFor={`${formId}-share`}>
        <Input
          id={`${formId}-share`}
          type="number"
          min="1"
          max="100"
          inputMode="numeric"
          value={percentage}
          onChange={(event) => setPercentage(Number(event.target.value))}
        />
      </Field>

      <Field label="Priority" htmlFor={`${formId}-priority`}>
        <Select
          id={`${formId}-priority`}
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority)}
        >
          <option value="Critical">Critical</option>
          <option value="Flexible">Flexible</option>
          <option value="Optional">Optional</option>
        </Select>
      </Field>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="sm">
          Add
        </Button>
        <Button size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
