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
  var pipVideo = document.getElementById("pip-video");
  var meetChadButton = document.getElementById("meet-chad");
  var bootScreen = document.getElementById("boot-screen");
  var bootText = document.getElementById("boot-text");
  var desktop = document.getElementById("desktop");
  var recruiterActivityMessage = document.getElementById("recruiter-activity-message");
  var engineerHint = document.getElementById("engineer-hint") || document.querySelector(".engineer-hint");
  var onboardingOverlay = document.getElementById("onboarding-overlay");
  var onboardingCard = onboardingOverlay ? onboardingOverlay.querySelector(".onboarding-card") : null;
  var onboardingStartButton = document.getElementById("onboarding-start");
  var hireChadScheduleObserver = null;
  var welcomeHintObserver = null;
  var welcomeHintTimer = null;
  var terminalHintRotateTimer = null;
  var terminalHintIndex = 0;
  var workstationBootTimer = null;
  var workstationBootFailsafeTimer = null;
  var workstationBootRan = false;
  var welcomeHintHasRun = false;
  var WELCOME_HINT_INITIAL_DELAY_MS = 1500;
  var WELCOME_HINT_LINE_DELAY_MS = 600;
  var WORKSTATION_BOOT_STEP_MS = 320;
  var WORKSTATION_BOOT_FAILSAFE_MS = 1450;
  var TERMINAL_HINT_ROTATE_MS = 6000;
  var WORKSTATION_BOOT_MESSAGES = [
    "Initializing workstation...",
    "Loading engineering workspace...",
    "Mounting CMDB architecture modules...",
    "System ready."
  ];
  var TERMINAL_HINTS = [
    "Try typing: demo",
    "Try typing: architecture",
    "Try typing: proof",
    "Try typing: resume",
    "Try typing: hire-chad"
  ];

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

  function ensureWelcomeHintContainer() {
    var hint = null;

    if (!onboardingCard) {
      return null;
    }

    hint = document.getElementById("welcome-hint");
    if (hint) {
      return hint;
    }

    hint = document.createElement("div");
    hint.id = "welcome-hint";
    hint.setAttribute("aria-live", "polite");
    hint.setAttribute("aria-atomic", "true");

    if (
      onboardingStartButton &&
      onboardingStartButton.parentNode &&
      onboardingStartButton.parentNode === onboardingCard
    ) {
      onboardingCard.insertBefore(hint, onboardingStartButton);
      return hint;
    }

    onboardingCard.appendChild(hint);
    return hint;
  }

  function runWelcomeHint() {
    var lines = [
      { text: "Try these commands:" },
      { text: "" },
      { text: "resume", cmd: "resume" },
      { text: "proof", cmd: "proof" },
      { text: "hire-chad", cmd: "hire-chad" }
    ];
    var hint = ensureWelcomeHintContainer();
    var lineIndex = 0;

    if (!hint || welcomeHintHasRun) {
      return;
    }

    welcomeHintHasRun = true;
    hint.innerHTML = "";

    function typeLine() {
      var entry = null;
      var line = null;

      if (lineIndex >= lines.length) {
        return;
      }

      entry = lines[lineIndex];

      if (entry.cmd) {
        line = document.createElement("button");
        line.type = "button";
        line.className = "welcome-command";
        line.textContent = entry.text;
        line.addEventListener("click", function (event) {
          var command = event.currentTarget ? event.currentTarget.getAttribute("data-command") : "";

          if (!command || typeof window.runTerminalCommand !== "function") {
            return;
          }

          window.runTerminalCommand(command);
        });
        line.setAttribute("data-command", entry.cmd);
      } else {
        line = document.createElement("div");
        line.textContent = entry.text;
      }

      hint.appendChild(line);
      lineIndex += 1;

      window.setTimeout(typeLine, WELCOME_HINT_LINE_DELAY_MS);
    }

    welcomeHintTimer = window.setTimeout(function () {
      welcomeHintTimer = null;
      typeLine();
    }, WELCOME_HINT_INITIAL_DELAY_MS);
  }

  function bindWelcomeHint() {
    if (!onboardingOverlay || !window.MutationObserver) {
      return;
    }

    ensureWelcomeHintContainer();

    welcomeHintObserver = new MutationObserver(function () {
      if (!onboardingOverlay.classList.contains("visible")) {
        return;
      }

      runWelcomeHint();
    });

    welcomeHintObserver.observe(onboardingOverlay, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  function revealDesktopFromWorkstationBoot() {
    if (!bootScreen || bootScreen.classList.contains("is-fading")) {
      return;
    }

    bootScreen.classList.add("is-fading");

    if (desktop) {
      desktop.classList.add("active");
      desktop.setAttribute("aria-hidden", "false");
    }
  }

  function runWorkstationBootSequence() {
    var messageIndex = 0;

    if (
      workstationBootRan ||
      !bootScreen ||
      !bootText ||
      !WORKSTATION_BOOT_MESSAGES.length
    ) {
      return;
    }

    workstationBootRan = true;
    bootScreen.classList.add("boot-custom");
    bootText.textContent = "";

    function printNextBootMessage() {
      if (messageIndex >= WORKSTATION_BOOT_MESSAGES.length) {
        revealDesktopFromWorkstationBoot();
        return;
      }

      if (bootText.textContent) {
        bootText.textContent += "\n";
      }

      bootText.textContent += WORKSTATION_BOOT_MESSAGES[messageIndex];
      messageIndex += 1;

      workstationBootTimer = window.setTimeout(printNextBootMessage, WORKSTATION_BOOT_STEP_MS);
    }

    printNextBootMessage();

    workstationBootFailsafeTimer = window.setTimeout(function () {
      revealDesktopFromWorkstationBoot();
    }, WORKSTATION_BOOT_FAILSAFE_MS);
  }

  function setEngineerHintText(textValue) {
    if (!engineerHint) {
      return;
    }

    engineerHint.textContent = "Engineer Tip - " + textValue;
    engineerHint.style.whiteSpace = "normal";
    engineerHint.style.overflowWrap = "anywhere";
  }

  function bindRotatingTerminalHints() {
    if (!engineerHint || terminalHintRotateTimer || !TERMINAL_HINTS.length) {
      return;
    }

    terminalHintIndex = Math.floor(Math.random() * TERMINAL_HINTS.length);
    setEngineerHintText(TERMINAL_HINTS[terminalHintIndex]);

    terminalHintRotateTimer = window.setInterval(function () {
      terminalHintIndex = (terminalHintIndex + 1) % TERMINAL_HINTS.length;
      setEngineerHintText(TERMINAL_HINTS[terminalHintIndex]);
    }, TERMINAL_HINT_ROTATE_MS);
  }

  function ensureGlobalTerminalRunner() {
    window.runTerminalCommand = function (commandText) {
      var terminalWindow = document.getElementById("terminal-window");
      var terminalLauncher = document.getElementById("terminal-launcher");
      var commandForm = null;
      var commandInput = null;
      var normalizedCommand = typeof commandText === "string" ? commandText.trim() : "";

      if (!normalizedCommand) {
        return;
      }

      if (
        terminalWindow &&
        terminalLauncher &&
        !terminalWindow.classList.contains("open")
      ) {
        terminalLauncher.click();
      }

      commandForm = document.getElementById("command-form");
      commandInput = document.getElementById("command-input");

      if (!commandForm || !commandInput) {
        return;
      }

      commandInput.focus();
      commandInput.value = normalizedCommand;
      commandForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    };
  }

  function normalizeTerminalTitles() {
    var commands = window.TerminalCommands;
    var titleLineOne = "Information Systems Engineer";
    var titleLineTwo = "ServiceNow CMDB • Discovery • CSDM";

    if (!commands || typeof commands !== "object") {
      return;
    }

    if (commands.banner) {
      commands.banner.run = function () {
        return {
          type: "text",
          payload: "CHAD MCCORMACK\n" + titleLineOne + "\n" + titleLineTwo
        };
      };
    }

    if (commands.whoami) {
      commands.whoami.run = function () {
        return {
          type: "text",
          payload:
            "Chad McCormack\n" +
            titleLineOne + "\n" +
            titleLineTwo + "\n\n" +
            "\"I do what I cannot, to learn what I cannot do!\""
        };
      };
    }

    if (commands.resume) {
      commands.resume.run = function () {
        return {
          type: "text",
          payload:
            "Chad McCormack\n" +
            titleLineOne + "\n" +
            titleLineTwo + "\n\n" +
            "Summary\n" +
            "- Improved enterprise infrastructure visibility for operations teams\n" +
            "- Strengthened CMDB governance, reconciliation, and data quality controls\n" +
            "- Increased Discovery reliability across complex environments\n\n" +
            "Navigation\n\n" +
            "career      open Career Log\n" +
            "mindmap     open Mind Map\n" +
            "proof       open Proof of Work\n" +
            "automation  open Automation Lab\n" +
            "contact     view Contact"
        };
      };
    }
  }

  function normalizeRecruiterActivityText(value) {
    var legacyBrand = "Chad" + "OS";

    if (typeof value !== "string") {
      return value;
    }

    return value.split(legacyBrand).join("Chad McCormack");
  }

  function bindRecruiterActivityTextNormalizer() {
    var observer = null;
    var applyNormalizedText = null;

    if (!recruiterActivityMessage) {
      return;
    }

    applyNormalizedText = function () {
      var currentText = recruiterActivityMessage.textContent;
      var normalizedText = normalizeRecruiterActivityText(currentText);

      if (normalizedText !== currentText) {
        recruiterActivityMessage.textContent = normalizedText;
      }
    };

    applyNormalizedText();

    if (!window.MutationObserver) {
      return;
    }

    observer = new MutationObserver(function () {
      applyNormalizedText();
    });

    observer.observe(recruiterActivityMessage, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  function bindMeetChadButton() {
    var openIntroVideo = null;

    if (!pipVideo) {
      return;
    }

    openIntroVideo = function () {
      var sourceUrl = pipVideo.getAttribute("data-video-src") || "/assets/intro.mp4";
      window.open(sourceUrl, "_blank", "noopener,noreferrer");
    };

    pipVideo.addEventListener("click", function (event) {
      if (event.target && event.target.id === "meet-chad") {
        return;
      }

      openIntroVideo();
    });

    if (meetChadButton) {
      meetChadButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        openIntroVideo();
      });
    }
  }

  function buildProofOfWorkArchitectureSection() {
    var section = null;
    var heading = null;
    var intro = null;
    var diagramList = null;
    var hasNormalizedArchitectureConsole = false;

    hasNormalizedArchitectureConsole = Boolean(
      document.getElementById("impact-summary") ||
      document.getElementById("architecture-diagram") ||
      document.getElementById("architecture-case") ||
      document.getElementById("engineering-principles")
    );

    if (
      !proofWorkList ||
      hasNormalizedArchitectureConsole ||
      proofWorkList.querySelector(".proof-work-diagram-section")
    ) {
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

  function createHireDecisionDivider() {
    var divider = document.createElement("hr");
    divider.className = "hire-decision-divider";
    return divider;
  }

  function ensureHireChadScheduleSection() {
    var section = null;
    var title = null;
    var description = null;

    if (!hireChadOutput || hireChadOutput.querySelector(".hire-schedule-section")) {
      return;
    }

    section = document.createElement("section");
    section.className = "hire-decision-section hire-schedule-section";

    title = document.createElement("h3");
    title.textContent = "NEXT STEP";

    description = document.createElement("p");
    description.textContent = "If you are looking for a ServiceNow CMDB / Discovery specialist who can design and implement reliable infrastructure visibility, let's schedule a conversation.";

    section.appendChild(title);
    section.appendChild(description);

    hireChadOutput.appendChild(createHireDecisionDivider());
    hireChadOutput.appendChild(section);
  }

  function ensureHireChadQuickLinksSection() {
    var section = null;
    var title = null;
    var actions = null;
    var linkedInButton = null;
    var resumeButton = null;
    var scheduleButton = null;
    var scheduleSection = null;
    var dividerBeforeSchedule = null;

    if (!hireChadOutput || hireChadOutput.querySelector(".hire-quick-links-section")) {
      return;
    }

    section = document.createElement("section");
    section.className = "hire-decision-section hire-quick-links-section";

    title = document.createElement("h3");
    title.textContent = "Quick Links";

    actions = document.createElement("div");
    actions.className = "hire-quick-links-actions";

    linkedInButton = document.createElement("a");
    linkedInButton.className = "cta-button";
    linkedInButton.href = "https://linkedin.com/in/chadmccormack";
    linkedInButton.target = "_blank";
    linkedInButton.rel = "noopener noreferrer";
    linkedInButton.textContent = "View LinkedIn";
    linkedInButton.setAttribute("aria-label", "View Chad on LinkedIn");
    linkedInButton.setAttribute("title", "View LinkedIn");

    resumeButton = document.createElement("a");
    resumeButton.className = "cta-button";
    resumeButton.href = "/assets/chad-mccormack-resume.pdf";
    resumeButton.target = "_blank";
    resumeButton.rel = "noopener noreferrer";
    resumeButton.textContent = "Download Resume";
    resumeButton.setAttribute("aria-label", "Download Chad resume");
    resumeButton.setAttribute("title", "Download Resume");

    scheduleButton = document.createElement("a");
    scheduleButton.className = "cta-button";
    scheduleButton.href = "mailto:chad@chadmccormack.me?subject=ServiceNow%20Opportunity";
    scheduleButton.textContent = "Schedule a Call";
    scheduleButton.setAttribute("aria-label", "Schedule a call with Chad");
    scheduleButton.setAttribute("title", "Schedule a Call");

    actions.appendChild(linkedInButton);
    actions.appendChild(resumeButton);
    actions.appendChild(scheduleButton);
    section.appendChild(title);
    section.appendChild(actions);

    scheduleSection = hireChadOutput.querySelector(".hire-schedule-section");

    if (!scheduleSection) {
      hireChadOutput.appendChild(createHireDecisionDivider());
      hireChadOutput.appendChild(section);
      return;
    }

    dividerBeforeSchedule = scheduleSection.previousElementSibling;

    if (dividerBeforeSchedule && dividerBeforeSchedule.classList.contains("hire-decision-divider")) {
      hireChadOutput.insertBefore(createHireDecisionDivider(), dividerBeforeSchedule);
      hireChadOutput.insertBefore(section, dividerBeforeSchedule);
      return;
    }

    hireChadOutput.insertBefore(createHireDecisionDivider(), scheduleSection);
    hireChadOutput.insertBefore(section, scheduleSection);
    hireChadOutput.insertBefore(createHireDecisionDivider(), scheduleSection);
  }

  function bindHireChadScheduleSection() {
    var hireLauncher = null;

    if (!hireChadOutput) {
      return;
    }

    ensureHireChadScheduleSection();
    ensureHireChadQuickLinksSection();

    hireLauncher = document.getElementById("hire-chad-launcher");
    if (hireLauncher) {
      hireLauncher.addEventListener("click", function () {
        window.setTimeout(function () {
          ensureHireChadScheduleSection();
          ensureHireChadQuickLinksSection();
        }, 0);
      });
    }

    if (!window.MutationObserver) {
      return;
    }

    hireChadScheduleObserver = new MutationObserver(function () {
      ensureHireChadScheduleSection();
      ensureHireChadQuickLinksSection();
    });

    hireChadScheduleObserver.observe(hireChadOutput, {
      childList: true
    });
  }

  buildProofOfWorkArchitectureSection();
  runWorkstationBootSequence();
  bindHireChadScheduleSection();
  bindRotatingTerminalHints();
  bindWelcomeHint();
  ensureGlobalTerminalRunner();
  normalizeTerminalTitles();
  bindRecruiterActivityTextNormalizer();
  bindMeetChadButton();

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
