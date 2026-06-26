# 🤖 Robot Face Controller

## Ordnerstruktur

```
robot-face/
├── controller.html     ← Laptop (Steuerung)
├── display.html        ← Handy (Anzeige)
├── images/
│   ├── Talk1.png
│   ├── Talk2.png
│   ├── Happy1.png
│   ├── Happy2.png
│   ├── Neutral1.png
│   ├── Neutral2.png
│   ├── Serious1.png
│   ├── Serious2.png
│   ├── Sad1.png
│   └── Sad2.png
└── audio/
    ├── voice1.mp3
    ├── voice2.mp3
    └── voice3.mp3
```

---

## 1. Supabase einrichten

1. Account auf [supabase.com](https://supabase.com) (mit GitHub einloggen)
2. Neues Projekt erstellen → Region: EU West
3. Im SQL Editor folgendes ausführen:

```sql
CREATE TABLE robot_state (
  id INT PRIMARY KEY DEFAULT 1,
  face TEXT DEFAULT 'Neutral',
  voiceline TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO robot_state (id, face) VALUES (1, 'Neutral');

-- Realtime aktivieren
ALTER TABLE robot_state REPLICA IDENTITY FULL;
```

4. Dann: Realtime → robot_state → aktivieren (Toggle)

5. Project Settings → API:
   - `Project URL` kopieren
   - `anon public` Key kopieren

---

## 2. Config eintragen

In **beiden** Dateien (`controller.html` und `display.html`) ersetzen:

```js
const SUPABASE_URL = 'DEINE_SUPABASE_URL';      // z.B. https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'DEIN_ANON_KEY';      // langer String
```

---

## 3. Voicelines anpassen

In `controller.html` die VOICELINES-Liste anpassen:

```js
const VOICELINES = [
  { label: 'Hallo!',     emoji: '👋', file: 'hallo.mp3' },
  { label: 'Danke!',     emoji: '🙏', file: 'danke.mp3' },
  { label: 'Ich bin ein Roboter', emoji: '🤖', file: 'roboter.mp3' },
];
```

---

## 4. Auf GitHub Pages hosten

```bash
# GitHub Repo erstellen (z.B. "robot-face")
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/DEIN_USERNAME/robot-face.git
git push -u origin main
```

Dann auf GitHub: Settings → Pages → Branch: main → Save

Website läuft dann auf:
- Controller: `https://DEIN_USERNAME.github.io/robot-face/controller.html`
- Display: `https://DEIN_USERNAME.github.io/robot-face/display.html`

---

## 5. Nutzung

1. Display-URL auf dem Handy öffnen → offen lassen
2. Controller-URL auf dem Laptop öffnen
3. Grüner Punkt = verbunden ✅
4. Gesicht drücken → Handy zeigt sofort die Animation
5. Voiceline drücken → Handy spielt Audio ab (unabhängig vom Gesicht)

---

## Tipps

- **iOS Audio**: Handy-Screen einmal antippen nachdem die Seite geladen ist (iOS braucht User-Interaction für Audio)
- **Animationsgeschwindigkeit**: In `display.html` → `ANIM_SPEED` in ms ändern (Standard: 400ms)
- **Bildformat**: PNG funktioniert am besten, transparenter Hintergrund möglich
