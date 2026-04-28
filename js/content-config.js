/**
 * Edit before deployment — outbound links used by desktop chrome & memo footer.
 */

/** Repository or profile URL */
export const GITHUB_URL = "https://github.com/AdamMomen/usdc-control-plane";

/** Public résumé PDF co-located in the static root (bundle your own file here). */
export const RESUME_PATH = "assets/resume.pdf";

/** If set, Mail To link prefills recipient; otherwise `mailto:?subject=…` opens blank To. */
export const EMAIL_TO = "";

export const MAILTO_SUBJECT = "USDC Control Plane";

/** @returns {string} */
export function mailtoHref() {
  const subj = encodeURIComponent(MAILTO_SUBJECT);
  if (EMAIL_TO) {
    return `mailto:${EMAIL_TO}?subject=${subj}`;
  }
  return `mailto:?subject=${subj}`;
}
