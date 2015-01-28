// Create a stub lightdm object, if we are in a browser
if (typeof lightdm == "undefined") {
  var lightdm = {
    can_hibernate: true,
    can_suspend: true,
    can_restart: true,
    can_poweroff: true,
    hibernate: console.log.bind(console, "hibernate"),
    suspend: console.log.bind(console, "suspend"),
    restart: console.log.bind(console, "restart"),
    poweroff: console.log.bind(console, "poweroff"),
    default_session: "default",
    timed_login_delay: 0,
    timed_login_user: undefined,
    users: [
      { name: "cqql", password: "password" },
      { name: "alf", password: "cat" }
    ],
    start_authentication: function (username) {
      lightdm.authentication_user = username;

      window.show_prompt("Password?");
    },
    provide_secret: function (password) {
      var username = lightdm.authentication_user;

      lightdm.is_authenticated = false;
      lightdm.users.forEach(function (user) {
        if (user.name === username && user.password === password) {
          lightdm.is_authenticated = true;
        }
      });

      if (lightdm.is_authenticated) {
        window.authentication_complete();
      } else {
        // LightDM let's you wait a bit, if you did not get it right
        window.setTimeout(window.authentication_complete, 3000);
      }
    },
    login: function (username, session) {
      console.log("Log into session " + session + " as " + username);
    }
  };

  if (lightdm.timed_login_delay > 0) {
    window.setTimeout(function () {
      timed_login(lightdm.timed_login_user);
    }, lightdm.timed_login_delay * 1000);
  }
}
