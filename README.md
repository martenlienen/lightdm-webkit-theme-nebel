# A semitransparent lightdm greeter theme

## Installation

### Manually

```sh
# Clone the project
git clone git@github.com:CQQL/lightdm-webkit-theme-nebel.git

# Install the files into the themes directory
sudo make install

# Set webkit-theme=nebel
sudo vim /etc/lightdm/lightdm-webkit-greeter.conf
```

## Shortcuts

In the login screen you can use the following shortcuts

- *Alt+n*: Next user
- *Alt+p*: Previous user
- *Shift+Alt+p*: Power off
- *Shift+Alt+r*: Restart
- *Shift+Alt+s*: Suspend
- *Shift+Alt+h*: Hibernate

## Wallpaper

The [wallpaper](https://www.flickr.com/photos/jvoves/6939745762) was
photographed by [Joseph Voves](http://josephvoves.com/) and released under
[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/).

To use another one, overwrite `wallpaper.jpg`.
