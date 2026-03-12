import { SITE_IDS } from "~constants"
import { htmlToMarkdown } from "~utils/exporter"
import {
  SiteAdapter,
  type ExportConfig,
  type ExportLifecycleContext,
} from "./base"

const GEMINI_EXPORT_THOUGHT_MARKER_ATTR = "data-ophel-export-thought-id"

interface GeminiExportLifecycleState {
  toggledThoughtIds: string[]
}

export class GeminiAdapter extends SiteAdapter {
  match(): boolean {
    return (
      window.location.hostname.includes("gemini.google") &&
      !window.location.hostname.includes("business.gemini.google")
    )
  }

  getSiteId(): string {
    return SITE_IDS.GEMINI
  }

  getName(): string {
    return "Gemini"
  }

  getExportConfig(): ExportConfig {
    return {
      userQuerySelector: "user-query",
      assistantResponseSelector: "model-response, .model-response-container .markdown",
      turnSelector: ".conversation-turn",
      useShadowDOM: false,
    }
  }

  extractUserQueryText(element: Element): string {
    const clone = element.cloneNode(true) as Element
    clone.querySelectorAll(".cdk-visually-hidden").forEach((node) => node.remove())
    const queryText = clone.querySelector(".query-text")
    const target = queryText || clone
    return this.extractTextWithLineBreaks(target)
  }

  extractAssistantResponseText(element: Element): string {
    const clone = element.cloneNode(true) as Element
    clone.querySelectorAll(".cdk-visually-hidden").forEach((node) => node.remove())
    
    // 思维链处理
    const thoughtNodes = Array.from(clone.querySelectorAll("model-thoughts"))
    const thoughtBlocks: string[] = []
    
    for (const thought of thoughtNodes) {
      const thoughtContent = thought.querySelector('[data-test-id="thoughts-content"]') || thought.querySelector(".thoughts-content")
      if (thoughtContent) {
        const markdown = htmlToMarkdown(thoughtContent) || this.extractTextWithLineBreaks(thoughtContent)
        if (markdown.trim()) {
          const quoted = markdown.trim().split("\n").map(line => line.trim() ? `> ${line}` : ">").join("\n")
          thoughtBlocks.push(`> [Thoughts]\n${quoted}`)
        }
      }
      thought.remove()
    }

    const bodyMarkdown = htmlToMarkdown(clone) || this.extractTextWithLineBreaks(clone)
    const normalizedBody = bodyMarkdown.trim()

    if (thoughtBlocks.length > 0) {
      return `${thoughtBlocks.join("\n\n")}\n\n${normalizedBody}`
    }
    return normalizedBody
  }

  async prepareConversationExport(context: ExportLifecycleContext): Promise<GeminiExportLifecycleState> {
    const toggledThoughtIds: string[] = []
    const thoughts = document.querySelectorAll('model-thoughts')
    
    for (const thought of Array.from(thoughts)) {
      const button = thought.querySelector('button[data-test-id="thoughts-header-button"]') as HTMLElement
      const isExpanded = thought.querySelector('[data-test-id="thoughts-content"]') !== null
      
      if (button && !isExpanded) {
        const markerId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
        thought.setAttribute(GEMINI_EXPORT_THOUGHT_MARKER_ATTR, markerId)
        button.click()
        toggledThoughtIds.push(markerId)
        await new Promise(r => setTimeout(r, 200))
      }
    }
    return { toggledThoughtIds }
  }

  async restoreConversationAfterExport(_context: ExportLifecycleContext, state: unknown): Promise<void> {
    const s = state as GeminiExportLifecycleState
    if (!s?.toggledThoughtIds) return

    for (const markerId of s.toggledThoughtIds) {
      const thought = document.querySelector(`model-thoughts[${GEMINI_EXPORT_THOUGHT_MARKER_ATTR}="${markerId}"]`)
      const button = thought?.querySelector('button[data-test-id="thoughts-header-button"]') as HTMLElement
      if (button) {
        button.click()
        await new Promise(r => setTimeout(r, 100))
      }
      thought?.removeAttribute(GEMINI_EXPORT_THOUGHT_MARKER_ATTR)
    }
  }

  getScrollContainer(): HTMLElement | null {
    return (document.querySelector("infinite-scroller.chat-history") as HTMLElement) || super.getScrollContainer()
  }
}
