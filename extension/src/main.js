chrome.runtime.onMessage.addListener(function (event, sender, sendResponse) {
  if (event.type === "authenticate") {
    let options = {
      scope: "openid email",
      device: "chrome-extension",
    };

    const auth = new OdinChrome(env.ODIN_ISSUER, env.ODIN_CLIENT_ID, {
      resource: env.ODIN_AUDIENCE,
    });
    
    auth
      .authenticate(options)
      .then(function (authResult) {
        console.log(authResult);
        localStorage.setItem("authResult", JSON.stringify(authResult));
        sendResponse({ success: true });
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon128.png",
          title: "Login Successful",
          message: "You can use the app now",
        });
      })
      .catch(function (err) {
        sendResponse({ success: false });
        console.log(err);
        chrome.notifications.create({
          type: "basic",
          title: "Login Failed",
          message: err.message,
          iconUrl: "icons/icon128.png",
        });
      });
  } else if (event.type === "logout") {
    const authResult = JSON.parse(localStorage.authResult || "{}");

    const options = {
      interactive: true,
      url:
        "https://identity.ath.staging-traveloka.com/session/end?post_logout_redirect_uri=" +
        encodeURIComponent(chrome.identity.getRedirectURL("odin/logout")) +
        "&id_token_hint=" +
        authResult.id_token,
    };
    chrome.identity.launchWebAuthFlow(options, function (redirectUri) {
      chrome.notifications.create({
        type: "basic",
        title: "Logout Successful",
        message: "You can re-login to use the app now",
        iconUrl: "icons/icon128.png",
      });
      sendResponse({ success: true });
    });
  }

  return true;
});
