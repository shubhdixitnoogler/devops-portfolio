/* =====================================================
   Global Command Palette (Ctrl+K / ⌘K)
   Keyboard-driven navigation, fast action execution,
   and instant search across Shubh's portfolio.
===================================================== */
(function () {
  "use strict";

  var overlay = document.getElementById("palette-overlay");
  var input = document.getElementById("palette-input");
  var list = document.getElementById("palette-list");

  var ACTIONS = [
    { title: "Navigate: Hero Section", icon: "🚀", hint: "Top", action: function () { scrollToId("hero"); } },
    { title: "Navigate: About Me", icon: "👤", hint: "Section", action: function () { scrollToId("about"); } },
    { title: "Navigate: Interactive Skills Matrix", icon: "🛠️", hint: "Section", action: function () { scrollToId("skills"); } },
    { title: "Navigate: Experience (HCL Tech)", icon: "💼", hint: "Section", action: function () { scrollToId("experience"); } },
    { title: "Navigate: AKS Architecture & Projects", icon: "☸️", hint: "Section", action: function () { scrollToId("projects"); } },
    { title: "Navigate: Contact Me Form", icon: "📬", hint: "Section", action: function () { scrollToId("contact"); } },
    { title: "Action: Preview Resume PDF", icon: "👁️", hint: "Modal", action: function () { if (window.openResumeModal) window.openResumeModal(); } },
    { title: "Action: Download Resume PDF", icon: "📥", hint: "Download", action: function () { downloadResume(); } },
    { title: "Action: Launch SRE Chaos Simulator", icon: "🚨", hint: "Challenge", action: function () { if (window.openChaosSimulator) window.openChaosSimulator(); } },
    { title: "Action: Focus Hero CLI Terminal", icon: "💻", hint: "Terminal", action: function () { focusTerminal(); } },
    { title: "Action: Toggle Retro Audio", icon: "🔊", hint: "Toggle", action: function () { if (window.DevOpsAudio) window.DevOpsAudio.toggleMute(); } },
    { title: "Action: Copy Email to Clipboard", icon: "📋", hint: "Copy", action: function () { copyEmail(); } },
    { title: "External: Open LinkedIn Profile", icon: "↗", hint: "Link", action: function () { window.open("https://linkedin.com/in/shubhdixitnoogler", "_blank"); } },
    { title: "External: Open GitHub Profile", icon: "↗", hint: "Link", action: function () { window.open("https://github.com/shubhdixitnoogler", "_blank"); } }
  ];

  var filteredActions = ACTIONS.slice();
  var selectedIndex = 0;

  function scrollToId(id) {
    var el = id === "hero" ? document.querySelector("header.hero") : document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function downloadResume() {
    var a = document.createElement("a");
    a.href = "Shubh_Dixit_SRE_DevOps.pdf";
    a.download = "Shubh_Dixit_SRE_DevOps.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function focusTerminal() {
    scrollToId("hero");
    var termInput = document.getElementById("term-cli-input");
    if (termInput) {
      setTimeout(function () { termInput.focus(); }, 400);
    }
  }

  function copyEmail() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("shubhdixitnoogler@gmail.com");
      alert("✅ Email copied to clipboard: shubhdixitnoogler@gmail.com");
    }
  }

  function openPalette() {
    if (!overlay) return;
    overlay.classList.add("active");
    if (input) {
      input.value = "";
      filterActions("");
      setTimeout(function () { input.focus(); }, 50);
    }
    if (window.DevOpsAudio) window.DevOpsAudio.playCommand();
  }

  function closePalette() {
    if (!overlay) return;
    overlay.classList.remove("active");
  }

  function renderList() {
    if (!list) return;
    list.innerHTML = "";

    if (!filteredActions.length) {
      list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-faint);font-family:var(--font-mono);font-size:0.8rem;">No matching commands found.</div>';
      return;
    }

    filteredActions.forEach(function (item, idx) {
      var el = document.createElement("div");
      el.className = "palette-item" + (idx === selectedIndex ? " selected" : "");
      el.innerHTML =
        '<div class="palette-item-left">' +
          '<span class="palette-item-icon">' + item.icon + '</span>' +
          '<span class="palette-item-text">' + item.title + '</span>' +
        '</div>' +
        '<span class="palette-item-hint">' + item.hint + '</span>';

      el.addEventListener("click", function () {
        closePalette();
        item.action();
      });

      list.appendChild(el);
    });
  }

  function filterActions(query) {
    var q = query.toLowerCase().trim();
    if (!q) {
      filteredActions = ACTIONS.slice();
    } else {
      filteredActions = ACTIONS.filter(function (a) {
        return a.title.toLowerCase().indexOf(q) !== -1 || a.hint.toLowerCase().indexOf(q) !== -1;
      });
    }
    selectedIndex = 0;
    renderList();
  }

  // Keyboard shortcut: Ctrl+K or Cmd+K
  window.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (overlay && overlay.classList.contains("active")) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === "Escape" && overlay && overlay.classList.contains("active")) {
      closePalette();
    }
  });

  // Navigation inside palette
  if (input) {
    input.addEventListener("input", function () {
      filterActions(input.value);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (filteredActions.length) {
          selectedIndex = (selectedIndex + 1) % filteredActions.length;
          renderList();
          ensureVisible();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (filteredActions.length) {
          selectedIndex = (selectedIndex - 1 + filteredActions.length) % filteredActions.length;
          renderList();
          ensureVisible();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          closePalette();
          filteredActions[selectedIndex].action();
        }
      }
    });
  }

  function ensureVisible() {
    if (!list) return;
    var selectedEl = list.children[selectedIndex];
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }

  // Background click to close
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        closePalette();
      }
    });
  }

  // Trigger button chip click
  document.addEventListener("click", function (e) {
    if (e.target.closest(".palette-trigger-chip")) {
      e.preventDefault();
      openPalette();
    }
  });

  window.openCommandPalette = openPalette;
})();
