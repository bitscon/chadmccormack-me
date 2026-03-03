(function () {
  var FILES = {
    "about.txt": "Chad McCormack is a systems architect and infrastructure automation engineer who builds resilient systems for high-trust delivery.\n\nFocus areas:\n- DevOps platform design\n- Platform reliability engineering\n- Automation that removes repetitive operational work\n\nHe partners with teams to ship faster with stronger operational confidence.",
    "experience.txt": "Experience highlights:\n- Designed platform architecture for multi-environment delivery\n- Built infrastructure-as-code workflows for repeatable provisioning\n- Improved reliability with observability, runbooks, and incident response patterns\n- Led automation efforts that reduced manual deployment toil",
    "projects.txt": "1. Billy - AI infrastructure foreman\n   Orchestrates AI-enabled infrastructure workflows and operational tasks for faster execution with guardrails.\n\n2. Homestead Architect - property planning platform\n   Planning system for land and property development that blends mapping, constraints, and staged execution guidance.\n\n3. AI News Pipeline - automated news aggregation + posting system\n   End-to-end pipeline that discovers, filters, summarizes, and publishes targeted updates with minimal human intervention.",
    "thinking.txt": "Current operating principles:\n- Design for graceful failure before scale\n- Prefer boring infrastructure with sharp automation\n- Keep systems observable, explainable, and operable under stress",
    "contact.txt": "email: chad@example.com\nlinkedin: https://linkedin.com/in/chad-placeholder\ngithub: https://github.com/chad-placeholder",
    "motto.txt": "\"I do what I cannot, to learn what I cannot do!\"",
    "resume.pdf": "Binary file detected.\nUse 'open resume' instead."
  };

  var FILE_ORDER = [
    "about.txt",
    "experience.txt",
    "projects.txt",
    "thinking.txt",
    "contact.txt",
    "motto.txt",
    "resume.pdf"
  ];

  var THEMES = ["dark", "light", "matrix"];
  var OPEN_TARGETS = {
    linkedin: {
      label: "LinkedIn",
      url: "https://linkedin.com/in/chad-placeholder"
    },
    github: {
      label: "GitHub",
      url: "https://github.com/chad-placeholder"
    },
    resume: {
      label: "Resume (PDF)",
      url: "/assets/chad-mccormack-resume.pdf"
    }
  };

  function text(payload) {
    return {
      type: "text",
      payload: payload
    };
  }

  function html(payload) {
    return {
      type: "html",
      payload: payload
    };
  }

  function clear() {
    return {
      type: "clear"
    };
  }

  function getNextTheme(currentTheme) {
    var currentIndex = THEMES.indexOf(currentTheme);

    if (currentIndex === -1) {
      return THEMES[0];
    }

    return THEMES[(currentIndex + 1) % THEMES.length];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
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
            "theme\n" +
            "pwd\n" +
            "date\n" +
            "banner\n" +
            "open\n" +
            "resume"
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
        return clear();
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
    },

    pwd: {
      run: function () {
        return text("/home/chad");
      }
    },

    date: {
      run: function () {
        return text(new Date().toString());
      }
    },

    banner: {
      run: function () {
        return text(
          "CHAD MCCORMACK\n" +
            "Systems Architect | Infrastructure Explorer | Automation Builder"
        );
      }
    },

    open: {
      run: function (args) {
        var target = (args[0] || "").toLowerCase();

        if (!target) {
          return text("usage: open <linkedin|github|resume>");
        }

        if (!Object.prototype.hasOwnProperty.call(OPEN_TARGETS, target)) {
          return text("open: unsupported target '" + target + "'");
        }

        var item = OPEN_TARGETS[target];

        return html(
          "Opening " + escapeHtml(item.label) + "...<br>" +
            "<a href=\"" + escapeHtml(item.url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
            escapeHtml(item.url) +
            "</a>"
        );
      }
    },

    resume: {
      run: function () {
        return html(
          "Downloading resume...<br>" +
            "<a href=\"/assets/chad-mccormack-resume.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">" +
            "/assets/chad-mccormack-resume.pdf" +
            "</a>"
        );
      }
    }
  };
})();
