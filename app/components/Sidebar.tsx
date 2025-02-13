"use client";

import React, { useState } from "react";
//import styles from "@/app/components/chatbot.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
//import ChatBot from "@/app/components/Rag";

const Sidebar: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  //const [showChat, setShowChat] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      setInputValue(""); // 検索後に入力をクリア
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // Enterキーで検索を実行
    }
  };

  return (
    <div className="sidebar">
      <div className="search-container" style={{ alignItems: "center" }}>
        <h3>サイト内検索</h3>
        <div style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="ここに入力して検索"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // 検索クエリを入力
            onKeyDown={handleKeyDown} // Enterキーで検索実行
            style={{
              padding: "8px",
              flexGrow: 1,
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginRight: "5px",
              height: "18px",
            }}
          />
          <button
            onClick={handleSearch} // ボタンを押すと検索実行
            style={{
              padding: "8px 16px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            検索
          </button>
        </div>
      </div>

      <div className="policy-link" style={{ alignItems: "center" }}>
        <h3 className="header">リンク集</h3>
        <p className="link_list">
          <Link href="/policy">本サイトについて</Link>
          <br />
          <Link href="/contact">お問い合わせ</Link>
          <br />
          <Link href="/process">線形代数の進め方</Link>
        </p>
      </div>
      {/*
      <div className={styles.buttoncontainer}>
        <button
          className={styles.toggle}
          onClick={() => setShowChat(!showChat)}
        >
          💬 チャットアシスタント
        </button>
      </div>
      {showChat && <ChatBot />}*/}
    </div>
  );
};

export default Sidebar;
