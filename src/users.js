var cx = React.addons.classSet;

var ul = React.createFactory("ul");
var li = React.createFactory("li");
var form = React.createFactory("form");
var label = React.createFactory("label");
var input = React.createFactory("input");
var i = React.createFactory("i");

var UserItem = React.createClass({
  propTypes: {
    /**
     * Is this user selected?
     */
    selected: React.PropTypes.bool,

    /**
     * The LightDM user object
     */
    user: React.PropTypes.object.isRequired,

    /**
     * A function to log in a user
     *
     * It must take the username and password as arguments and return a Q
     * promise.
     */
    login: React.PropTypes.func.isRequired
  },
  getInitialState: function () {
    return {
      password: "",
      locked: false
    };
  },
  componentDidMount: function () {
    this.focusPasswordInput();
  },
  componentDidUpdate: function () {
    this.focusPasswordInput();
  },
  render: function () {
    var locked = this.props.selected && this.state.locked;

    return li(
      { ref: "li",
        className: cx({ selected: this.props.selected,
                        locked: locked }),
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
            readOnly: locked,
            onChange: this.setPassword })),
      i({ className: "fa fa-spinner fa-pulse" }));
  },
  login: function (event) {
    event.preventDefault();

    var item = this;

    this.setState({ locked: true }, function () {
      this.props.login(this.props.user.name, this.state.password)
        .catch(function () {
          item.setState({
            password: "",
            locked: false
          }, function () {
            var ref = item.refs["li"];

            if (ref) {
              var node = $(ref.getDOMNode());

              node.addClass("error");

              node.on("webkitAnimationEnd", function () {
                node.removeClass("error");
              });
            }
          });
        });
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
  propTypes: {
    users: React.PropTypes.array.isRequired,
    login: React.PropTypes.func.isRequired
  },
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
          login: list.props.login,
          selected: index == list.state.selected,
          onClick: list.select.bind(list, index) });
    });

    return ul({ className: "users" }, items);
  },
  onKeyUp: function (event) {
    if (event.ctrlKey) {
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
