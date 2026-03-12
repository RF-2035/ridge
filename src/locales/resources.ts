/**
 * 国际化资源 (Simplified)
 */

import { en } from "./en"
import { zhCN } from "./zh-CN"

export const resources = {
  "zh-CN": zhCN,
  "zh-TW": zhCN, // Fallback to zh-CN for simplicity
  en: en,
  ja: en, // Fallback to en
  ko: en,
  fr: en,
  de: en,
  ru: en,
  es: en,
  pt: en,
}

export type LocaleKey = keyof typeof zhCN
