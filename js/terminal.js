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
  var desktopPopup = document.getElementById("desktop-popup");
  var systemMonitorStats = document.getElementById("system-monitor-stats");
  var launcherButtons = document.querySelectorAll("#desktop-launcher .launcher-button");
  var terminalWindow = document.getElementById("terminal-window");
  var systemsMapWindow = document.getElementById("systems-map-window");
  var systemsMapContent = document.getElementById("systems-map-content");
  var systemsMapLayerButtons = document.querySelectorAll("#systems-map-window .systems-map-layer");
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
    !desktopPopup ||
    !systemMonitorStats ||
    !launcherButtons.length ||
    !terminalWindow ||
    !systemsMapWindow ||
    !systemsMapContent ||
    !systemsMapLayerButtons.length ||
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

  var state = {
    history: [],
    historyIndex: 0,
    theme: "dark",
    promptTimestampEnabled: false,
    terminalInitialized: false,
    systemsMapLayer: "core",
    windowZ: 2000
  };
  var biosAnimationState = {
    lines: []
  };
  var systemMonitorInterval = null;
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

      if (
        terminalWindow.classList.contains("open") &&
        terminalWindow.classList.contains("is-active")
      ) {
        event.preventDefault();
        closeTerminalWindow();
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

    terminalLauncher.focus();
  }

  runBootExperience();
})();
