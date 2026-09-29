# Zusammenarbeit gemeinsam wirksam gestalten

**Live:** https://meldahm.github.io/workshop-zusammenarbeit-bbs/
**Repository:** https://github.com/MelDahm/workshop-zusammenarbeit-bbs

Ergebnisdokumentation des Workshops mit den Bildungsgang- und Fachteamleitungen der
Otto-Bennemann-Schule zum Thema Zusammenarbeit.

**Stand:** 21.09.2026 · zusammengestellt von Melanie Dahm

**Leitfrage des Workshops:**
„Wie gestalten wir Zusammenarbeit, die uns gemeinsam wirksamer macht?“

---

## Was diese Website ist

- eine sachliche Ergebnisdokumentation und Arbeitsgrundlage für Schulleitung sowie
  Bildungsgang- und Fachteamleitungen
- eine Nachschlage- und Belegebene mit den Originalfotos der Workshopergebnisse
- eine statische Website ohne Backend, ohne Login, ohne Datenbank

Die Website enthält keine Cookies, kein Tracking, keine Analytics und keine externen
Dienste. Alle Dateien liegen lokal im Repository.

## Aufbau der Website

Die Seite ist in drei Ebenen gegliedert:

| Ebene | Bereiche | Zweck |
| --- | --- | --- |
| Einführung | Start | Leitfrage, Einordnung, roter Faden, Agenda und Präsentation |
| Ebene 1 | Perspektiven zum Start, WHY, HOW, WHAT | den Workshop nachvollziehen |
| Ebene 2 | Statusbild, Fragen für die Weiterarbeit | Ergebnisse gemeinsam betrachten |
| Beleg | Dokumentation (A–D) | Originalergebnisse und Fotos |

Der Aufbau ist auch visuell erkennbar: Ebene 1 und Ebene 2 werden durch schmale
Trennbänder mit eigener Beschriftung voneinander abgesetzt.

### Breite und Spaltenaufbau

Der Inhalt liegt in `.container` und ist auf `--breite-inhalt` (84rem, also
1344px) begrenzt. Auf sehr breiten Monitoren wird die Seite mittig gesetzt, statt
bis zum Bildschirmrand gedehnt zu werden.

Ab 68rem Viewportbreite stehen die Abschnitte 2 bis 7 zweispaltig: links der
Abschnittskopf (`.section__kopf` mit Kicker und Überschrift), rechts der Inhalt
(`.section__inhalt`). Der Kopf bleibt beim Scrollen stehen, solange der
Abschnitt läuft. Abschnitt 1 (Start) und Abschnitt 8 (Dokumentation) bleiben
einspaltig, weil dort Fotos und Materialien stehen, die breiter wirken sollen.

Fließtext ist bewusst auf 46rem begrenzt, damit die Zeilenlänge lesbar bleibt.
Kästen, Listen und Fotoraster nutzen die volle Breite der rechten Spalte.

Für die Breite sind zwei Stellschrauben relevant:

| Variable / Klasse | Wirkung |
| --- | --- |
| `--breite-inhalt` | Gesamtbreite des Containers |
| `--breite-text` | Standardbreite für Fließtext |
| `.section--mit-kopf` | schaltet den zweispaltigen Abschnittsaufbau frei |
| `.fotos` | Spaltenzahl folgt automatisch der verfügbaren Breite |

## Technik

- HTML5 und CSS3, dazu wenig Vanilla JavaScript
- keine Frameworks, keine Bibliotheken, kein Build-Prozess
- Schriften über Systemschriften (keine externen Schriftarten)
- Barrierearmut: Skip-Link, Tastaturbedienung, sichtbare Fokusmarken, `prefers-reduced-motion`
- vollständig responsiv von Smartphone bis Desktop

## Dateistruktur

```
/
├── index.html                     Seiteninhalt mit allen Bereichen
├── README.md                      diese Datei
├── css/
│   └── style.css                  Gestaltung, responsiv, Druck
├── js/
│   └── script.js                  Navigation, Lightbox, Zustand, Nach-oben
└── assets/
    ├── images/                    Fotos der Originalergebnisse
    │   ├── start-01.jpg … start-07.jpg
    │   ├── why-01.jpg … why-04.jpg
    │   ├── how-01.jpg … how-09.jpg
    │   └── what-01.jpg … what-03.jpg
    └── dokumente/
        ├── Agenda.pdf
        └── Praesentation.pdf
```

Die Website lässt sich lokal ohne Server öffnen: `index.html` im Browser aufrufen.
(`file://` funktioniert; die PDFs öffnen je nach Browser ebenfalls.)

## Lokal prüfen

```powershell
# Seite direkt öffnen
start index.html
```

Alternativ einen kleinen lokalen Server starten (mit Python):

```powershell
python -m http.server 8000
# danach http://localhost:8000 aufrufen
```

---

## Veröffentlichung über GitHub Pages

### Variante A: Repository als Website veröffentlichen

1. Repository auf GitHub anlegen.
2. Die Ordner `css`, `js` und `assets` sowie `index.html` und `README.md` in das
   Repository hochladen.
3. **Settings → Pages** öffnen.
4. Unter **Build and deployment** als Quelle **Deploy from a branch** wählen.
5. Branch **main** (oder **master**) und Ordner **/ (root)** auswählen.
6. **Save** klicken. Nach wenigen Minuten ist die Seite online, unter:
   `https<Benutzername>.github.io<Repositoryname>/`

### Variante B: In einem bestehenden Organisations-Repository veröffentlichen

Wenn die Website in ein bereits bestehendes Repository (zum Beispiel einer Schul-Homepage)
eingebunden werden soll:

1. Ordner anlegen, zum Beispiel `workshop-zusammenarbeit/`:
   ```powershell
   New-Item -ItemType Directory workshop-zusammenarbeit
   Copy-Item index.html, css, js, assets, README.md workshop-zusammenarbeit -Recurse
   ```
2. In `index.html` die drei Verweise um den Ordnernamen ergänzen:
   ```html
   <link rel="stylesheet" href="workshop-zusammenarbeit/css/style.css">
   <script src="workshop-zusammenarbeit/js/script.js"></script>
   ```
   sowie alle `assets/...`-Pfade in `href` und `src`.
3. Hochladen, done. Unter `https<Benutzername>.github.io<Repositoryname>/workshop-zusammenarbeit/`

> **Hinweis:** Alle Pfade in dieser Website sind relativ. Sie funktionieren deshalb
> sowohl im Repository-Root als auch in einem Unterordner. Nur bei Variante B müssen die
> Pfade einmalig angepasst werden.

---

## Fotos ergänzen

Die Fotos liegen in `assets/images` und sind nach Bereichen benannt:

| Bereich | Dateien |
| --- | --- |
| Perspektiven zum Start | `start-01.jpg` … `start-07.jpg` |
| WHY | `why-01.jpg` … `why-04.jpg` |
| HOW | `how-01.jpg` … `how-09.jpg` |
| WHAT | `what-01.jpg` … `what-03.jpg` |

**Weitere Fotos hinzufügen:**

1. Datei nach `assets/images` legen, sprechend benennen (z. B. `what-04.jpg`).
2. In `index.html` den passenden Platzhalter-Kommentar suchen, zum Beispiel:
   ```html
   <!-- FOTO EINFÜGEN: HOW Kopfstand Gruppe 1 -->
   ```
3. Darunter den Baustein einfügen:
   ```html
   <figure class="foto">
     <a href="assets/images/how-10.jpg" class="foto__link" data-caption="Originalfoto aus dem Workshop: HOW, Gruppe 1">
       <img src="assets/images/how-10.jpg" alt="Kurze, sachliche Bildbeschreibung" loading="lazy">
     </a>
     <figcaption>Originalfoto: HOW, Gruppe 1</figcaption>
   </figure>
   ```

**Empfehlungen zu den Bilddateien**

- Querformat 4:3 wie die vorhandenen Aufnahmen (z. B. 1800 x 1350 px)
- JPEG, Qualität 80–85 (Größe je Foto dann ca. 250–500 KB)
- Die Originale unverändert und unbeschnitten verwenden; nur die Dateigröße reduzieren
- `alt` und `figcaption` kurz und sachlich halten, keine Bewertung des Bildinhalts

**Hinweis zur Ausrichtung der Fotos**

Die Aufnahmen sind im Hochformat entstanden und werden auf der Website für die
Ansicht um 90 Grad nach rechts gedreht. Die Drehung passiert ausschließlich über
CSS in `css/style.css` (`.foto img` und `.lightbox__img` mit `rotate(90deg)`) –
die Bilddateien selbst bleiben unverändert und quer.

Die Drehung erwartet ein Seitenverhältnis von 4:3 quer. Für Fotos mit einem
anderen Seitenverhältnis muss in `css/style.css` der Wert `width: 133.3333%` und
`aspect-ratio: 3 / 4` entsprechend angepasst werden:

| Quelformat | `width` in Prozent | `aspect-ratio` |
| --- | --- | --- |
| 4:3 quer | `133.3333%` | `3 / 4` |
| 3:4 hoch | `100%` | `4 / 3` |
| 1:1 | `100%` | `1 / 1` |

Sollen die Fotos künftig nicht mehr gedreht werden, genügt es, in `css/style.css`
beim Selector `.foto img` (und `.lightbox__img`) die Zeile
`transform: translate(-50%, -50%) rotate(90deg);` durch
`transform: translate(-50%, -50%);` zu ersetzen sowie `aspect-ratio: 3 / 4` durch
`aspect-ratio: 4 / 3`.

Die vorhandenen Fotos wurden ausschließlich in der Größe reduziert, nicht inhaltlich
verändert oder beschnitten.

Lightbox, Bildunterschriften und responsive Darstellung funktionieren automatisch für
jedes Bild, das über `.foto__link` eingebunden wird.

## Inhalte pflegen

Die Seite trennt sprachlich und optisch drei Ebenen:

1. **Was im Workshop geäußert oder erarbeitet wurde** — Abschnitte Perspektiven, WHY,
   HOW, WHAT und die vollständige Dokumentation (Abschnitt 8).
2. **Was in der Gesamtschau auffällt** — die Rubriken „Was fällt auf?“ sowie das
   Statusbild.
3. **Welche Fragen sich daraus ergeben** — Abschnitt Weiterarbeit sowie die
   hervorgehobenen Frageblöcke.

Aussagen in den Abschnitten 2 bis 5 geben die Beiträge der Teilnehmenden wieder und
sind keine Aussagen über die gesamte Schule. Diese Formulierungen beim Bearbeiten
beibehalten.

## Barrierefreiheit und Bedienung

- Sticky-Navigation mit Markierung des aktuellen Abschnitts
- Mobile Menü (Button „Menü“, schließt per Klick, Link oder `Esc`)
- Aufklappbare Originaldokumentation; geöffnete Bereiche bleiben per `localStorage`
  erhalten (fällt in einem privaten Fenster ohne Zustandsspeicherung aus)
- Lightbox mit `Esc` und Tastaturbedienung
- „Nach oben“-Schaltfläche ab ca. 1200 px Scrollposition
- Respektiert die Systemeinstellung „Bewegung reduzieren“

## Stand

Ergebnisdokumentation vom **21.09.2026**, zusammengestellt von **Melanie Dahm**,
Otto-Bennemann-Schule. Der Inhalt ist Arbeitsgrundlage und kann gemeinsam mit den
Bildungsgang- und Fachteamleitungen fortgeschrieben werden.

Stand und Zusammenstellung stehen an zwei Stellen sichtbar auf der Seite: unter der
Kleinzeile „Ergebnisdokumentation" im Startbereich und im Fußbereich. Beide Texte
liegen in `index.html` als Elemente der Klasse `stand`.

Bei einer späteren Überarbeitung sollten Datum und Name an beiden Stellen sowie im
`<meta name="description">` und im `<meta name="author">` im `<head>` angepasst werden.
