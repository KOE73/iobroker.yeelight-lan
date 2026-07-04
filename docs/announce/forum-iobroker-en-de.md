# Announce for forum.iobroker.net

Post the German version in "Entwicklung / Tester gesucht" (main tester audience),
the English one in the English section. Attach docs/img/remote-tab.png.

---

## Deutsch — Tester gesucht

**[Neuer Adapter] yeelight-lan-direct — direkte LAN-Steuerung für Yeelight/Mi, komplett ohne Cloud**

Hallo zusammen,

ich habe einen Adapter für die direkte Steuerung von Yeelight-Lampen über das lokale Netzwerk geschrieben (rohes TCP/JSON-RPC, dasselbe Protokoll wie die offizielle App im LAN-Modus). Keine Cloud, keine Verzögerung, funktioniert auch ohne Internet.

**Features:**
- SSDP-Discovery liest die tatsächlichen Fähigkeiten jeder Lampe aus — es werden nur die States angelegt, die das Modell wirklich unterstützt (keine toten hue/sat bei Mono-Lampen; volle bg_*-Unterstützung bei Deckenleuchten mit Ambilight)
- eingebauter **Fernbedienungs-Tab** im Admin: die Lampe leuchtet auf dem Bildschirm live in ihrer echten Farbe und Helligkeit
- volle Hintergrundlicht-Unterstützung (Power, Helligkeit, CT, RGB, HSV)
- Inkrement-States (BRIGHT_UP/DOWN, CT_UP/DOWN, HUE_CW/CCW…) — direkt mit Wandschaltern verdrahtbar, ohne Skripte
- gedrosselte Befehlsqueue (Yeelight-Firmware verwirft stillschweigend Befehls-Bursts)
- Discovery funktioniert auch auf Hosts mit VPN / mehreren Netzwerk-Interfaces

**Installation:**
```
iobroker url https://github.com/KOE73/iobroker.yeelight-lan-direct.git
iobroker add yeelight-lan-direct
```
Voraussetzung: LAN Control in der Yeelight-App aktiviert, js-controller ≥ 5.

**Gesucht:** Tester mit verschiedenen Modellen (mono, strip, bslamp, desklamp, ceiling…) vor der Einreichung ins offizielle Repo. Getestet bisher: ceilc (Deckenleuchte mit Ambilight), color4. Feedback gern hier im Thread oder als GitHub-Issue.

GitHub (README EN/RU, Screenshots): https://github.com/KOE73/iobroker.yeelight-lan-direct

Danke!

---

## English — testers wanted

**[New adapter] yeelight-lan-direct — direct LAN control for Yeelight/Mi lamps, zero cloud**

Hi all,

I wrote an adapter that talks to Yeelight lamps directly over the local network (raw TCP/JSON-RPC — the same protocol the official app uses in LAN mode). No cloud round-trips, instant response, works with the internet down.

**Highlights:**
- SSDP discovery reads each lamp's real capabilities — only supported states get created (no dead hue/sat on mono bulbs; full bg_* set on ceiling lights with ambilight)
- built-in **remote control tab** in Admin: the on-screen lamp glows live in its actual color and brightness
- full background/ambilight channel support (power, brightness, CT, RGB, HSV)
- incremental states (BRIGHT_UP/DOWN, CT_UP/DOWN, HUE_CW/CCW…) — wire them straight to wall switches, no scripting
- throttled command queue (Yeelight firmware silently drops command bursts)
- discovery works on hosts with VPNs / multiple NICs

**Install:**
```
iobroker url https://github.com/KOE73/iobroker.yeelight-lan-direct.git
iobroker add yeelight-lan-direct
```
Requires LAN Control enabled in the Yeelight app, js-controller ≥ 5.

**Looking for:** testers with different models (mono, strip, bslamp, desklamp, ceiling…) before I submit to the official repository. Tested so far: ceilc (ceiling w/ ambilight) and color4. Feedback in this thread or via GitHub issues is much appreciated.

GitHub (README EN/RU, screenshots): https://github.com/KOE73/iobroker.yeelight-lan-direct

Thanks!
