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

      window.authentication_complete();
    },
    login: function (username, session) {
      console.log("Log into session " + session + " as " + username);
    }
  };
}
