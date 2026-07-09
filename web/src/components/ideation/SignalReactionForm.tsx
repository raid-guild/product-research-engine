"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmojiReactionPicker } from "@/components/ideation/EmojiReactionPicker";

type SignalReactionFormProps = {
  relatedIdeaSlug: string;
  relatedIdeaTitle?: string;
};

export function SignalReactionForm({ relatedIdeaSlug, relatedIdeaTitle }: SignalReactionFormProps) {
  const router = useRouter();
  const [reactionEmoji, setReactionEmoji] = useState("👀");
  const [note, setNote] = useState("");
  const [researchQuestion, setResearchQuestion] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/signal-reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        relatedIdeaSlug,
        relatedIdeaTitle,
        reactionEmoji,
        note,
        researchQuestion,
        submittedBy,
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.error ?? "Could not save signal reaction.");
      return;
    }

    setNote("");
    setResearchQuestion("");
    setSubmittedBy("");
    toast.success("Signal reaction saved.");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-border bg-card/80 p-5">
      <div className="space-y-2">
        <Label>Reaction</Label>
        <EmojiReactionPicker value={reactionEmoji} onChange={setReactionEmoji} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="What reaction, signal, concern, or observation should we capture?"
          required
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="research-question">Optional research question</Label>
        <Textarea
          id="research-question"
          value={researchQuestion}
          onChange={(event) => setResearchQuestion(event.target.value)}
          placeholder="What should carry forward into research?"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="submitted-by">Name, handle, or blank for anon</Label>
        <Input
          id="submitted-by"
          value={submittedBy}
          onChange={(event) => setSubmittedBy(event.target.value)}
          placeholder="Anon"
        />
      </div>

      <Button type="submit" disabled={isSubmitting || note.trim().length < 3} className="gap-2">
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Saving..." : "Save Signal"}
      </Button>
    </form>
  );
}
