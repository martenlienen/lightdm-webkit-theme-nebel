var div = React.createFactory("div");
var button = React.createFactory("button");
var i = React.createFactory("i");

/**
 * A button to trigger a power management functionality of LightDM
 *
 * The button can also be triggered with Alt-<some key>.
 */
var PowerManagementButton = React.createClass({
  propTypes: {
    /**
     * The LightDM function to call
     */
    action: React.PropTypes.string.isRequired,

    /**
     * Shortcut key (key is a reserver property)
     */
    skey: React.PropTypes.string.isRequired,

    /**
     * Name of a FontAwesome icon
     */
    icon: React.PropTypes.string.isRequired
  },
  componentDidMount: function () {
    window.addEventListener("keyup", this.onKeyUp);
  },
  componentWillUnmount: function () {
    window.removeEventListener("keyup", this.onKeyUp);
  },
  render: function () {
    var name = this.capitalize(this.props.action);
    var title = name + " (Alt-" + this.props.skey + ")";

    return button(
      { onClick: this.executeAction },
      i({ title: title,
          className: "fa fa-4x fa-" + this.props.icon }));
  },
  executeAction: function () {
    lightdm[this.props.action]();
  },
  onKeyUp: function (event) {
    var code = this.props.skey.toUpperCase().charCodeAt(0);

    if (event.altKey && event.keyCode === code) {
      this.executeAction();
    }
  },
  capitalize: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});

/**
 * A row of buttons for power management, e.g. suspend
 */
var PowerManagementButtons = React.createClass({
  statics: {
    buttons: [
      {
        action: "hibernate",
        key: "h",
        icon: "leaf"
      },
      {
        action: "suspend",
        key: "s",
        icon: "pause"
      },
      {
        action: "restart",
        key: "r",
        icon: "refresh"
      },
      {
        action: "poweroff",
        key: "p",
        icon: "power-off"
      }
    ]
  },
  render: function () {
    var buttons = [];

    PowerManagementButtons.buttons.forEach(function (spec) {
      if (lightdm["can_" + spec.action]) {
        var button = React.createElement(
          PowerManagementButton,
          { key: spec.action,
            action: spec.action,
            skey: spec.key,
            icon: spec.icon});

        buttons.push(button);
      }
    });

    return div({ className: "power-management-buttons" }, buttons);
  }
});
