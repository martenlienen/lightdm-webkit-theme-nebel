// Stub out the lightdm object for development in the browser
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

// This is called by lightdm, but I could not figured out, what it is supposed
// to do.
function show_message (msg) {
  alert("Message: " + msg);
}

var authenticator = {
  login: function (username, password) {
    var deferred = Q.defer();

    window.show_prompt = function (msg) {
      lightdm.provide_secret(password);
    };

    window.authentication_complete = function () {
      if (lightdm.is_authenticated) {
        deferred.resolve();

        lightdm.login(lightdm.authentication_user, lightdm.default_session);
      } else {
        deferred.reject();
      }
    };

    lightdm.start_authentication(username);

    return deferred.promise;
  }
};

var cx = React.addons.classSet;

var ul = React.createFactory("ul");
var li = React.createFactory("li");
var form = React.createFactory("form");
var label = React.createFactory("label");
var input = React.createFactory("input");
var div = React.createFactory("div");
var button = React.createFactory("button");
var i = React.createFactory("i");

var UserItem = React.createClass({
  getInitialState: function () {
    return {
      password: ""
    };
  },
  componentDidMount: function () {
    this.focusPasswordInput();
  },
  componentDidUpdate: function () {
    this.focusPasswordInput();
  },
  render: function () {
    return li(
      { ref: "li",
        className: cx({ selected: this.props.selected }),
        onClick: this.props.onClick },
      form(
        { onSubmit: this.login },
        label(
          {},
          this.props.user.name),
        input(
          {
            ref: "password-input",
            type: "password",
            placeholder: "Password",
            value: this.state.password,
            onChange: this.setPassword })));
  },
  login: function (event) {
    event.preventDefault();

    var item = this;

    authenticator
      .login(this.props.user.name, this.state.password)
      .catch(function () {
        item.setState({ password: "" });

        var ref = item.refs["li"];

        if (ref) {
          var node = $(ref.getDOMNode());
          node.addClass("error");

          node.on("webkitAnimationEnd", function () {
            node.removeClass("error");
          });
        }
      });
  },
  setPassword: function (event) {
    this.setState({ password: event.target.value });
  },
  focusPasswordInput: function () {
    if (this.props.selected) {
      var ref = this.refs["password-input"];

      if (ref) {
        ref.getDOMNode().focus();
      }
    }
  }
});

var UserList = React.createClass({
  getInitialState: function () {
    return {
      selected: 0
    };
  },
  componentDidMount: function () {
    window.addEventListener("keyup", this.onKeyUp);
  },
  componentWillUnmount: function () {
    window.removeEventListener("keyup", this.onKeyUp);
  },
  render: function () {
    var list = this;
    var items = this.props.users.map(function (user, index) {
      return React.createElement(
        UserItem,
        { key: user.name,
          user: user,
          selected: index == list.state.selected,
          onClick: list.select.bind(list, index) });
    });

    return ul({ className: "users" }, items);
  },
  onKeyUp: function (event) {
    if (event.altKey && !event.shiftKey) {
      if (event.keyCode === 78) {
        // Alt+n
        this.select((this.state.selected + 1) % this.props.users.length);
      } else if (event.keyCode === 80) {
        // Alt+p
        this.select((this.state.selected + this.props.users.length - 1) % this.props.users.length);
      }
    }
  },
  select: function (index) {
    this.setState({ selected: index });
  }
});

var Button = React.createClass({
  componentDidMount: function () {
    window.addEventListener("keyup", this.onKeyUp);
  },
  componentWillUnmount: function () {
    window.removeEventListener("keyup", this.onKeyUp);
  },
  render: function () {
    return button(
      { onClick: this.executeAction },
      i({ title: this.capitalize(this.props.action),
          className: "fa fa-4x fa-" + this.props.icon }));
  },
  executeAction: function () {
    lightdm[this.props.action]();
  },
  onKeyUp: function (event) {
    if (this.props.keyCode && event.altKey && event.shiftKey && event.keyCode === this.props.keyCode) {
      this.executeAction();
    }
  },
  capitalize: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});

var ButtonRow = React.createClass({
  statics: {
    buttons: [
      {
        action: "hibernate",
        keyCode: 72, // Alt+Shift+h
        icon: "leaf"
      },
      {
        action: "suspend",
        keyCode: 83, // Alt+Shift+s
        icon: "pause"
      },
      {
        action: "restart",
        keyCode: 82, // Alt+Shift+r
        icon: "refresh"
      },
      {
        action: "poweroff",
        keyCode: 80, // Alt+Shift+p
        icon: "power-off"
      }
    ]
  },
  render: function () {
    var buttons = [];

    ButtonRow.buttons.forEach(function (spec) {
      if (lightdm["can_" + spec.action]) {
        var button = React.createElement(
          Button,
          { key: spec.action,
            action: spec.action,
            keyCode: spec.keyCode,
            icon: spec.icon});

        buttons.push(button);
      }
    });

    return div({ className: "button-row" }, buttons);
  }
});

function initializeUsers () {
  var container = document.getElementById("users-container");
  var component = React.createElement(UserList, { users: lightdm.users });

  React.render(component, container);
}

function initializeButtons () {
  var container = document.getElementById("buttons-container");
  var component = React.createElement(ButtonRow);

  React.render(component, container);
}

window.addEventListener("load", initializeUsers);
window.addEventListener("load", initializeButtons);
