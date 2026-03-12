import { AIStudioAdapter } from "./aistudio"
import { SiteAdapter } from "./base"
import { ChatGLMAdapter } from "./chatglm"
import { ChatGPTAdapter } from "./chatgpt"
import { ClaudeAdapter } from "./claude"
import { DeepSeekAdapter } from "./deepseek"
import { DoubaoAdapter } from "./doubao"
import { GeminiEnterpriseAdapter } from "./gemini-enterprise"
import { GeminiAdapter } from "./gemini"
import { GrokAdapter } from "./grok"
import { KimiAdapter } from "./kimi"

const adapters: SiteAdapter[] = [
  new GeminiAdapter(),
  new GeminiEnterpriseAdapter(),
  new ChatGPTAdapter(),
  new ClaudeAdapter(),
  new AIStudioAdapter(),
  new GrokAdapter(),
  new DeepSeekAdapter(),
  new DoubaoAdapter(),
  new ChatGLMAdapter(),
  new KimiAdapter(),
]

/**
 * 获取当前页面匹配的适配器
 */
export function getAdapter(): SiteAdapter | null {
  return adapters.find((adapter) => adapter.match()) || null
}

export type { SiteAdapter, ExportConfig } from "./base"
