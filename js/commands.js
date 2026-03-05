(function () {
  var FILES = {
    "about.txt": "Profile content is markdown-driven.\nRun `hire`, `career`, or `architecture`.",
    "experience.txt": "Run `career` for timeline content from career-timeline.md.",
    "projects.txt": "Run `proof` for architecture-projects.md.",
    "thinking.txt": "Run `architecture` for cmdb-discovery-expertise.md.",
    "contact.txt": "email: chad@bitscon.net\nlinkedin: https://www.linkedin.com/in/chadmccormack/",
    "motto.txt": "\"I do what I cannot, to learn what I cannot do!\"",
    "resume.pdf": "Binary file detected.\nUse `resume` to open the PDF window.",
    "projects/billy-ai-runtime": "Automation runtime notes available in project docs.",
    "projects/automation-lab": "Use `automation` to open the Automation Lab window.",
    "projects/infrastructure-architectures": "Use `architecture` to load expertise content.",
    "projects/ai-assisted-workflows": "AI-assisted workflow notes are maintained outside the terminal."
  };

  var FILE_ORDER = [
    "about.txt",
    "experience.txt",
    "projects.txt",
    "thinking.txt",
    "contact.txt",
    "motto.txt",
    "automation-lab/",
    "resume.pdf"
  ];

  var THEMES = ["dark", "light", "matrix"];
  var OPEN_TARGETS = {
    linkedin: {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/chadmccormack/"
    },
    resume: {
      label: "Resume (PDF)",
      url: "/assets/chad-mccormack-resume.pdf"
    },
    email: {
      label: "Email",
      url: "mailto:chad@bitscon.net"
    }
  };
  var APP_LAUNCHERS = {
    automation: "automation-lab-launcher"
  };
  var MARKDOWN_FILE_BY_KEY = {
    proofOfWork: "architecture-projects.md",
    architecture: "cmdb-discovery-expertise.md",
    hireChad: "resume.md",
    demo: "enterprise-impact.md",
    interviewPrep: "interview-topics.md",
    career: "career-timeline.md"
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

  function openDesktopWindow(target) {
    var launcherId = APP_LAUNCHERS[target];
    var launcher = launcherId ? document.getElementById(launcherId) : null;

    if (!launcher || typeof launcher.click !== "function") {
      return text("unable to open '" + target + "' right now");
    }

    launcher.click();
    return null;
  }

  function getMarkdownProvider() {
    if (!window.PortfolioMarkdown || typeof window.PortfolioMarkdown !== "object") {
      return null;
    }

    return window.PortfolioMarkdown;
  }

  function getMarkdownFileName(key) {
    return MARKDOWN_FILE_BY_KEY[key] || (key + ".md");
  }

  function runMarkdownCommand(commandName, key) {
    var provider = getMarkdownProvider();
    var cachedHtml = null;

    if (provider && typeof provider.getRenderedMarkdown === "function") {
      cachedHtml = provider.getRenderedMarkdown(key);
    }

    if (cachedHtml) {
      return html(cachedHtml);
    }

    if (provider && typeof provider.prefetchMarkdown === "function") {
      provider.prefetchMarkdown(key);
    }

    return text(
      "Loading " + getMarkdownFileName(key) + "...\n" +
      "Run `" + commandName + "` again in a moment."
    );
  }

  window.TerminalCommands = {
    help: {
      run: function () {
        return text(
          "Available commands:\n\n" +
          "help         show command list\n" +
          "hire         view resume and contact info\n" +
          "proof        architecture case studies\n" +
          "architecture CMDB and Discovery expertise\n" +
          "impact       enterprise outcomes\n" +
          "career       experience timeline\n" +
          "interview    discussion topics\n\n" +
          "Aliases: demo, hire-chad, mindmap, projects, experience\n" +
          "Utilities: ls, cat <file>, open <linkedin|resume|email>, clear, theme, pwd, date"
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
          "Information Systems Engineer\n" +
          "ServiceNow CMDB • Discovery • CSDM"
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
          "Information Systems Engineer\n" +
          "ServiceNow CMDB • Discovery • CSDM"
        );
      }
    },

    open: {
      run: function (args) {
        var target = (args[0] || "").toLowerCase();

        if (!target) {
          return text("usage: open <linkedin|resume|email>");
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

    architecture: {
      run: function () {
        return runMarkdownCommand("architecture", "architecture");
      }
    },

    proof: {
      run: function () {
        return runMarkdownCommand("proof", "proofOfWork");
      }
    },

    hire: {
      run: function () {
        return runMarkdownCommand("hire", "hireChad");
      }
    },

    "hire-chad": {
      run: function () {
        return runMarkdownCommand("hire-chad", "hireChad");
      }
    },

    impact: {
      run: function () {
        return runMarkdownCommand("impact", "demo");
      }
    },

    demo: {
      run: function () {
        return runMarkdownCommand("demo", "demo");
      }
    },

    interview: {
      run: function () {
        return runMarkdownCommand("interview", "interviewPrep");
      }
    },

    career: {
      run: function () {
        return runMarkdownCommand("career", "career");
      }
    },

    mindmap: {
      run: function () {
        return runMarkdownCommand("mindmap", "architecture");
      }
    },

    map: {
      run: function () {
        return runMarkdownCommand("map", "architecture");
      }
    },

    projects: {
      run: function () {
        return runMarkdownCommand("projects", "proofOfWork");
      }
    },

    experience: {
      run: function () {
        return runMarkdownCommand("experience", "career");
      }
    },

    automation: {
      run: function () {
        return openDesktopWindow("automation");
      }
    },

    lab: {
      run: function () {
        return openDesktopWindow("automation");
      }
    },

    contact: {
      run: function () {
        return text(
          "Contact\n\n" +
          "Email: chad@bitscon.net\n" +
          "LinkedIn: https://www.linkedin.com/in/chadmccormack/\n" +
          "Website: chadmccormack.me"
        );
      }
    }
  };

  window.TerminalCommands["interview-prep"] = window.TerminalCommands.interview;
})();
