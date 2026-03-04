(function () {
  var proofOfWorkWindow = document.getElementById("proof-of-work-window");
  var proofWorkList = proofOfWorkWindow ? proofOfWorkWindow.querySelector(".proof-work-list") : null;
  var mindMapWindow = document.getElementById("systems-map-window");
  var mindMapCanvas = document.getElementById("mind-map-canvas");
  var mindMapNodes = document.getElementById("mind-map-nodes");
  var mindMapLines = document.getElementById("mind-map-lines");
  var detailTitle = document.getElementById("mind-map-detail-title");
  var detailSubtitle = document.getElementById("mind-map-detail-subtitle");
  var detailDescription = document.getElementById("mind-map-detail-description");
  var detailPhilosophy = document.getElementById("mind-map-detail-philosophy");
  var hireChadOutput = document.getElementById("hire-chad-output");
  var hireChadScheduleObserver = null;

  var PROOF_WORK_DIAGRAMS = [
    {
      title: "Discovery to CMDB Pipeline",
      ascii: [
        "Infrastructure Environment",
        "        |",
        "        v",
        "Discovery Scan",
        "        |",
        "        v",
        "Credential Strategy",
        "        |",
        "        v",
        "Discovery Patterns",
        "        |",
        "        v",
        "CI Classification",
        "        |",
        "        v",
        "CMDB Population"
      ].join("\n"),
      description: "Improved discovery reliability and CI identification accuracy across enterprise estates, producing consistent CMDB population.",
      focus: [
        "Discovery coverage strategy",
        "Credential governance and pattern stability",
        "CI classification integrity"
      ]
    },
    {
      title: "CMDB Data Quality Model",
      ascii: [
        "Infrastructure Data",
        "        |",
        "        v",
        "CI Classification",
        "        |",
        "        v",
        "Normalization Rules",
        "        |",
        "        v",
        "Reconciliation Engine",
        "        |",
        "        v",
        "Trusted CMDB"
      ].join("\n"),
      description: "Raised CMDB trust for operations and leadership through reconciliation governance, normalization controls, and ownership standards.",
      focus: [
        "CI lifecycle ownership",
        "Reconciliation strategy",
        "Normalized infrastructure data"
      ]
    },
    {
      title: "Service Visibility Model",
      ascii: [
        "Infrastructure",
        "        |",
        "        v",
        "Configuration Items",
        "        |",
        "        v",
        "CI Relationships",
        "        |",
        "        v",
        "Business Services",
        "        |",
        "        v",
        "Operational Visibility"
      ].join("\n"),
      description: "Improved incident impact analysis and change confidence by strengthening CI relationships and service topology context.",
      focus: [
        "CI relationship modeling",
        "Service topology context",
        "Operational impact analysis"
      ]
    },
    {
      title: "Question",
      question: "How does CSDM connect products, services, and infrastructure?",
      ascii: [
        "Product / Product Offering",
        "        |",
        "        v",
        "Business Service",
        "        |",
        "        v",
        "Technical Service",
        "        |",
        "        v",
        "Application Service",
        "        |",
        "        v",
        "Application",
        "        |",
        "        v",
        "Infrastructure (Servers, Databases, Networks)"
      ].join("\n"),
      description: "The Common Service Data Model (CSDM) provides a structured way to connect products and services to the underlying applications and infrastructure that support them.",
      focusLabel: "This model enables:",
      focus: [
        "clear service ownership",
        "product-aligned service management",
        "reliable incident impact analysis",
        "consistent service mapping"
      ],
      practiceTitle: "CSDM Implementation Approach",
      practiceDescription: "When implementing CSDM, I focus on aligning the service model to how the organization delivers products and operates services.",
      practiceLabel: "This includes:",
      practiceItems: [
        "defining product and service boundaries",
        "aligning CI classes to the CSDM layers",
        "mapping infrastructure to applications",
        "connecting services to business capabilities"
      ]
    }
  ];

  function buildProofOfWorkArchitectureSection() {
    var section = null;
    var heading = null;
    var intro = null;
    var diagramList = null;

    if (!proofWorkList || proofWorkList.querySelector(".proof-work-diagram-section")) {
      return;
    }

    section = document.createElement("section");
    section.className = "proof-work-diagram-section";

    heading = document.createElement("h3");
    heading.className = "proof-work-diagram-heading";
    heading.textContent = "Enterprise Architecture Examples";

    intro = document.createElement("p");
    intro.className = "proof-work-diagram-intro";
    intro.textContent = "Outcome-focused ServiceNow Discovery and CMDB architecture used to improve enterprise infrastructure visibility.";

    diagramList = document.createElement("div");
    diagramList.className = "proof-work-diagram-list";

    for (var i = 0; i < PROOF_WORK_DIAGRAMS.length; i += 1) {
      var diagram = PROOF_WORK_DIAGRAMS[i];
      var block = document.createElement("article");
      var title = document.createElement("h4");
      var ascii = document.createElement("pre");
      var description = null;
      var focusLabel = null;
      var focusList = null;
      var question = null;
      var practiceTitle = null;
      var practiceDescription = null;
      var practiceLabel = null;
      var practiceList = null;

      block.className = "diagram-block";
      title.className = "diagram-title";
      title.textContent = diagram.title;

      ascii.className = "diagram-ascii";
      ascii.textContent = diagram.ascii;

      block.appendChild(title);

      if (diagram.question) {
        question = document.createElement("p");
        question.className = "diagram-focus-label";
        question.textContent = diagram.question;
        block.appendChild(question);
      }

      block.appendChild(ascii);

      if (diagram.description) {
        description = document.createElement("p");
        description.className = "diagram-description";
        description.textContent = diagram.description;
        block.appendChild(description);
      }

      if (Array.isArray(diagram.focus) && diagram.focus.length) {
        focusLabel = document.createElement("p");
        focusLabel.className = "diagram-focus-label";
        focusLabel.textContent = diagram.focusLabel || "Architectural Focus:";

        focusList = document.createElement("ul");
        focusList.className = "diagram-focus-list";

        for (var j = 0; j < diagram.focus.length; j += 1) {
          var focusItem = document.createElement("li");
          focusItem.textContent = diagram.focus[j];
          focusList.appendChild(focusItem);
        }

        block.appendChild(focusLabel);
        block.appendChild(focusList);
      }

      if (diagram.practiceTitle) {
        practiceTitle = document.createElement("p");
        practiceTitle.className = "diagram-focus-label";
        practiceTitle.textContent = diagram.practiceTitle;
        block.appendChild(practiceTitle);
      }

      if (diagram.practiceDescription) {
        practiceDescription = document.createElement("p");
        practiceDescription.className = "diagram-description";
        practiceDescription.textContent = diagram.practiceDescription;
        block.appendChild(practiceDescription);
      }

      if (Array.isArray(diagram.practiceItems) && diagram.practiceItems.length) {
        practiceLabel = document.createElement("p");
        practiceLabel.className = "diagram-focus-label";
        practiceLabel.textContent = diagram.practiceLabel || "This includes:";

        practiceList = document.createElement("ul");
        practiceList.className = "diagram-focus-list";

        for (var k = 0; k < diagram.practiceItems.length; k += 1) {
          var practiceItem = document.createElement("li");
          practiceItem.textContent = diagram.practiceItems[k];
          practiceList.appendChild(practiceItem);
        }

        block.appendChild(practiceLabel);
        block.appendChild(practiceList);
      }

      diagramList.appendChild(block);
    }

    section.appendChild(heading);
    section.appendChild(intro);
    section.appendChild(diagramList);
    proofWorkList.insertBefore(section, proofWorkList.firstChild);
  }

  function ensureHireChadScheduleSection() {
    var section = null;
    var title = null;
    var description = null;
    var button = null;
    var divider = null;

    if (!hireChadOutput || hireChadOutput.querySelector(".hire-schedule-section")) {
      return;
    }

    divider = document.createElement("hr");
    divider.className = "hire-decision-divider";

    section = document.createElement("section");
    section.className = "hire-decision-section hire-schedule-section";

    title = document.createElement("h3");
    title.textContent = "Schedule a Call";

    description = document.createElement("p");
    description.textContent = "If you'd like to discuss ServiceNow CMDB architecture, Discovery strategy, or enterprise service modeling, I would be happy to connect.";

    button = document.createElement("a");
    button.className = "cta-button";
    button.href = "mailto:chad@chadmccormack.me?subject=ServiceNow%20Opportunity";
    button.textContent = "Schedule a Call";
    button.setAttribute("aria-label", "Schedule a call with Chad");
    button.setAttribute("title", "Schedule a Call");

    section.appendChild(title);
    section.appendChild(description);
    section.appendChild(button);

    hireChadOutput.appendChild(divider);
    hireChadOutput.appendChild(section);
  }

  function bindHireChadScheduleSection() {
    var hireLauncher = null;

    if (!hireChadOutput) {
      return;
    }

    ensureHireChadScheduleSection();

    hireLauncher = document.getElementById("hire-chad-launcher");
    if (hireLauncher) {
      hireLauncher.addEventListener("click", function () {
        window.setTimeout(ensureHireChadScheduleSection, 0);
      });
    }

    if (!window.MutationObserver) {
      return;
    }

    hireChadScheduleObserver = new MutationObserver(function () {
      ensureHireChadScheduleSection();
    });

    hireChadScheduleObserver.observe(hireChadOutput, {
      childList: true
    });
  }

  buildProofOfWorkArchitectureSection();
  bindHireChadScheduleSection();

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

  var ARCHITECTURE_NODES = [
    {
      id: "discovery",
      title: "Discovery",
      purpose: "Reliable enterprise discovery and accurate CI identification.",
      focus: [
        "MID Server topology",
        "Credential governance",
        "Pattern stability",
        "Discovery coverage strategy"
      ],
      explanation: "Reliable Discovery improves downstream CMDB quality through stable MID Server design, credential controls, and pattern standards.",
      position: [48, 11]
    },
    {
      id: "infrastructure-data",
      title: "Infrastructure Data",
      purpose: "Trusted infrastructure inventory for operations.",
      focus: [
        "CI classification standards",
        "Server, network, and application relationships",
        "Normalized infrastructure data"
      ],
      explanation: "Trusted inventory improves incident and change decisions by maintaining clean CI classes, relationship integrity, and normalization standards.",
      position: [48, 30]
    },
    {
      id: "cmdb-governance",
      title: "CMDB Governance",
      purpose: "Sustainable configuration data trust.",
      focus: [
        "CI lifecycle ownership",
        "Reconciliation strategy",
        "Normalization rules",
        "Data quality controls"
      ],
      explanation: "Governance sustains CMDB credibility by defining ownership, reconciliation policy, and measurable data quality controls.",
      position: [48, 50]
    },
    {
      id: "service-mapping",
      title: "Service Mapping",
      purpose: "Service context for incident and change decisions.",
      focus: [
        "Application dependency mapping",
        "Service topology",
        "Operational context"
      ],
      explanation: "Service Mapping translates infrastructure relationships into business context that operations teams can act on quickly.",
      position: [48, 70]
    },
    {
      id: "operational-visibility",
      title: "Operational Visibility",
      purpose: "Faster, lower-risk operational response.",
      focus: [
        "Incident impact understanding",
        "Faster troubleshooting",
        "Accurate infrastructure context"
      ],
      explanation: "Operational visibility reduces response risk by giving teams clear impact context and faster paths to resolution.",
      position: [48, 89]
    }
  ];

  var NODE_BY_ID = {};
  var NODE_ORDER = [];
  var CONNECTIONS = [];

  for (var n = 0; n < ARCHITECTURE_NODES.length; n += 1) {
    var currentNode = ARCHITECTURE_NODES[n];
    NODE_BY_ID[currentNode.id] = currentNode;
    NODE_ORDER.push(currentNode.id);

    if (n < ARCHITECTURE_NODES.length - 1) {
      CONNECTIONS.push([currentNode.id, ARCHITECTURE_NODES[n + 1].id]);
    }
  }

  var nodeElements = {};
  var resizeObserver = null;
  var windowMutationObserver = null;

  function isMobileStack() {
    return window.matchMedia("(max-width: 640px)").matches;
  }

  function setDetailPanel(nodeId) {
    var data = NODE_BY_ID[nodeId];

    if (!data) {
      return;
    }

    detailTitle.textContent = data.title;
    detailSubtitle.textContent = "Purpose: " + data.purpose;
    detailDescription.textContent = data.explanation;
    detailPhilosophy.textContent = "Architectural Focus: " + data.focus.join(" | ");
  }

  function setActiveNode(nodeId) {
    var keys = Object.keys(nodeElements);
    for (var i = 0; i < keys.length; i += 1) {
      nodeElements[keys[i]].classList.toggle("is-active", keys[i] === nodeId);
    }

    setDetailPanel(nodeId);
  }

  function createNode(nodeId) {
    var data = NODE_BY_ID[nodeId];
    var node = document.createElement("button");
    var title = document.createElement("span");
    var purpose = document.createElement("p");
    var focus = document.createElement("p");

    node.type = "button";
    node.className = "mind-node architecture-node";
    node.setAttribute("data-node-id", nodeId);
    node.setAttribute("aria-label", data.title);

    title.className = "mind-node-title";
    title.textContent = data.title;
    purpose.className = "mind-node-purpose";
    purpose.textContent = "Purpose: " + data.purpose;
    focus.className = "mind-node-subtitle";
    focus.textContent = "Focus: " + data.focus.join(" | ");

    node.appendChild(title);
    node.appendChild(purpose);
    node.appendChild(focus);
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
      var position = NODE_BY_ID[id].position;

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

  function createLine(x1, y1, x2, y2) {
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", x1.toFixed(1));
    line.setAttribute("y1", y1.toFixed(1));
    line.setAttribute("x2", x2.toFixed(1));
    line.setAttribute("y2", y2.toFixed(1));

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
      createLine(x1, y1, x2, y2);
    }
  }

  function scheduleLineDraw() {
    window.requestAnimationFrame(drawConnectionLines);
  }

  function buildMindMap() {
    mindMapNodes.innerHTML = "";
    mindMapCanvas.classList.add("architecture-diagram");
    mindMapLines.classList.add("connection-lines");
    nodeElements = {};

    for (var i = 0; i < NODE_ORDER.length; i += 1) {
      var id = NODE_ORDER[i];
      var node = createNode(id);
      nodeElements[id] = node;
      mindMapNodes.appendChild(node);
    }

    applyNodeLayout();
    setActiveNode(NODE_ORDER[0]);
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
