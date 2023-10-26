import { CSS_LANGUAGE } from "./css/language";
import { JSON_LANGUAGE } from "./json/language";
import { PYTHON_LANGUAGE } from "./python/language";
import { TYPESCRIPT_LANGUAGE } from "./typescript/language";
import { PLAIN_TEXT_LANGUAGE } from "../../core/languages/plain-text";
import { MARKDOWN_LANGUAGE } from "./markdown/language";

export const LANGUAGE_PRESETS = [
  TYPESCRIPT_LANGUAGE,
  JSON_LANGUAGE,
  CSS_LANGUAGE,
  PYTHON_LANGUAGE,
  PLAIN_TEXT_LANGUAGE,
  MARKDOWN_LANGUAGE
] as const;
