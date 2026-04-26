(function () {
  const form = document.getElementById("admin-login-form");
  const passwordField = document.getElementById("admin-login-password");
  const statusNode = document.getElementById("admin-login-status");

  if (!form || !passwordField) {
    return;
  }

  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/admin.html";

  function setStatus(message, tone) {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message;
    statusNode.dataset.tone = tone || "neutral";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("正在验证后台密码...", "neutral");

    try {
      const response = await fetch("./api/admin/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json"
        },
        body: JSON.stringify({
          password: passwordField.value,
          next
        })
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      setStatus("登录成功，正在进入后台...", "success");
      location.href = result.redirectTo || "/admin.html";
    } catch (error) {
      console.error("Admin login failed:", error);
      setStatus(`登录失败：${error.message}`, "error");
    }
  });
})();
