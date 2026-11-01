# Pultwerk – Produktionspult für Online-Workshops (Prototyp)

Klickbarer Desktop-Prototyp einer gemeinsamen Produktions-App für Zoom-Workshops, Webinare und hybride Veranstaltungen. Eine Veranstaltung, eine Teilnehmerliste, ein Chat und ein Spotlight-Status bilden die Grundlage für alle Bereiche.

> **Demo-Prototyp:** Es besteht keine Verbindung zu Zoom, NDI, SDI, SRT, Dante, OSC oder einem Stream Deck. Alle Aktionen ändern ausschließlich den lokalen Zustand im Browser und sind in der Oberfläche als „Demo“ oder „Nicht verbunden“ gekennzeichnet. Es wird nichts aufgezeichnet, übertragen oder an Dritte gesendet.

## Starten

Voraussetzung: Node.js 20.19 oder neuer (getestet mit Node.js 22).

```bash
cd pultwerk
npm install
npm run dev        # Entwicklungsserver auf http://localhost:5173
```

Weitere Befehle:

| Befehl | Zweck |
| --- | --- |
| `npm run build` | TypeScript-Prüfung und Produktions-Build nach `dist/` |
| `npm run preview` | Build lokal ansehen (http://localhost:4173) |
| `npm run typecheck` | Nur TypeScript prüfen |
| `npm test` | Tests der Chat-Auswertung (Node-Test-Runner) |
| `npm run map:generate` | Weltkarte aus Natural-Earth-Daten neu erzeugen |

Optimiert für Laptop- und Desktop-Bildschirme ab etwa 1280 px Breite; kleinere Fenster werden einspaltig.

## Bereiche

1. **Veranstaltung** – Startansicht mit anstehenden Aktionen, Ablaufplan, Verbindungsstatus und Umschalter für eine geplante, laufende oder beendete Demo-Sitzung.
2. **Teilnehmende** – Liste mit Rolle, Mikrofon, Kamera, Handzeichen (mit Uhrzeit), Sprecherstatus, Suche, Filter und Sortierung. Wortmeldungen nach Eingangszeit, älteste zuerst. Ein Klick setzt eine Person ins Spotlight, ein zweiter Klick entfernt sie. „Alle Teilnehmenden stummschalten“ mit Bestätigung.
3. **Galerie Studio** – Robin als Moderation groß in der Mitte, Teilnehmende rundherum. Alternativ Spotlight-Bühne und gleichmäßiges Raster. Kachelzahl, Namen, Reaktionen und Handzeichen einstellbar.
4. **Live Grafiken** – Chat-Simulator, Weltkarte mit Prüfliste, Live-Umfrage (Auswahl oder offene Frage), Wortwolke mit Filtern und Chat-Highlight. Alle vier mit Live-Vorschau, Einblendung in die Galerie-Vorschau und großer Präsentationsansicht.
5. **Steuerpult und Stream Deck** – anpassbares Raster großer Aktionsflächen, Tastenfeld-Vorschau mit den Handzeichen in Eingangsreihenfolge, Aktionsprotokoll.
6. **Audio und Ausgabe** – simulierte Pegel und eine Tabelle möglicher Ausgänge (NDI, SRT, SDI, Dante, virtuelle Kamera, Aufnahme).
7. **Integrationen und Einstellungen** – Karten mit Status, Erklärung und den Voraussetzungen für eine echte Anbindung.

Tastenkürzel: `Alt` + `1` bis `7` wechselt den Bereich, `N` nächste Hand ins Spotlight, `M` alle stummschalten (mit Bestätigung), `G` Galerie wechseln, `U` Umfrage einblenden, `?` zeigt alle Kürzel.

## Regeln der Chat-Auswertung

- **Weltkarte:** Nur Orte, die eine Person selbst im Chat nennt. Erkennung ausschließlich über ein kleines lokales Ortsverzeichnis (`src/data/places.ts`). Eindeutige Orte müssen bestätigt werden (optional automatisch); mehrdeutige („Frankfurt“, „Halle“) und unbekannte Orte („Grüße aus …“) landen in der Prüfliste. Pro Person zählt der zuletzt bestätigte Ort; Personen am selben Ort werden gruppiert.
- **Umfrage:** Gültig ist eine Nachricht, die genau einer Kennung (A, B … oder 1, 2 …) oder genau dem Antworttext entspricht. Nachrichten wie „eher B“ oder „B oder C“ gehen zur Prüfung. Standardmäßig zählt pro Person nur die zuletzt abgegebene gültige Antwort.
- **Wortwolke:** Jeder Begriff zählt pro Nachricht einmal. Filter für Füllwörter, Kurzwörter und Zahlen, unangemessene Begriffe (Beispielliste), Umfrage-Stimmen und Mindestnennungen; einzelne Begriffe lassen sich ausblenden.
- Beiträge von Moderation, Co-Moderation, Vortrag und Produktion werden nicht ausgewertet.

## Was funktioniert, was simuliert ist

| Vollständig im Prototyp | Nur simuliert |
| --- | --- |
| Gemeinsamer Zustand für alle Bereiche, Änderungen sofort überall sichtbar | Teilnehmende, Chat, Sprecherwechsel und Reaktionen (Beispieldaten, optionale Live-Simulation) |
| Spotlight an/aus, Mehrfach-Spotlight mit Limit, Reihenfolge | Wirkung von Spotlight und Stummschalten in Zoom |
| Handzeichen-Warteschlange nach Eingangszeit | Videobilder (stilisierte Kamerabilder) |
| Ortserkennung, Prüfliste, Pins, Gruppierung | Audiopegel |
| Umfrage-Zuordnung, Prüfen, Verwerfen, Zurücksetzen, Schließen, offene Frage | Ausgänge NDI, SRT, SDI, Dante (nur Quellenauswahl) |
| Wortwolke mit Filtern und Ausblenden | Stream-Deck-Tasten (Vorschau im Browser) |
| Präsentationsansicht, Einblendung in der Galerie-Vorschau | Verbindungstests (enden immer mit „nicht verbunden“) |

## Vor einer echten Zoom-Anbindung prüfen

- **Schnittstelle:** Host-Funktionen wie Spotlight, „Alle stummschalten“ und Handzeichen senken bietet das **Zoom Meeting SDK** (Web, Windows, macOS, Linux). Die App tritt dabei selbst dem Meeting bei und braucht die Rolle **Host oder Co-Host**.
- **App-Registrierung:** App im Zoom App Marketplace mit SDK-Zugangsdaten und serverseitig signiertem Token. Für Meetings außerhalb des eigenen Kontos verlangt Zoom zusätzlich ein Nutzer-Token (ZAK oder OBF) und eine geprüfte Produktions-App.
- **Chat für Grafiken:** Chat-Ereignisse über das Meeting SDK oder **Zoom Realtime Media Streams (RTMS)**; RTMS ist ein Backend-Dienst und muss für das Konto verfügbar und freigegeben sein.
- **Webinare:** Attendees haben kein Video; für das Spotlight müssen sie zu Panelists werden.
- **Eigene Galerie-Komposition:** Zugriff auf einzelne Videobilder (Rohdaten) braucht zusätzliche Freigaben sowie Einwilligung und Datenschutzprüfung.
- **Datenschutz:** Teilnehmende über die Auswertung von Chat-Beiträgen informieren; Ortsangaben nur aus selbst genannten Beiträgen verwenden.

Weitere Integrationen (Details in der App unter „Integrationen“):

- **Stream Deck:** Plugin auf Basis des Stream Deck SDK oder eine Controller-Software (z. B. Bitfocus Companion) mit lokaler Schnittstelle zur App; alternativ WebHID in Chromium-Browsern.
- **OSC:** lokaler Dienst oder Desktop-App, da Browser kein UDP senden können.
- **NDI:** NDI SDK und Lizenzbedingungen, native Anwendung.
- **SRT:** Software- oder Hardware-Encoder und ein SRT-Ziel.
- **SDI:** Ein-/Ausgabekarte (z. B. Blackmagic oder AJA) mit Hersteller-SDK.
- **Dante/Audio:** Dante-Geräte oder Dante Virtual Soundcard (lizenzpflichtig), Audiointerface mit passenden Treibern.

Die Angaben sind vor einer Umsetzung mit der aktuellen Herstellerdokumentation abzugleichen.

## Projektstruktur

```
pultwerk/
├── scripts/generate-world-map.mjs   # erzeugt src/data/worldMap.ts aus Natural Earth
├── src/
│   ├── App.tsx                      # Rahmen, Navigation, Tastenkürzel
│   ├── state/                       # Datenmodell, Reducer, Befehle, Auswertung
│   │   ├── types.ts                 # gemeinsames Datenmodell
│   │   ├── reducer.ts               # alle Zustandsänderungen
│   │   ├── derive.ts                # Karte, Umfrage, Wortwolke aus dem Chat
│   │   ├── commands.ts              # Befehle mit sichtbarer Rückmeldung
│   │   └── deckActions.ts           # Aktionen für Steuerpult, Tasten, Kürzel
│   ├── integrations/adapters.ts     # Integrationsgrenzen (Meeting, Controller, Ausgang)
│   ├── lib/                         # Ortserkennung, Abstimmung, Wortwolke, Projektion
│   ├── data/                        # Beispieldaten, Ortsverzeichnis, Integrationskatalog
│   ├── components/                  # Kacheln, Galerie, Grafiken, Tastenfeld, UI-Bausteine
│   ├── views/                       # die sieben Bereiche
│   └── styles/                      # Gestaltung (Tokens, Komponenten, Ansichten)
└── tests/logic.test.ts              # Tests für die Chat-Auswertung
```

Integrationsgrenze: Die Oberfläche ruft nur lokale Befehle (`src/state/commands.ts`) auf. Ein späterer Adapter implementiert `MeetingAdapter`, `ControllerAdapter` oder `OutputAdapter` (`src/integrations/adapters.ts`) mit einer offiziell unterstützten Schnittstelle, ohne dass sich die Ansichten ändern müssen.

## Quellen und Lizenzen

- Kartendaten: [Natural Earth](https://www.naturalearthdata.com) (gemeinfrei), über das npm-Paket `world-atlas`.
- Schriften: Barlow, Barlow Semi Condensed, IBM Plex Mono (SIL Open Font License), lokal über `@fontsource` eingebunden.
- Symbole: Lucide (ISC-Lizenz).
- Alle Personen, Orte im Chat und Inhalte der Beispielveranstaltung sind erfunden.
