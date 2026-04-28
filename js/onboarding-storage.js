/** First-run onboarding completion (persisted per browser profile). */

const LEGACY_ONBOARDING_KEY = "backos.onboarding.completed";

export const ONBOARDING_STORAGE_KEY = "bazingaos.onboarding.completed";

/**
 * When `localStorage` is unavailable (Node tests / private mode edge cases), treated as completed
 * so the shell does not require onboarding UI outside the browser.
 *
 * @returns {boolean}
 */
export function isOnboardingComplete() {
  if (typeof localStorage === "undefined") {
    return true;
  }
  try {
    if (localStorage.getItem(ONBOARDING_STORAGE_KEY) === "1") {
      return true;
    }
    if (localStorage.getItem(LEGACY_ONBOARDING_KEY) === "1") {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
      localStorage.removeItem(LEGACY_ONBOARDING_KEY);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function markOnboardingComplete() {
  if (typeof localStorage === "undefined") {
    return;
  }
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
    localStorage.removeItem(LEGACY_ONBOARDING_KEY);
  } catch {
    /* ignore quota / blocked storage */
  }
}
