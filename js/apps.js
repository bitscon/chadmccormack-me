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

  var PROOF_WORK_DIAGRAMS = [
    {
      title: "Discovery Reliability Pipeline",
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
      description: "Designed discovery flow patterns that improve infrastructure identification accuracy and produce consistent CMDB population at enterprise scale.",
      focus: [
        "Discovery coverage strategy",
        "Credential and pattern stability",
        "CI classification integrity"
      ]
    },
    {
      title: "CMDB Data Governance Model",
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
      description: "Designed governance patterns to improve configuration data accuracy, support operational decision making, and increase trust in CMDB reporting.",
      focus: [
        "CI lifecycle ownership",
        "Reconciliation strategy",
        "Normalized infrastructure data"
      ]
    },
    {
      title: "Service Visibility Architecture",
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
      description: "Enabled service visibility by strengthening CI relationships and topology context, allowing operations teams to troubleshoot faster and assess impact with confidence.",
      focus: [
        "CI relationship modeling",
        "Service topology context",
        "Operational impact analysis"
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
    intro.textContent = "Examples of how I structure ServiceNow Discovery and CMDB to create reliable infrastructure visibility for operations teams.";

    diagramList = document.createElement("div");
    diagramList.className = "proof-work-diagram-list";

    for (var i = 0; i < PROOF_WORK_DIAGRAMS.length; i += 1) {
      var diagram = PROOF_WORK_DIAGRAMS[i];
      var block = document.createElement("article");
      var title = document.createElement("h4");
      var ascii = document.createElement("pre");
      var description = document.createElement("p");
      var focusLabel = document.createElement("p");
      var focusList = document.createElement("ul");

      block.className = "diagram-block";
      title.className = "diagram-title";
      title.textContent = diagram.title;

      ascii.className = "diagram-ascii";
      ascii.textContent = diagram.ascii;

      description.className = "diagram-description";
      description.textContent = diagram.description;

      focusLabel.className = "diagram-focus-label";
      focusLabel.textContent = "Architectural Focus:";

      for (var j = 0; j < diagram.focus.length; j += 1) {
        var focusItem = document.createElement("li");
        focusItem.textContent = diagram.focus[j];
        focusList.appendChild(focusItem);
      }

      focusList.className = "diagram-focus-list";

      block.appendChild(title);
      block.appendChild(ascii);
      block.appendChild(description);
      block.appendChild(focusLabel);
      block.appendChild(focusList);
      diagramList.appendChild(block);
    }

    section.appendChild(heading);
    section.appendChild(intro);
    section.appendChild(diagramList);
    proofWorkList.insertBefore(section, proofWorkList.firstChild);
  }

  buildProofOfWorkArchitectureSection();

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
      purpose: "Accurate infrastructure discovery using ServiceNow Discovery.",
      focus: [
        "MID Server architecture",
        "credential strategy",
        "pattern stability",
        "discovery coverage"
      ],
      explanation: "Discovery quality starts with stable MID Server topology, predictable credentials, and disciplined pattern management.",
      position: [48, 11]
    },
    {
      id: "infrastructure-data",
      title: "Infrastructure Data",
      purpose: "Reliable infrastructure inventory.",
      focus: [
        "CI classification",
        "server, network, and application relationships",
        "normalized infrastructure data"
      ],
      explanation: "Reliable infrastructure data requires clean CI classes, relationship integrity, and consistent normalization standards.",
      position: [48, 30]
    },
    {
      id: "cmdb-governance",
      title: "CMDB Governance",
      purpose: "Trustworthy configuration data.",
      focus: [
        "CI lifecycle ownership",
        "reconciliation strategy",
        "normalization rules",
        "data quality controls"
      ],
      explanation: "Governance keeps CMDB data credible by defining ownership, reconciliation rules, and measurable data quality controls.",
      position: [48, 50]
    },
    {
      id: "service-mapping",
      title: "Service Mapping",
      purpose: "Connecting infrastructure to business services.",
      focus: [
        "application dependency mapping",
        "service topology",
        "operational context"
      ],
      explanation: "Service Mapping translates infrastructure relationships into business service topology that operations teams can act on.",
      position: [48, 70]
    },
    {
      id: "operational-visibility",
      title: "Operational Visibility",
      purpose: "Empowering operations teams.",
      focus: [
        "incident impact understanding",
        "faster troubleshooting",
        "accurate infrastructure context"
      ],
      explanation: "Operational visibility closes the loop by helping responders understand impact, context, and the fastest path to resolution.",
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
