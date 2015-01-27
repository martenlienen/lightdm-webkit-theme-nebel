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
    users: [{name: "cqql"}, {name: "alf"}]
  };
}

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
      { className: cx({ selected: this.props.selected }),
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

    this.props.onLogin(this.state.password);
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
          onLogin: list.props.onLogin.bind(list, user.name),
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

function show_message (msg) {
  alert("Message: " + msg);
}

var password = null;

function show_prompt (msg) {
  lightdm.provide_secret(password);
}

function authentication_complete () {
  if (lightdm.is_authenticated) {
    lightdm.login(lightdm.authentication_user, lightdm.default_session);
  } else {
    alert("Wrong password!?");
  }
}

function initializeUsers () {
  var container = document.getElementById("users-container");
  var component = React.createElement(
    UserList,
    {
      users: lightdm.users,
      onLogin: function (user, password) {
        lightdm.start_authentication(user);
        window.password = password;
      }
    });

  React.render(component, container);
}

function initializeButtons () {
  var container = document.getElementById("buttons-container");
  var component = React.createElement(ButtonRow);

  React.render(component, container);
}

window.addEventListener("load", initializeUsers);
window.addEventListener("load", initializeButtons);
