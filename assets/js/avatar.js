/* =====================================================
   Walking DevOps Avatar Script
   Pixel-perfect alignment with bottom navigation rail
   and section milestone checkpoints.
===================================================== */
(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var avatar = document.getElementById("avatar");
  if (!avatar) return;

  if (prefersReduced) {
    avatar.style.opacity = "1";
    return;
  }

  /* ---------- DOM Elements ---------- */
  var avatarBody = avatar.querySelector(".avatar-body");
  var avatarShadow = avatar.querySelector(".avatar-shadow");
  var avatarSpeech = document.getElementById("avatar-speech");
  var speechTag = avatarSpeech ? avatarSpeech.querySelector(".speech-tag") : null;
  var speechText = avatarSpeech ? avatarSpeech.querySelector(".speech-text") : null;
  var walkFrames = avatar.querySelectorAll(".walk-frame");
  var idleFrame = avatar.querySelector(".idle-frame");
  var jumpFrame = avatar.querySelector(".jump-frame");
  var particlesWrap = document.getElementById("avatar-particles");
  var railTrack = document.querySelector(".ground-rail-track");
  var railProgress = document.querySelector(".ground-rail-progress");
  var milestoneBtns = document.querySelectorAll(".milestone-btn");

  /* ---------- Sections Definition ---------- */
  var sections = [
    { id: "hero", label: "Hero", quote: "Welcome to Shubh's DevOps space! 🚀" },
    { id: "about", label: "About", quote: "3.5+ years building reliable cloud systems ☁️" },
    { id: "skills", label: "Skills", quote: "K8s, Terraform, Docker & Observability 🛠️" },
    { id: "experience", label: "Experience", quote: "Oct 2024–Present: Senior DevOps Analyst at HCL 📈" },
    { id: "projects", label: "Projects", quote: "Zero-downtime microservices on AKS & AWS 🐳" },
    { id: "contact", label: "Contact", quote: "Let's connect! Open for DevOps / SRE roles 📬" }
  ];

  /* Click quips easter eggs */
  var clickQuotes = [
    "System Status: 100% Operational! 🟢",
    "kubectl apply -f peace_of_mind.yaml 🧘",
    "0 open incidents on production! 🛡️",
    "Terraform apply: Infrastructure ready ✨",
    "99.9% uptime sustained! ⚡",
    "Pro tip: Press [Ctrl+K] anytime for quick commands! ⌨️",
    "Try the live SRE Chaos Simulator above! 🚨",
    "Click 'Preview Resume' for instant in-browser viewing! 📄",
    "Pro tip: Use [←] and [→] arrows to walk me! 🎮"
  ];
  var clickQuoteIndex = 0;

  /* ---------- State ---------- */
  var currentX = 0;
  var targetX = 0;
  var facingRight = true;
  var isWalking = false;
  var isJumping = false;
  var jumpTimer = null;
  var scrollStopTimer = null;
  var speechHideTimer = null;
  var frameIndex = 0;
  var frameTick = 0;
  var bobPhase = 0;
  var lastScrollY = window.scrollY || window.pageYOffset;
  var activeSectionIndex = 0;
  var dustList = [];
  var dustTick = 0;

  /* ---------- Geometry & Positioning ---------- */
  function getMilestonePositions() {
    var positions = [];
    for (var i = 0; i < milestoneBtns.length; i++) {
      var rect = milestoneBtns[i].getBoundingClientRect();
      positions.push(rect.left + rect.width / 2);
    }
    return positions;
  }

  function getSectionScrollTargets() {
    var docH = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    var maxScroll = Math.max(1, docH - window.innerHeight);
    var targets = [];

    for (var i = 0; i < sections.length; i++) {
      if (i === 0) {
        targets.push(0);
      } else if (i === sections.length - 1) {
        var lastEl = document.getElementById(sections[i].id);
        var lastTop = lastEl ? lastEl.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) : maxScroll;
        targets.push(Math.min(maxScroll, lastTop));
      } else {
        var el = document.getElementById(sections[i].id);
        if (el) {
          // Exact top of section matches scroll destination
          var top = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
          targets.push(Math.min(maxScroll, Math.max(0, top)));
        } else {
          targets.push((i / (sections.length - 1)) * maxScroll);
        }
      }
    }
    return { targets: targets, maxScroll: maxScroll };
  }

  /* Maps scrollY directly to the milestone button positions */
  function calculateAlignment(scrollY) {
    var positions = getMilestonePositions();
    if (!positions.length) {
      return { x: window.innerWidth / 2, activeIndex: 0 };
    }

    var data = getSectionScrollTargets();
    var targets = data.targets;

    if (scrollY <= targets[0]) {
      return { x: positions[0], activeIndex: 0 };
    }
    if (scrollY >= targets[targets.length - 1]) {
      var last = positions.length - 1;
      return { x: positions[last], activeIndex: last };
    }

    for (var i = 0; i < targets.length - 1; i++) {
      var sStart = targets[i];
      var sEnd = targets[i + 1];
      if (scrollY >= sStart && scrollY <= sEnd) {
        var range = sEnd - sStart;
        var t = range > 0 ? (scrollY - sStart) / range : 0;
        var interpX = positions[i] + t * (positions[i + 1] - positions[i]);
        var activeIdx = t < 0.5 ? i : i + 1;
        return { x: interpX, activeIndex: activeIdx };
      }
    }

    return { x: positions[0], activeIndex: 0 };
  }

  /* ---------- Speech Bubble Positioning & Display ---------- */
  function updateSpeechPosition() {
    if (!avatarSpeech) return;
    var bubbleW = avatarSpeech.offsetWidth || 220;
    var halfW = bubbleW / 2;
    var minX = halfW + 16;
    var maxX = window.innerWidth - halfW - 16;
    var shiftX = 0;

    if (currentX < minX) {
      shiftX = minX - currentX;
    } else if (currentX > maxX) {
      shiftX = maxX - currentX;
    }

    avatarSpeech.style.transform = "translateX(calc(-50% + " + shiftX.toFixed(1) + "px)) translateY(0)";
  }

  function showSpeech(tag, text, durationMs) {
    if (!avatarSpeech) return;
    if (speechTag) speechTag.textContent = tag || "DEV-BOT";
    if (speechText) speechText.textContent = text;
    avatarSpeech.classList.add("active");
    updateSpeechPosition();

    clearTimeout(speechHideTimer);
    if (durationMs) {
      speechHideTimer = setTimeout(function () {
        avatarSpeech.classList.remove("active");
      }, durationMs);
    }
  }

  /* ---------- Frame Switchers ---------- */
  function setFrame(idx) {
    for (var i = 0; i < walkFrames.length; i++) {
      walkFrames[i].style.display = i === idx ? "block" : "none";
    }
    if (idleFrame) idleFrame.style.display = "none";
    if (jumpFrame) jumpFrame.style.display = "none";
  }

  function setIdle() {
    for (var i = 0; i < walkFrames.length; i++) {
      walkFrames[i].style.display = "none";
    }
    if (idleFrame) idleFrame.style.display = "block";
    if (jumpFrame) jumpFrame.style.display = "none";
  }

  function setJump() {
    for (var i = 0; i < walkFrames.length; i++) {
      walkFrames[i].style.display = "none";
    }
    if (idleFrame) idleFrame.style.display = "none";
    if (jumpFrame) jumpFrame.style.display = "block";
  }

  /* ---------- Dust Particles ---------- */
  function spawnDust(x) {
    if (!particlesWrap) return;
    var el = document.createElement("span");
    el.className = "walk-dust";
    var size = 4 + Math.random() * 4;
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.left = x + "px";
    el.style.bottom = "0px";
    particlesWrap.appendChild(el);

    var p = {
      el: el,
      life: 1,
      decay: 0.035 + Math.random() * 0.02,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1 + Math.random() * 1.5
    };
    dustList.push(p);

    if (dustList.length > 16) {
      var old = dustList.shift();
      if (old.el.parentNode) old.el.parentNode.removeChild(old.el);
    }
  }

  function updateDust() {
    for (var i = dustList.length - 1; i >= 0; i--) {
      var p = dustList[i];
      p.life -= p.decay;
      if (p.life <= 0) {
        if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
        dustList.splice(i, 1);
      } else {
        var upPx = (1 - p.life) * 16 * p.vy;
        p.el.style.opacity = (p.life * 0.7).toFixed(2);
        p.el.style.transform = "translateY(-" + upPx.toFixed(1) + "px) scale(" + (0.4 + p.life * 0.6).toFixed(2) + ")";
      }
    }
  }

  /* ---------- Scroll Handler ---------- */
  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var delta = scrollY - lastScrollY;
    lastScrollY = scrollY;

    var alignment = calculateAlignment(scrollY);
    var nextX = alignment.x;

    if (Math.abs(nextX - targetX) > 1) {
      facingRight = nextX >= targetX;
      isWalking = true;
    }
    targetX = nextX;

    /* update active milestone */
    if (alignment.activeIndex !== activeSectionIndex) {
      activeSectionIndex = alignment.activeIndex;
      milestoneBtns.forEach(function (btn, idx) {
        if (idx === activeSectionIndex) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
      showSpeech("DEV-BOT", sections[activeSectionIndex].quote, 4000);
    }

    /* detect fast scroll = jump */
    if (Math.abs(delta) > 90 && !isJumping) {
      triggerJump();
    }

    clearTimeout(scrollStopTimer);
    scrollStopTimer = setTimeout(function () {
      isWalking = false;
    }, 120);
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Jump / Wave Trigger ---------- */
  function triggerJump() {
    isJumping = true;
    if (window.DevOpsAudio) {
      window.DevOpsAudio.playJump();
    }
    clearTimeout(jumpTimer);
    jumpTimer = setTimeout(function () {
      isJumping = false;
    }, 380);
    for (var k = 0; k < 4; k++) {
      spawnDust(currentX + (Math.random() - 0.5) * 20);
    }
  }

  function triggerCelebration() {
    if (avatarBody) {
      avatarBody.classList.remove("avatar-celebrate");
      void avatarBody.offsetWidth;
      avatarBody.classList.add("avatar-celebrate");
      setTimeout(function () {
        avatarBody.classList.remove("avatar-celebrate");
      }, 750);
    }
    triggerJump();
    var quote = clickQuotes[clickQuoteIndex % clickQuotes.length];
    clickQuoteIndex++;
    showSpeech("SHUBH-BOT", quote, 4000);
  }

  avatar.addEventListener("click", function (e) {
    e.preventDefault();
    triggerCelebration();
  });

  /* ---------- Milestone Buttons Click Handler ---------- */
  milestoneBtns.forEach(function (btn, index) {
    btn.addEventListener("click", function () {
      var secId = btn.getAttribute("data-section");
      var targetEl = secId === "hero"
        ? document.querySelector("header.hero")
        : document.getElementById(secId);

      if (targetEl) {
        // 1. Immediately snap target X to this milestone checkpoint
        var positions = getMilestonePositions();
        if (positions[index] !== undefined) {
          targetX = positions[index];
          facingRight = targetX >= currentX;
          isWalking = true;
        }

        // 2. Set active button state
        activeSectionIndex = index;
        milestoneBtns.forEach(function (b, idx) {
          b.classList.toggle("active", idx === index);
        });

        // 3. Scroll to the exact position corresponding to this milestone
        var data = getSectionScrollTargets();
        var targetScroll = data.targets[index] !== undefined ? data.targets[index] : 0;
        window.scrollTo({ top: targetScroll, behavior: "smooth" });

        triggerJump();
        showSpeech("DEV-BOT", sections[index].quote, 4000);
      }
    });
  });

  /* ---------- Keyboard Controls ---------- */
  window.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    var positions = getMilestonePositions();
    if (!positions.length) return;

    if (e.key === "ArrowRight") {
      targetX = Math.min(positions[positions.length - 1], targetX + 30);
      facingRight = true;
      isWalking = true;
      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(function () { isWalking = false; }, 180);
    } else if (e.key === "ArrowLeft") {
      targetX = Math.max(positions[0], targetX - 30);
      facingRight = false;
      isWalking = true;
      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(function () { isWalking = false; }, 180);
    } else if (e.key === " " || e.key === "ArrowUp") {
      e.preventDefault();
      triggerCelebration();
    }
  });

  /* ---------- Resize Handler ---------- */
  window.addEventListener("resize", function () {
    var scrollY = window.scrollY || window.pageYOffset;
    var alignment = calculateAlignment(scrollY);
    targetX = alignment.x;
    currentX = targetX;
  });

  /* ---------- Main Animation Loop ---------- */
  function tick() {
    /* ease horizontal position towards target */
    var dx = targetX - currentX;
    currentX += dx * 0.15;

    /* update progress rail fill directly to the avatar's position */
    if (railProgress && railTrack) {
      var trackRect = railTrack.getBoundingClientRect();
      var fillW = Math.max(0, currentX - trackRect.left - 36);
      railProgress.style.width = fillW.toFixed(1) + "px";
    }

    /* bob while walking or idle */
    bobPhase += isWalking ? 0.22 : 0.04;
    var bobY = isWalking ? Math.sin(bobPhase * 2.5) * 3 : Math.sin(bobPhase) * 1.5;

    /* jump height */
    var jumpY = isJumping ? -24 : 0;

    /* apply horizontal translate to avatar container */
    avatar.style.transform = "translateX(" + currentX.toFixed(1) + "px)";

    /* update speech bubble clamping so it never cuts off at viewport edges */
    updateSpeechPosition();

    /* apply vertical & facing transform to avatar body */
    if (avatarBody) {
      var scaleX = facingRight ? 1 : -1;
      avatarBody.style.transform =
        "translateY(" + (bobY + jumpY).toFixed(1) + "px) scaleX(" + scaleX + ")";
    }

    /* shadow follows ground, shrinks and fades during jump */
    if (avatarShadow) {
      var shadowScale = isJumping ? 0.55 : (isWalking ? 0.9 : 1);
      var shadowOpacity = isJumping ? 0.15 : (isWalking ? 0.4 : 0.5);
      avatarShadow.style.transform = "scaleX(" + shadowScale + ")";
      avatarShadow.style.opacity = shadowOpacity;
    }

    /* frame cycle */
    frameTick++;
    if (isJumping) {
      setJump();
    } else if (isWalking && Math.abs(dx) > 0.3) {
      if (frameTick % 5 === 0) {
        frameIndex = (frameIndex + 1) % walkFrames.length;
        setFrame(frameIndex);
      }
      dustTick++;
      if (dustTick % 8 === 0) {
        spawnDust(currentX + (facingRight ? -10 : 10));
      }
    } else {
      setIdle();
    }

    updateDust();
    requestAnimationFrame(tick);
  }

  /* ---------- Initialize ---------- */
  var initScrollY = window.scrollY || window.pageYOffset;
  var initAlignment = calculateAlignment(initScrollY);
  currentX = initAlignment.x;
  targetX = currentX;
  activeSectionIndex = initAlignment.activeIndex;

  milestoneBtns.forEach(function (btn, idx) {
    if (idx === activeSectionIndex) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  setIdle();
  avatar.style.opacity = "1";
  showSpeech("DEV-BOT", "Hi! I'm your DevOps buddy 🚀 Scroll or click me!", 4500);

  requestAnimationFrame(tick);
})();
