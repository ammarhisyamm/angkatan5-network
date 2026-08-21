"use client";

import React, { useState } from "react";
import { User } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useApp } from "@/lib/store/AppContext";
import { Send, CheckCircle2 } from "lucide-react";

export function ConnectModal({
  isOpen,
  onClose,
  receiver,
}: {
  isOpen: boolean;
  onClose: () => void;
  receiver: User;
}) {
  const { sendConnection } = useApp();
  const [message, setMessage] = useState(
    `Hi ${receiver?.name?.split(" ")[0] || "there"}, I'd like to connect with you on the Angkatan 5 Talent Network.`
  );
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiver) return;
    setIsSending(true);
    setTimeout(() => {
      sendConnection(receiver.id, message);
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Connect with ${receiver?.name}`}
      description="Send a short note to introduce yourself."
      maxWidth="md"
      footer={
        isSent ? undefined : (
          <>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="connect-form" variant="primary" size="sm" isLoading={isSending}>
              <Send className="size-3.5" strokeWidth={1.5} />
              Send Request
            </Button>
          </>
        )
      }
    >
      {isSent ? (
        <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success-lighter text-success-base">
            <CheckCircle2 className="size-6" strokeWidth={1.5} />
          </span>
          <div>
            <h4 className="text-base font-semibold leading-6 text-text-strong-950">Request sent</h4>
            <p className="mt-0.5 text-[13px] leading-5 text-text-sub-600">
              {receiver?.name} will receive your note.
            </p>
          </div>
        </div>
      ) : (
        <form id="connect-form" onSubmit={handleSend} className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-3">
            <img
              src={receiver?.avatar}
              alt=""
              className="size-10 shrink-0 rounded-full bg-bg-weak-50 object-cover ring-1 ring-stroke-soft-200"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-5 text-text-strong-950">{receiver?.name}</p>
              <p className="truncate text-xs leading-[18px] text-text-sub-600">
                {receiver?.role} at {receiver?.company}
              </p>
            </div>
          </div>

          <Textarea
            label="Your Message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a warm, concise message..."
            required
          />
        </form>
      )}
    </Modal>
  );
}
