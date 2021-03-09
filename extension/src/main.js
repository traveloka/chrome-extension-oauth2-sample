chrome.runtime.onMessage.addListener(function (event) {
  if (event.type === "authenticate") {
    let options = {
      scope: "openid email",
      device: "chrome-extension",
    };

    const auth = new OdinChrome(env.ODIN_ISSUER, env.ODIN_CLIENT_ID, {
      resource: env.ODIN_AUDIENCE
    });
    auth
      .authenticate(options)
      .then(function (authResult) {
        console.log(authResult);

        auth
          .exchangeCodeForToken(authResult.code, authResult.secret)
          .then((result) => {
            localStorage.setItem("authResult", JSON.stringify(result));

            chrome.notifications.create({
              type: "basic",
              iconUrl: "icons/icon128.png",
              title: "Login Successful",
              message: "You can use the app now",
            });
          });
      })
      .catch(function (err) {
        console.log(err);
        chrome.notifications.create({
          type: "basic",
          title: "Login Failed",
          message: err.message,
          iconUrl: "icons/icon128.png",
        });
      });
  }
});
