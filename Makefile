.PHONY: install

THEME_DIR = $$DESTDIR/usr/share/lightdm-webkit/themes/nebel

install:
	mkdir -p $(THEME_DIR)
	cp --recursive font-awesome-4.3.0 $(THEME_DIR)
	cp react-with-addons.js $(THEME_DIR)
	cp wallpaper.jpg $(THEME_DIR)
	cp index.html $(THEME_DIR)
	cp index.theme $(THEME_DIR)
	cp nebel.js $(THEME_DIR)
	cp nebel.css $(THEME_DIR)
