(function () {
  var mindMapWindow = document.getElementById("systems-map-window");
  var mindMapCanvas = document.getElementById("mind-map-canvas");
  var mindMapNodes = document.getElementById("mind-map-nodes");
  var mindMapLines = document.getElementById("mind-map-lines");
  var detailTitle = document.getElementById("mind-map-detail-title");
  var detailSubtitle = document.getElementById("mind-map-detail-subtitle");
  var detailDescription = document.getElementById("mind-map-detail-description");
  var detailPhilosophy = document.getElementById("mind-map-detail-philosophy");

  if (
    !mindMapWindow ||
    !mindMapCanvas ||
    !mindMapNodes ||
    !mindMapLines ||
    !detailTitle ||
    !detailSubtitle ||
    !detailDescription ||
    !detailPhilosophy
  ) {
    return;
  }

  var NODE_DATA = {
    core: {
      tier: "central",
      title: "Chad McCormack",
      subtitle: "Systems Engineer",
      position: [50, 50],
      description: "Systems-first engineering with practical architecture, resilient automation, and operational clarity.",
      philosophy: "Great systems help teams move faster by reducing uncertainty."
    },
    automation: {
      tier: "primary",
      title: "Automation",
      subtitle: "Repeatable systems",
      position: [50, 18],
      description: "Designing workflows that remove repetitive toil and convert manual steps into dependable automation.",
      philosophy: "If a task happens twice, it deserves automation."
    },
    infrastructure: {
      tier: "primary",
      title: "Infrastructure",
      subtitle: "Platform foundations",
      position: [77, 32],
      description: "Building reliable environments with clear operational boundaries and long-term maintainability.",
      philosophy: "Infrastructure should feel invisible when it is healthy."
    },
    aiSystems: {
      tier: "primary",
      title: "AI Systems",
      subtitle: "Practical intelligence",
      position: [77, 68],
      description: "Applying AI where it improves workflows, assists decision-making, and increases engineering leverage.",
      philosophy: "AI should augment engineer judgment, not replace it."
    },
    reliability: {
      tier: "primary",
      title: "Reliability",
      subtitle: "Signals and recovery",
      position: [50, 82],
      description: "Operational resilience through observability, incident readiness, and service-level thinking.",
      philosophy: "Resilience is designed before incidents happen."
    },
    developerTooling: {
      tier: "primary",
      title: "Developer Tooling",
      subtitle: "Engineer experience",
      position: [23, 68],
      description: "Tooling that reduces friction, speeds feedback loops, and helps teams stay focused on meaningful work.",
      philosophy: "Developer experience is a reliability multiplier."
    },
    operationalThinking: {
      tier: "primary",
      title: "Operational Thinking",
      subtitle: "Real-world execution",
      position: [23, 32],
      description: "Designing systems with production reality in mind: visibility, ownership, and operational consistency.",
      philosophy: "Good architecture includes how the system is run."
    },
    workflowAutomation: {
      tier: "secondary",
      title: "workflow automation",
      subtitle: "automation",
      position: [36, 9],
      description: "Eliminating repetitive process steps with scripted and event-driven automation paths.",
      philosophy: "Consistency beats heroics in production."
    },
    taskOrchestration: {
      tier: "secondary",
      title: "task orchestration",
      subtitle: "automation",
      position: [50, 6],
      description: "Sequencing dependent actions safely so systems behave predictably at scale.",
      philosophy: "Order and observability make automation trustworthy."
    },
    repeatableSystems: {
      tier: "secondary",
      title: "repeatable systems",
      subtitle: "automation",
      position: [64, 9],
      description: "Creating reusable patterns that teams can execute without custom one-off handling.",
      philosophy: "The best runbook is one you rarely need."
    },
    platformArchitecture: {
      tier: "secondary",
      title: "platform architecture",
      subtitle: "infrastructure",
      position: [88, 24],
      description: "Defining stable platform boundaries that support many services without operational sprawl.",
      philosophy: "Strong foundations make product velocity sustainable."
    },
    networkSystems: {
      tier: "secondary",
      title: "network systems",
      subtitle: "infrastructure",
      position: [92, 32],
      description: "Pragmatic network design for secure connectivity, reliable routing, and clear segmentation.",
      philosophy: "Networks should be explicit, observable, and resilient."
    },
    resilientEnvironments: {
      tier: "secondary",
      title: "resilient environments",
      subtitle: "infrastructure",
      position: [88, 40],
      description: "Operationally safe environments with recovery patterns and confidence in change.",
      philosophy: "Resilience is architecture plus discipline."
    },
    llmIntegration: {
      tier: "secondary",
      title: "LLM integration",
      subtitle: "ai systems",
      position: [88, 60],
      description: "Integrating language models into engineering systems for focused, high-value use cases.",
      philosophy: "AI value comes from context and clear guardrails."
    },
    aiTooling: {
      tier: "secondary",
      title: "AI tooling",
      subtitle: "ai systems",
      position: [92, 68],
      description: "Building tooling that lets engineers apply AI capabilities without workflow disruption.",
      philosophy: "Useful AI feels like a native engineering tool."
    },
    aiAssistants: {
      tier: "secondary",
      title: "AI assistants",
      subtitle: "ai systems",
      position: [88, 76],
      description: "Assistant patterns that help with operations, diagnostics, and knowledge retrieval.",
      philosophy: "Assistants should improve signal, not add noise."
    },
    observability: {
      tier: "secondary",
      title: "observability",
      subtitle: "reliability",
      position: [36, 91],
      description: "Telemetry and diagnostics designed to reduce mean-time-to-understand and mean-time-to-recover.",
      philosophy: "If you cannot see it, you cannot operate it well."
    },
    incidentThinking: {
      tier: "secondary",
      title: "incident thinking",
      subtitle: "reliability",
      position: [50, 94],
      description: "Response patterns focused on calm execution, clear ownership, and useful post-incident learning.",
      philosophy: "Incidents are data for better architecture."
    },
    systemHealth: {
      tier: "secondary",
      title: "system health",
      subtitle: "reliability",
      position: [64, 91],
      description: "Health models that combine metrics, service behavior, and risk posture.",
      philosophy: "Healthy systems expose risk early."
    },
    cliTooling: {
      tier: "secondary",
      title: "CLI tooling",
      subtitle: "developer tooling",
      position: [12, 60],
      description: "Command-line utilities that streamline common engineering tasks with reliable defaults.",
      philosophy: "A good CLI turns complexity into intent."
    },
    engineeringWorkflows: {
      tier: "secondary",
      title: "engineering workflows",
      subtitle: "developer tooling",
      position: [8, 68],
      description: "Workflow design that improves throughput while preserving quality and operational visibility.",
      philosophy: "Fast feedback loops create better systems."
    },
    developerExperience: {
      tier: "secondary",
      title: "developer experience",
      subtitle: "developer tooling",
      position: [12, 76],
      description: "Reducing friction so engineers spend more time building and less time fighting tooling.",
      philosophy: "DX is infrastructure for human productivity."
    },
    runbooks: {
      tier: "secondary",
      title: "runbooks",
      subtitle: "operational thinking",
      position: [12, 24],
      description: "Actionable operational playbooks with clear decision points and escalation paths.",
      philosophy: "Runbooks should be executable under pressure."
    },
    automationFirstMindset: {
      tier: "secondary",
      title: "automation-first mindset",
      subtitle: "operational thinking",
      position: [8, 32],
      description: "Designing operations around automation from the beginning, not as an afterthought.",
      philosophy: "Automation is architecture, not cleanup."
    },
    systemsVisibility: {
      tier: "secondary",
      title: "systems visibility",
      subtitle: "operational thinking",
      position: [12, 40],
      description: "Surfacing system state clearly so decisions are informed and response is faster.",
      philosophy: "Visibility turns operations into engineering."
    }
  };

  var NODE_ORDER = [
    "core",
    "automation",
    "infrastructure",
    "aiSystems",
    "reliability",
    "developerTooling",
    "operationalThinking",
    "workflowAutomation",
    "taskOrchestration",
    "repeatableSystems",
    "platformArchitecture",
    "networkSystems",
    "resilientEnvironments",
    "llmIntegration",
    "aiTooling",
    "aiAssistants",
    "observability",
    "incidentThinking",
    "systemHealth",
    "cliTooling",
    "engineeringWorkflows",
    "developerExperience",
    "runbooks",
    "automationFirstMindset",
    "systemsVisibility"
  ];

  var CONNECTIONS = [
    ["core", "automation", "primary"],
    ["core", "infrastructure", "primary"],
    ["core", "aiSystems", "primary"],
    ["core", "reliability", "primary"],
    ["core", "developerTooling", "primary"],
    ["core", "operationalThinking", "primary"],

    ["automation", "workflowAutomation", "secondary"],
    ["automation", "taskOrchestration", "secondary"],
    ["automation", "repeatableSystems", "secondary"],

    ["infrastructure", "platformArchitecture", "secondary"],
    ["infrastructure", "networkSystems", "secondary"],
    ["infrastructure", "resilientEnvironments", "secondary"],

    ["aiSystems", "llmIntegration", "secondary"],
    ["aiSystems", "aiTooling", "secondary"],
    ["aiSystems", "aiAssistants", "secondary"],

    ["reliability", "observability", "secondary"],
    ["reliability", "incidentThinking", "secondary"],
    ["reliability", "systemHealth", "secondary"],

    ["developerTooling", "cliTooling", "secondary"],
    ["developerTooling", "engineeringWorkflows", "secondary"],
    ["developerTooling", "developerExperience", "secondary"],

    ["operationalThinking", "runbooks", "secondary"],
    ["operationalThinking", "automationFirstMindset", "secondary"],
    ["operationalThinking", "systemsVisibility", "secondary"]
  ];

  var nodeElements = {};
  var resizeObserver = null;
  var windowMutationObserver = null;

  function isMobileStack() {
    return window.matchMedia("(max-width: 640px)").matches;
  }

  function setDetailPanel(nodeId) {
    var data = NODE_DATA[nodeId];

    if (!data) {
      return;
    }

    detailTitle.textContent = data.title;
    detailSubtitle.textContent = data.subtitle;
    detailDescription.textContent = data.description;
    detailPhilosophy.textContent = "\"" + data.philosophy + "\"";
  }

  function setActiveNode(nodeId) {
    var keys = Object.keys(nodeElements);
    for (var i = 0; i < keys.length; i += 1) {
      nodeElements[keys[i]].classList.toggle("is-active", keys[i] === nodeId);
    }

    setDetailPanel(nodeId);
  }

  function createNode(nodeId) {
    var data = NODE_DATA[nodeId];
    var node = document.createElement("button");
    var title = document.createElement("span");
    var subtitle = document.createElement("span");

    node.type = "button";
    node.className = "mind-node mind-node--" + data.tier;
    node.setAttribute("data-node-id", nodeId);
    node.setAttribute("aria-label", data.title);

    title.className = "mind-node-title";
    title.textContent = data.title;
    subtitle.className = "mind-node-subtitle";
    subtitle.textContent = data.subtitle;

    node.appendChild(title);
    node.appendChild(subtitle);
    node.addEventListener("click", function () {
      setActiveNode(nodeId);
    });

    return node;
  }

  function applyNodeLayout() {
    var mobile = isMobileStack();
    var keys = Object.keys(nodeElements);

    for (var i = 0; i < keys.length; i += 1) {
      var id = keys[i];
      var node = nodeElements[id];
      var position = NODE_DATA[id].position;

      if (mobile) {
        node.style.left = "";
        node.style.top = "";
        continue;
      }

      node.style.left = position[0] + "%";
      node.style.top = position[1] + "%";
    }
  }

  function clearLines() {
    while (mindMapLines.firstChild) {
      mindMapLines.removeChild(mindMapLines.firstChild);
    }
  }

  function createLine(x1, y1, x2, y2, className) {
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", x1.toFixed(1));
    line.setAttribute("y1", y1.toFixed(1));
    line.setAttribute("x2", x2.toFixed(1));
    line.setAttribute("y2", y2.toFixed(1));

    if (className) {
      line.setAttribute("class", className);
    }

    mindMapLines.appendChild(line);
  }

  function drawConnectionLines() {
    clearLines();

    if (isMobileStack()) {
      return;
    }

    var canvasRect = mindMapCanvas.getBoundingClientRect();

    if (!canvasRect.width || !canvasRect.height) {
      return;
    }

    for (var i = 0; i < CONNECTIONS.length; i += 1) {
      var connection = CONNECTIONS[i];
      var fromNode = nodeElements[connection[0]];
      var toNode = nodeElements[connection[1]];

      if (!fromNode || !toNode) {
        continue;
      }

      var fromRect = fromNode.getBoundingClientRect();
      var toRect = toNode.getBoundingClientRect();
      var x1 = (fromRect.left - canvasRect.left) + (fromRect.width / 2);
      var y1 = (fromRect.top - canvasRect.top) + (fromRect.height / 2);
      var x2 = (toRect.left - canvasRect.left) + (toRect.width / 2);
      var y2 = (toRect.top - canvasRect.top) + (toRect.height / 2);
      var className = connection[2] === "secondary" ? "secondary" : "";

      createLine(x1, y1, x2, y2, className);
    }
  }

  function scheduleLineDraw() {
    window.requestAnimationFrame(drawConnectionLines);
  }

  function buildMindMap() {
    mindMapNodes.innerHTML = "";
    nodeElements = {};

    for (var i = 0; i < NODE_ORDER.length; i += 1) {
      var id = NODE_ORDER[i];
      var node = createNode(id);
      nodeElements[id] = node;
      mindMapNodes.appendChild(node);
    }

    applyNodeLayout();
    setActiveNode("core");
    scheduleLineDraw();
  }

  function bindMindMapEvents() {
    var launcher = document.getElementById("systems-map-launcher");

    if (launcher) {
      launcher.addEventListener("click", function () {
        window.setTimeout(scheduleLineDraw, 320);
      });
    }

    window.addEventListener("resize", function () {
      applyNodeLayout();
      scheduleLineDraw();
    });

    if (window.ResizeObserver) {
      resizeObserver = new window.ResizeObserver(function () {
        scheduleLineDraw();
      });
      resizeObserver.observe(mindMapCanvas);
      resizeObserver.observe(mindMapWindow);
    }

    windowMutationObserver = new MutationObserver(function () {
      if (mindMapWindow.classList.contains("open")) {
        window.setTimeout(scheduleLineDraw, 30);
      }
    });

    windowMutationObserver.observe(mindMapWindow, {
      attributes: true,
      attributeFilter: ["class", "style"]
    });
  }

  buildMindMap();
  bindMindMapEvents();
})();
