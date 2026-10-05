/* =====================================================
   Contact Form Gateway Handler
   Routes submissions directly to shubhdixitnoogler@gmail.com
   via FormSubmit AJAX API with status feedback.
===================================================== */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("contact-submit-btn");

  if (!form) return;

  var ENDPOINT = "https://formsubmit.co/ajax/shubhdixitnoogler@gmail.com";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nameInput = form.querySelector('[name="name"]');
    var emailInput = form.querySelector('[name="email"]');
    var subjectInput = form.querySelector('[name="subject"]');
    var messageInput = form.querySelector('[name="message"]');

    var name = nameInput ? nameInput.value.trim() : "";
    var email = emailInput ? emailInput.value.trim() : "";
    var subject = (subjectInput && subjectInput.value.trim())
      ? subjectInput.value.trim()
      : "New DevOps Portfolio Contact from " + (name || "Visitor");
    var message = messageInput ? messageInput.value.trim() : "";

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.className = "form-status status-error";
        statusEl.textContent = "Please fill in all required fields (Name, Email, Message).";
      }
      return;
    }

    // Set loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">Transmitting packet...</span> <span class="btn-icon">⏳</span>';
    }
    if (statusEl) {
      statusEl.className = "form-status status-loading";
      statusEl.textContent = "Connecting to mail gateway & dispatching to shubhdixitnoogler@gmail.com...";
    }

    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        _subject: subject,
        message: message,
        _template: "table"
      })
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("HTTP error " + res.status);
        }
        return res.json();
      })
      .then(function (data) {
        if (statusEl) {
          statusEl.className = "form-status status-success";
          statusEl.innerHTML = "✅ Message dispatched successfully! Shubh will review and get back to you shortly.";
        }
        form.reset();

        if (submitBtn) {
          submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span> <span class="btn-icon">✅</span>';
        }

        // Trigger avatar celebration & speech
        var avatar = document.getElementById("avatar");
        if (avatar && window.getSelection) {
          var avatarSpeech = document.getElementById("avatar-speech");
          if (avatarSpeech) {
            var speechText = avatarSpeech.querySelector(".speech-text");
            if (speechText) speechText.textContent = "Message received! Thanks for reaching out 🚀";
            avatarSpeech.classList.add("active");
          }
          avatar.click();
        }

        setTimeout(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="btn-text">Send Another Message</span> <span class="btn-icon">🚀</span>';
          }
        }, 4000);
      })
      .catch(function (err) {
        if (statusEl) {
          statusEl.className = "form-status status-error";
          statusEl.innerHTML =
            '⚠️ Transmission error. You can also reach me directly at <a href="mailto:shubhdixitnoogler@gmail.com" style="color:var(--amber);text-decoration:underline;">shubhdixitnoogler@gmail.com</a>.';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="btn-text">Retry Send</span> <span class="btn-icon">🚀</span>';
        }
      });
  });
})();
