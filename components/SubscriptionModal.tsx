"use client";

import React from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
}: SubscriptionModalProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirm(email);
    setEmail("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to Price Changes</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex justify-between gap-1 py-4 w-full"
        >
          <div className="flex items-center gap-4">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Subscribe</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
