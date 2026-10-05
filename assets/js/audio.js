/* =====================================================
   Subtle Retro Audio Engine
   Synthesizes soft mechanical clicks, cyber blips, and
   8-bit jumps using the native Web Audio API.
   Zero external audio files, zero latency, zero bandwidth.
   Includes a polite Mute Toggle (defaults to OFF).
===================================================== */
(function () {
  "use strict";

  var audioCtx = null;
  var isMuted = localStorage.getItem("devops_sound_enabled") !== "true";

  function getAudioContext() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, startVol, endVol, freqSlide) {
    if (isMuted) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;

      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (freqSlide) {
        osc.frequency.exponentialRampToValueAtTime(freqSlide, ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(startVol || 0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(endVol || 0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  var DevOpsAudio = {
    isMuted: function () {
      return isMuted;
    },

    toggleMute: function () {
      isMuted = !isMuted;
      localStorage.setItem("devops_sound_enabled", (!isMuted).toString());
      DevOpsAudio.updateToggleUI();
      if (!isMuted) {
        DevOpsAudio.playSuccess();
      }
      return isMuted;
    },

    playKeyClick: function () {
      // Soft mechanical key press sound
      playTone(900 + Math.random() * 200, "triangle", 0.025, 0.03, 0.001);
    },

    playHover: function () {
      // Subtle cyber blip on button hover
      playTone(580, "sine", 0.035, 0.025, 0.0005, 780);
    },

    playJump: function () {
      // Cheerful 8-bit leap sound
      playTone(240, "square", 0.09, 0.04, 0.001, 560);
    },

    playSuccess: function () {
      // Pleasant two-tone completion chime
      playTone(523.25, "sine", 0.12, 0.05, 0.001); // C5
      setTimeout(function () {
        playTone(659.25, "sine", 0.18, 0.05, 0.001); // E5
      }, 70);
    },

    playCommand: function () {
      // Terminal command execution tone
      playTone(440, "sine", 0.05, 0.04, 0.001, 880);
    },

    updateToggleUI: function () {
      var btns = document.querySelectorAll(".sound-toggle-btn");
      btns.forEach(function (btn) {
        if (isMuted) {
          btn.classList.remove("sound-on");
          btn.innerHTML = '<span class="sound-icon">🔈</span> <span class="sound-label">Audio: OFF</span>';
          btn.setAttribute("title", "Click to enable retro audio effects");
          btn.setAttribute("aria-label", "Audio muted. Click to enable sound effects.");
        } else {
          btn.classList.add("sound-on");
          btn.innerHTML = '<span class="sound-icon">🔊</span> <span class="sound-label">Audio: ON</span>';
          btn.setAttribute("title", "Click to mute audio");
          btn.setAttribute("aria-label", "Audio enabled. Click to mute sound effects.");
        }
      });
    }
  };

  window.DevOpsAudio = DevOpsAudio;

  // Initialize UI once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", DevOpsAudio.updateToggleUI);
  } else {
    DevOpsAudio.updateToggleUI();
  }

  // Hook global hover events on buttons and links
  document.addEventListener("mouseover", function (e) {
    if (e.target.closest("a, button, .milestone-btn, [role='button']")) {
      DevOpsAudio.playHover();
    }
  }, { passive: true });

  // Hook sound toggle button clicks
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".sound-toggle-btn");
    if (btn) {
      e.preventDefault();
      DevOpsAudio.toggleMute();
    }
  });
})();
