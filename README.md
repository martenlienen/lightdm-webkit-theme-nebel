# A semitransparent lightdm greeter theme

## Installation

### From AUR

```sh
yaourt lightdm-webkit-theme-nebel
```

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

- *Ctrl-n* or *Arrow Down*: Next user
- *Ctrl-p* or *Arrow Up*: Previous user
- *Alt-p*: Power off
- *Alt-r*: Restart
- *Alt-s*: Suspend
- *Alt-h*: Hibernate

## Wallpaper

The [wallpaper](https://www.flickr.com/photos/jvoves/6939745762) was
photographed by [Joseph Voves](http://josephvoves.com/) and released under
[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/).

To use another one, overwrite `wallpaper.jpg`.
