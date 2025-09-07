# How to contribute

## Bild auf der Startseite ändern

1. Gewünschtes Bild nach `/static/img/` kopieren
2. In `/assets/css/main.scss` nach dem `#page-bg` Block suchen
3. Den Dateinamen in `background: url();` entsprechend ändern
4. background-position: -223px -67px; /* Keep for moon image */

## Bilder in den Sektionen ("Galerie", "Equipment", etc.) ändern

1. Bild in `header.jpg` umbenennen
2. Bild in den entsprechenden Ordner unter `/content/` kopieren (z.B. `/content/galerie/header.jpg`)
