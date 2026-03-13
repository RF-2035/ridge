import React, { useState } from "react"
import { getAdapter } from "~adapters/index"
import { ConversationManager } from "~core/conversation-manager"
import { t } from "~utils/i18n"

export const App = () => {
  const [isCopied, setIsCopied] = useState(false)
  const adapter = getAdapter()

  if (!adapter) {
    return null
  }

  const handleCopyMarkdown = async () => {
    const manager = new ConversationManager(adapter)
    const success = await manager.exportConversationToClipboard()
    
    if (success) {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
      <button
        onClick={handleCopyMarkdown}
        title={t("copyMarkdown")}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "24px",
          backgroundColor: isCopied ? "#4CAF50" : "#007BFF",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s ease",
        }}>
        {isCopied ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        )}
      </button>
    </div>
  )
}
