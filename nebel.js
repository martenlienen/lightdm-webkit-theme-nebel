var cx = React.addons.classSet;

var ul = React.createFactory("ul");
var li = React.createFactory("li");
var form = React.createFactory("form");
var label = React.createFactory("label");
var input = React.createFactory("input");

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
      { className: cx({ selected: this.props.selected }) },
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
        {
          key: user.name,
          user: user,
          selected: index == list.state.selected,
          onLogin: list.props.onLogin.bind(list, user.name) });
    });

    return ul({ className: "users" }, items);
  },
  onKeyUp: function (event) {
    if (event.altKey) {
      if (event.keyCode === 78) {
        // Alt+n
        this.setState({ selected: (this.state.selected + 1) % this.props.users.length });
      } else if (event.keyCode === 80) {
        // Alt+p
        this.setState({ selected: (this.state.selected + this.props.users.length - 1) % this.props.users.length });
      }
    }
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

function initialize () {
  var container = document.getElementById("container");
  var component = React.createElement(
    UserList,
    {
      users: lightdm.users,
      //users: [{name: "cqql"}, {name: "grrt"}],
      onLogin: function (user, password) {
        lightdm.start_authentication(user);
        window.password = password;
      }
    });

  React.render(component, container);
}

window.addEventListener("load", initialize);
