(function () {
  var bootSequence = document.getElementById("boot-sequence");
  var biosScreen = document.getElementById("bios-screen");
  var biosCopy = biosScreen.querySelector(".boot-copy");
  var kernelScreen = document.getElementById("kernel-screen");
  var asciiScreen = document.getElementById("ascii-screen");
  var kernelLog = document.getElementById("kernel-log");
  var asciiBanner = document.getElementById("ascii-banner");

  var desktop = document.getElementById("desktop");
  var desktopWindows = document.getElementById("desktop-windows");
  var terminalLauncher = document.getElementById("terminal-launcher");
  var hireChadLauncher = document.getElementById("hire-chad-launcher");
  var systemsMapLauncher = document.getElementById("systems-map-launcher");
  var automationLabLauncher = document.getElementById("automation-lab-launcher");
  var careerLogLauncher = document.getElementById("career-log-launcher");
  var proofOfWorkLauncher = document.getElementById("proof-of-work-launcher");
  var resumeLauncher = document.getElementById("resume-launcher");
  var skillsLauncher = document.getElementById("skills-launcher");
  var desktopPopup = document.getElementById("desktop-popup");
  var onboardingOverlay = document.getElementById("onboarding-overlay");
  var onboardingStartButton = document.getElementById("onboarding-start");
  var pipVideo = document.getElementById("pip-video");
  var notifications = document.getElementById("notifications");
  var systemMonitorStats = document.getElementById("system-monitor-stats");
  var launcherButtons = document.querySelectorAll("#desktop-launcher .launcher-button");
  var terminalWindow = document.getElementById("terminal-window");
  var hireChadWindow = document.getElementById("hire-chad-window");
  var systemsMapWindow = document.getElementById("systems-map-window");
  var automationLabWindow = document.getElementById("automation-lab-window");
  var careerLogWindow = document.getElementById("career-log-window");
  var proofOfWorkWindow = document.getElementById("proof-of-work-window");
  var resumeWindow = document.getElementById("resume-window");
  var skillsWindow = document.getElementById("skills-window");
  var hireChadOutput = document.getElementById("hire-chad-output");
  var systemsMapContent = document.getElementById("systems-map-content");
  var systemsMapLayerButtons = document.querySelectorAll("#systems-map-window .systems-map-layer");
  var careerLogFilterInput = document.getElementById("career-log-filter");
  var careerLogClearButton = document.getElementById("career-log-clear");
  var careerLogContent = document.getElementById("career-log-content");
  var resumeDownloadButton = document.getElementById("resume-download");
  var resumeExperienceList = document.getElementById("resume-experience-list");
  var terminal = document.getElementById("terminal");
  var output = document.getElementById("output");
  var form = document.getElementById("command-form");
  var input = document.getElementById("command-input");
  var promptLabel = document.querySelector(".prompt");

  if (
    !bootSequence ||
    !biosScreen ||
    !biosCopy ||
    !kernelScreen ||
    !asciiScreen ||
    !kernelLog ||
    !asciiBanner ||
    !desktop ||
    !desktopWindows ||
    !terminalLauncher ||
    !hireChadLauncher ||
    !systemsMapLauncher ||
    !automationLabLauncher ||
    !careerLogLauncher ||
    !proofOfWorkLauncher ||
    !resumeLauncher ||
    !skillsLauncher ||
    !desktopPopup ||
    !onboardingOverlay ||
    !onboardingStartButton ||
    !pipVideo ||
    !notifications ||
    !systemMonitorStats ||
    !launcherButtons.length ||
    !terminalWindow ||
    !hireChadWindow ||
    !systemsMapWindow ||
    !automationLabWindow ||
    !careerLogWindow ||
    !proofOfWorkWindow ||
    !resumeWindow ||
    !skillsWindow ||
    !hireChadOutput ||
    !systemsMapContent ||
    !systemsMapLayerButtons.length ||
    !careerLogFilterInput ||
    !careerLogClearButton ||
    !careerLogContent ||
    !resumeDownloadButton ||
    !resumeExperienceList ||
    !terminal ||
    !output ||
    !form ||
    !input ||
    !promptLabel
  ) {
    throw new Error("Missing required terminal elements.");
  }

  var THEME_KEY = "terminal-theme";
  var HISTORY_KEY = "terminal-history";
  var ONBOARDING_KEY = "chados-onboarding-seen";
  var HISTORY_LIMIT = 200;
  var THEMES = ["dark", "light", "matrix"];
  var BASE_PROMPT = "chad@workshop:~$";

  var BIOS_DURATION_MS = 3500;
  var BIOS_DOT_DELAY_MS = 70;
  var KERNEL_LINE_DELAY_MS = 180;
  var KERNEL_POST_DELAY_MS = 1200;
  var ASCII_HOLD_MS = 1500;
  var DESKTOP_TRANSITION_MS = 500;
  var TERMINAL_CLOSE_MS = 200;
  var NOTIFICATION_LIFE_MS = 6000;
  var NOTIFICATION_EXIT_MS = 220;
  var RECRUITER_ACTIVITY_MIN_DELAY_MS = 20000;
  var RECRUITER_ACTIVITY_MAX_DELAY_MS = 90000;
  var RECRUITER_ACTIVITY_TITLE = "Recruiter Activity";
  var HIRE_CHAD_STEP_DELAY_MS = 190;
  var HIRE_CHAD_DOT_DELAY_MS = 75;

  var BIOS_CHECKS = [
    { label: "Memory test", dots: 13 },
    { label: "CPU detected", dots: 12 },
    { label: "Storage mounted", dots: 9 }
  ];

  var KERNEL_LINES = [
    "[ 0.0001 ] Booting Workshop OS",
    "[ 0.1021 ] Initializing CPU scheduler",
    "[ 0.2201 ] Loading kernel modules",
    "[ 0.3310 ] Detecting system devices",
    "[ 0.4411 ] Starting networking services",
    "[ 0.5520 ] Starting container runtime",
    "[ 0.6621 ] Starting automation subsystem",
    "[ 0.7812 ] Starting infrastructure subsystem",
    "[ 0.8923 ] Mounting /home filesystem",
    "[ 1.0034 ] Launching graphical environment",
    "[ OK ] Started Network Manager",
    "[ OK ] Started Container Services",
    "[ OK ] Started Automation Runtime",
    "[ OK ] Started Workshop Services"
  ];

  var ASCII_ART = [
    "██████╗██╗  ██╗ █████╗ ██████╗",
    "██╔════╝██║  ██║██╔══██╗██╔══██╗",
    "██║     ███████║███████║██║  ██║",
    "██║     ██╔══██║██╔══██║██║  ██║",
    "╚██████╗██║  ██║██║  ██║██████╔╝",
    "╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝"
  ].join("\n");

  var INITIAL_NOTIFICATIONS = [
    {
      delay: 3000,
      icon: "⚙",
      title: "Automation",
      message: "Nightly infrastructure checks completed successfully."
    },
    {
      delay: 8000,
      icon: "🐳",
      title: "Containers",
      message: "7 services running normally."
    },
    {
      delay: 15000,
      icon: "🤖",
      title: "AI Assistant",
      message: "Billy runtime standing by."
    }
  ];

  var RECRUITER_ACTIVITY_TEMPLATES = [
    {
      key: "active-reviewers",
      tags: ["general", "terminal"],
      message: function () {
        var count = randomInt(1, 4);
        var suffix = count === 1 ? "recruiter" : "recruiters";
        return count + " " + suffix + " currently reviewing this system.";
      }
    },
    {
      key: "opened-career-log",
      tags: ["career-log"],
      message: "Another hiring manager just opened career.log."
    },
    {
      key: "exploring-mind-map",
      tags: ["mind-map"],
      message: "Recruiter exploring mind-map.txt."
    },
    {
      key: "evaluating-automation-lab",
      tags: ["automation-lab"],
      message: "A hiring team is evaluating automation-lab."
    },
    {
      key: "ran-hire-chad",
      tags: ["hire-chad", "terminal"],
      message: "Someone just ran 'hire-chad' in the terminal."
    },
    {
      key: "reviewing-infrastructure-thinking",
      tags: ["mind-map", "general"],
      message: "Recruiter reviewing infrastructure thinking."
    },
    {
      key: "engineering-lead-exploring",
      tags: ["general"],
      message: "Another engineering lead is exploring ChadOS."
    },
    {
      key: "inspecting-automation-patterns",
      tags: ["automation-lab", "general"],
      message: "Recruiter inspecting automation patterns."
    },
    {
      key: "opened-mind-map",
      tags: ["mind-map"],
      message: "Someone just opened the Mind Map."
    },
    {
      key: "evaluating-platform-thinking",
      tags: ["mind-map", "career-log", "general"],
      message: "Engineering manager evaluating platform thinking."
    }
  ];

  var HIRE_CHAD_SEQUENCE = [
    { type: "line", text: "sudo hire-chad", className: "is-command", pause: 220 },
    { type: "line", text: "[sudo] password for recruiter: ********", className: "is-command", pause: 220 },
    { type: "line", text: "", pause: 180 },
    { type: "line", text: "Initializing candidate analysis...", className: "is-section", pause: 240 },
    { type: "line", text: "", pause: 180 },
    { type: "line", text: "Loading profile: Chad McCormack", pause: 190 },
    { type: "line", text: "Target role: Creative Systems Engineer", pause: 220 },
    { type: "line", text: "", pause: 180 },
    { type: "line", text: "Checking engineering traits:", className: "is-section", pause: 220 },
    { type: "ok", label: "Infrastructure architecture", dots: 12 },
    { type: "ok", label: "Automation engineering", dots: 17 },
    { type: "ok", label: "Incident response mindset", dots: 14 },
    { type: "ok", label: "Platform thinking", dots: 22 },
    { type: "ok", label: "Documentation that ships", dots: 15 },
    { type: "ok", label: "Curiosity + execution", dots: 18 },
    { type: "line", text: "", pause: 220 },
    { type: "line", text: "Evaluating working style...", className: "is-section", pause: 240 },
    { type: "line", text: "", pause: 170 },
    { type: "line", text: "Builds systems other engineers enjoy using", pause: 180 },
    { type: "line", text: "Automates repetitive operational work", pause: 180 },
    { type: "line", text: "Leaves infrastructure easier than found", pause: 180 },
    { type: "line", text: "Designs feedback loops into systems", pause: 220 },
    { type: "line", text: "", pause: 180 },
    { type: "line", text: "Final recommendation:", className: "is-section", pause: 220 },
    { type: "line", text: "", pause: 160 },
    { type: "line", text: "HIRE CHAD.", className: "is-final", pause: 240 },
    { type: "line", text: "", pause: 180 },
    { type: "line", text: "Tip: type \"hire-chad --why\" in the terminal.", className: "is-tip", pause: 0 }
  ];

  var SYSTEMS_MAP_CORE_ASCII = [
    "          Users",
    "            │",
    "    ┌───────┴────────┐",
    "    │   Interfaces   │",
    "    │  APIs / UI /   │",
    "    │ Integrations   │",
    "    └───────┬────────┘",
    "            │",
    "    ┌───────┴────────┐",
    "    │   Automation   │",
    "    │ CI / CD / Jobs │",
    "    │ Event Systems  │",
    "    └───────┬────────┘",
    "            │",
    "    ┌───────┴────────┐",
    "    │ Infrastructure │",
    "    │ Compute / Net  │",
    "    │ Storage / IAM  │",
    "    └───────┬────────┘",
    "            │",
    "    ┌───────┴────────┐",
    "    │ Observability  │",
    "    │ Logs / Metrics │",
    "    │ Alerts / SLOs  │",
    "    └───────┬────────┘",
    "            │",
    "        Feedback"
  ].join("\n");

  var SYSTEMS_MAP_LAYERS = {
    core: {
      label: "Core",
      bullets: []
    },
    interfaces: {
      label: "Interfaces",
      bullets: [
        "API-first integration patterns",
        "Consistent contract design",
        "Developer-friendly documentation",
        "Systems designed for operability",
        "Interfaces built to reduce cognitive load"
      ]
    },
    automation: {
      label: "Automation",
      bullets: [
        "CI templates as paved roads",
        "Automated environment provisioning",
        "Event-driven operations for routine tasks",
        "Self-documenting runbooks",
        "ChatOps for operational visibility"
      ]
    },
    infrastructure: {
      label: "Infrastructure",
      bullets: [
        "Immutable patterns for safe deployments",
        "Segmentation and least privilege access",
        "Infrastructure defined as code",
        "Reliability-first architecture",
        "Capacity planning and failure tolerance"
      ]
    },
    governance: {
      label: "Governance",
      bullets: [
        "Guardrails over gatekeeping",
        "Change management that doesn't slow teams",
        "Auditable automation",
        "Clear system ownership",
        "Sustainable operational practices"
      ]
    }
  };

  var CAREER_SUMMARY = {
    title: "Career Summary",
    description: [
      "ServiceNow CMDB / Discovery SME with enterprise experience designing infrastructure visibility and configuration data governance for large corporate environments."
    ],
    specialties: [
      "CMDB architecture and governance",
      "ServiceNow Discovery reliability",
      "infrastructure classification and CI modeling",
      "service visibility for operations teams"
    ]
  };

  var CAREER_TIMELINE_ENTRIES = [
    {
      id: "current-role",
      period: "[2024 -> Present]",
      company: "Enterprise Financial Services Organization (Current Placeholder)",
      role: "ServiceNow CMDB / Discovery SME",
      responsibilities: [
        "Drove enterprise CMDB architecture standards and data governance controls.",
        "Improved Discovery reliability across shared enterprise infrastructure domains.",
        "Aligned CI lifecycle ownership between platform and operations teams."
      ],
      focus: [
        "MID Server architecture",
        "discovery credential strategy",
        "CI reconciliation and normalization"
      ],
      contributions: [
        "Improved discovery pattern stability for critical enterprise segments.",
        "Strengthened CI relationship quality for downstream service visibility.",
        "Implemented recurring CMDB data quality checkpoints with platform owners."
      ],
      platforms: [
        "ServiceNow CMDB",
        "ServiceNow Discovery",
        "Enterprise Infrastructure"
      ]
    },
    {
      id: "capital-one",
      period: "[2019 - 2023]",
      company: "Capital One",
      role: "Senior ServiceNow CMDB / Discovery Engineer",
      responsibilities: [
        "Improved CMDB data quality and trust across operations teams.",
        "Stabilized discovery patterns and credential workflows.",
        "Increased infrastructure visibility across enterprise environments."
      ],
      focus: [
        "CMDB governance and CI lifecycle",
        "discovery coverage and reliability",
        "infrastructure relationship modeling"
      ],
      contributions: [
        "Discovery pattern troubleshooting across complex infrastructure estates.",
        "CI classification improvements for cleaner reconciliation outcomes.",
        "Service visibility improvements for incident and support workflows."
      ],
      platforms: [
        "ServiceNow CMDB",
        "ServiceNow Discovery",
        "Enterprise Infrastructure"
      ]
    },
    {
      id: "platform-specialist",
      period: "[2016 - 2019]",
      company: "Enterprise Technology Organization (Platform Specialist Placeholder)",
      role: "ServiceNow Engineer / Platform Specialist",
      responsibilities: [
        "Configured and troubleshot Discovery for mixed enterprise environments.",
        "Improved CI classification and normalization across infrastructure classes.",
        "Supported infrastructure data modeling for operational reporting."
      ],
      focus: [
        "Discovery pattern stability",
        "service mapping readiness",
        "Operational reporting"
      ],
      contributions: [
        "Created repeatable triage workflows for discovery failure analysis.",
        "Reduced CI data drift through better classification and model controls.",
        "Improved evidence quality for governance and audit stakeholders."
      ],
      platforms: [
        "ServiceNow CMDB",
        "ServiceNow Discovery",
        "Service Mapping",
        "Infrastructure Data Modeling"
      ]
    },
    {
      id: "infra-engineering",
      period: "[Earlier Roles]",
      company: "Enterprise Infrastructure Organizations",
      role: "Infrastructure / Systems Engineering",
      responsibilities: [
        "Managed enterprise infrastructure operations and reliability workflows.",
        "Built monitoring and operational tooling for service continuity.",
        "Automated repeat operational tasks to reduce support toil."
      ],
      focus: [
        "Infrastructure visibility",
        "monitoring and operational tooling",
        "Automation-first operational practices"
      ],
      contributions: [
        "Documented runbooks that improved incident response consistency.",
        "Introduced recurring operational checks for critical platform services.",
        "Improved handoff quality between infrastructure operations and engineering."
      ],
      platforms: [
        "Enterprise Infrastructure",
        "Monitoring and Alerting",
        "Operational Tooling"
      ]
    }
  ];

  var state = {
    history: [],
    historyIndex: 0,
    theme: "dark",
    promptTimestampEnabled: false,
    terminalInitialized: false,
    hireChadRunId: 0,
    systemsMapLayer: "core",
    careerLogFilter: "",
    careerLogExpanded: {
      "current-role": true
    },
    notificationsScheduled: false,
    recruiterActivityStarted: false,
    lastRecruiterActivityKey: "",
    onboardingVisible: false,
    windowZ: 2000
  };
  var biosAnimationState = {
    lines: []
  };
  var systemMonitorInterval = null;
  var notificationSequence = 0;
  var notificationScheduleTimers = [];
  var recruiterActivityTimer = null;
  var windowCloseTimers = {};
  var desktopPopupTimer = null;
  var activeDrag = null;

  var ctx = {
    print: print,
    clear: clearOutput,
    history: state.history,
    setTheme: setTheme,
    getTheme: getTheme
  };

  function sleep(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getPromptText() {
    if (!state.promptTimestampEnabled) {
      return BASE_PROMPT;
    }

    var now = new Date();
    var stamp = now.toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    return "[" + stamp + "] " + BASE_PROMPT;
  }

  function renderPrompt() {
    promptLabel.textContent = getPromptText();
  }

  function getTheme() {
    return state.theme;
  }

  function setTheme(themeName) {
    if (THEMES.indexOf(themeName) === -1) {
      return;
    }

    state.theme = themeName;
    document.body.setAttribute("data-theme", themeName);
    window.localStorage.setItem(THEME_KEY, themeName);
  }

  function restoreTheme() {
    var savedTheme = window.localStorage.getItem(THEME_KEY);

    if (savedTheme && THEMES.indexOf(savedTheme) !== -1) {
      setTheme(savedTheme);
      return;
    }

    setTheme("dark");
  }

  function restoreHistory() {
    var rawHistory = window.localStorage.getItem(HISTORY_KEY);

    if (!rawHistory) {
      return;
    }

    try {
      var parsed = JSON.parse(rawHistory);

      if (!Array.isArray(parsed)) {
        return;
      }

      var restored = [];
      for (var i = 0; i < parsed.length; i += 1) {
        if (typeof parsed[i] === "string" && parsed[i].trim()) {
          restored.push(parsed[i]);
        }
      }

      if (restored.length > HISTORY_LIMIT) {
        restored = restored.slice(restored.length - HISTORY_LIMIT);
      }

      state.history.splice(0, state.history.length);
      for (var j = 0; j < restored.length; j += 1) {
        state.history.push(restored[j]);
      }

      state.historyIndex = state.history.length;
    } catch (_error) {
      state.historyIndex = 0;
    }
  }

  function persistHistory() {
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
    } catch (_error) {
      // Ignore storage quota or blocked access errors.
    }
  }

  function hasSeenOnboarding() {
    try {
      return window.localStorage.getItem(ONBOARDING_KEY) === "1";
    } catch (_error) {
      return false;
    }
  }

  function markOnboardingSeen() {
    try {
      window.localStorage.setItem(ONBOARDING_KEY, "1");
    } catch (_error) {
      // Ignore blocked storage access.
    }
  }

  function closeOnboardingOverlay(markSeen) {
    if (!state.onboardingVisible) {
      return;
    }

    state.onboardingVisible = false;
    onboardingOverlay.classList.remove("visible");
    onboardingOverlay.setAttribute("aria-hidden", "true");

    if (markSeen) {
      markOnboardingSeen();
    }

    terminalLauncher.focus();
  }

  function maybeShowOnboardingOverlay() {
    if (hasSeenOnboarding()) {
      return false;
    }

    state.onboardingVisible = true;
    onboardingOverlay.classList.add("visible");
    onboardingOverlay.setAttribute("aria-hidden", "false");
    onboardingStartButton.focus();
    return true;
  }

  function bindOnboardingOverlay() {
    onboardingStartButton.addEventListener("click", function () {
      closeOnboardingOverlay(true);
    });
  }

  function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
  }

  function scrollKernelToBottom() {
    kernelLog.scrollTop = kernelLog.scrollHeight;
  }

  function appendLine(text, className) {
    var line = document.createElement("div");
    line.className = "output-line" + (className ? " " + className : "");
    line.textContent = text;
    output.appendChild(line);
    scrollToBottom();
  }

  function appendHtml(html) {
    var line = document.createElement("div");
    line.className = "output-line";
    line.innerHTML = html;
    output.appendChild(line);
    scrollToBottom();
  }

  function print(text) {
    appendLine(String(text));
  }

  function clearOutput() {
    output.innerHTML = "";
    scrollToBottom();
  }

  function echoCommand(rawInput) {
    appendLine(getPromptText() + " " + rawInput, "command-echo");
  }

  function tokenize(inputText) {
    var tokens = [];
    var pattern = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|(\S+)/g;
    var match;

    while ((match = pattern.exec(inputText)) !== null) {
      tokens.push(match[1] || match[2] || match[3]);
    }

    return tokens;
  }

  function parseInput(rawInput) {
    var tokens = tokenize(rawInput.trim());

    if (!tokens.length) {
      return null;
    }

    return {
      rawCommand: tokens[0],
      command: tokens[0].toLowerCase(),
      args: tokens.slice(1)
    };
  }

  function handleUnknownCommand(rawCommand) {
    print(
      "command not found: " + rawCommand +
        "\nType 'help' to see available commands."
    );
  }

  function applyCommandResult(result) {
    if (!result) {
      return;
    }

    if (result.type === "clear") {
      clearOutput();
      return;
    }

    if (result.type === "html") {
      appendHtml(result.payload || "");
      return;
    }

    if (result.type === "text") {
      print(result.payload || "");
      return;
    }
  }

  function resolveCommandAlias(commandName) {
    if (commandName === "cls") {
      return "clear";
    }

    return commandName;
  }

  function runSystemNavigationCommand(commandName) {
    if (commandName === "resume" || commandName === "cv") {
      openResumeWindow();
      return true;
    }

    if (commandName === "skills") {
      openSkillsWindow();
      return true;
    }

    return false;
  }

  function runCommand(rawInput) {
    var parsed = parseInput(rawInput);
    var commands = window.TerminalCommands || {};

    if (!parsed) {
      return;
    }

    parsed.command = resolveCommandAlias(parsed.command);

    if (runSystemNavigationCommand(parsed.command)) {
      return;
    }

    var command = commands[parsed.command];

    if (!command || typeof command.run !== "function") {
      handleUnknownCommand(parsed.rawCommand);
      return;
    }

    try {
      var result = command.run(parsed.args, ctx);
      applyCommandResult(result);
    } catch (error) {
      print("error: failed to run command");
      console.error(error);
    }
  }

  function getCommandNames() {
    var commands = window.TerminalCommands || {};
    var names = Object.keys(commands);

    if (names.indexOf("clear") !== -1 && names.indexOf("cls") === -1) {
      names.push("cls");
    }

    names.sort();
    return names;
  }

  function autoCompleteCommand() {
    var value = input.value;

    if (!value.trim()) {
      return;
    }

    if (/\s/.test(value.trim())) {
      return;
    }

    var token = value.trim().toLowerCase();
    var names = getCommandNames();
    var matches = [];

    for (var i = 0; i < names.length; i += 1) {
      if (names[i].indexOf(token) === 0) {
        matches.push(names[i]);
      }
    }

    if (!matches.length) {
      return;
    }

    if (matches.length === 1) {
      input.value = matches[0] + " ";
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    print("Suggestions: " + matches.join("  "));
  }

  function applyHistoryInput() {
    if (state.historyIndex < 0) {
      state.historyIndex = 0;
    }

    if (state.historyIndex >= state.history.length) {
      input.value = "";
      return;
    }

    input.value = state.history[state.historyIndex];
    input.setSelectionRange(input.value.length, input.value.length);
  }

  function pushHistory(command) {
    if (!command || !command.trim()) {
      return;
    }

    state.history.push(command);

    if (state.history.length > HISTORY_LIMIT) {
      state.history.splice(0, state.history.length - HISTORY_LIMIT);
    }

    state.historyIndex = state.history.length;
    persistHistory();
  }

  function onSubmit(event) {
    event.preventDefault();

    var rawInput = input.value;

    if (!rawInput.trim()) {
      input.value = "";
      input.focus();
      return;
    }

    echoCommand(rawInput);
    pushHistory(rawInput);
    runCommand(rawInput);

    input.value = "";
    input.focus();
    scrollToBottom();
  }

  function onKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      autoCompleteCommand();
      input.focus();
      return;
    }

    if (event.ctrlKey && !event.shiftKey && !event.altKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      clearOutput();
      input.focus();
      return;
    }

    if (!state.history.length) {
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
      }

      applyHistoryInput();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (state.historyIndex < state.history.length) {
        state.historyIndex += 1;
      }

      applyHistoryInput();
    }
  }

  function setActiveBootScreen(nextScreen) {
    var screens = [biosScreen, kernelScreen, asciiScreen];

    for (var i = 0; i < screens.length; i += 1) {
      var active = screens[i] === nextScreen;
      screens[i].classList.toggle("active", active);
      screens[i].setAttribute("aria-hidden", active ? "false" : "true");
    }
  }

  function renderBiosLines(lines) {
    biosCopy.textContent = lines.join("\n");
  }

  function getBiosDotCount(label) {
    for (var i = 0; i < BIOS_CHECKS.length; i += 1) {
      if (BIOS_CHECKS[i].label === label) {
        return BIOS_CHECKS[i].dots;
      }
    }

    return 13;
  }

  async function animateOkLine(label) {
    var lines = biosAnimationState.lines;
    var lineIndex = lines.length;
    var resolvedDotCount = getBiosDotCount(label);
    var dots = "";

    lines.push(label);
    lines[lineIndex] = label;
    renderBiosLines(lines);

    for (var i = 0; i < resolvedDotCount; i += 1) {
      dots += ".";
      lines[lineIndex] = label + dots;
      renderBiosLines(lines);
      await sleep(BIOS_DOT_DELAY_MS);
    }

    lines[lineIndex] = label + dots + "OK";
    renderBiosLines(lines);
  }

  async function runBiosChecks() {
    var biosStart = Date.now();
    biosAnimationState.lines = [
      "Workshop BIOS v1.0",
      "Initializing hardware...",
      ""
    ];
    var lines = biosAnimationState.lines;

    renderBiosLines(lines);
    await sleep(180);

    for (var i = 0; i < BIOS_CHECKS.length; i += 1) {
      await animateOkLine(BIOS_CHECKS[i].label);
    }

    lines.push("");
    lines.push("Boot device found: /dev/workshop");
    lines.push("");
    lines.push("Press DEL to enter setup");
    renderBiosLines(lines);

    var elapsed = Date.now() - biosStart;
    if (elapsed < BIOS_DURATION_MS) {
      await sleep(BIOS_DURATION_MS - elapsed);
    }
  }

  async function printKernelLine(lineText) {
    var line = document.createElement("div");
    line.className = "kernel-line";
    line.textContent = lineText;
    kernelLog.appendChild(line);
    scrollKernelToBottom();

    await sleep(KERNEL_LINE_DELAY_MS);
  }

  async function runKernelBootLogs() {
    kernelLog.innerHTML = "";

    for (var i = 0; i < KERNEL_LINES.length; i += 1) {
      await printKernelLine(KERNEL_LINES[i]);
    }
  }

  function showAsciiBanner() {
    asciiBanner.textContent = ASCII_ART;
  }

  function activateDesktop() {
    desktop.classList.add("active");
    desktop.setAttribute("aria-hidden", "false");
  }

  function getWindowId(windowElement) {
    if (windowElement.id) {
      return windowElement.id;
    }

    if (windowElement.getAttribute("data-app")) {
      return windowElement.getAttribute("data-app");
    }

    return "window";
  }

  function clearWindowCloseTimer(windowElement) {
    var windowId = getWindowId(windowElement);

    if (windowCloseTimers[windowId]) {
      window.clearTimeout(windowCloseTimers[windowId]);
      delete windowCloseTimers[windowId];
    }
  }

  function setWindowFocused(windowElement) {
    var windows = desktopWindows.querySelectorAll(".chados-window");

    for (var i = 0; i < windows.length; i += 1) {
      windows[i].classList.toggle(
        "is-active",
        windows[i] === windowElement && windows[i].classList.contains("open")
      );
    }
  }

  function bringWindowToFront(windowElement) {
    if (!windowElement) {
      return;
    }

    state.windowZ += 1;
    windowElement.style.zIndex = String(state.windowZ);
    setWindowFocused(windowElement);
  }

  function getWindowCenterPosition(windowElement) {
    var desktopRect = desktopWindows.getBoundingClientRect();
    var windowRect = windowElement.getBoundingClientRect();

    return {
      left: Math.round((desktopRect.width - windowRect.width) / 2),
      top: Math.round((desktopRect.height - windowRect.height) / 2)
    };
  }

  function centerWindow(windowElement, force) {
    if (!force && windowElement.dataset.positioned === "true") {
      return;
    }

    var centered = getWindowCenterPosition(windowElement);

    windowElement.style.left = centered.left + "px";
    windowElement.style.top = centered.top + "px";
    windowElement.dataset.positioned = "true";
  }

  function recenterWindow(windowElement) {
    if (!windowElement || !windowElement.classList.contains("open")) {
      return;
    }

    stopWindowDrag(windowElement);
    bringWindowToFront(windowElement);

    var centered = getWindowCenterPosition(windowElement);
    windowElement.classList.remove("recentering");
    // Force reflow so recenter animation reliably replays.
    void windowElement.offsetWidth;
    windowElement.classList.add("recentering");
    windowElement.style.left = centered.left + "px";
    windowElement.style.top = centered.top + "px";
    windowElement.dataset.positioned = "true";

    window.setTimeout(function () {
      windowElement.classList.remove("recentering");
    }, 210);
  }

  function stopWindowDrag(targetWindow) {
    if (!activeDrag) {
      return;
    }

    if (targetWindow && activeDrag.windowElement !== targetWindow) {
      return;
    }

    activeDrag.windowElement.classList.remove("dragging");
    document.removeEventListener("mousemove", onWindowDragMouseMove);
    document.removeEventListener("mouseup", onWindowDragMouseUp);
    activeDrag = null;
  }

  function onWindowDragMouseMove(event) {
    if (!activeDrag) {
      return;
    }

    var nextLeft = (event.clientX - activeDrag.offsetX) - activeDrag.desktopLeft;
    var nextTop = (event.clientY - activeDrag.offsetY) - activeDrag.desktopTop;

    activeDrag.windowElement.style.left = nextLeft + "px";
    activeDrag.windowElement.style.top = nextTop + "px";
    activeDrag.windowElement.dataset.positioned = "true";
  }

  function onWindowDragMouseUp() {
    stopWindowDrag();
  }

  function openChadWindow(windowElement) {
    if (windowElement.classList.contains("open") && !windowElement.classList.contains("closing")) {
      bringWindowToFront(windowElement);
      return false;
    }

    clearWindowCloseTimer(windowElement);
    centerWindow(windowElement, false);
    windowElement.classList.remove("closing");
    windowElement.classList.add("open");
    windowElement.setAttribute("aria-hidden", "false");
    bringWindowToFront(windowElement);
    windowElement.classList.remove("launched");
    // Trigger a reflow so the open animation can replay reliably.
    void windowElement.offsetWidth;
    windowElement.classList.add("launched");

    return true;
  }

  function closeChadWindow(windowElement) {
    if (!windowElement.classList.contains("open") || windowElement.classList.contains("closing")) {
      return;
    }

    stopWindowDrag(windowElement);
    clearWindowCloseTimer(windowElement);
    windowElement.classList.remove("launched");
    windowElement.classList.remove("open");
    windowElement.classList.remove("is-active");
    windowElement.classList.remove("recentering");
    windowElement.classList.add("closing");

    var windowId = getWindowId(windowElement);
    windowCloseTimers[windowId] = window.setTimeout(function () {
      windowElement.classList.remove("closing");
      windowElement.setAttribute("aria-hidden", "true");
      delete windowCloseTimers[windowId];
    }, TERMINAL_CLOSE_MS);
  }

  function openTerminalWindow() {
    openChadWindow(terminalWindow);

    if (!state.terminalInitialized) {
      initializeTerminalSession();
      state.terminalInitialized = true;
      return;
    }

    input.focus();
    scrollToBottom();
  }

  function closeTerminalWindow() {
    closeChadWindow(terminalWindow);
    terminalLauncher.focus();
  }

  function getLauncherForWindow(windowElement) {
    if (windowElement === terminalWindow) {
      return terminalLauncher;
    }

    if (windowElement === hireChadWindow) {
      return hireChadLauncher;
    }

    if (windowElement === systemsMapWindow) {
      return systemsMapLauncher;
    }

    if (windowElement === automationLabWindow) {
      return automationLabLauncher;
    }

    if (windowElement === careerLogWindow) {
      return careerLogLauncher;
    }

    if (windowElement === proofOfWorkWindow) {
      return proofOfWorkLauncher;
    }

    if (windowElement === resumeWindow) {
      return resumeLauncher;
    }

    if (windowElement === skillsWindow) {
      return skillsLauncher;
    }

    return null;
  }

  function focusLauncherForWindow(windowElement) {
    var launcher = getLauncherForWindow(windowElement);

    if (launcher) {
      launcher.focus();
    }
  }

  function appendHireChadLine(text, className) {
    var line = document.createElement("div");
    line.className = "hire-log-line" + (className ? " " + className : "");
    line.textContent = text;
    hireChadOutput.appendChild(line);
    hireChadOutput.scrollTop = hireChadOutput.scrollHeight;
    return line;
  }

  function stopHireChadAnimation() {
    state.hireChadRunId += 1;
  }

  async function animateHireChadOkLine(label, dots, runId) {
    var dotCount = typeof dots === "number" && dots > 0 ? dots : 14;
    var dotText = "";
    var line = appendHireChadLine(label);

    for (var i = 0; i < dotCount; i += 1) {
      if (runId !== state.hireChadRunId) {
        return;
      }

      dotText += ".";
      line.textContent = label + dotText;
      hireChadOutput.scrollTop = hireChadOutput.scrollHeight;
      await sleep(HIRE_CHAD_DOT_DELAY_MS);
    }

    if (runId !== state.hireChadRunId) {
      return;
    }

    line.textContent = label + dotText + "OK";
    line.classList.add("is-ok");
  }

  async function runHireChadSequence() {
    stopHireChadAnimation();
    var runId = state.hireChadRunId;

    hireChadOutput.innerHTML = "";

    for (var i = 0; i < HIRE_CHAD_SEQUENCE.length; i += 1) {
      if (runId !== state.hireChadRunId) {
        return;
      }

      var step = HIRE_CHAD_SEQUENCE[i];

      if (step.type === "ok") {
        await animateHireChadOkLine(step.label, step.dots, runId);
      } else {
        appendHireChadLine(step.text, step.className);
      }

      var waitMs = typeof step.pause === "number" ? step.pause : HIRE_CHAD_STEP_DELAY_MS;
      if (waitMs > 0) {
        await sleep(waitMs);
      }
    }
  }

  function openHireChadWindow() {
    var opened = openChadWindow(hireChadWindow);

    if (opened) {
      runHireChadSequence();
    }
  }

  function closeHireChadWindow() {
    stopHireChadAnimation();
    closeChadWindow(hireChadWindow);
    focusLauncherForWindow(hireChadWindow);
  }

  function openAutomationLabWindow() {
    openChadWindow(automationLabWindow);
  }

  function closeAutomationLabWindow() {
    closeChadWindow(automationLabWindow);
    focusLauncherForWindow(automationLabWindow);
  }

  function openProofOfWorkWindow() {
    openChadWindow(proofOfWorkWindow);
  }

  function closeProofOfWorkWindow() {
    closeChadWindow(proofOfWorkWindow);
    focusLauncherForWindow(proofOfWorkWindow);
  }

  function createResumeExperienceEntry(entry) {
    var article = document.createElement("article");
    var header = document.createElement("div");
    var period = document.createElement("span");
    var company = document.createElement("span");
    var role = document.createElement("p");
    var impactList = document.createElement("ul");
    var focus = document.createElement("p");

    article.className = "resume-entry";
    header.className = "resume-entry-header";
    period.className = "resume-entry-period";
    company.className = "resume-entry-company";
    role.className = "resume-entry-role";
    impactList.className = "resume-entry-impact";
    focus.className = "resume-entry-focus";

    period.textContent = entry.period;
    company.textContent = entry.company;
    role.textContent = entry.role;

    header.appendChild(period);
    header.appendChild(company);

    for (var i = 0; i < entry.responsibilities.length; i += 1) {
      var point = document.createElement("li");
      point.textContent = entry.responsibilities[i];
      impactList.appendChild(point);
    }

    focus.textContent = "Platform Focus: " + entry.focus.join(" | ");

    article.appendChild(header);
    article.appendChild(role);
    article.appendChild(impactList);
    article.appendChild(focus);
    return article;
  }

  function renderResumeViewer() {
    resumeExperienceList.innerHTML = "";

    for (var i = 0; i < CAREER_TIMELINE_ENTRIES.length; i += 1) {
      resumeExperienceList.appendChild(
        createResumeExperienceEntry(CAREER_TIMELINE_ENTRIES[i])
      );
    }
  }

  function openResumeWindow() {
    renderResumeViewer();
    openChadWindow(resumeWindow);
  }

  function closeResumeWindow() {
    closeChadWindow(resumeWindow);
    focusLauncherForWindow(resumeWindow);
  }

  function openSkillsWindow() {
    openChadWindow(skillsWindow);
  }

  function closeSkillsWindow() {
    closeChadWindow(skillsWindow);
    focusLauncherForWindow(skillsWindow);
  }

  function bindResumeViewerInteractions() {
    resumeDownloadButton.addEventListener("click", function () {
      window.print();
    });

    resumeWindow.addEventListener("mousedown", function () {
      if (resumeWindow.classList.contains("open")) {
        bringWindowToFront(resumeWindow);
      }
    });

    renderResumeViewer();
  }

  function createCareerListSection(label, values, className) {
    var section = document.createElement("section");
    var heading = document.createElement("p");
    var list = document.createElement("ul");

    section.className = className || "career-entry-section";
    heading.className = "career-entry-label";
    heading.textContent = label + ":";

    for (var i = 0; i < values.length; i += 1) {
      var item = document.createElement("li");
      item.textContent = values[i];
      list.appendChild(item);
    }

    section.appendChild(heading);
    section.appendChild(list);
    return section;
  }

  function createCareerSummarySection() {
    var summary = document.createElement("section");
    var title = document.createElement("h3");
    var description = document.createElement("p");
    var specialtyTitle = document.createElement("p");
    var specialtyList = document.createElement("ul");

    summary.className = "career-summary";
    title.className = "career-summary-title";
    title.textContent = CAREER_SUMMARY.title;

    description.className = "career-summary-description";
    description.textContent = CAREER_SUMMARY.description.join(" ");

    specialtyTitle.className = "career-summary-specialty-title";
    specialtyTitle.textContent = "Specialties";

    for (var i = 0; i < CAREER_SUMMARY.specialties.length; i += 1) {
      var item = document.createElement("li");
      item.textContent = CAREER_SUMMARY.specialties[i];
      specialtyList.appendChild(item);
    }

    summary.appendChild(title);
    summary.appendChild(description);
    summary.appendChild(specialtyTitle);
    summary.appendChild(specialtyList);
    return summary;
  }

  function careerEntryMatchesFilter(entry, query) {
    if (!query) {
      return true;
    }

    var searchable = [
      entry.period,
      entry.company,
      entry.role,
      entry.responsibilities.join(" "),
      entry.focus.join(" "),
      entry.contributions.join(" "),
      entry.platforms.join(" ")
    ].join(" ").toLowerCase();

    return searchable.indexOf(query) !== -1;
  }

  function toggleCareerEntry(entryId) {
    state.careerLogExpanded[entryId] = !state.careerLogExpanded[entryId];
    renderCareerLog();
  }

  function renderCareerLog() {
    var query = state.careerLogFilter.trim().toLowerCase();
    var container = document.createElement("div");
    var hasEntries = false;

    container.className = "career-log-container";
    careerLogContent.innerHTML = "";
    container.appendChild(createCareerSummarySection());

    for (var i = 0; i < CAREER_TIMELINE_ENTRIES.length; i += 1) {
      var entry = CAREER_TIMELINE_ENTRIES[i];

      if (!careerEntryMatchesFilter(entry, query)) {
        continue;
      }

      hasEntries = true;
      var expanded = !!state.careerLogExpanded[entry.id];
      var article = document.createElement("article");
      var header = document.createElement("div");
      var period = document.createElement("span");
      var company = document.createElement("span");
      var role = document.createElement("p");
      var detailBlock = document.createElement("div");
      var platformLabel = document.createElement("p");

      article.className = "career-entry" + (expanded ? " is-expanded" : "");
      article.setAttribute("data-entry-id", entry.id);
      article.setAttribute("role", "button");
      article.setAttribute("tabindex", "0");
      article.setAttribute("aria-expanded", expanded ? "true" : "false");

      header.className = "career-entry-header";
      period.className = "career-entry-period";
      period.textContent = entry.period;
      company.className = "career-entry-company";
      company.textContent = entry.company;
      header.appendChild(period);
      header.appendChild(company);

      role.className = "career-entry-role";
      role.textContent = entry.role;

      article.appendChild(header);
      article.appendChild(role);
      article.appendChild(createCareerListSection("Impact", entry.responsibilities, "career-entry-section"));
      article.appendChild(createCareerListSection("Platform Focus", entry.focus, "career-entry-section"));
      article.appendChild(createCareerListSection("Platforms", entry.platforms, "career-entry-section"));

      detailBlock.className = "career-entry-extra";
      detailBlock.appendChild(createCareerListSection("Key Contributions", entry.contributions, "career-entry-section"));
      platformLabel.className = "career-entry-platforms";
      platformLabel.textContent = "Click entry to collapse or expand contribution details.";
      detailBlock.appendChild(platformLabel);
      article.appendChild(detailBlock);

      (function (entryId) {
        article.addEventListener("click", function () {
          toggleCareerEntry(entryId);
        });

        article.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleCareerEntry(entryId);
          }
        });
      })(entry.id);

      container.appendChild(article);
    }

    if (!hasEntries) {
      var empty = document.createElement("div");
      empty.className = "career-log-empty";
      empty.textContent = "No career entries match the current filter.";
      container.appendChild(empty);
    }

    careerLogContent.appendChild(container);
  }

  function openCareerLogWindow() {
    careerLogFilterInput.value = state.careerLogFilter;
    renderCareerLog();
    openChadWindow(careerLogWindow);
    careerLogFilterInput.focus();
  }

  function bindCareerLogInteractions() {
    var titleElement = careerLogWindow.querySelector(".window-title");

    if (titleElement) {
      titleElement.textContent = "career.log — less";
    }

    careerLogFilterInput.placeholder = "filter timeline (company, cmdb, discovery, infrastructure...)";

    careerLogFilterInput.addEventListener("input", function (event) {
      state.careerLogFilter = event.target.value || "";
      renderCareerLog();
    });

    careerLogClearButton.addEventListener("click", function () {
      state.careerLogFilter = "";
      careerLogFilterInput.value = "";
      renderCareerLog();
      careerLogFilterInput.focus();
    });

    careerLogWindow.addEventListener("mousedown", function () {
      if (careerLogWindow.classList.contains("open")) {
        bringWindowToFront(careerLogWindow);
      }
    });

    renderCareerLog();
  }

  function renderSystemsMapLayer(layerName) {
    var nextLayer = SYSTEMS_MAP_LAYERS[layerName] ? layerName : "core";
    var layerData = SYSTEMS_MAP_LAYERS[nextLayer];
    var lines = [];

    state.systemsMapLayer = nextLayer;

    if (nextLayer === "core") {
      lines.push("Core");
      lines.push("");
      lines.push(SYSTEMS_MAP_CORE_ASCII);
      lines.push("");
      lines.push("\"Every system should make the next engineer's job easier.\"");
    } else {
      lines.push(layerData.label);
      lines.push("");

      for (var i = 0; i < layerData.bullets.length; i += 1) {
        lines.push("- " + layerData.bullets[i]);
      }
    }

    lines.push("");
    lines.push("Hint: type `map --deep` in the Terminal.");
    systemsMapContent.textContent = lines.join("\n");
    systemsMapContent.scrollTop = 0;
    systemsMapContent.scrollLeft = 0;

    for (var j = 0; j < systemsMapLayerButtons.length; j += 1) {
      systemsMapLayerButtons[j].classList.toggle(
        "is-active",
        systemsMapLayerButtons[j].getAttribute("data-layer") === nextLayer
      );
    }
  }

  function openSystemsMapWindow() {
    renderSystemsMapLayer(state.systemsMapLayer);
    openChadWindow(systemsMapWindow);
  }

  function bindSystemsMapInteractions() {
    for (var i = 0; i < systemsMapLayerButtons.length; i += 1) {
      systemsMapLayerButtons[i].addEventListener("click", function (event) {
        var layerName = event.currentTarget.getAttribute("data-layer");
        renderSystemsMapLayer(layerName);
      });
    }

    systemsMapWindow.addEventListener("mousedown", function () {
      if (systemsMapWindow.classList.contains("open")) {
        bringWindowToFront(systemsMapWindow);
      }
    });

    renderSystemsMapLayer(state.systemsMapLayer);
  }

  function makeWindowDraggable(windowElement) {
    if (!windowElement || windowElement.dataset.draggableBound === "true") {
      return;
    }

    var titlebar = windowElement.querySelector(".window-titlebar");

    if (!titlebar) {
      return;
    }

    function onMouseDown(event) {
      if (event.button !== 0 || event.target.closest(".window-control")) {
        return;
      }

      if (!windowElement.classList.contains("open")) {
        return;
      }

      bringWindowToFront(windowElement);

      var rect = windowElement.getBoundingClientRect();
      var desktopRect = desktopWindows.getBoundingClientRect();
      stopWindowDrag();
      activeDrag = {
        windowElement: windowElement,
        desktopLeft: desktopRect.left,
        desktopTop: desktopRect.top,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top
      };

      windowElement.classList.add("dragging");
      document.addEventListener("mousemove", onWindowDragMouseMove);
      document.addEventListener("mouseup", onWindowDragMouseUp);
      event.preventDefault();
    }

    titlebar.addEventListener("mousedown", onMouseDown);
    titlebar.addEventListener("dblclick", function (event) {
      if (event.target.closest(".window-control")) {
        return;
      }

      recenterWindow(windowElement);
    });
    windowElement.dataset.draggableBound = "true";
  }

  function setSelectedLauncherButton(nextButton) {
    for (var i = 0; i < launcherButtons.length; i += 1) {
      launcherButtons[i].classList.toggle("selected", launcherButtons[i] === nextButton);
    }
  }

  function handleWindowControl(action, windowElement) {
    if (action === "close") {
      if (windowElement === terminalWindow) {
        closeTerminalWindow();
        return;
      }

      if (windowElement === hireChadWindow) {
        closeHireChadWindow();
        return;
      }

      if (windowElement === automationLabWindow) {
        closeAutomationLabWindow();
        return;
      }

      if (windowElement === proofOfWorkWindow) {
        closeProofOfWorkWindow();
        return;
      }

      if (windowElement === resumeWindow) {
        closeResumeWindow();
        return;
      }

      if (windowElement === skillsWindow) {
        closeSkillsWindow();
        return;
      }

      closeChadWindow(windowElement);
      focusLauncherForWindow(windowElement);
      return;
    }

    showDesktopPopup("Coming soon.");
  }

  function showDesktopPopup(message) {
    desktopPopup.textContent = message;
    desktopPopup.classList.add("visible");
    desktopPopup.setAttribute("aria-hidden", "false");

    if (desktopPopupTimer) {
      window.clearTimeout(desktopPopupTimer);
    }

    desktopPopupTimer = window.setTimeout(function () {
      desktopPopup.classList.remove("visible");
      desktopPopup.setAttribute("aria-hidden", "true");
      desktopPopupTimer = null;
    }, 1400);
  }

  function getNotificationTimestamp() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function getNotificationOffset() {
    if (window.matchMedia("(max-width: 520px)").matches) {
      return 14;
    }

    if (window.matchMedia("(max-width: 640px)").matches) {
      return 12;
    }

    return 10;
  }

  function positionNotifications() {
    var desktopRect = desktop.getBoundingClientRect();
    var pipRect = pipVideo.getBoundingClientRect();
    var computedTop = Math.round((pipRect.bottom - desktopRect.top) + getNotificationOffset());

    notifications.style.top = Math.max(8, computedTop) + "px";
  }

  function dismissNotification(notificationElement) {
    if (!notificationElement || notificationElement.dataset.dismissing === "true") {
      return;
    }

    if (notificationElement.__autoDismissTimer) {
      window.clearTimeout(notificationElement.__autoDismissTimer);
      notificationElement.__autoDismissTimer = null;
    }

    notificationElement.dataset.dismissing = "true";
    notificationElement.classList.remove("is-visible");
    notificationElement.classList.add("is-dismissing");
    var onDismiss = typeof notificationElement.__onDismiss === "function"
      ? notificationElement.__onDismiss
      : null;
    notificationElement.__onDismiss = null;

    window.setTimeout(function () {
      if (notificationElement.parentNode === notifications) {
        notifications.removeChild(notificationElement);
      }

      if (onDismiss) {
        onDismiss();
      }
    }, NOTIFICATION_EXIT_MS);
  }

  function showNotification(config) {
    if (!config) {
      return;
    }

    notificationSequence += 1;
    positionNotifications();

    var notification = document.createElement("article");
    notification.className = "chados-notification";
    notification.setAttribute("role", "status");
    notification.setAttribute("aria-live", "polite");
    notification.setAttribute("aria-atomic", "true");
    notification.setAttribute("data-notification-id", String(notificationSequence));

    var heading = document.createElement("div");
    heading.className = "notification-head";

    if (config.icon) {
      var icon = document.createElement("span");
      icon.className = "notification-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = config.icon;
      heading.appendChild(icon);
    }

    var title = document.createElement("p");
    title.className = "notification-title";
    title.textContent = config.title || "System";
    heading.appendChild(title);

    var timestamp = document.createElement("span");
    timestamp.className = "notification-time";
    timestamp.textContent = getNotificationTimestamp();
    heading.appendChild(timestamp);

    var message = document.createElement("p");
    message.className = "notification-message";
    message.textContent = config.message || "";

    notification.appendChild(heading);
    notification.appendChild(message);
    notification.addEventListener("click", function () {
      dismissNotification(notification);
    });
    notification.__onDismiss = typeof config.onDismiss === "function"
      ? config.onDismiss
      : null;

    notifications.appendChild(notification);
    window.requestAnimationFrame(function () {
      notification.classList.add("is-visible");
    });

    notification.__autoDismissTimer = window.setTimeout(function () {
      dismissNotification(notification);
    }, NOTIFICATION_LIFE_MS);
  }

  function getRecruiterContextTagFromWindow(windowElement) {
    if (windowElement === systemsMapWindow) {
      return "mind-map";
    }

    if (windowElement === automationLabWindow) {
      return "automation-lab";
    }

    if (windowElement === careerLogWindow) {
      return "career-log";
    }

    if (windowElement === hireChadWindow) {
      return "hire-chad";
    }

    if (windowElement === terminalWindow) {
      return "terminal";
    }

    if (windowElement === proofOfWorkWindow) {
      return "proof-of-work";
    }

    if (windowElement === resumeWindow) {
      return "resume";
    }

    if (windowElement === skillsWindow) {
      return "skills";
    }

    return "general";
  }

  function getRecruiterContextTag() {
    var activeWindow = desktopWindows.querySelector(".chados-window.open.is-active");

    if (activeWindow) {
      return getRecruiterContextTagFromWindow(activeWindow);
    }

    var trackedWindows = [
      systemsMapWindow,
      automationLabWindow,
      careerLogWindow,
      hireChadWindow,
      proofOfWorkWindow,
      resumeWindow,
      skillsWindow,
      terminalWindow
    ];

    for (var i = 0; i < trackedWindows.length; i += 1) {
      if (trackedWindows[i].classList.contains("open")) {
        return getRecruiterContextTagFromWindow(trackedWindows[i]);
      }
    }

    return "general";
  }

  function getRecruiterTemplateWeight(template, contextTag) {
    if (!template.tags || !template.tags.length) {
      return 1;
    }

    if (template.tags.indexOf(contextTag) !== -1) {
      return 3;
    }

    if (contextTag === "general" && template.tags.indexOf("general") !== -1) {
      return 2;
    }

    return 1;
  }

  function chooseRecruiterActivityTemplate() {
    var contextTag = getRecruiterContextTag();
    var candidates = [];

    for (var i = 0; i < RECRUITER_ACTIVITY_TEMPLATES.length; i += 1) {
      var template = RECRUITER_ACTIVITY_TEMPLATES[i];

      if (
        RECRUITER_ACTIVITY_TEMPLATES.length > 1 &&
        template.key === state.lastRecruiterActivityKey
      ) {
        continue;
      }

      candidates.push({
        template: template,
        weight: getRecruiterTemplateWeight(template, contextTag)
      });
    }

    if (!candidates.length) {
      for (var j = 0; j < RECRUITER_ACTIVITY_TEMPLATES.length; j += 1) {
        candidates.push({
          template: RECRUITER_ACTIVITY_TEMPLATES[j],
          weight: getRecruiterTemplateWeight(RECRUITER_ACTIVITY_TEMPLATES[j], contextTag)
        });
      }
    }

    var totalWeight = 0;
    for (var k = 0; k < candidates.length; k += 1) {
      totalWeight += candidates[k].weight;
    }

    var pick = Math.random() * totalWeight;
    var running = 0;

    for (var m = 0; m < candidates.length; m += 1) {
      running += candidates[m].weight;
      if (pick <= running) {
        return candidates[m].template;
      }
    }

    return candidates[candidates.length - 1].template;
  }

  function buildRecruiterActivityNotification() {
    var template = chooseRecruiterActivityTemplate();
    var message = typeof template.message === "function"
      ? template.message()
      : template.message;

    state.lastRecruiterActivityKey = template.key;

    return {
      title: RECRUITER_ACTIVITY_TITLE,
      message: message
    };
  }

  function getNextRecruiterActivityDelay() {
    return randomInt(RECRUITER_ACTIVITY_MIN_DELAY_MS, RECRUITER_ACTIVITY_MAX_DELAY_MS);
  }

  function scheduleNextRecruiterActivityNotification() {
    if (!state.recruiterActivityStarted) {
      return;
    }

    if (recruiterActivityTimer) {
      window.clearTimeout(recruiterActivityTimer);
    }

    recruiterActivityTimer = window.setTimeout(function () {
      recruiterActivityTimer = null;

      if (!state.recruiterActivityStarted) {
        return;
      }

      var notificationConfig = buildRecruiterActivityNotification();
      notificationConfig.onDismiss = scheduleNextRecruiterActivityNotification;
      showNotification(notificationConfig);
    }, getNextRecruiterActivityDelay());
  }

  function startRecruiterActivityNotifications() {
    if (state.recruiterActivityStarted) {
      return;
    }

    state.recruiterActivityStarted = true;
    scheduleNextRecruiterActivityNotification();
  }

  function scheduleDesktopNotifications() {
    if (state.notificationsScheduled) {
      return;
    }

    state.notificationsScheduled = true;
    positionNotifications();

    for (var i = 0; i < INITIAL_NOTIFICATIONS.length; i += 1) {
      (function (notificationConfig) {
        var timer = window.setTimeout(function () {
          showNotification(notificationConfig);
        }, notificationConfig.delay);

        notificationScheduleTimers.push(timer);
      })(INITIAL_NOTIFICATIONS[i]);
    }
  }

  function bindWindowSystem() {
    var windows = desktopWindows.querySelectorAll(".chados-window");

    for (var i = 0; i < windows.length; i += 1) {
      makeWindowDraggable(windows[i]);
    }

    desktopWindows.addEventListener("mousedown", function (event) {
      var focusedWindow = event.target.closest(".chados-window");

      if (focusedWindow && focusedWindow.classList.contains("open")) {
        bringWindowToFront(focusedWindow);
      }
    });

    desktopWindows.addEventListener("click", function (event) {
      var controlButton = event.target.closest("[data-window-action]");

      if (!controlButton) {
        return;
      }

      var windowElement = controlButton.closest(".chados-window");

      if (!windowElement) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      handleWindowControl(controlButton.getAttribute("data-window-action"), windowElement);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }

      if (state.onboardingVisible) {
        event.preventDefault();
        closeOnboardingOverlay(true);
        return;
      }

      var activeWindow = desktopWindows.querySelector(".chados-window.open.is-active");

      if (!activeWindow) {
        return;
      }

      event.preventDefault();

      if (activeWindow === terminalWindow) {
        closeTerminalWindow();
        return;
      }

      if (activeWindow === hireChadWindow) {
        closeHireChadWindow();
        return;
      }

      if (activeWindow === automationLabWindow) {
        closeAutomationLabWindow();
        return;
      }

      if (activeWindow === proofOfWorkWindow) {
        closeProofOfWorkWindow();
        return;
      }

      if (activeWindow === resumeWindow) {
        closeResumeWindow();
        return;
      }

      if (activeWindow === skillsWindow) {
        closeSkillsWindow();
        return;
      }

      closeChadWindow(activeWindow);
      focusLauncherForWindow(activeWindow);
    });
  }

  function bindDesktopInteractions() {
    for (var i = 0; i < launcherButtons.length; i += 1) {
      (function (button) {
        button.addEventListener("click", function () {
          setSelectedLauncherButton(button);

          if (button.id === "terminal-launcher") {
            openTerminalWindow();
            return;
          }

          if (button.id === "hire-chad-launcher") {
            openHireChadWindow();
            return;
          }

          if (button.id === "systems-map-launcher") {
            openSystemsMapWindow();
            return;
          }

          if (button.id === "automation-lab-launcher") {
            openAutomationLabWindow();
            return;
          }

          if (button.id === "career-log-launcher") {
            openCareerLogWindow();
            return;
          }

          if (button.id === "proof-of-work-launcher") {
            openProofOfWorkWindow();
            return;
          }

          if (button.id === "resume-launcher") {
            openResumeWindow();
            return;
          }

          if (button.id === "skills-launcher") {
            openSkillsWindow();
            return;
          }

          showDesktopPopup("Open with terminal?");
        });
      })(launcherButtons[i]);
    }

    desktop.addEventListener("click", function (event) {
      if (event.target === desktop) {
        setSelectedLauncherButton(null);
        setWindowFocused(null);
      }
    });

    bindWindowSystem();
    bindOnboardingOverlay();
    bindSystemsMapInteractions();
    bindCareerLogInteractions();
    bindResumeViewerInteractions();
    positionNotifications();
    window.addEventListener("resize", positionNotifications);
  }

  function renderSystemMonitor() {
    var jobStates = ["active", "running", "queued", "active"];
    var clusterStates = ["nominal", "stable", "nominal", "healthy"];
    var containers = randomInt(6, 11);
    var agents = randomInt(2, 5);

    systemMonitorStats.textContent =
      "Containers: " + containers + " running\n" +
      "Automation jobs: " + jobStates[randomInt(0, jobStates.length - 1)] + "\n" +
      "Cluster health: " + clusterStates[randomInt(0, clusterStates.length - 1)] + "\n" +
      "AI agents: " + agents + " online";
  }

  function startSystemMonitor() {
    renderSystemMonitor();

    if (systemMonitorInterval) {
      window.clearInterval(systemMonitorInterval);
    }

    systemMonitorInterval = window.setInterval(renderSystemMonitor, 6000);
  }

  function initializeTerminalSession() {
    restoreHistory();
    renderPrompt();

    print("Workshop ready.");
    print("Type 'help' to explore.");

    form.addEventListener("submit", onSubmit);
    input.addEventListener("keydown", onKeyDown);

    terminal.addEventListener("click", function () {
      bringWindowToFront(terminalWindow);
      input.focus();
    });

    input.focus();
    scrollToBottom();
  }

  async function runBootExperience() {
    restoreTheme();

    setActiveBootScreen(biosScreen);
    await runBiosChecks();

    setActiveBootScreen(kernelScreen);
    await runKernelBootLogs();
    await sleep(KERNEL_POST_DELAY_MS);

    setActiveBootScreen(asciiScreen);
    showAsciiBanner();
    await sleep(ASCII_HOLD_MS);

    activateDesktop();
    bindDesktopInteractions();
    startSystemMonitor();

    bootSequence.style.transitionDuration = DESKTOP_TRANSITION_MS + "ms";
    bootSequence.classList.add("hidden");
    await sleep(DESKTOP_TRANSITION_MS);
    bootSequence.setAttribute("aria-hidden", "true");

    scheduleDesktopNotifications();
    startRecruiterActivityNotifications();
    if (!maybeShowOnboardingOverlay()) {
      terminalLauncher.focus();
    }
  }

  runBootExperience();
})();
