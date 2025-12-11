"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chatbot.module.css";

interface Message {
  text: string;
  isBot: boolean;
}

interface RagResponse {
  answer: string;
  sources?: { title: string; path: string }[];
  error?: string;
}

export default function Chatbot({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "RAGチャットアシスタントです。質問を入力してください。",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (loading) return;
    const question = input.trim();
    if (!question) return;

    const userMessage = { text: question, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setLoading(true);
    fetch(`/api/rag?q=${encodeURIComponent(question)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          console.error("Server response:", await res.text());
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return (await res.json()) as RagResponse;
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }

        if (!data || !data.answer) {
          throw new Error("Invalid response format");
        }

        const referenceText =
          data.sources && data.sources.length > 0
            ? "\n\n参考:\n" +
              data.sources
                .map((src) => `・${src.title} (${src.path})`)
                .join("\n")
            : "";

        const botMessage = {
          text: `${data.answer}${referenceText}`,
          isBot: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      })
      .catch((error) => {
        console.error("Error details:", error);
        const fallback = error instanceof Error ? error.message : "エラーが発生しました。";
        const errorMessage = { text: fallback || "エラーが発生しました。", isBot: true };
        setMessages((prev) => [...prev, errorMessage]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (loading) return;
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>チャットアシスタント</h3>
          {onClose && (
            <button aria-label="チャットを閉じる" onClick={onClose}>
              &times;
            </button>
          )}
        </div>
        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.isBot ? styles.botmessage : styles.usermessage}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.input}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="質問を入力してください..."
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading}>
            {loading ? "検索中..." : "送信"}
          </button>
        </div>
      </div>
    </div>
  );
}
