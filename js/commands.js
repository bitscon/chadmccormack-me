(function () {
  var FILES = {
    "about.txt": "Chad McCormack is a ServiceNow CMDB / Discovery SME focused on enterprise infrastructure visibility and configuration data trust.\n\nFocus areas:\n- Improved CMDB trust through governance and ownership standards\n- Increased Discovery reliability across complex infrastructure estates\n- Better incident impact clarity through service visibility\n\nHe aligns platform engineering and operations around reliable ServiceNow data.",
    "experience.txt": "Experience highlights:\n- Improved CMDB data quality and reporting trust for enterprise stakeholders\n- Stabilized ServiceNow Discovery through MID Server topology, credential governance, and pattern standards\n- Strengthened CI relationship integrity to improve service visibility and change confidence\n- Standardized operational controls that reduced discovery rework and escalation noise\n\nEnterprise organizations:\nCapital One | <Company Name> | <Company Name>",
    "projects.txt": "1. CMDB Governance Operating Model\n   Improved data trust by defining CI ownership, reconciliation controls, and quality checkpoints.\n\n2. Discovery Reliability Program\n   Increased enterprise coverage with stable credential strategy, MID Server design, and pattern standards.\n\n3. Service Visibility Foundation\n   Strengthened CI relationships and service topology to improve incident impact analysis and change confidence.",
    "thinking.txt": "Operating principles:\n- Outcome-first architecture with measurable operational impact\n- Governance that improves delivery speed and audit confidence\n- Clear ownership, reconciliation standards, and data quality controls",
    "contact.txt": "email: <Email Address>\nlinkedin: <LinkedIn URL>\ngithub: <GitHub URL>",
    "motto.txt": "\"I do what I cannot, to learn what I cannot do!\"",
    "resume.pdf": "Binary file detected.\nUse 'open resume' instead.",
    "projects/billy-ai-runtime": "billy-ai-runtime:\nDistributed runtime that orchestrates AI-driven infra workflows with guardrails, observability, and recovery paths.",
    "projects/automation-lab": "automation-lab:\nHands-on infrastructure automation experiments across provisioning, orchestration, and self-healing operations.",
    "projects/infrastructure-architectures": "infrastructure-architectures:\nReference blueprints for scalable platform foundations, environment parity, and resilient system boundaries.",
    "projects/ai-assisted-workflows": "ai-assisted-workflows:\nPractical AI copilots and agents embedded in engineering delivery pipelines to reduce toil and increase velocity."
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
  var APP_LAUNCHERS = {
    career: "career-log-launcher",
    mindmap: "systems-map-launcher",
    proof: "proof-of-work-launcher",
    automation: "automation-lab-launcher"
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
            "resume\n" +
            "career\n" +
            "mindmap\n" +
            "proof\n" +
            "demo  - guided overview of Chad's architecture expertise\n" +
            "automation\n" +
            "contact\n" +
            "hire-chad\n" +
            "lab\n" +
            "map"
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
            "ServiceNow CMDB / Discovery SME\n\n" +
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
            "ServiceNow CMDB / Discovery SME"
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
        return text(
          "Chad McCormack\n" +
            "ServiceNow CMDB / Discovery SME\n\n" +
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
        );
      }
    },

    demo: {
      run: function () {
        return text(
          "Initializing architecture overview...\n\n" +
            "Chad McCormack\n" +
            "Information Systems Engineer\n" +
            "ServiceNow CMDB • Discovery • CSDM\n\n" +
            "Problem Chad Solves\n" +
            "-------------------\n" +
            "Enterprise CMDB data often becomes unreliable due to discovery failures,\n" +
            "credential issues, and inconsistent CI classification.\n\n" +
            "Approach\n" +
            "--------\n" +
            "• Design scalable ServiceNow Discovery architectures\n" +
            "• Align infrastructure models to CSDM\n" +
            "• Improve CMDB data trust and service visibility\n\n" +
            "Results\n" +
            "-------\n" +
            "• More reliable CMDB population\n" +
            "• Better service mapping accuracy\n" +
            "• Improved operational visibility\n\n" +
            "Next Commands\n" +
            "-------------\n" +
            "architecture   - view architecture example\n" +
            "hire-chad      - open hiring info\n" +
            "resume         - download resume"
        );
      }
    },

    career: {
      run: function () {
        return openDesktopWindow("career");
      }
    },

    mindmap: {
      run: function () {
        return openDesktopWindow("mindmap");
      }
    },

    proof: {
      run: function () {
        return openDesktopWindow("proof");
      }
    },

    automation: {
      run: function () {
        return openDesktopWindow("automation");
      }
    },

    contact: {
      run: function () {
        return text(
          "Contact\n\n" +
            "Email: <Email Address>\n" +
            "LinkedIn: <LinkedIn URL>\n" +
            "References: <Reference Name> (available upon request)."
        );
      }
    },

    "hire-chad": {
      run: function () {
        return text(
          "---\n\n" +
            "sudo hire-chad\n\n" +
            "Initializing candidate analysis...\n\n" +
            "✓ Enterprise CMDB architecture\n" +
            "✓ Discovery reliability\n" +
            "✓ CMDB governance and data quality\n" +
            "✓ Service visibility for operations\n\n" +
            "Result:\n\n" +
            "ServiceNow CMDB / Discovery SME who improves data trust and incident readiness.\n\n" +
            "Recommendation:\n\n" +
            "Hire Chad McCormack.\n" +
            "Email me to schedule a 15-minute intro."
        );
      }
    },

    lab: {
      run: function () {
        return text(
          "automation-lab/ — Automation Lab\n\n" +
            "discovery-health-checks\n" +
            "cmdb-quality-guardrails\n" +
            "credential-lifecycle-controls\n" +
            "service-visibility-reports\n\n" +
            "Type:\n\n" +
            "cat projects/automation-lab"
        );
      }
    },

    map: {
      run: function () {
        return text(
          "      Users\n" +
            "        │\n" +
            " ┌──────┴──────┐\n" +
            " │  Interfaces │\n" +
            " └──────┬──────┘\n" +
            "        │\n" +
            " ┌──────┴──────┐\n" +
            " │ Automation  │\n" +
            " └──────┬──────┘\n" +
            "        │\n" +
            " ┌──────┴──────┐\n" +
            " │Infrastructure│\n" +
            " └──────┬──────┘\n" +
            "        │\n" +
            "      Systems\n\n" +
            "\"Every system should make the next engineer's job easier.\""
        );
      }
    }
  };

  window.TerminalCommands.cv = window.TerminalCommands.resume;
  window.TerminalCommands.experience = window.TerminalCommands.career;
  window.TerminalCommands.architecture = window.TerminalCommands.mindmap;
  window.TerminalCommands.projects = window.TerminalCommands.proof;
})();
