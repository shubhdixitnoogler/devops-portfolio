/* =====================================================
   Interactive Chaos & Incident Response Simulator
   Playable SRE challenge simulating real-time P1 incident
   triage, MTTR timing, and GitOps remediation.
===================================================== */
(function () {
  "use strict";

  var modal = document.getElementById("chaos-modal");
  var timerEl = document.getElementById("chaos-timer");
  var latencyEl = document.getElementById("chaos-val-lat");
  var errorEl = document.getElementById("chaos-val-err");
  var burnEl = document.getElementById("chaos-val-burn");
  var feedbackEl = document.getElementById("chaos-feedback");
  var optionsList = document.getElementById("chaos-options");

  var timerInterval = null;
  var secondsElapsed = 0;
  var isResolved = false;

  function openChaosSimulator() {
    if (!modal) return;
    modal.classList.add("active");
    resetSimulator();
    startTimer();

    if (window.DevOpsAudio) {
      window.DevOpsAudio.playCommand();
    }
  }

  function closeChaosSimulator() {
    if (!modal) return;
    modal.classList.remove("active");
    stopTimer();
  }

  function startTimer() {
    stopTimer();
    secondsElapsed = 0;
    if (timerEl) timerEl.textContent = "MTTR: 00:00";
    timerInterval = setInterval(function () {
      secondsElapsed++;
      var mins = Math.floor(secondsElapsed / 60);
      var secs = secondsElapsed % 60;
      var str = "MTTR: " + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
      if (timerEl) timerEl.textContent = str;
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resetSimulator() {
    isResolved = false;
    if (latencyEl) {
      latencyEl.textContent = "2.85s";
      latencyEl.className = "chaos-strip-val";
    }
    if (errorEl) {
      errorEl.textContent = "4.82%";
      errorEl.className = "chaos-strip-val";
    }
    if (burnEl) {
      burnEl.textContent = "14.2x";
      burnEl.className = "chaos-strip-val";
    }
    if (feedbackEl) {
      feedbackEl.style.display = "none";
      feedbackEl.className = "chaos-feedback-box";
      feedbackEl.innerHTML = "";
    }
    if (optionsList) {
      var btns = optionsList.querySelectorAll(".chaos-option-btn");
      btns.forEach(function (btn) {
        btn.disabled = false;
        btn.style.opacity = "1";
      });
    }
  }

  function handleOption(optionKey) {
    if (isResolved) return;

    if (window.DevOpsAudio) {
      window.DevOpsAudio.playKeyClick();
    }

    if (optionKey === "rollback") {
      // Correct Option: Rollback faulty deployment!
      isResolved = true;
      stopTimer();

      if (latencyEl) {
        latencyEl.textContent = "24ms";
        latencyEl.className = "chaos-strip-val ok";
      }
      if (errorEl) {
        errorEl.textContent = "0.001%";
        errorEl.className = "chaos-strip-val ok";
      }
      if (burnEl) {
        burnEl.textContent = "1.0x (Normal)";
        burnEl.className = "chaos-strip-val ok";
      }

      if (feedbackEl) {
        feedbackEl.className = "chaos-feedback-box success";
        feedbackEl.innerHTML =
          '<strong>🏆 INCIDENT RESOLVED in ' + secondsElapsed + 's! MTTR: Excellent.</strong><br>' +
          '• Reverted <span style="color:#eef2f6;">checkout-service</span> from v2.4 to stable v2.3.<br>' +
          '• Pods with memory leak terminated; 100% of canary traffic restored to healthy pods.<br>' +
          '• SLO preserved (99.99% availability). <em>This is how Shubh maintains reliability under pressure.</em>';
        feedbackEl.style.display = "block";
      }

      // Audio & Avatar celebration
      if (window.DevOpsAudio) {
        window.DevOpsAudio.playSuccess();
      }
      var avatar = document.getElementById("avatar");
      if (avatar) avatar.click();

    } else if (optionKey === "scale") {
      // Partial Option: Scaling masks problem
      if (latencyEl) latencyEl.textContent = "1.42s";
      if (errorEl) errorEl.textContent = "2.10%";
      if (burnEl) burnEl.textContent = "6.5x";

      if (feedbackEl) {
        feedbackEl.className = "chaos-feedback-box partial";
        feedbackEl.innerHTML =
          '<strong>⚠️ Partial Mitigation (Temporary Relief)</strong><br>' +
          'Scaling to 8 replicas distributed traffic, but the memory leak in checkout v2.4 is still crashing pods.<br>' +
          'Try an action that eliminates the faulty version entirely (GitOps Rollback)!';
        feedbackEl.style.display = "block";
      }

    } else if (optionKey === "traffic") {
      // Alternative Option: Reroute
      if (latencyEl) latencyEl.textContent = "68ms";
      if (errorEl) errorEl.textContent = "0.05%";
      if (burnEl) burnEl.textContent = "1.8x";

      if (feedbackEl) {
        feedbackEl.className = "chaos-feedback-box partial";
        feedbackEl.innerHTML =
          '<strong>ℹ️ Traffic Diverted to Secondary Region</strong><br>' +
          'Traffic shifted to DR cluster. Latency is acceptable (68ms cross-region), but primary cluster remains unhealthy.<br>' +
          'Rollback the bad revision to complete root remediation!';
        feedbackEl.style.display = "block";
      }
    }
  }

  // Hook global trigger
  window.openChaosSimulator = openChaosSimulator;

  // Bind close buttons & background click
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".chaos-close-btn")) {
        closeChaosSimulator();
      }
    });
  }

  // Bind option clicks
  if (optionsList) {
    optionsList.addEventListener("click", function (e) {
      var btn = e.target.closest(".chaos-option-btn");
      if (btn) {
        var action = btn.getAttribute("data-action");
        handleOption(action);
      }
    });
  }

  // Global trigger buttons (like telemetry HUD chaos button)
  document.addEventListener("click", function (e) {
    if (e.target.closest(".telemetry-chaos-btn")) {
      e.preventDefault();
      openChaosSimulator();
    }
  });

  // ESC key to close
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeChaosSimulator();
    }
  });
})();
