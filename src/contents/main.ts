import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: [
    "https://gemini.google.com/*",
    "https://business.gemini.google/*",
    "https://aistudio.google.com/*",
    "https://grok.com/*",
    "https://chat.openai.com/*",
    "https://chatgpt.com/*",
    "https://claude.ai/*",
    "https://www.doubao.com/*",
    "https://chat.deepseek.com/*",
    "https://www.kimi.com/*",
    "https://chatglm.cn/*",
  ],
  run_at: "document_idle",
}

// Minimal initialization
if (!(window as any).ophelInitialized) {
  (window as any).ophelInitialized = true
  console.log("[Ophel] Copy Markdown initialized")
}
