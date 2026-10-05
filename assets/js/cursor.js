/* =====================================================
   Interactive DevOps Cyber Cursor Engine
   Features:
   - Instant central dot + fluid eased magnetic ring
   - Cyber target brackets and contextual mode badges
   - Magnetic pull towards interactive buttons
   - Click shockwave ripple + micro spark particle burst
   - Glowing comet trail on movement
   - Seamless mobile & reduced-motion fallback
===================================================== */
(function () {
  "use strict";

  /* Check device capabilities */
  var hasPointer =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!hasPointer || prefersReduced) return;

  /* ---------- DOM Creation ---------- */
  var cursorWrap = document.createElement("div");
  cursorWrap.id = "custom-cursor";
  cursorWrap.setAttribute("aria-hidden", "true");

  cursorWrap.innerHTML =
    '<div class="cursor-dot"></div>' +
    '<div class="cursor-ring">' +
      '<div class="cursor-corner top-left"></div>' +
      '<div class="cursor-corner top-right"></div>' +
      '<div class="cursor-corner bottom-left"></div>' +
      '<div class="cursor-corner bottom-right"></div>' +
      '<span class="cursor-badge"></span>' +
    '</div>';

  var canvas = document.createElement("canvas");
  canvas.id = "cursor-canvas";
  canvas.setAttribute("aria-hidden", "true");

  document.body.appendChild(cursorWrap);
  document.body.appendChild(canvas);

  var dotEl = cursorWrap.querySelector(".cursor-dot");
  var ringEl = cursorWrap.querySelector(".cursor-ring");
  var badgeEl = cursorWrap.querySelector(".cursor-badge");

  /* ---------- Canvas Trail Setup ---------- */
  var ctx = canvas.getContext("2d");
  var trailParticles = [];
  var MAX_TRAIL = 18;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  /* ---------- State Variables ---------- */
  var mouseX = -100;
  var mouseY = -100;
  var ringX = -100;
  var ringY = -100;
  var isVisible = false;
  var isClicking = false;
  var magneticTarget = null;
  var currentMode = "";

  /* ---------- Mouse Listeners ---------- */
  window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursorWrap.classList.add("active");
      document.body.classList.add("has-custom-cursor");
      ringX = mouseX;
      ringY = mouseY;
    }

    /* Spawn subtle trail particle when moving */
    if (Math.random() < 0.6) {
      trailParticles.push({
        x: mouseX,
        y: mouseY,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 2 + Math.random() * 2.5,
        alpha: 0.5,
        color: Math.random() < 0.5 ? "255, 180, 84" : "94, 234, 212"
      });
      if (trailParticles.length > MAX_TRAIL) {
        trailParticles.shift();
      }
    }
  });

  document.addEventListener("mouseleave", function () {
    cursorWrap.classList.remove("active");
    isVisible = false;
  });

  document.addEventListener("mouseenter", function () {
    cursorWrap.classList.add("active");
    isVisible = true;
  });

  /* ---------- Click & Shockwave ---------- */
  window.addEventListener("mousedown", function (e) {
    isClicking = true;
    cursorWrap.classList.add("state-clicking");
    spawnClickShockwave(e.clientX, e.clientY);
    spawnClickSparks(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", function () {
    isClicking = false;
    cursorWrap.classList.remove("state-clicking");
  });

  function spawnClickShockwave(x, y) {
    var ripple = document.createElement("div");
    ripple.className = "cursor-ripple";
    ripple.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    document.body.appendChild(ripple);
    setTimeout(function () {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 600);
  }

  function spawnClickSparks(x, y) {
    var count = 8;
    for (var i = 0; i < count; i++) {
      (function () {
        var spark = document.createElement("div");
        spark.className = "cursor-spark";
        var isAmber = Math.random() < 0.5;
        spark.style.background = isAmber ? "var(--amber, #ffb454)" : "var(--cyan, #5eead4)";
        spark.style.boxShadow = isAmber
          ? "0 0 6px rgba(255, 180, 84, 0.9)"
          : "0 0 6px rgba(94, 234, 212, 0.9)";
        spark.style.left = x + "px";
        spark.style.top = y + "px";
        document.body.appendChild(spark);

        var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        var dist = 24 + Math.random() * 26;
        var targetX = Math.cos(angle) * dist;
        var targetY = Math.sin(angle) * dist;

        var start = performance.now();
        var duration = 400 + Math.random() * 100;

        function animateSpark(now) {
          var progress = (now - start) / duration;
          if (progress >= 1) {
            if (spark.parentNode) spark.parentNode.removeChild(spark);
            return;
          }
          var ease = 1 - Math.pow(1 - progress, 3);
          var curX = targetX * ease;
          var curY = targetY * ease + (progress * 12); // subtle gravity
          spark.style.transform = "translate3d(" + curX.toFixed(1) + "px, " + curY.toFixed(1) + "px, 0) scale(" + (1 - progress * 0.8).toFixed(2) + ")";
          spark.style.opacity = (1 - progress).toFixed(2);
          requestAnimationFrame(animateSpark);
        }
        requestAnimationFrame(animateSpark);
      })();
    }
  }

  /* ---------- Hover State Detection & Magnetic Target ---------- */
  function clearCursorStates() {
    cursorWrap.classList.remove("state-hover", "state-card", "state-terminal", "state-avatar");
    badgeEl.textContent = "";
    currentMode = "";
    magneticTarget = null;
  }

  document.addEventListener("mouseover", function (e) {
    var target = e.target;

    // 1. Avatar hover
    var avatarEl = target.closest("#avatar");
    if (avatarEl) {
      clearCursorStates();
      cursorWrap.classList.add("state-avatar");
      badgeEl.textContent = "POKE 🚀";
      currentMode = "avatar";
      magneticTarget = avatarEl;
      return;
    }

    // 2. Terminal hover
    var terminalEl = target.closest(".terminal");
    if (terminalEl) {
      clearCursorStates();
      cursorWrap.classList.add("state-terminal");
      badgeEl.textContent = "EXEC ⚡";
      currentMode = "terminal";
      return;
    }

    // 3. Project / Experience card hover
    var cardEl = target.closest(".project, .timeline-item, #skills li");
    if (cardEl && !target.closest("a, button")) {
      clearCursorStates();
      cursorWrap.classList.add("state-card");
      badgeEl.textContent = "INSPECT 🔍";
      currentMode = "card";
      return;
    }

    // 4. Interactive buttons / links
    var btnEl = target.closest("a, button, [role='button'], .milestone-btn");
    if (btnEl) {
      clearCursorStates();
      cursorWrap.classList.add("state-hover");
      magneticTarget = btnEl;
      if (btnEl.classList.contains("milestone-btn")) {
        badgeEl.textContent = "GOTO 📍";
      } else if (btnEl.getAttribute("download") !== null) {
        badgeEl.textContent = "PDF 📄";
      } else if (btnEl.getAttribute("target") === "_blank") {
        badgeEl.textContent = "LINK ↗";
      } else {
        badgeEl.textContent = "VIEW ✨";
      }
      currentMode = "hover";
      return;
    }

    // 5. Default
    clearCursorStates();
  });

  /* ---------- Main Animation Loop ---------- */
  function updateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = trailParticles.length - 1; i >= 0; i--) {
      var p = trailParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      p.radius *= 0.95;

      if (p.alpha <= 0 || p.radius <= 0.4) {
        trailParticles.splice(i, 1);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.color + ", " + p.alpha.toFixed(2) + ")";
        ctx.fill();
      }
    }
  }

  function render() {
    if (isVisible) {
      /* Update sharp pointer dot instantly */
      dotEl.style.transform = "translate3d(" + mouseX + "px, " + mouseY + "px, 0)";

      /* Magnetic target easing */
      var targetX = mouseX;
      var targetY = mouseY;

      if (magneticTarget) {
        var rect = magneticTarget.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        // Mild magnetic pull (15% towards element center)
        targetX = mouseX + (centerX - mouseX) * 0.22;
        targetY = mouseY + (centerY - mouseY) * 0.22;
      }

      /* Fluid lerp for outer ring */
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      ringEl.style.transform =
        "translate3d(" + ringX.toFixed(1) + "px, " + ringY.toFixed(1) + "px, 0)";
    }

    updateTrail();
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
