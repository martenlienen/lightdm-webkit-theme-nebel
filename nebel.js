var authProcess = null;

/**
 * LightDM hook to show a message to the user
 */
function show_message (msg) {
  console.log(msg);
}

/**
 * LightDM hook to prompt the user for information
 *
 * This is always used to ask for the password.
 */
function show_prompt (prompt) {
  lightdm.provide_secret(authProcess.password);
}

/**
 * LightDM hook, that is called when an authentication process completes
 *
 * This is called, when LightDM has authorized or denied the authentication
 * process. Note that this is called with a delay of several seconds in the case
 * of a wrong password.
 */
function authentication_complete () {
  if (lightdm.is_authenticated) {
    authProcess.deferred.resolve();

    lightdm.login(lightdm.authentication_user, lightdm.default_session);
  } else {
    authProcess.deferred.reject();
  }
}

/**
 * LightDM hook to log in a user when the timed login timer runs out
 *
 * You can configure LightDM to log you in as some user if you do not choose
 * another user during the first x seconds. Then this will be called with the
 * username of this default user.
 */
function timed_login (username) {
  lightdm.login(lightdm.timed_login_user);
}

function initializeUsers () {
  var container = document.getElementById("users-container");
  var component = React.createElement(
    UserList,
    {
      users: lightdm.users,
      login: function (username, password) {
        authProcess = {
          deferred: Q.defer(),
          password: password
        };

        lightdm.start_authentication(username);

        return authProcess.deferred.promise;
      }
    }
  );

  React.render(component, container);
}

function initializeButtons () {
  var container = document.getElementById("buttons-container");
  var component = React.createElement(PowerManagementButtons);

  React.render(component, container);
}

window.addEventListener("load", initializeUsers);
window.addEventListener("load", initializeButtons);
