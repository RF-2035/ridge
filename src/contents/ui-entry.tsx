import type { PlasmoCSConfig, PlasmoMountShadowHost } from "plasmo"
import React from "react"
import { App } from "~components/App"

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
}

/**
 * 自定义 Shadow Host 挂载位置
 *
 * 默认挂载到 document.body（大多数站点）
 * ChatGPT / Grok 特殊处理：延迟挂载 + MutationObserver 监控重挂载
 * 因为这些站点的 React Hydration 会清除 body 下的非预期元素
 */
export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
}) => {
  const hostname = window.location.hostname
  const needsDelayedMount =
    hostname.includes("chatgpt.com") ||
    hostname.includes("chat.openai.com") ||
    hostname.includes("grok.com") ||
    hostname.includes("claude.ai") ||
    hostname.includes("deepseek.com")

  const doMount = () => {
    if (!shadowHost.parentElement) {
      document.body.appendChild(shadowHost)
    }
  }

  if (needsDelayedMount) {
    const delays = [500, 1000, 2000, 3000]
    delays.forEach((delay) => setTimeout(doMount, delay))

    const observer = new MutationObserver(() => {
      if (!shadowHost.parentElement) doMount()
    })
    observer.observe(document.body, { childList: true, subtree: false })
  } else {
    doMount()
  }
}

const PlasmoApp = () => <App />
export default PlasmoApp
