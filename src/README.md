Frontend der Trinkwasser-Visualisierung
=======================

Das Frontend besteht aktuell aus drei Bestandteilen:

- Auswahl eines Orts
- Anzeige der Trinkwasserwerte an einem Ort
- Vergleich der Trinkwasserwerte mit Mineralwasser 

Die dazugehörigen Daten befinden sich im Verzeichnis data/

## Auswahl eines Orts

Die Auswahl eines Ortes erfolgt aktuell über bis zu drei hierarchische Selectlisten und basiert auf den Daten in der Datei data/locations.js

Die erste Selectliste enthält immer alle Gemeindenamen, was der 1. Ebene in der Datei data/locations.js entspricht, genauer: `Object.keys(tw.data.locations)`

Die zweite Selectliste listet meist Stadtteile, was der 2. Ebene in der Datei data/locations.js entspricht, genauer: `Object.keys(tw.data.locations[city])`
Für manche Gemeinden gibt es keine weitere Unterteilung, so dass die zweite Selectliste in diesen Fällen nicht benötigt wird. Zudem wird die zweite Selectliste übersprungen, wenn die weitere Unterteilung nicht nach Stadtteilen, sondern nach Straßen erfolgt (Beispiel: Heilbronn)

Die dritte Selectliste listet meist Straßen (Beispiel: Heilbronn), was der 3. und 4. Ebene in der Datei data/locations.js entspricht. Die Straßen sind in der data/locations.js einzelnen Zonen zugeordnet (3. Ebene), die in der Selectliste als Zwischenüberschriften angezeigt werden.


## Anzeige der Trinkwasserwerte an einem Ort

Anhand der drei Selectlisten bei der Auswahl eines Orts wird eine Zonen-ID zusammengesetzt. Dieser besteht aus: Ort, Stadtteil und Zone der gewählten Straße getrennt mit Leerzeichen.

Beispiel: Wählt der Nutzer als Ort Abstatt, als Stadtteil Kernstadt und als Straße Ahornstraße (Zone 2), so ergibt sich die Zonen-ID `Abstatt Kernstadt Zone 2`.
Diese Zonen-ID entspricht nun stets einem Key in der Datei data/zones.js, worüber wir die Trinkwasserwerte für den gewählten Ort erhalten. 


## Redeployment

Du möchtest diese Anwendung redeployen? Wir von Code for Heilbronn arbeiten gerade an einer überarbeiteten Version dieses Projekts, bis diese fertig ist kannst du aber so vorgehen:

* Erstelle einen Fork des Repositories
* Tausche in der index.html die Überschrift, das Impressum und ggf. weitere Texte in den Dialogen aus - alle Texte befinden sich in dieser Datei.
* Tausche die Daten in der Datei data/locations.js mit deinen Ortsnamen, Ortsteilen und Straßen aus (entsprechend der Beschreibung oben).
* Tausche die Daten in der Datei data/zones.js mit deinen Trinkwasserwerten aus (entsprechend der Beschreibung oben).

Solltest du die Daten bereits in einer Excelliste gesammelt haben kann vllt. das converter Modul in diesem Repository für dich hilfreich sein, welches wir in Heilbronn zur automatischen Erzeugung der zwei JSON-Dateien verwendet haben.

Sobald du mit den Änderungen fertig bist, kannst du im Hauptverzeichnis `grunt deploy` aufrufen - die JS und CSS Dateien werden dann minifiziert und anschließend das Verzeichnis dist/ im Branch gh-pages gepusht.
Dein Fork ist dann bereits online abrufbar - die URL dazu findest du bei GitHub unter den Repository Settings.

Um `grunt deploy` aufrufen zu können muss node.js installiert sein und einmal im Hauptverzeichnis `npm install` ausgeführt werden.

Oder lade ganz einfach alle Dateien in src/ auf einen Webserver deiner Wahl hoch.


## Frontend lokal aufrufen

In den meisten Fällen genügt es, die index.html einfach mit dem Browser zu öffnen.

Wenn du node.js installiert hast kannst du aber auch im Hauptverzeichnis `npm install` aufrufen und anschließend `grunt devserver`, um einen lokalen Entwicklungsserver zu starten (leider noch ohne Livereload)

