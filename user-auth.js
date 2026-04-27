(function () {
  const form = document.getElementById("user-auth-form");
  const statusNode = document.getElementById("auth-status");
  const submitButton = document.getElementById("auth-submit");
  const tabs = Array.from(document.querySelectorAll(".auth-tab"));
  const registerOnlyNodes = Array.from(document.querySelectorAll("[data-register-only]"));
  const fields = {
    displayName: document.getElementById("auth-display-name"),
    email: document.getElementById("auth-email"),
    password: document.getElementById("auth-password"),
    schoolName: document.getElementById("auth-school-name")
  };

  if (!form) {
    return;
  }

  let mode = new URLSearchParams(location.search).get("mode") === "register" ? "register" : "login";

  function setStatus(message, tone) {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message;
    statusNode.dataset.tone = tone || "neutral";
  }

  function setMode(nextMode) {
    mode = nextMode === "register" ? "register" : "login";

    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mode === mode);
    });

    registerOnlyNodes.forEach((node) => {
      node.style.display = mode === "register" ? "" : "none";
    });

    if (fields.displayName) {
      fields.displayName.required = mode === "register";
    }

    if (fields.password) {
      fields.password.autocomplete = mode === "register" ? "new-password" : "current-password";
    }

    submitButton.textContent = mode === "register" ? "注册并登录" : "登录";
    setStatus(
      mode === "register"
        ? "注册后会自动登录，并写入用户管理表。"
        : "请输入邮箱和密码登录；没有账号可以切换到注册。",
      "neutral"
    );
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setMode(tab.dataset.mode));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = mode === "register" ? "./api/auth/register" : "./api/auth/login";
    const payload = {
      email: fields.email.value.trim(),
      password: fields.password.value
    };

    if (mode === "register") {
      payload.displayName = fields.displayName.value.trim();
      payload.schoolName = fields.schoolName.value.trim();
    }

    submitButton.disabled = true;
    setStatus(mode === "register" ? "正在注册账号..." : "正在登录...", "neutral");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      setStatus("登录成功，正在进入我的学习...", "success");
      window.setTimeout(() => {
        location.href = "learning.html";
      }, 450);
    } catch (error) {
      setStatus(error.message, "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  setMode(mode);
})();
