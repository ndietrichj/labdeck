import { useMemo, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AgentConsoleProps = {
  backendUrl?: string;
  providerId: string;
  model: string;
};

export default function AgentConsole({ backendUrl, providerId, model }: AgentConsoleProps) {
  const apiBase = useMemo(() => {
    return (
      backendUrl ||
      import.meta.env.VITE_LABDECK_BACKEND_BASE_URL ||
      "http://localhost:8787/api"
    ).replace(/\/$/, "");
  }, [backendUrl]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "LabDeck local AI console online. Pick a provider/model and send a prompt." },
  ]);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendPrompt() {
    const trimmed = prompt.trim();
    if (!trimmed || busy) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setPrompt("");
    setBusy(true);

    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, model, prompt: trimmed, messages: nextMessages }),
      });

      const raw = await res.text();
      let data: any;

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(`Backend returned non-JSON from ${apiBase}/chat. Is server/index.ts running on :8787?`);
      }

      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);

      setMessages([...nextMessages, { role: "assistant", content: data.response ?? "(empty response)" }]);
    } catch (err: any) {
      setMessages([...nextMessages, { role: "assistant", content: `Request failed: ${err?.message ?? "unknown error"}` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="agent-console">
      <div className="agent-transcript">
        {messages.map((message, index) => (
          <div className={`agent-message ${message.role}`} key={`${message.role}-${index}`}>
            <div className="agent-role">{message.role}</div>
            <pre>{message.content}</pre>
          </div>
        ))}
        {busy && <div className="agent-thinking">Running local inference…</div>}
      </div>

      <div className="agent-composer">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              sendPrompt();
            }
          }}
          placeholder="Ask a local model… Ctrl+Enter to send"
        />
        <button onClick={sendPrompt} disabled={busy || !prompt.trim()}>
          {busy ? "Running…" : "Send"}
        </button>
      </div>
    </div>
  );
}

