(function () {
  var bootSequence = document.getElementById("boot-sequence");
  var biosScreen = document.getElementById("bios-screen");
  var kernelScreen = document.getElementById("kernel-screen");
  var asciiScreen = document.getElementById("ascii-screen");
  var kernelLog = document.getElementById("kernel-log");
  var asciiBanner = document.getElementById("ascii-banner");

  var desktop = document.getElementById("desktop");
  var terminalWindow = document.getElementById("terminal-window");
  var terminal = document.getElementById("terminal");
  var output = document.getElementById("output");
  var form = document.getElementById("command-form");
  var input = document.getElementById("command-input");
  var promptLabel = document.querySelector(".prompt");

  if (
    !bootSequence ||
    !biosScreen ||
    !kernelScreen ||
    !asciiScreen ||
    !kernelLog ||
    !asciiBanner ||
    !desktop ||
    !terminalWindow ||
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
  var KERNEL_LINE_DELAY_MS = 180;
  var KERNEL_POST_DELAY_MS = 1200;
  var ASCII_HOLD_MS = 1500;
  var DESKTOP_TRANSITION_MS = 500;

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

  var state = {
    history: [],
    historyIndex: 0,
    theme: "dark",
    promptTimestampEnabled: false
  };

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

    terminalWindow.classList.remove("launched");
    window.requestAnimationFrame(function () {
      terminalWindow.classList.add("launched");
    });
  }

  function initializeTerminalSession() {
    restoreTheme();
    restoreHistory();
    renderPrompt();

    print("Workshop ready.");
    print("Type 'help' to explore.");

    form.addEventListener("submit", onSubmit);
    input.addEventListener("keydown", onKeyDown);

    terminal.addEventListener("click", function () {
      input.focus();
    });

    input.focus();
    scrollToBottom();
  }

  async function runBootExperience() {
    setActiveBootScreen(biosScreen);
    await sleep(BIOS_DURATION_MS);

    setActiveBootScreen(kernelScreen);
    await runKernelBootLogs();
    await sleep(KERNEL_POST_DELAY_MS);

    setActiveBootScreen(asciiScreen);
    showAsciiBanner();
    await sleep(ASCII_HOLD_MS);

    activateDesktop();
    initializeTerminalSession();

    bootSequence.style.transitionDuration = DESKTOP_TRANSITION_MS + "ms";
    bootSequence.classList.add("hidden");
    await sleep(DESKTOP_TRANSITION_MS);
    bootSequence.setAttribute("aria-hidden", "true");
  }

  runBootExperience();
})();
