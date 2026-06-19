"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showErrorToast } from "@/src/utils/toast";

export default function PlayerNameForm({
  currentName,
  onSave,
  onCancel,
}: {
  currentName: string;
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const trimmedName = name.trim();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedName || saving) return;

    setSaving(true);
    try {
      await onSave(trimmedName);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Could not save player name.";
      showErrorToast("Name not saved", {
        description: message,
        id: `player-name-error:${message}`,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-4 border-t border-border/20 pt-4"
    >
      <label
        htmlFor="player-name"
        className="mb-2 block text-sm font-heading text-foreground"
      >
        Player name
      </label>
      <Input
        id="player-name"
        autoFocus
        autoComplete="nickname"
        value={name}
        maxLength={24}
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter a name"
        disabled={saving}
      />
      <div className="mt-3 flex gap-2">
        <Button
          type="submit"
          className="flex-1"
          disabled={
            saving ||
            !trimmedName ||
            trimmedName === currentName.trim()
          }
        >
          {saving ? <Loader2 className="animate-spin" /> : null}
          {saving ? "Saving" : "Save"}
        </Button>
        <Button
          type="button"
          variant="neutral"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
