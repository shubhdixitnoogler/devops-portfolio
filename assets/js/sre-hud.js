/* =====================================================
   Live SRE Cluster Telemetry & Golden Signals HUD
   Draws animated sparkline graphs and simulates live
   Kubernetes cluster operational metrics.
===================================================== */
(function () {
  "use strict";

  var hud = document.getElementById("sre-telemetry-hud");
  if (!hud) return;

  var latencyVal = document.getElementById("hud-val-latency");
  var rpsVal = document.getElementById("hud-val-rps");
  var errorVal = document.getElementById("hud-val-error");
  var satVal = document.getElementById("hud-val-sat");

  var canvasLatency = document.getElementById("sparkline-latency");
  var canvasRps = document.getElementById("sparkline-rps");
  var canvasError = document.getElementById("sparkline-error");
  var canvasSat = document.getElementById("sparkline-sat");

  // History buffers for sparklines
  var latencyHistory = [22, 24, 21, 25, 23, 26, 22, 24, 23, 25, 22, 24, 23];
  var rpsHistory = [1380, 1420, 1390, 1450, 1410, 1440, 1430, 1410, 1460, 1420];
  var errorHistory = [0.001, 0.002, 0.001, 0.001, 0.003, 0.001, 0.001, 0.002];
  var satHistory = [41, 43, 40, 42, 45, 41, 42, 44, 43, 42];

  function drawSparkline(canvas, data, color) {
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = (canvas.width = canvas.offsetWidth * 2);
    var h = (canvas.height = canvas.offsetHeight * 2);

    ctx.clearRect(0, 0, w, h);
    if (data.length < 2) return;

    var min = Math.min.apply(null, data) * 0.9;
    var max = Math.max.apply(null, data) * 1.1;
    if (max === min) max = min + 1;

    ctx.beginPath();
    for (var i = 0; i < data.length; i++) {
      var x = (i / (data.length - 1)) * w;
      var y = h - ((data[i] - min) / (max - min)) * (h - 8) - 4;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = color || "#5eead4";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Subtle gradient fill under sparkline
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color ? "rgba(94, 234, 212, 0.25)" : "rgba(255, 180, 84, 0.25)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function updateMetrics() {
    // 1. Latency (P95 ~22-26ms)
    var nextLat = 22 + Math.floor(Math.random() * 5);
    latencyHistory.push(nextLat);
    if (latencyHistory.length > 20) latencyHistory.shift();
    if (latencyVal) latencyVal.textContent = nextLat + "ms";
    drawSparkline(canvasLatency, latencyHistory, "#5eead4");

    // 2. Traffic RPS (~1380-1460 req/s)
    var nextRps = 1390 + Math.floor(Math.random() * 80);
    rpsHistory.push(nextRps);
    if (rpsHistory.length > 20) rpsHistory.shift();
    if (rpsVal) rpsVal.textContent = nextRps.toLocaleString() + "/s";
    drawSparkline(canvasRps, rpsHistory, "#ffb454");

    // 3. Error Rate (<0.005%)
    var nextErr = 0.001 + (Math.random() * 0.002);
    errorHistory.push(nextErr);
    if (errorHistory.length > 20) errorHistory.shift();
    if (errorVal) errorVal.textContent = nextErr.toFixed(3) + "%";
    drawSparkline(canvasError, errorHistory, "#4ade80");

    // 4. Saturation (~40-45%)
    var nextSat = 41 + Math.floor(Math.random() * 4);
    satHistory.push(nextSat);
    if (satHistory.length > 20) satHistory.shift();
    if (satVal) satVal.textContent = nextSat + "%";
    drawSparkline(canvasSat, satHistory, "#38bdf8");
  }

  // Update loop every 2.5s
  setInterval(updateMetrics, 2500);
  setTimeout(updateMetrics, 200);

  // Resize handler
  window.addEventListener("resize", function () {
    drawSparkline(canvasLatency, latencyHistory, "#5eead4");
    drawSparkline(canvasRps, rpsHistory, "#ffb454");
    drawSparkline(canvasError, errorHistory, "#4ade80");
    drawSparkline(canvasSat, satHistory, "#38bdf8");
  });
})();
