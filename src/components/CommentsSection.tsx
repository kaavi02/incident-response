"use client";

import { useState } from "react";
import { addComment } from "@/actions/incidents";

import { toast } from "react-hot-toast";

export default function CommentsSection({ incidentId, userId, comments }: { incidentId: string, userId: string, comments: any[] }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addComment(incidentId, userId, content);
      setContent("");
      toast.success("Comment posted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-headline-sm font-headline-sm font-semibold text-on-surface mb-4">
        War Room Notes & Updates
      </h3>

      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 rounded-lg bg-surface-container/50 border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-on-surface text-body-sm">{comment.author.name || comment.author.email}</span>
              <span className="text-telemetry-sm text-on-surface-variant font-mono" suppressHydrationWarning>
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-body-md text-on-surface-variant whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-on-surface-variant text-body-sm italic">No updates logged yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Log an update or finding..."
          className="w-full min-h-[100px] p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-body-md focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-y"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="absolute bottom-4 right-4 flex items-center gap-1.5 px-4 py-1.5 bg-primary text-on-primary rounded-lg font-semibold disabled:opacity-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
          Post
        </button>
      </form>
    </div>
  );
}
