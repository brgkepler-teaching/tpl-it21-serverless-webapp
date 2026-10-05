# Serverless Web-App – Vorlage für die Aufgaben 21.1 bis 21.7

Vorlage für das Modul *IT-21 Serverless Web-Apps*: eine Single-Page-Webapp (**Kepler Item Hub**) ohne eigenen Server.
Die genauen Aufgabenstellungen und Abgaben stehen in den Teams-Assignments.

```
index.html + style.css + app.js ──► localStorage ──► SQLite im Browser ──► Supabase (Cloud-DB) ──► GitHub Pages
```

## So startest du
1. Repository über **„Use this template“** auf GitHub in deinen Account kopieren und in GitHub Desktop klonen.
2. Lokalen Webserver starten: im Terminal von **Antigravity** (alternativ VS Code) `npx serve -l 5500` (im Projektordner), dann `http://localhost:5500` öffnen (Alternative: `python -m http.server 5500`) (Codespace: Port 5500 öffnen). Ab Aufgabe 21.3 (SQLite/WASM) ist ein Webserver Pflicht.
3. Stellen mit `🎯 CUSTOMIZATION POINT` im Code sind deine Anpassungspunkte.

## Dateien
* `index.html` – HTML-Shell (Header, Aktionsleiste, Liste, Dialog)
* `style.css` – Responsive Layout (CSS Grid)
* `app.js` – State, Rendering, Events

## Abgabe
Änderungen in GitHub Desktop prüfen, Commit-Summary eingeben, **Commit to main** und **Push origin** klicken.
Für GitHub Pages im kostenlosen Account muss das Repository **öffentlich** sein – keine persönlichen Daten oder Geheimnisse (Supabase *service_role*-Key!) einchecken. Nur den öffentlichen *anon*-Key verwenden.
