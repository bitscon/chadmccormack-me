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
  var systemsMapContent = document.getElementById("systems-map-content");
  var careerLogWindow = document.getElementById("career-log-window");
  var careerLogContent = document.getElementById("career-log-content");
  var proofOfWorkContent = document.getElementById("proof-of-work-content") || proofWorkList;
  var hireChadWindow = document.getElementById("hire-chad-window");
  var interviewPrepWindow = document.getElementById("interview-prep-window");
  var interviewPrepContent = document.getElementById("interview-prep-content");
  var hireChadOutput = document.getElementById("hire-chad-output");
  var hireChadLauncher = document.getElementById("hire-chad-launcher");
  var systemsMapLauncher = document.getElementById("systems-map-launcher");
  var careerLogLauncher = document.getElementById("career-log-launcher");
  var proofOfWorkLauncher = document.getElementById("proof-of-work-launcher");
  var interviewPrepLauncher = document.getElementById("interview-prep-launcher");
  var pipVideo = document.getElementById("pip-video");
  var meetChadButton = document.getElementById("meet-chad");
  var recruiterActivityPanel = document.getElementById("recruiter-activity");
  var recruiterActivityTitle = recruiterActivityPanel
    ? recruiterActivityPanel.querySelector(".recruiter-activity-title")
    : null;
  var recruiterActivityMessage = document.getElementById("recruiter-activity-message");
  var engineerHint = document.getElementById("engineer-hint") || document.querySelector(".engineer-hint");
  var onboardingOverlay = document.getElementById("onboarding-overlay");
  var onboardingCard = onboardingOverlay ? onboardingOverlay.querySelector(".onboarding-card") : null;
  var onboardingStartButton = document.getElementById("onboarding-start");
  var welcomeHintObserver = null;
  var welcomeHintTimer = null;
  var terminalHintRotateTimer = null;
  var terminalHintIndex = 0;
  var welcomeHintHasRun = false;
  var WELCOME_HINT_INITIAL_DELAY_MS = 1500;
  var WELCOME_HINT_LINE_DELAY_MS = 600;
  var TERMINAL_HINT_ROTATE_MS = 6000;
  var TERMINAL_HINTS = [
    "Try typing: demo",
    "Try typing: architecture",
    "Try typing: proof",
    "Try typing: resume",
    "Try typing: hire-chad"
  ];
  var MARKDOWN_BASE_PATH = "assets/data/role/servicenow/";
  var MARKDOWN_FILE_BY_KEY = {
    proofOfWork: "architecture-projects.md",
    architecture: "cmdb-discovery-expertise.md",
    hireChad: "resume.md",
    demo: "enterprise-impact.md",
    interviewPrep: "interview-topics.md",
    career: "career-timeline.md"
  };
  var markdownHtmlCache = {};
  var markdownLoadCache = {};
  var RECRUITER_ACTIVITY_TITLE_TEXT = "Recruiter Activity";
  var RECRUITER_ACTIVITY_STABLE_TEXT = "• A recruiter opened Hire Chad";
  var RECRUITER_CTA_TITLE_TEXT = "Interested in working together?";
  var RECRUITER_CTA_DETAILS_HTML =
    "Open <strong>Hire Chad</strong> to view resume, LinkedIn, and contact options.";
  var RECRUITER_CTA_ACTION_TEXT = "Open Hire Chad";

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
      { text: "demo", cmd: "demo" },
      { text: "architecture", cmd: "architecture" },
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

  function escapeMarkdownHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  async function loadMarkdown(path) {
    var candidates = [path];
    var response = null;
    var i = 0;
    var candidate = "";
    var lastError = null;

    if (path.charAt(0) === "/") {
      candidates.push(path.slice(1));
    } else {
      candidates.push("/" + path);
    }

    for (i = 0; i < candidates.length; i += 1) {
      candidate = candidates[i];

      try {
        response = await fetch(candidate);

        if (response.ok) {
          return response.text();
        }

        lastError = new Error("Unable to load markdown: " + candidate + " (" + response.status + ")");
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Unable to load markdown: " + path);
  }

  function renderMarkdown(md) {
    var lines = String(md || "").replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var inList = false;

    function closeList() {
      if (!inList) {
        return;
      }

      html.push("</ul>");
      inList = false;
    }

    for (var i = 0; i < lines.length; i += 1) {
      var line = lines[i];
      var h3Match = line.match(/^###\s+(.*)$/);
      var h2Match = line.match(/^##\s+(.*)$/);
      var h1Match = line.match(/^#\s+(.*)$/);
      var listMatch = line.match(/^\s*\-\s+(.*)$/);
      var dividerMatch = line.match(/^\s*---+\s*$/);

      if (h3Match) {
        closeList();
        html.push("<h3>" + escapeMarkdownHtml(h3Match[1]) + "</h3>");
        continue;
      }

      if (h2Match) {
        closeList();
        html.push("<h2>" + escapeMarkdownHtml(h2Match[1]) + "</h2>");
        continue;
      }

      if (h1Match) {
        closeList();
        html.push("<h1>" + escapeMarkdownHtml(h1Match[1]) + "</h1>");
        continue;
      }

      if (listMatch) {
        if (!inList) {
          html.push("<ul>");
          inList = true;
        }

        html.push("<li>" + escapeMarkdownHtml(listMatch[1]) + "</li>");
        continue;
      }

      if (dividerMatch) {
        closeList();
        html.push("<hr>");
        continue;
      }

      closeList();

      if (!line.trim()) {
        html.push("<br>");
        continue;
      }

      html.push(escapeMarkdownHtml(line) + "<br>");
    }

    closeList();
    return html.join("");
  }

  function getMarkdownPath(key) {
    var fileName = MARKDOWN_FILE_BY_KEY[key];

    if (!fileName) {
      throw new Error("Unknown markdown key: " + key);
    }

    return MARKDOWN_BASE_PATH + fileName;
  }

  async function loadRenderedMarkdownByKey(key) {
    if (markdownHtmlCache[key]) {
      return markdownHtmlCache[key];
    }

    if (markdownLoadCache[key]) {
      return markdownLoadCache[key];
    }

    markdownLoadCache[key] = loadMarkdown(getMarkdownPath(key))
      .then(function (markdownText) {
        var html = renderMarkdown(markdownText);
        markdownHtmlCache[key] = html;
        return html;
      })
      .finally(function () {
        delete markdownLoadCache[key];
      });

    return markdownLoadCache[key];
  }

  async function renderMarkdownIntoElement(targetElement, key) {
    if (!targetElement) {
      return;
    }

    try {
      targetElement.innerHTML = await loadRenderedMarkdownByKey(key);
    } catch (error) {
      targetElement.innerHTML =
        "<p>Unable to load <strong>" +
        escapeMarkdownHtml(MARKDOWN_FILE_BY_KEY[key] || key) +
        "</strong>.</p>";
      console.error(error);
    }
  }

  function bindMarkdownLauncher(launcher, loader) {
    if (!launcher) {
      return;
    }

    launcher.addEventListener("click", function () {
      window.setTimeout(function () {
        loader();
      }, 0);
    });
  }

  function bindMarkdownWindowOpen(windowElement, loader) {
    var isOpen = false;

    if (!windowElement || !window.MutationObserver) {
      return;
    }

    isOpen = windowElement.classList.contains("open");

    new MutationObserver(function () {
      var nextIsOpen = windowElement.classList.contains("open");

      if (nextIsOpen && !isOpen) {
        loader();
      }

      isOpen = nextIsOpen;
    }).observe(windowElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  function enableArchitectureMarkdownMode() {
    if (!mindMapWindow) {
      return;
    }

    mindMapWindow.classList.add("markdown-mode");
  }

  function enableCareerMarkdownMode() {
    var careerFilter = document.getElementById("career-log-filter");
    var careerClear = document.getElementById("career-log-clear");

    if (careerLogWindow) {
      careerLogWindow.classList.add("markdown-mode");
    }

    if (careerFilter) {
      careerFilter.readOnly = true;
    }

    if (careerClear) {
      careerClear.disabled = true;
    }
  }

  async function loadProofOfWorkMarkdown() {
    await renderMarkdownIntoElement(proofOfWorkContent, "proofOfWork");
  }

  async function loadArchitectureMarkdown() {
    enableArchitectureMarkdownMode();
    await renderMarkdownIntoElement(systemsMapContent, "architecture");
  }

  async function loadHireChadMarkdown() {
    await renderMarkdownIntoElement(hireChadOutput, "hireChad");
  }

  async function loadInterviewPrepMarkdown() {
    await renderMarkdownIntoElement(interviewPrepContent, "interviewPrep");
  }

  async function loadCareerMarkdown() {
    enableCareerMarkdownMode();
    await renderMarkdownIntoElement(careerLogContent, "career");
  }

  function bindMarkdownContent() {
    bindMarkdownLauncher(proofOfWorkLauncher, loadProofOfWorkMarkdown);
    bindMarkdownLauncher(systemsMapLauncher, loadArchitectureMarkdown);
    bindMarkdownLauncher(hireChadLauncher, loadHireChadMarkdown);
    bindMarkdownLauncher(interviewPrepLauncher, loadInterviewPrepMarkdown);
    bindMarkdownLauncher(careerLogLauncher, loadCareerMarkdown);

    bindMarkdownWindowOpen(proofOfWorkWindow, loadProofOfWorkMarkdown);
    bindMarkdownWindowOpen(mindMapWindow, loadArchitectureMarkdown);
    bindMarkdownWindowOpen(hireChadWindow, loadHireChadMarkdown);
    bindMarkdownWindowOpen(interviewPrepWindow, loadInterviewPrepMarkdown);
    bindMarkdownWindowOpen(careerLogWindow, loadCareerMarkdown);

    loadProofOfWorkMarkdown();
    loadArchitectureMarkdown();
    loadHireChadMarkdown();
    loadInterviewPrepMarkdown();
    loadCareerMarkdown();
    loadRenderedMarkdownByKey("demo").catch(function (error) {
      console.error(error);
    });
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

    if (commands.demo) {
      commands.demo.run = function () {
        var cached = markdownHtmlCache.demo;

        if (cached) {
          return {
            type: "html",
            payload: cached
          };
        }

        loadRenderedMarkdownByKey("demo").catch(function (error) {
          console.error(error);
        });

        return {
          type: "text",
          payload: "Loading enterprise-impact.md...\nRun `demo` again in a moment."
        };
      };
    }

    if (!commands.hire && commands["hire-chad"]) {
      commands.hire = commands["hire-chad"];
    }
  }

  function normalizeRecruiterActivityText(value) {
    if (typeof value !== "string" || !value.trim()) {
      return RECRUITER_ACTIVITY_STABLE_TEXT;
    }

    return RECRUITER_ACTIVITY_STABLE_TEXT;
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

      if (recruiterActivityTitle && recruiterActivityTitle.textContent !== RECRUITER_ACTIVITY_TITLE_TEXT) {
        recruiterActivityTitle.textContent = RECRUITER_ACTIVITY_TITLE_TEXT;
      }

      if (normalizedText !== currentText) {
        recruiterActivityMessage.textContent = normalizedText;
      }

      recruiterActivityMessage.classList.remove("is-updating");
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

  function applyRecruiterCtaText(banner) {
    var title = null;
    var subtitle = null;
    var details = null;
    var actionButton = null;

    if (!banner) {
      return;
    }

    title = banner.querySelector(".recruiter-cta-title");
    subtitle = banner.querySelector(".recruiter-cta-subtitle");
    details = banner.querySelector(".recruiter-cta-details");
    actionButton = banner.querySelector(".recruiter-cta-action");

    if (title && title.textContent !== RECRUITER_CTA_TITLE_TEXT) {
      title.textContent = RECRUITER_CTA_TITLE_TEXT;
    }

    if (subtitle) {
      if (subtitle.textContent !== "") {
        subtitle.textContent = "";
      }

      if (!subtitle.hasAttribute("hidden")) {
        subtitle.setAttribute("hidden", "");
      }
    }

    if (details && details.innerHTML !== RECRUITER_CTA_DETAILS_HTML) {
      details.innerHTML = RECRUITER_CTA_DETAILS_HTML;
    }

    if (actionButton && actionButton.textContent !== RECRUITER_CTA_ACTION_TEXT) {
      actionButton.textContent = RECRUITER_CTA_ACTION_TEXT;
    }
  }

  function bindRecruiterCtaTextPolish() {
    var observer = null;
    var bannerObserver = null;
    var bindBannerObserver = null;

    bindBannerObserver = function () {
      var banner = document.getElementById("recruiter-cta-banner");

      if (!banner) {
        return;
      }

      applyRecruiterCtaText(banner);

      if (!window.MutationObserver) {
        return;
      }

      if (bannerObserver) {
        bannerObserver.disconnect();
      }

      bannerObserver = new MutationObserver(function () {
        applyRecruiterCtaText(banner);
      });

      bannerObserver.observe(banner, {
        childList: true,
        characterData: true,
        subtree: true
      });
    };

    bindBannerObserver();

    if (!window.MutationObserver || !document.body) {
      return;
    }

    observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i += 1) {
        var addedNodes = mutations[i].addedNodes;

        for (var j = 0; j < addedNodes.length; j += 1) {
          var node = addedNodes[j];

          if (!node || node.nodeType !== 1) {
            continue;
          }

          if (node.id === "recruiter-cta-banner") {
            bindBannerObserver();
            return;
          }

          if (node.querySelector && node.querySelector("#recruiter-cta-banner")) {
            bindBannerObserver();
            return;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function bindMeetChadButton() {
    var openIntroVideo = null;

    if (!pipVideo) {
      return;
    }

    if (pipVideo.classList.contains("video-disabled")) {
      pipVideo.setAttribute("aria-disabled", "true");
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

  bindMarkdownContent();
  bindRotatingTerminalHints();
  bindWelcomeHint();
  ensureGlobalTerminalRunner();
  normalizeTerminalTitles();
  bindRecruiterActivityTextNormalizer();
  bindRecruiterCtaTextPolish();
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
    detailPhilosophy.textContent = "Focus Areas: " + data.focus.join(" | ");
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
