/* =====================================================
   Interactive DevOps Terminal (Playable CLI)
   Features:
   - Command interpreter (whoami, help, skills, kubectl, terraform, etc.)
   - Command history navigation (Up / Down arrow keys)
   - Real-time mechanical typing audio integration
   - Tab completion / suggestions
   - Realistic colored terminal output
===================================================== */
(function () {
  "use strict";

  var terminalEl = document.getElementById("interactive-terminal");
  var inputEl = document.getElementById("term-cli-input");
  var outputEl = document.getElementById("term-output");

  if (!terminalEl || !inputEl || !outputEl) return;

  var history = [];
  var historyIndex = -1;

  var COMMANDS = {
    help: function () {
      return [
        '<span class="term-cyan">Available commands:</span>',
        '  <span class="term-amber">whoami</span>       - About Shubh Dixit & current role',
        '  <span class="term-amber">skills</span>       - Cloud, K8s, IaC, CI/CD, and Observability stack',
        '  <span class="term-amber">experience</span>   - Career history & achievements at HCL Tech',
        '  <span class="term-amber">projects</span>     - Overview of key engineering projects',
        '  <span class="term-amber">kubectl</span>      - Run K8s commands (<span class="term-dim">kubectl get nodes</span>, <span class="term-dim">kubectl get pods</span>)',
        '  <span class="term-amber">terraform</span>    - Run IaC commands (<span class="term-dim">terraform plan</span>, <span class="term-dim">terraform apply</span>)',
        '  <span class="term-amber">uptime</span>       - Production uptime metrics & incident counter',
        '  <span class="term-amber">contact</span>      - Email, LinkedIn, GitHub & location',
        '  <span class="term-amber">resume</span>       - Download PDF resume directly',
        '  <span class="term-amber">clear</span>        - Clear the terminal screen'
      ].join("\n");
    },

    whoami: function () {
      return [
        '<span class="term-green">Shubh Dixit</span> — DevOps Automation Engineer (Senior Analyst at HCL Tech)',
        'Specializing in Azure & AWS Cloud Infrastructure, AKS Container Orchestration,',
        'Terraform Infrastructure as Code, CI/CD Pipelines, and Prometheus/Grafana Observability.',
        '<span class="term-cyan">Status:</span> Open for DevOps & SRE opportunities.'
      ].join("\n");
    },

    skills: function () {
      return [
        '<span class="term-amber">☁️ Cloud:</span>        Azure (AKS, VNets, NSGs, App Services, Blob), AWS (EC2, S3, EKS)',
        '<span class="term-amber">🐳 Containers:</span>   Kubernetes, AKS, EKS, Docker, Helm, HPA, Ingress Controllers',
        '<span class="term-amber">🏗️ IaC:</span>          Terraform (Modules, for_each, dynamic blocks, remote state), Ansible',
        '<span class="term-amber">🔁 CI/CD:</span>        GitHub Actions, Azure DevOps Pipelines, Blue-Green, Canary',
        '<span class="term-amber">📊 Observability:</span> Prometheus, Grafana, Azure Monitor, CloudWatch, Custom Alerting',
        '<span class="term-amber">🐧 Scripting:</span>     Bash, Shell, Python, Linux Administration (Ubuntu, RHEL)'
      ].join("\n");
    },

    experience: function () {
      return [
        '<span class="term-cyan">HCL Technologies — DevOps Automation Engineer (Senior Analyst)</span> <span class="term-dim">[Oct 2024 — Present]</span>',
        '  • Reduced microservices deployment lead time by 40% using GitHub Actions & Azure DevOps.',
        '  • Architected AKS clusters with HPA and multi-cloud Terraform modules.',
        '  • Maintained 99.9% uptime for business-critical applications.',
        '',
        '<span class="term-cyan">HCL Technologies — Analyst – Infrastructure Support</span> <span class="term-dim">[Feb 2023 — Sept 2024]</span>',
        '  • Automated log rotations and health checks via Bash, reducing toil by 25%.',
        '  • Debugged incidents using Linux CLI tools (grep, awk, sed, top).'
      ].join("\n");
    },

    projects: function () {
      return [
        '1. <span class="term-amber">End-to-End AKS Orchestration</span>       - Microservices CI/CD + Helm + Prometheus monitoring',
        '2. <span class="term-amber">Hybrid Cloud IaC with Terraform</span>   - Multi-cloud VNet/VPC provisioning with remote state',
        '3. <span class="term-amber">Zero-Downtime Deployment Strategy</span> - Blue-Green & Canary releases with automated rollback',
        '4. <span class="term-amber">Enterprise Observability Stack</span>     - Custom Grafana dashboards & SLO alert rules'
      ].join("\n");
    },

    uptime: function () {
      return [
        '<span class="term-green">● SYSTEM STATUS: 100% OPERATIONAL</span>',
        '  Uptime Sustained:       <span class="term-amber">99.9%</span>',
        '  Deploy Lead Time Cut:   <span class="term-amber">40%</span>',
        '  Years of Experience:    <span class="term-amber">3.5+</span>',
        '  Open Critical Incidents:<span class="term-green"> 0</span>'
      ].join("\n");
    },

    contact: function () {
      return [
        '📧 Email:    <a href="mailto:shubhdixitnoogler@gmail.com" class="term-link">shubhdixitnoogler@gmail.com</a>',
        '💼 LinkedIn: <a href="https://linkedin.com/in/shubhdixitnoogler" target="_blank" rel="noopener" class="term-link">linkedin.com/in/shubhdixitnoogler</a>',
        '💻 GitHub:   <a href="https://github.com/shubhdixitnoogler" target="_blank" rel="noopener" class="term-link">github.com/shubhdixitnoogler</a>',
        '🌍 Location: Lucknow, India (Open to Remote / Relocation)'
      ].join("\n");
    },

    resume: function () {
      var link = document.createElement("a");
      link.href = "Shubh_Dixit_SRE_DevOps.pdf";
      link.download = "Shubh_Dixit_SRE_DevOps.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return '<span class="term-green">📥 Initiated download for Shubh_Dixit_SRE_DevOps.pdf...</span>';
    },

    clear: function () {
      outputEl.innerHTML = "";
      return null;
    }
  };

  // Kubernetes command handler
  function handleKubectl(args) {
    var sub = args.join(" ").toLowerCase();
    if (sub === "get nodes" || sub === "get node") {
      return [
        'NAME                             STATUS   ROLES   AGE    VERSION',
        'aks-agentpool-39281012-vmss0000  <span class="term-green">Ready</span>    agent   142d   v1.28.5',
        'aks-agentpool-39281012-vmss0001  <span class="term-green">Ready</span>    agent   142d   v1.28.5',
        'aks-systempool-1928019-vmss0000  <span class="term-green">Ready</span>    agent   142d   v1.28.5'
      ].join("\n");
    }
    if (sub === "get pods" || sub === "get pod" || sub === "get pods -a") {
      return [
        'NAME                                READY   STATUS    RESTARTS   AGE',
        'ingress-nginx-controller-74b89      1/1     <span class="term-green">Running</span>   0          48d',
        'frontend-microservice-68f4d-2xq9    1/1     <span class="term-green">Running</span>   0          12d',
        'backend-api-service-91a2c-7kp1      1/1     <span class="term-green">Running</span>   0          12d',
        'prometheus-node-exporter-83df       1/1     <span class="term-green">Running</span>   0          94d',
        'grafana-dashboard-core-54ec         1/1     <span class="term-green">Running</span>   0          94d'
      ].join("\n");
    }
    if (sub.indexOf("describe") === 0) {
      return '<span class="term-cyan">Events:</span> 0 Warning, 4 Normal (Scheduled, Pulled, Created, Started). Pod healthy.';
    }
    return '<span class="term-dim">Usage: kubectl [get nodes | get pods | describe pod &lt;name&gt;]</span>';
  }

  // Terraform command handler
  function handleTerraform(args) {
    var sub = (args[0] || "").toLowerCase();
    if (sub === "plan") {
      return [
        '<span class="term-cyan">Terraform will perform the following actions:</span>',
        '  <span class="term-green">+ azurerm_kubernetes_cluster.aks</span>',
        '  <span class="term-green">+ azurerm_virtual_network.vnet</span>',
        '  <span class="term-green">+ azurerm_subnet.aks_subnet</span>',
        '',
        '<span class="term-amber">Plan: 3 to add, 0 to change, 0 to destroy.</span>'
      ].join("\n");
    }
    if (sub === "apply") {
      return [
        'azurerm_virtual_network.vnet: Creating...',
        'azurerm_subnet.aks_subnet: Creating...',
        'azurerm_kubernetes_cluster.aks: Provisioning...',
        '<span class="term-green">Apply complete! Resources: 3 added, 0 changed, 0 destroyed.</span>'
      ].join("\n");
    }
    return '<span class="term-dim">Usage: terraform [plan | apply]</span>';
  }

  function executeCommand(raw) {
    var trimmed = raw.trim();
    if (!trimmed) return;

    history.push(trimmed);
    historyIndex = history.length;

    // Echo input
    var lineEl = document.createElement("p");
    lineEl.className = "term-line prompt-line";
    lineEl.innerHTML = '<span class="prompt">$</span> <span class="cmd-text">' + escapeHTML(trimmed) + '</span>';
    outputEl.appendChild(lineEl);

    // Play terminal execute sound
    if (window.DevOpsAudio) {
      window.DevOpsAudio.playCommand();
    }

    var parts = trimmed.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1);
    var output = "";

    if (cmd === "kubectl") {
      output = handleKubectl(args);
    } else if (cmd === "terraform") {
      output = handleTerraform(args);
    } else if (cmd === "cat" && (args[0] === "resume" || args[0] === "resume.pdf" || args[0] === "resume.txt")) {
      output = COMMANDS.resume();
    } else if (COMMANDS[cmd]) {
      output = COMMANDS[cmd](args);
    } else {
      output = '<span class="term-error">command not found: ' + escapeHTML(cmd) + '</span>. Type <span class="term-highlight">\'help\'</span> for available commands.';
    }

    if (output !== null && output !== undefined) {
      var outEl = document.createElement("p");
      outEl.className = "term-line output-line";
      outEl.innerHTML = output;
      outputEl.appendChild(outEl);
    }

    // Scroll to bottom of terminal
    terminalEl.scrollTop = terminalEl.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Keydown handler
  inputEl.addEventListener("keydown", function (e) {
    // Play mechanical click
    if (window.DevOpsAudio && e.key.length === 1) {
      window.DevOpsAudio.playKeyClick();
    }

    if (e.key === "Enter") {
      e.preventDefault();
      var val = inputEl.value;
      inputEl.value = "";
      executeCommand(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length && historyIndex > 0) {
        historyIndex--;
        inputEl.value = history[historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        inputEl.value = history[historyIndex] || "";
      } else {
        historyIndex = history.length;
        inputEl.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      var current = inputEl.value.trim().toLowerCase();
      var keys = Object.keys(COMMANDS).concat(["kubectl get nodes", "kubectl get pods", "terraform plan", "terraform apply"]);
      for (var k = 0; k < keys.length; k++) {
        if (keys[k].indexOf(current) === 0) {
          inputEl.value = keys[k];
          break;
        }
      }
    }
  });

  // Focus input when clicking anywhere on the terminal
  terminalEl.addEventListener("click", function () {
    inputEl.focus();
  });
})();
