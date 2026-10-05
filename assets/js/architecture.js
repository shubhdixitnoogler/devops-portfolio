/* =====================================================
   Interactive AKS Architecture Visualizer Engine
   Features:
   - Interactive pipeline stages with live inspection cards
   - Production configuration snippets for each stage
   - Pipeline run simulation with animated data packet
   - Integrated audio feedback
===================================================== */
(function () {
  "use strict";

  var visualizer = document.getElementById("aks-architecture-visualizer");
  if (!visualizer) return;

  var nodes = visualizer.querySelectorAll(".arch-node");
  var detailEl = document.getElementById("arch-stage-detail");
  var simBtn = document.getElementById("arch-sim-btn");

  var STAGE_DATA = {
    git: {
      badge: "STAGE 01",
      title: "Git Version Control & Branch Protection",
      tech: "Git • GitHub Actions • Branch Rules",
      desc: "Developers commit microservices changes. Feature branches require pull request reviews and passing automated CI checks before merging into main, preventing configuration drift.",
      metrics: "100% auditable commit history with enforced PR checks",
      codeLang: "yaml",
      codeTitle: "branch-protection.yml",
      snippet:
`# GitHub Branch Protection Policy
protect_branch:
  name: "main"
  enforce_admins: true
  required_status_checks:
    strict: true
    contexts: ["ci/build-and-test", "security/trivy-scan"]
  required_pull_request_reviews:
    required_approving_review_count: 1`
    },

    ci: {
      badge: "STAGE 02",
      title: "Automated Build, Test & Security Scanning",
      tech: "GitHub Actions • Docker Multi-Stage • Trivy",
      desc: "Triggers on pull request. Compiles microservices using Docker multi-stage builds to minimize image surface. Runs Trivy vulnerability scanner to block critical CVEs before pushing to registry.",
      metrics: "60% smaller Docker image size & automated CVE gating",
      codeLang: "yaml",
      codeTitle: "ci-pipeline.yml",
      snippet:
`# CI Docker Multi-Stage Build & Security Scan
- name: Build Docker image
  run: docker build -t myapp:\${{ github.sha }} .
- name: Run Trivy Vulnerability Scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'myapp:\${{ github.sha }}'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'`
    },

    registry: {
      badge: "STAGE 03",
      title: "Secure Azure Container Registry (ACR)",
      tech: "Azure ACR • Private Endpoints • RBAC",
      desc: "Validated container images are pushed to Azure Container Registry (ACR) with immutable SHA-256 digest tags. Integrated with Azure Private Endpoints so images never traverse the public internet.",
      metrics: "Zero public internet exposure via VNet Private Endpoints",
      codeLang: "hcl",
      codeTitle: "terraform/acr.tf",
      snippet:
`# Terraform Azure Container Registry with Private Endpoint
resource "azurerm_container_registry" "acr" {
  name                = "acrprodservices"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Premium"
  admin_enabled       = false
  public_network_access_enabled = false
}`
    },

    cd: {
      badge: "STAGE 04",
      title: "GitOps Continuous Deployment & Helm Packaging",
      tech: "Helm 3 • NGINX Ingress • Azure DevOps",
      desc: "Microservices configurations are packaged into modular Helm charts. Helm handles environment-specific values, rollback triggers, and traffic routing via NGINX Ingress Controller with SSL termination.",
      metrics: "40% faster deployment lead time with instant rollback capability",
      codeLang: "yaml",
      codeTitle: "helm/values-prod.yaml",
      snippet:
`# Helm Values for Production Release
replicaCount: 3
ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: api.shubhdixit.cloud
      paths:
        - path: /
          pathType: Prefix`
    },

    aks: {
      badge: "STAGE 05",
      title: "Azure Kubernetes Service (AKS) & Autoscaling",
      tech: "Azure AKS • HPA • Azure CNI • Terraform",
      desc: "Clusters run on Azure Kubernetes Service provisioned via Terraform modules. Horizontal Pod Autoscaler (HPA) automatically scales pods between 3 and 10 replicas based on CPU and memory metrics.",
      metrics: "99.9% uptime sustained with zero manual intervention",
      codeLang: "yaml",
      codeTitle: "k8s/hpa-policy.yaml",
      snippet:
`# Kubernetes Horizontal Pod Autoscaler (HPA)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: microservices-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: microservice-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 75`
    },

    monitoring: {
      badge: "STAGE 06",
      title: "Observability, Custom Dashboards & Alerting",
      tech: "Prometheus • Grafana • Alertmanager",
      desc: "Prometheus scrapes cluster metrics, pod resource utilization, and API latency. Custom Grafana dashboards monitor SLOs with Alertmanager rules routing alerts to teams before incidents cause downtime.",
      metrics: "Sub-second anomaly detection & zero open critical incidents",
      codeLang: "yaml",
      codeTitle: "monitoring/alert-rules.yaml",
      snippet:
`# Prometheus Alert Rule for Microservice Latency
- alert: HighRequestLatency
  expr: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 0.35
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "High P99 Latency detected on AKS cluster"`
    }
  };

  function renderStage(key) {
    var data = STAGE_DATA[key];
    if (!data || !detailEl) return;

    nodes.forEach(function (node) {
      if (node.getAttribute("data-stage") === key) {
        node.classList.add("active");
      } else {
        node.classList.remove("active");
      }
    });

    detailEl.innerHTML =
      '<div class="arch-detail-header">' +
        '<div class="arch-detail-meta">' +
          '<span class="arch-stage-badge">' + data.badge + '</span>' +
          '<h5 class="arch-stage-heading">' + data.title + '</h5>' +
          '<span class="arch-stage-tech-list">' + data.tech + '</span>' +
        '</div>' +
        '<div class="arch-metric-pill">' +
          '<span class="metric-icon">📈</span> ' + data.metrics +
        '</div>' +
      '</div>' +
      '<p class="arch-stage-desc">' + data.desc + '</p>' +
      '<div class="arch-code-block">' +
        '<div class="arch-code-bar">' +
          '<span class="code-dot red"></span>' +
          '<span class="code-dot yellow"></span>' +
          '<span class="code-dot green"></span>' +
          '<span class="arch-code-title">' + data.codeTitle + '</span>' +
        '</div>' +
        '<pre class="arch-code-content"><code>' + escapeHTML(data.snippet) + '</code></pre>' +
      '</div>';
  }

  function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Node click listeners
  nodes.forEach(function (node) {
    node.addEventListener("click", function () {
      var stage = node.getAttribute("data-stage");
      if (window.DevOpsAudio) {
        window.DevOpsAudio.playKeyClick();
      }
      renderStage(stage);
    });

    node.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        node.click();
      }
    });
  });

  // Automated Pipeline Simulation
  var isSimulating = false;
  var simInterval = null;

  if (simBtn) {
    simBtn.addEventListener("click", function () {
      if (isSimulating) return;
      isSimulating = true;
      simBtn.disabled = true;
      simBtn.innerHTML = '<span class="sim-icon">⏳</span> Simulating Deployment...';

      if (window.DevOpsAudio) {
        window.DevOpsAudio.playCommand();
      }

      var stageKeys = ["git", "ci", "registry", "cd", "aks", "monitoring"];
      var step = 0;

      renderStage(stageKeys[0]);

      simInterval = setInterval(function () {
        step++;
        if (step >= stageKeys.length) {
          clearInterval(simInterval);
          isSimulating = false;
          simBtn.disabled = false;
          simBtn.innerHTML = '<span class="sim-icon">✔</span> Simulation Complete!';

          if (window.DevOpsAudio) {
            window.DevOpsAudio.playSuccess();
          }

          setTimeout(function () {
            simBtn.innerHTML = '<span class="sim-icon">▶</span> Simulate Pipeline Run';
          }, 3000);
        } else {
          renderStage(stageKeys[step]);
          if (window.DevOpsAudio) {
            window.DevOpsAudio.playHover();
          }
        }
      }, 1200);
    });
  }

  // Initial render with stage 1 (Git)
  renderStage("git");
})();
