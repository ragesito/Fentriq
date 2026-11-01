# Fentriq — Brand Kit

Símbolo: **Folded Band** — una cinta de planos plegados que representa el stack completo
(front, back, Web3, IA, data) plegado en una sola pieza con impulso.

Acabado: **Anodizado**. En la web es el logo 3D de aluminio cepillado (`src/components/home/scene.ts`);
estos archivos son esa misma versión en plano.

## Archivos

**Logo (SVG, texto en curvas — no necesita la fuente instalada)**
- `fentriq-primary.svg` — horizontal, color. Uso general sobre fondo claro.
- `fentriq-stacked.svg` — apilado (espacios cuadrados/verticales).
- `fentriq-reverse.svg` — para fondo oscuro.
- `fentriq-mono-dark.svg` / `fentriq-mono-white.svg` — una sola tinta (sellos, B/N).
- `fentriq-mark.svg` — solo el símbolo.

**Íconos**
- `fentriq-icon-dark.svg` — squircle negro. Es la versión que usan todos los iconos de la web.
- `fentriq-icon-accent.svg` — squircle azul, para usos sueltos.

**Favicons / web (en `public/`)**
- `favicon.ico` (16/32/48), `favicon-16.png`, `favicon-32.png`, `favicon-48.png`
- `apple-touch-icon.png` (180), `icon-512.png`, `fentriq-icon-maskable-512.png`
- `site.webmanifest`

Todos los iconos declarados llevan la misma versión: Google elige el mayor de los declarados
para los resultados de búsqueda, y si uno es distinto aparece ese.

## Colores
Cada pieza va en degradado, de arriba abajo. En 16 px, colores lisos.

| Pieza | Sobre oscuro | Sobre claro |
|---|---|---|
| Azul anodizado | `#2A31EE` → `#5546F7` | igual |
| Titanio | `#D5D8E0` → `#8E93A3` | `#5D6170` → `#3A3D49` |
| Claro | `#FFFFFF` → `#E2E4E9` | `#2A2D36` → `#15171C` |
| Violeta anodizado | `#8E3FF2` → `#5A22D6` | igual |

- Fondo de iconos: `#0B0C10`
- Acento de la web: `#3A46FF`, y `#7A45FF` al pasar el ratón

## Tipografía
- Wordmark: **Outfit** Regular.

## Uso
- Dejá aire alrededor del logo (mínimo = la altura del símbolo).
- No deformes, no cambies los colores de los facetados ni rotes el símbolo.
- Sobre fondos oscuros usá la versión reverse o mono-white.
