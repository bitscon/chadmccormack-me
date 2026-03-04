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
  var systemsMapLauncher = document.getElementById("systems-map-launcher");
  var careerLogLauncher = document.getElementById("career-log-launcher");
  var desktopPopup = document.getElementById("desktop-popup");
  var systemMonitorStats = document.getElementById("system-monitor-stats");
  var launcherButtons = document.querySelectorAll("#desktop-launcher .launcher-button");
  var terminalWindow = document.getElementById("terminal-window");
  var systemsMapWindow = document.getElementById("systems-map-window");
  var careerLogWindow = document.getElementById("career-log-window");
  var systemsMapContent = document.getElementById("systems-map-content");
  var systemsMapLayerButtons = document.querySelectorAll("#systems-map-window .systems-map-layer");
  var careerLogFilterInput = document.getElementById("career-log-filter");
  var careerLogClearButton = document.getElementById("career-log-clear");
  var careerLogContent = document.getElementById("career-log-content");
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
    !systemsMapLauncher ||
    !careerLogLauncher ||
    !desktopPopup ||
    !systemMonitorStats ||
    !launcherButtons.length ||
    !terminalWindow ||
    !systemsMapWindow ||
    !careerLogWindow ||
    !systemsMapContent ||
    !systemsMapLayerButtons.length ||
    !careerLogFilterInput ||
    !careerLogClearButton ||
    !careerLogContent ||
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
  var CAREER_LOG_LIVE_MS = 6000;
  var CAREER_LOG_MAX_LINES = 120;

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

  var SYSTEMS_MAP_LAYERS = {
    core: {
      label: "Core",
      bullets: [
        "Service boundaries are explicit so teams can move independently.",
        "Automation and infrastructure decisions are measured by operator clarity.",
        "Observability closes the loop between change, behavior, and follow-up.",
        "Design choices optimize for the next engineer inheriting the system."
      ]
    },
    interfaces: {
      label: "Interfaces",
      bullets: [
        "Predictable contracts between teams, tools, and environments.",
        "Operational UX is treated as part of platform architecture.",
        "Self-service entry points mirror real delivery workflows.",
        "Incident feedback is folded into interface revisions quickly."
      ]
    },
    automation: {
      label: "Automation",
      bullets: [
        "CI templates as paved roads.",
        "Event-driven ops for routine tasks.",
        "Self-documenting runbooks.",
        "Idempotent workflows with safe retries."
      ]
    },
    infrastructure: {
      label: "Infrastructure",
      bullets: [
        "Immutable patterns for safe rollbacks.",
        "Segmentation, least privilege.",
        "Pragmatic reliability aligned to service criticality.",
        "Capacity and cost visibility built into platform defaults."
      ]
    },
    governance: {
      label: "Governance",
      bullets: [
        "Change control that does not slow teams.",
        "Guardrails over gates.",
        "Auditability with clear ownership.",
        "Policy encoded close to delivery paths."
      ]
    }
  };

  var CAREER_LOG_SEED = [
    { stamp: "2023-11-03 08:14:09", level: "INFO", tag: "platform", message: "Mapped delivery pain points and documented recurring deployment friction patterns." },
    { stamp: "2023-11-18 10:42:17", level: "OK", tag: "automation", message: "Converted manual release checklist into repeatable CI pipeline stages." },
    { stamp: "2023-12-01 15:06:44", level: "INFO", tag: "sre", message: "Defined baseline service level indicators for critical internal workloads." },
    { stamp: "2023-12-12 19:22:30", level: "WARN", tag: "ops", message: "Detected noisy alert routing causing missed follow-up actions overnight." },
    { stamp: "2023-12-13 09:37:05", level: "OK", tag: "reliability", message: "Introduced alert grouping and ownership labels to cut response ambiguity." },
    { stamp: "2024-01-08 11:03:52", level: "INFO", tag: "cloud", message: "Standardized environment templates for faster and safer service onboarding." },
    { stamp: "2024-01-21 16:48:11", level: "OK", tag: "delivery", message: "Reduced deploy variance by enforcing shared pipeline conventions." },
    { stamp: "2024-02-07 07:55:24", level: "INFO", tag: "platform", message: "Published internal platform contracts to keep service boundaries explicit." },
    { stamp: "2024-02-19 13:42:29", level: "WARN", tag: "cloud", message: "Migration rehearsal exposed hidden dependency on legacy network pathing." },
    { stamp: "2024-02-20 18:10:18", level: "OK", tag: "cloud", message: "Reworked network segmentation plan with rollback checkpoints and drills." },
    { stamp: "2024-03-04 09:23:50", level: "INFO", tag: "automation", message: "Created event-driven handlers for repeatable operational maintenance tasks." },
    { stamp: "2024-03-15 12:47:33", level: "OK", tag: "ops", message: "Self-healing routines removed recurring ticket queue for low-risk incidents." },
    { stamp: "2024-04-02 08:19:07", level: "INFO", tag: "leadership", message: "Facilitated architecture review sessions focused on operational clarity." },
    { stamp: "2024-04-11 14:38:56", level: "OK", tag: "delivery", message: "Cut lead time by shipping reusable release templates to multiple teams." },
    { stamp: "2024-04-26 21:31:08", level: "WARN", tag: "sre", message: "Unexpected latency spike traced to unbounded background processing jobs." },
    { stamp: "2024-04-26 22:16:40", level: "OK", tag: "reliability", message: "Added workload guards and queue visibility to stabilize peak traffic windows." },
    { stamp: "2024-05-13 10:11:28", level: "INFO", tag: "platform", message: "Versioned platform modules to reduce drift between service environments." },
    { stamp: "2024-05-29 17:54:12", level: "OK", tag: "automation", message: "Automated runbook generation from pipeline metadata and change records." },
    { stamp: "2024-06-09 09:44:36", level: "INFO", tag: "ops", message: "Implemented post-incident timeline templates to improve learning quality." },
    { stamp: "2024-06-23 12:05:09", level: "OK", tag: "leadership", message: "Aligned engineering rituals around reliability goals and ownership handoffs." },
    { stamp: "2024-07-08 15:18:55", level: "INFO", tag: "cloud", message: "Shifted provisioning defaults toward immutable replacement patterns." },
    { stamp: "2024-07-16 20:41:03", level: "WARN", tag: "delivery", message: "Release freeze triggered after dependency mismatch in shared runtime layer." },
    { stamp: "2024-07-16 21:26:47", level: "OK", tag: "platform", message: "Introduced compatibility checks earlier in pipeline to prevent recurrence." },
    { stamp: "2024-08-05 08:33:14", level: "INFO", tag: "reliability", message: "Expanded synthetic checks to detect user-facing degradation before reports." },
    { stamp: "2024-08-19 13:09:28", level: "OK", tag: "sre", message: "Improved incident handoff quality with concise state snapshots and context." },
    { stamp: "2024-09-03 11:58:46", level: "INFO", tag: "automation", message: "Built reusable automation kit for routine operational workflows." },
    { stamp: "2024-09-14 16:40:57", level: "OK", tag: "delivery", message: "Deployment cadence increased while keeping rollback confidence high." },
    { stamp: "2024-10-01 07:36:51", level: "INFO", tag: "leadership", message: "Coached teams on designing guardrails that accelerate safe change." },
    { stamp: "2024-10-12 09:14:03", level: "OK", tag: "platform", message: "Standardized CI templates to reduce deployment variance across teams." },
    { stamp: "2024-10-28 18:22:49", level: "WARN", tag: "ops", message: "Detected delayed backup verification in one environment during audit prep." },
    { stamp: "2024-10-29 08:57:12", level: "OK", tag: "governance", message: "Added automated verification checkpoints and ownership escalation paths." },
    { stamp: "2024-11-11 10:05:44", level: "INFO", tag: "cloud", message: "Refined cost visibility dashboards for infrastructure decision reviews." },
    { stamp: "2024-12-03 14:31:18", level: "OK", tag: "reliability", message: "Reduced mean-time-to-recovery through clearer diagnostics and runbook cues." },
    { stamp: "2025-01-22 09:16:27", level: "INFO", tag: "automation", message: "Connected change events to automated evidence capture for audits." },
    { stamp: "2025-03-02 17:45:39", level: "OK", tag: "sre", message: "Production readiness checks now block risk without slowing normal delivery." },
    { stamp: "2025-05-14 08:24:50", level: "INFO", tag: "platform", message: "Expanded paved-road platform modules for new service launches." },
    { stamp: "2025-07-09 12:38:08", level: "OK", tag: "leadership", message: "Operational review process now links reliability outcomes to roadmap choices." },
    { stamp: "2025-10-17 11:11:42", level: "INFO", tag: "delivery", message: "Reduced repetitive release toil with policy-aware deployment automation." },
    { stamp: "2026-01-06 09:07:21", level: "OK", tag: "reliability", message: "Current platform posture: stable, observable, and resilient under change." },
    { stamp: "2026-02-18 16:19:55", level: "OK", tag: "leadership", message: "Ready to lead modern platform, automation, and reliability programs today." }
  ];

  var state = {
    history: [],
    historyIndex: 0,
    theme: "dark",
    promptTimestampEnabled: false,
    terminalInitialized: false,
    systemsMapLayer: "core",
    careerLogFilter: "",
    careerLogLines: CAREER_LOG_SEED.slice(),
    windowZ: 2000
  };
  var biosAnimationState = {
    lines: []
  };
  var systemMonitorInterval = null;
  var careerLogInterval = null;
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

  function runCommand(rawInput) {
    var parsed = parseInput(rawInput);
    var commands = window.TerminalCommands || {};

    if (!parsed) {
      return;
    }

    parsed.command = resolveCommandAlias(parsed.command);

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

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function getCurrentLogTimestamp() {
    var now = new Date();

    return (
      now.getFullYear() +
      "-" + pad2(now.getMonth() + 1) +
      "-" + pad2(now.getDate()) +
      " " + pad2(now.getHours()) +
      ":" + pad2(now.getMinutes()) +
      ":" + pad2(now.getSeconds())
    );
  }

  function formatCareerLogEntry(entry) {
    return (
      entry.stamp +
      " [" + entry.level + "]" +
      " [" + entry.tag + "] " +
      entry.message
    );
  }

  function renderCareerLog() {
    var query = state.careerLogFilter.trim().toLowerCase();
    var fragment = document.createDocumentFragment();
    var hasVisibleLines = false;

    careerLogContent.innerHTML = "";

    for (var i = 0; i < state.careerLogLines.length; i += 1) {
      var lineEntry = state.careerLogLines[i];
      var searchableText = (lineEntry.tag + " " + lineEntry.message).toLowerCase();

      if (query && searchableText.indexOf(query) === -1) {
        continue;
      }

      var line = document.createElement("div");
      line.className = "career-log-line level-" + lineEntry.level.toLowerCase();
      line.textContent = formatCareerLogEntry(lineEntry);
      fragment.appendChild(line);
      hasVisibleLines = true;
    }

    if (!hasVisibleLines) {
      var emptyLine = document.createElement("div");
      emptyLine.className = "career-log-line level-info";
      emptyLine.textContent = "No log lines match current filter.";
      fragment.appendChild(emptyLine);
    }

    careerLogContent.appendChild(fragment);
    careerLogContent.scrollTop = careerLogContent.scrollHeight;
  }

  function appendCareerLogLine(lineEntry) {
    state.careerLogLines.push(lineEntry);

    if (state.careerLogLines.length > CAREER_LOG_MAX_LINES) {
      state.careerLogLines.splice(0, state.careerLogLines.length - CAREER_LOG_MAX_LINES);
    }

    if (careerLogWindow.classList.contains("open")) {
      renderCareerLog();
    }
  }

  function appendCareerLogHeartbeat() {
    appendCareerLogLine({
      stamp: getCurrentLogTimestamp(),
      level: "INFO",
      tag: "workstation",
      message: "Recruiter is reading logs..."
    });
  }

  function openCareerLogWindow() {
    careerLogFilterInput.value = state.careerLogFilter;
    renderCareerLog();
    openChadWindow(careerLogWindow);
    careerLogFilterInput.focus();
  }

  function bindCareerLogInteractions() {
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

  function startCareerLogStream() {
    if (careerLogInterval) {
      window.clearInterval(careerLogInterval);
    }

    careerLogInterval = window.setInterval(appendCareerLogHeartbeat, CAREER_LOG_LIVE_MS);
  }

  function renderSystemsMapLayer(layerName) {
    var nextLayer = SYSTEMS_MAP_LAYERS[layerName] ? layerName : "core";
    var layerData = SYSTEMS_MAP_LAYERS[nextLayer];
    var lines = [
      "SYSTEMS MAP / " + layerData.label.toUpperCase(),
      "",
      "Users -> Interfaces -> Automation -> Infrastructure -> Observability -> Feedback loops",
      "",
      "  Users",
      "    |",
      "    v",
      "Interfaces -> Automation -> Infrastructure -> Observability",
      "                      ^                     |",
      "                      |---------------------|",
      "                         Feedback loops",
      "",
      layerData.label + " layer:"
    ];

    state.systemsMapLayer = nextLayer;

    for (var i = 0; i < layerData.bullets.length; i += 1) {
      lines.push("- " + layerData.bullets[i]);
    }

    lines.push("");
    lines.push("Hint: type `map --deep` in Terminal");
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

      closeChadWindow(windowElement);
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

      var activeWindow = desktopWindows.querySelector(".chados-window.open.is-active");

      if (!activeWindow) {
        return;
      }

      event.preventDefault();

      if (activeWindow === terminalWindow) {
        closeTerminalWindow();
        return;
      }

      closeChadWindow(activeWindow);

      if (activeWindow === careerLogWindow) {
        careerLogLauncher.focus();
      } else if (activeWindow === systemsMapWindow) {
        systemsMapLauncher.focus();
      }
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

          if (button.id === "systems-map-launcher") {
            openSystemsMapWindow();
            return;
          }

          if (button.id === "career-log-launcher") {
            openCareerLogWindow();
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
    bindSystemsMapInteractions();
    bindCareerLogInteractions();
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
    startCareerLogStream();

    bootSequence.style.transitionDuration = DESKTOP_TRANSITION_MS + "ms";
    bootSequence.classList.add("hidden");
    await sleep(DESKTOP_TRANSITION_MS);
    bootSequence.setAttribute("aria-hidden", "true");

    terminalLauncher.focus();
  }

  runBootExperience();
})();
