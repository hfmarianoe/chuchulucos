# YouTube Agent Skill

Once skills de Claude para llevar un canal de YouTube. Origen: [Jakeschincariol/youtube-agent-skill](https://github.com/Jakeschincariol/youtube-agent-skill) (MIT; licencia en `.claude/skills/LICENSE-youtube-agent-skill`). Se revisó antes de instalar: los scripts de Python no usan red ni ejecutan comandos.

## Dónde está

- En `.claude/skills/yt-*`, dentro del repo: la cargan las sesiones del chat (nube) y las locales (con `git pull`).
- Global en tu equipo (opcional): `cp -r .claude/skills/yt-* ~/.claude/skills/`.

## Comandos

`/yt-script`, `/yt-package`, `/yt-edit`, `/yt-comment`, `/yt-plan`, `/yt-viral`, `/yt-retention`, `/yt-shorts`, `/yt-seo`, `/yt-chapters`, `/yt-audit`.

## Primer paso

Llena `.claude/youtube/voice.md` (tu voz: tono, muletillas, temas); todas las skills lo leen. En local, cópialo también a `~/.claude/youtube/voice.md`.

## Notas

- Solo escriben: nada se publica hasta que tú subas el video.
- Los scripts no necesitan dependencias: `python3 .claude/skills/yt-script/hookscore.py --hook "..."`.
- Es distinta de las skills `enfecamino` y `hfmarianoe`, que publican borradores en YouTube Studio.
