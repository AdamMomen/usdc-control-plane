/** First-run onboarding wizard (single window until Finish). */

import { markOnboardingComplete } from "./onboarding-storage.js";

/**
 * @param {HTMLElement} body `.desktop-window__body`
 * @param {{ onDone: () => void }} callbacks
 */
export function mountOnboardingWizard(body, { onDone }) {
  body.classList.add("onboarding-wizard-root");

  const STEPS = [
    {
      title: "Welcome to BazingaOS",
      body:
        "This is the **USDC Control Plane** experience — a browser-only simulation " +
        "of how trust invariants, lifecycle flows, and failure modes fit together. The desktop " +
        "stays clear until you choose: you opened this from the **Getting started** button.",
    },
    {
      title: "Programs live on your desktop",
      body:
        "Each workload opens from an **icon** below. Opening a window is intentional — your " +
        "desktop stays calm instead of dumping every tool on screen at once.",
    },
    {
      title: "Launch anything quickly",
      body:
        "Press **⌘ K** on Mac or **Ctrl + K** on Windows/Linux to open the **command palette** " +
        "and jump straight to Asset Lifecycle, Invariants, Explorer, and more.",
    },
    {
      title: "Simulation only",
      body:
        "There is **no live chain**, **no database**, and **no backend**. Everything runs " +
        "locally — it is a reviewer-facing artifact for how you reason about infra.",
    },
    {
      title: "All set",
      body:
        "When you tap **Finish**, this tour completes and will not appear again **in this browser**. " +
        "We save that preference in **local storage**. On your next visits, the animated boot splash skips too.",
    },
  ];

  let stepIndex = 0;

  function render() {
    body.replaceChildren();
    const wrap = document.createElement("div");
    wrap.className = "onboarding-wizard";

    const progress = document.createElement("div");
    progress.className = "onboarding-wizard-progress";
    progress.setAttribute("aria-hidden", "true");
    for (let i = 0; i < STEPS.length; i++) {
      const dot = document.createElement("span");
      dot.className = "onboarding-wizard-dot" + (i === stepIndex ? " onboarding-wizard-dot--active" : "");
      progress.appendChild(dot);
    }

    const h = document.createElement("h2");
    h.className = "onboarding-wizard-title";
    h.textContent = STEPS[stepIndex].title;

    const p = document.createElement("p");
    p.className = "onboarding-wizard-body";
    p.innerHTML = STEPS[stepIndex].body.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    const nav = document.createElement("div");
    nav.className = "onboarding-wizard-nav";

    const back = document.createElement("button");
    back.type = "button";
    back.className = "onboarding-wizard-btn onboarding-wizard-btn--secondary";
    back.textContent = "Back";

    const next = document.createElement("button");
    next.type = "button";
    next.className = "onboarding-wizard-btn onboarding-wizard-btn--primary";

    const last = stepIndex === STEPS.length - 1;
    next.textContent = last ? "Finish" : "Next";

    back.disabled = stepIndex === 0;
    back.addEventListener("click", () => {
      stepIndex = Math.max(0, stepIndex - 1);
      render();
    });

    next.addEventListener("click", () => {
      if (last) {
        markOnboardingComplete();
        onDone();
        return;
      }
      stepIndex += 1;
      render();
    });

    nav.append(back, next);

    wrap.append(progress, h, p, nav);
    body.appendChild(wrap);
  }

  render();
}
