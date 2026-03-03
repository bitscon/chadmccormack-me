(function () {
  var terminal = document.getElementById("terminal");
  var output = document.getElementById("output");
  var form = document.getElementById("command-form");
  var input = document.getElementById("command-input");
  var promptLabel = document.querySelector(".prompt");

  if (!terminal || !output || !form || !input || !promptLabel) {
    throw new Error("Missing required terminal elements.");
  }

  var THEME_KEY = "terminal-theme";
  var HISTORY_KEY = "terminal-history";
  var HISTORY_LIMIT = 200;
  var THEMES = ["dark", "light", "matrix"];
  var BASE_PROMPT = "chad@workshop:~$";
  var BOOT_LINES = [
    "Booting workshop environment...",
    "Loading system profile: Chad McCormack",
    "Initializing modules...",
    "✓ infrastructure",
    "✓ automation",
    "✓ systems architecture",
    "",
    "Workshop ready.",
    "Type 'help' to explore."
  ];

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

  function printBootSequence() {
    for (var i = 0; i < BOOT_LINES.length; i += 1) {
      print(BOOT_LINES[i]);
    }
  }

  function init() {
    restoreTheme();
    restoreHistory();
    renderPrompt();
    printBootSequence();

    form.addEventListener("submit", onSubmit);
    input.addEventListener("keydown", onKeyDown);

    terminal.addEventListener("click", function () {
      input.focus();
    });

    input.focus();
    scrollToBottom();
  }

  init();
})();
