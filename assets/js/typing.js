const text = "I design and automate CI/CD pipelines, containerized deployments, and cloud infrastructure to reduce manual effort, improve deployment reliability, and support production-ready systems.";
const speed = 60;

let i = 0;
const target = document.getElementById("terminal-text");

function typeEffect() {
  if (i < text.length) {
    target.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, speed);
  }
}

typeEffect();

/* =====================================================
   Terminal widget typing effect
   Plays once, when the panel scrolls into view.
===================================================== */
(function () {
  const container = document.getElementById("terminal-widget");
  if (!container) return;

  // Respect reduced-motion preference: leave the static text as-is
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const lines = Array.prototype.slice.call(container.querySelectorAll(".term-line"));
  if (!lines.length) return;

  // Capture original text (keeps full content visible for no-JS users until this runs)
  const queue = lines.map(function (line) {
    if (line.classList.contains("prompt-line")) {
      const cmdEl = line.querySelector(".cmd-text");
      const text = cmdEl.textContent;
      cmdEl.textContent = "";
      return { el: line, cmdEl: cmdEl, text: text, type: "command" };
    }
    const text = line.textContent;
    line.textContent = "";
    return { el: line, text: text, type: "output" };
  });

  lines.forEach(function (line) {
    line.style.visibility = "hidden";
  });

  function playLine(i) {
    if (i >= queue.length) {
      const lastEl = queue[queue.length - 1].el;
      const cursor = document.createElement("span");
      cursor.className = "cursor term-cursor";
      cursor.textContent = "█";
      lastEl.appendChild(cursor);
      return;
    }

    const item = queue[i];
    item.el.style.visibility = "visible";

    if (item.type === "output") {
      item.el.textContent = item.text;
      setTimeout(function () {
        playLine(i + 1);
      }, 260);
      return;
    }

    let j = 0;
    const interval = setInterval(function () {
      item.cmdEl.textContent = item.text.slice(0, j + 1);
      j += 1;
      if (j >= item.text.length) {
        clearInterval(interval);
        setTimeout(function () {
          playLine(i + 1);
        }, 380);
      }
    }, 38);
  }

  function start() {
    setTimeout(function () {
      playLine(0);
    }, 400);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(container);
  } else {
    start();
  }
})();

/* =====================================================
   Scroll-reveal
   Fades/lifts section content in as it enters view.
===================================================== */
(function () {
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const targets = document.querySelectorAll(
    "section > h2, section > p, section > ul, .project, .timeline-item, #skills li, .terminal, .status-bar"
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("in-view");
    });
    return;
  }

  targets.forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.transitionDelay = (i % 4) * 70 + "ms";
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) {
    revealObserver.observe(el);
  });
})();

/* =====================================================
   Status bar metric counters
   Counts up once when the status bar scrolls into view.
===================================================== */
(function () {
  const metrics = document.querySelectorAll(".metric-value");
  if (!metrics.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setFinal(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const decimals = el.getAttribute("data-count").indexOf(".") > -1 ? 1 : 0;
    el.textContent = target.toFixed(decimals) + suffix;
  }

  if (reduceMotion) {
    metrics.forEach(setFinal);
    return;
  }

  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const decimals = el.getAttribute("data-count").indexOf(".") > -1 ? 1 : 0;
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  const statusBar = document.querySelector(".status-bar");
  if (!statusBar || !("IntersectionObserver" in window)) {
    metrics.forEach(animateCount);
    return;
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          metrics.forEach(animateCount);
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  counterObserver.observe(statusBar);
})();