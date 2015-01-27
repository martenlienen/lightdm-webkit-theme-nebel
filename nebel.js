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

function initializeUsers () {
  var container = document.getElementById("users-container");
  var component = React.createElement(UserList, { users: lightdm.users });

  React.render(component, container);
}

function initializeButtons () {
  var container = document.getElementById("buttons-container");
  var component = React.createElement(PowerManagementButtons);

  React.render(component, container);
}

window.addEventListener("load", initializeUsers);
window.addEventListener("load", initializeButtons);
