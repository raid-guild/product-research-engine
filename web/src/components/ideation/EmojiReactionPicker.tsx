"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { reactionEmojiOptions } from "@/lib/validation/signal-reactions";

type EmojiReactionPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const labels: Record<string, string> = {
  "🔥": "Strong interest",
  "👀": "Curious",
  "⚠️": "Concern or risk",
  "❓": "Unclear",
  "🧊": "Skeptical",
  "💸": "Customer pain",
  "🧭": "Research question",
};

export function EmojiReactionPicker({ value, onChange }: EmojiReactionPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
      {reactionEmojiOptions.map((emoji) => (
        <Button
          key={emoji}
          type="button"
          variant="outline"
          title={labels[emoji]}
          aria-label={labels[emoji]}
          className={cn(
            "h-12 border-border bg-card text-xl hover:border-primary hover:bg-primary/10",
            value === emoji && "border-primary bg-primary/15 text-primary",
          )}
          onClick={() => onChange(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}
