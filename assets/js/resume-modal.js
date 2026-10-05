/* =====================================================
   Resume Quick Previewer Modal Controller
   Provides recruiters with instantaneous in-browser preview
   of Shubh's SRE & DevOps resume without requiring downloads.
===================================================== */
(function () {
  "use strict";

  var modal = document.getElementById("resume-modal");

  function openResumeModal() {
    if (!modal) return;
    modal.classList.add("active");
    var iframe = modal.querySelector(".resume-iframe");
    if (iframe && !iframe.getAttribute("src")) {
      iframe.setAttribute("src", "Shubh_Dixit_SRE_DevOps.pdf#toolbar=0");
    }
    if (window.DevOpsAudio) {
      window.DevOpsAudio.playCommand();
    }
  }

  function closeResumeModal() {
    if (!modal) return;
    modal.classList.remove("active");
  }

  window.openResumeModal = openResumeModal;

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".resume-close-btn")) {
        closeResumeModal();
      }
    });
  }

  // Bind all preview buttons with class .preview-resume-btn
  document.addEventListener("click", function (e) {
    if (e.target.closest(".preview-resume-btn")) {
      e.preventDefault();
      openResumeModal();
    }
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeResumeModal();
    }
  });
})();
