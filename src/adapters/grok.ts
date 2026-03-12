import { SITE_IDS } from "~constants"
import { SiteAdapter, type ExportConfig } from "./base"

export class GrokAdapter extends SiteAdapter {
  match(): boolean {
    return window.location.hostname === "grok.com" || window.location.hostname.endsWith(".grok.com")
  }

  getSiteId(): string {
    return SITE_IDS.GROK
  }

  getName(): string {
    return "Grok"
  }

  getExportConfig(): ExportConfig {
    return {
      userQuerySelector: ".message-bubble.rounded-br-lg",
      assistantResponseSelector: ".message-bubble:not(.rounded-br-lg) .response-content-markdown",
      turnSelector: null,
      useShadowDOM: false,
    }
  }

  getScrollContainer(): HTMLElement | null {
    const main = document.querySelector("main")
    if (main) {
      const scrollable = main.querySelector('[class*="overflow-auto"]') as HTMLElement
      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        return scrollable
      }
    }
    return super.getScrollContainer()
  }
}
