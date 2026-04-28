/**
 * Edit before deployment — outbound links used by desktop chrome & memo footer.
 */

/** GitHub profile */
export const GITHUB_URL = "https://github.com/AdamMomen";

/** Résumé (Google Doc — ensure link sharing is set for reviewers). */
export const RESUME_URL =
  "https://docs.google.com/document/d/1Jxh7XueuqWzeRKpi7iXfoyaOskstjHVNRYx1uP4RBFs/edit?usp=sharing";

/** 𝕏 profile */
export const X_URL = "https://x.com/0xmomen";

/** Legacy: static PDF fallback path (unused if RESUME_URL is set). Kept for self-host parity. */
export const RESUME_PDF_FALLBACK_PATH = "assets/resume.pdf";

/** If set, Mail To link prefills recipient; otherwise `mailto:?subject=…` opens blank To. */
export const EMAIL_TO = "info@adammomen.com";

export const MAILTO_SUBJECT = "USDC Control Plane";

/** @returns {string} */
export function mailtoHref() {
  const subj = encodeURIComponent(MAILTO_SUBJECT);
  if (EMAIL_TO) {
    return `mailto:${EMAIL_TO}?subject=${subj}`;
  }
  return `mailto:?subject=${subj}`;
}
