chrome.runtime.onMessage.addListener(function (event, sender, sendResponse) {
  if (event.type === "authenticate") {
    let options = {
      scope: "openid email",
      device: "chrome-extension",
    };

    const auth = new OauthChrome(env.OAUTH2_ISSUER, env.OAUTH2_CLIENT_ID, {
      audience: env.OAUTH2_AUDIENCE,
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
    // const authResult = JSON.parse(localStorage.authResult || "{}");

    // const options = {
    //   interactive: true,
    //   url: `${env.OAUTH2_ISSUER}/v2/logout?client_id`,
    // };
    // chrome.identity.launchWebAuthFlow(options, function (redirectUri) {
    //   chrome.notifications.create({
    //     type: "basic",
    //     title: "Logout Successful",
    //     message: "You can re-login to use the app now",
    //     iconUrl: "icons/icon128.png",
    //   });
    //   sendResponse({ success: true });
    // });

    sendResponse({ success: true });
  }

  return true;
});
