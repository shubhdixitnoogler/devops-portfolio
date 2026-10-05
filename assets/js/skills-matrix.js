/* =====================================================
   Interactive Skills Matrix & Proof Cards
   Category filtering + expandable proof cards with
   production engineering context for recruiters.
===================================================== */
(function () {
  "use strict";

  var section = document.getElementById("skills");
  if (!section) return;

  var filterBtns = section.querySelectorAll(".skill-filter-btn");
  var skillItems = section.querySelectorAll(".skills-grid li");
  var proofContainer = document.getElementById("skill-proof-card");

  var PROOF_DATA = {
    terraform: {
      title: "Terraform (Infrastructure as Code)",
      icon: "🏗️",
      badge: "3.5+ YEARS PRODUCTION USE",
      desc: "Architected multi-cloud IaC provisioning for Azure and AWS. Built reusable modular codebases with dynamic blocks, for_each iterators, and remote state management in Azure Blob Storage with distributed lease locking.",
      chips: ["Modular Architecture", "Remote State Locking", "Azure & AWS Providers", "Workspaces & Parity"]
    },

    kubernetes: {
      title: "Kubernetes & Azure Kubernetes Service (AKS)",
      icon: "☸️",
      badge: "PRODUCTION CONTAINER ORCHESTRATION",
      desc: "Deployed and operated microservices across AKS clusters. Configured Horizontal Pod Autoscalers (HPA), NGINX Ingress controllers, TLS cert-manager, cluster network policies, and Helm 3 release management.",
      chips: ["AKS Clusters", "Horizontal Pod Autoscaler (HPA)", "Ingress Controllers", "Helm 3 Charts"]
    },

    azure: {
      title: "Microsoft Azure Cloud Infrastructure",
      icon: "☁️",
      badge: "PRIMARY ENTERPRISE CLOUD",
      desc: "Designed secure Azure virtual networks (VNets), subnets, NSGs, Azure Container Registry (ACR), Azure Key Vault secrets integration, and managed identity RBAC for zero-trust enterprise security.",
      chips: ["AKS", "VNets & Peering", "ACR Registry", "Azure Key Vault", "Managed Identity"]
    },

    aws: {
      title: "Amazon Web Services (AWS)",
      icon: "☁️",
      badge: "HYBRID CLOUD INFRASTRUCTURE",
      desc: "Provisioned secure AWS VPCs, subnets, EC2 instances, S3 storage buckets, IAM least-privilege security roles, and CloudWatch metrics alongside Azure workloads using unified Terraform modules.",
      chips: ["VPC Networking", "EC2 & S3", "IAM Least Privilege", "CloudWatch"]
    },

    docker: {
      title: "Docker Containerization & Security",
      icon: "🐳",
      badge: "60% IMAGE SIZE REDUCTION",
      desc: "Containerized enterprise polyglot microservices using Docker multi-stage builds to eliminate build tooling from production artifacts. Integrated Trivy image scanning to gate vulnerabilities in CI pipelines.",
      chips: ["Multi-Stage Builds", "Trivy CVE Scanning", "Alpine & Distroless", "Layer Caching"]
    },

    "github-actions": {
      title: "GitHub Actions & CI/CD Automation",
      icon: "🔁",
      badge: "40% DEPLOYMENT TIME CUT",
      desc: "Engineered automated CI/CD release pipelines with automated linting, security scans, artifact build, and GitOps deployments to staging and production clusters with blue-green rollback triggers.",
      chips: ["Matrix Builds", "Automated Rollback", "Secrets Management", "Self-Hosted Runners"]
    },

    prometheus: {
      title: "Prometheus Monitoring & Alerting",
      icon: "📊",
      badge: "P99 SLO ALERTING & TIME-SERIES",
      desc: "Deployed Prometheus node exporters and kube-state-metrics to collect cluster telemetry, HTTP request latency histograms, and saturation metrics. Authored Alertmanager rules for rapid anomaly detection.",
      chips: ["PromQL Queries", "ServiceMonitors", "Alertmanager Routing", "SLO / SLI Tracking"]
    },

    grafana: {
      title: "Grafana Enterprise Dashboards",
      icon: "📈",
      badge: "EXECUTIVE & SRE OBSERVABILITY",
      desc: "Created centralized Grafana dashboards visualizing golden signals (latency, traffic, error budget burn rates, saturation) across multi-cluster Kubernetes deployments for HCL development teams.",
      chips: ["Golden Signals Dashboards", "Cluster Heatmaps", "Error Budget Burn", "Datasource Integration"]
    },

    linux: {
      title: "Linux Administration & Bash Scripting",
      icon: "🐧",
      badge: "25% TOIL REDUCTION",
      desc: "Automated daily infrastructure maintenance, log rotations, security patching, and health diagnostics across Ubuntu and RHEL fleets via modular Bash and Python automation scripts.",
      chips: ["Bash Automation", "Systemd Services", "Network Diagnostics", "Log Rotation & Cron"]
    }
  };

  function showProof(key) {
    if (!proofContainer) return;
    var data = PROOF_DATA[key];
    if (!data) return;

    // Highlight active skill item
    skillItems.forEach(function (item) {
      if (item.getAttribute("data-skill") === key) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    proofContainer.innerHTML =
      '<div class="proof-header">' +
        '<h4 class="proof-title"><span class="proof-icon">' + data.icon + '</span> ' + data.title + '</h4>' +
        '<span class="proof-badge">' + data.badge + '</span>' +
      '</div>' +
      '<p class="proof-desc">' + data.desc + '</p>' +
      '<div class="proof-chips">' +
        data.chips.map(function (c) { return '<span class="proof-chip">' + c + '</span>'; }).join("") +
      '</div>';

    proofContainer.classList.add("active");

    if (window.DevOpsAudio) {
      window.DevOpsAudio.playKeyClick();
    }
  }

  // Bind skill badge clicks
  skillItems.forEach(function (item) {
    item.classList.add("skill-item-interactive");
    item.addEventListener("click", function () {
      var key = item.getAttribute("data-skill");
      if (key) {
        showProof(key);
      }
    });
  });

  // Category filter buttons
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-category");

      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      skillItems.forEach(function (item) {
        var itemCat = item.getAttribute("data-category") || "";
        if (cat === "all" || itemCat.indexOf(cat) !== -1) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });

      if (window.DevOpsAudio) {
        window.DevOpsAudio.playHover();
      }
    });
  });

  // Default display for first skill (Terraform)
  setTimeout(function () {
    showProof("terraform");
  }, 300);
})();
