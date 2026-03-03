(function () {
  var FILES = {
    "about.txt": "Chad is a systems architect focused on resilient platforms, practical automation, and operational clarity.\n\nHe builds infrastructure that helps teams ship confidently and recover quickly.",
    "experience.txt": "Placeholder experience summary:\n- Systems architecture and platform design\n- Cloud infrastructure modernization\n- Reliability and operations leadership",
    "projects.txt": "Placeholder projects:\n1. Infrastructure Blueprint Engine\n2. Automated Environment Provisioning Toolkit\n3. Platform Observability Dashboard",
    "thinking.txt": "Chad's current thinking:\n- Keep systems understandable under stress\n- Automate repetitive work, not ownership\n- Design for graceful failure before scale",
    "contact.txt": "Email: chad@example.com\nLinkedIn: linkedin.com/in/chadmccormack\nGitHub: github.com/chadmccormack",
    "motto.txt": "\"I do what I cannot, to learn what I cannot do!\""
  };

  var FILE_ORDER = [
    "about.txt",
    "experience.txt",
    "projects.txt",
    "thinking.txt",
    "contact.txt",
    "motto.txt"
  ];

  var THEMES = ["dark", "light", "matrix"];

  function text(payload) {
    return {
      type: "text",
      payload: payload
    };
  }

  function getNextTheme(currentTheme) {
    var currentIndex = THEMES.indexOf(currentTheme);

    if (currentIndex === -1) {
      return THEMES[0];
    }

    return THEMES[(currentIndex + 1) % THEMES.length];
  }

  window.TerminalCommands = {
    help: {
      run: function () {
        return text(
          "Available commands:\n\n" +
            "help\n" +
            "ls\n" +
            "whoami\n" +
            "cat <file>\n" +
            "clear\n" +
            "theme"
        );
      }
    },

    ls: {
      run: function () {
        return text(FILE_ORDER.join("\n"));
      }
    },

    whoami: {
      run: function () {
        return text(
          "Chad McCormack\n" +
            "Systems Architect | Infrastructure Explorer | Automation Builder\n\n" +
            "\"I do what I cannot, to learn what I cannot do!\""
        );
      }
    },

    cat: {
      run: function (args) {
        var fileName = args[0];

        if (!fileName) {
          return text("usage: cat <file>");
        }

        if (!Object.prototype.hasOwnProperty.call(FILES, fileName)) {
          return text("cat: " + fileName + ": No such file");
        }

        return text(FILES[fileName]);
      }
    },

    clear: {
      run: function () {
        return {
          type: "clear"
        };
      }
    },

    theme: {
      run: function (args, ctx) {
        var requestedTheme = args[0];
        var nextTheme = "";

        if (!requestedTheme) {
          nextTheme = getNextTheme(ctx.getTheme());
          ctx.setTheme(nextTheme);
          return text("theme set to " + nextTheme);
        }

        requestedTheme = requestedTheme.toLowerCase();

        if (THEMES.indexOf(requestedTheme) === -1) {
          return text("theme: expected one of dark, light, matrix");
        }

        ctx.setTheme(requestedTheme);
        return text("theme set to " + requestedTheme);
      }
    }
  };
})();
