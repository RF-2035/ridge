import { SITE_IDS } from "~constants"
import { SiteAdapter, type ExportConfig } from "./base"

export class AIStudioAdapter extends SiteAdapter {
  match(): boolean {
    return window.location.hostname === "aistudio.google.com"
  }

  getSiteId(): string {
    return SITE_IDS.AISTUDIO
  }

  getName(): string {
    return "AI Studio"
  }

  getExportConfig(): ExportConfig {
    return {
      userQuerySelector: ".chat-turn-container.user",
      assistantResponseSelector: ".chat-turn-container.model",
      turnSelector: ".chat-turn-container",
      useShadowDOM: false,
    }
  }

  extractUserQueryText(element: Element): string {
    const contentChunk = element.querySelector("ms-prompt-chunk.text-chunk, ms-prompt-chunk")
    if (contentChunk) {
      return contentChunk.textContent?.trim() || ""
    }
    const turnContent = element.querySelector(".turn-content")
    if (turnContent) {
      const clone = turnContent.cloneNode(true) as Element
      clone.querySelector(".author-label")?.remove()
      return clone.textContent?.trim() || ""
    }
    return super.extractUserQueryText(element)
  }

  extractAssistantResponseText(element: Element): string {
    const markdownNodes = element.querySelectorAll("ms-cmark-node")
    const lines: string[] = []
    
    for (const node of Array.from(markdownNodes)) {
      if (node.closest("ms-thought-chunk")) continue
      lines.push(this.extractTextWithLineBreaks(node))
    }

    // 思维链处理
    const thoughtChunks = element.querySelectorAll("ms-thought-chunk")
    const thoughtBlocks: string[] = []
    for (const thought of Array.from(thoughtChunks)) {
      const text = thought.textContent?.trim()
      if (text) {
        const quoted = text.split("\n").map(line => line.trim() ? `> ${line}` : ">").join("\n")
        thoughtBlocks.push(`> [Thoughts]\n${quoted}`)
      }
    }

    const body = lines.join("\n\n").trim()
    if (thoughtBlocks.length > 0) {
      return `${thoughtBlocks.join("\n\n")}\n\n${body}`
    }
    return body
  }

  getScrollContainer(): HTMLElement | null {
    return document.querySelector(".chat-container") || document.querySelector(".virtual-scroll-container") || super.getScrollContainer()
  }
}
