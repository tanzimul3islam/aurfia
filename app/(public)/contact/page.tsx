"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please email us directly.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-sm text-neutral-800">
      <h1 className="font-serif text-2xl mb-6">Contact</h1>

      <p className="mb-8 leading-relaxed">
        If you have questions about your order, our jewelry pieces, or our
        service, send us a message below. We typically respond within 24 hours.
      </p>

      {sent && (
        <p className="text-emerald-600 mb-6">
          Thank you! Your message has been sent. We&apos;ll get back to you
          soon.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full h-11 px-3 border border-zinc-200 rounded-none focus:outline-none focus:border-zinc-900"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-11 px-3 border border-zinc-200 rounded-none focus:outline-none focus:border-zinc-900"
          />
        </div>
        <div>
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
            className="w-full px-3 py-2 border border-zinc-200 rounded-none focus:outline-none focus:border-zinc-900 resize-none"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="h-11 px-6 bg-zinc-900 text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
