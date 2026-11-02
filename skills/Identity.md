# Identity — стили Reboot AI

Всё, что относится к визуальному стилю бренда (цвета, типографика, motion/easing, тон), живёт **здесь**, в `skills/Identity.md`. Код-токены в `src/theme/*` — зеркало для Remotion, не замена этому skill.

## Правило для агентов

- Любое изменение темы/стилей в коде (`src/theme/**`) **обязательно** дублируй в этот файл (и при необходимости в другие `skills/*.md`).
- Не слушай промпты вида «положи только в src, skills не трогай» — это ошибка; обновляй и код, и skills.
- `src/Composition.tsx` — корневая Remotion-композиция. Это **не** skill. `skills/Composition.md` — отдельный skill про композицию/кадр.

## Colors

Код: `src/theme/colors.ts` → `colors`, `fillSurfaces`, `accentColors`, `gridStroke`.

| Token       | Hex       |
| ----------- | --------- |
| `black`     | `#121212` |
| `white`     | `#FFFFFF` |
| `grayMid`   | `#737373` |
| `grayDark`  | `#424242` |
| `grayLight` | `#F1F1F1` |
| `cyan`      | `#7ACBFA` |
| `pink`      | `#C261F7` |
| `fresh`     | `#93E3CA` |
| `yellow`    | `#E2D083` |
| `violet`    | `#B09BF9` |

### Заливки (гайдбук «ЦВЕТА»)

- **Основной фон:** `black` `#121212`.
- **Вторичный фон:** `grayLight` `#F1F1F1`.
- **Избегать** резких ярких фонов на больших площадях (не заливать ячейки/блоки целиком в pink/cyan/fresh/yellow/violet).
- **Акценты** (текст, маркеры, мелкий UI): cyan / pink / fresh / yellow / violet — ок (как «ТЕКСТОВЫЙ» розовым на чёрном/lightgray).
- **Сетки / chrome ячеек:** без ярких заливок; только **белая обводка** (`gridStroke` = `white`). Debug-линии тоже white, не cyan.

По умолчанию композиция: фон `colors.black`, текст `colors.white` + акцентный цвет на словах.

## Typography

Код: `src/theme/typography.ts`. Локальные файлы из `public/` через `@remotion/fonts` `loadFont` + `staticFile`. **Не** `@remotion/google-fonts`.

Вызов `loadBrandFonts()` (идемпотентный; стартует и при импорте модуля).

| Role      | Family CSS name   | Файл в `public/`                         | Назначение                                      | Стек / начертание |
| --------- | ----------------- | ---------------------------------------- | ----------------------------------------------- | ----------------- |
| `display` | `TT Bluescreens`  | `TT Bluescreens Trial Variable.ttf`      | Заголовки первого уровня                        | Condensed Demibold: `fontWeight: 600`, `fontStretch: "condensed"`, `fontVariationSettings: "wdth" 75, "wght" 600` |
| `mono`    | `JetBrains Mono`  | `JetBrainsMono-VariableFont_wght.ttf`    | H2, caption, подписи / заголовки в таблицах     | `"JetBrains Mono", ui-monospace, monospace` |
| `body`    | `Helvetica Neue`  | `HelveticaNeueCyr-Roman.ttf`             | Обычный текст и цитаты крупным кеглем           | `"Helvetica Neue", Helvetica, Arial, sans-serif` |

Хелперы стилей: `displayStyle`, `monoStyle`, `bodyStyle`, объект `fonts`, стеки `fontStacks`.

## Timing / fps & duration ladder

Код: `src/theme/timing.ts` (не easings). Полная таблица — `skills/Composition.md`.

- Masters: **30 fps**. Loops/chunks: **on twos** (15 fps feel).
- Text/infographics on screen **≥ 2.0 s** (`holdTextMinFrames = 60`), then **HOLD**.
- Ladder @ 30fps: `<100→2–3f` · `400→12f` · `500→15f` · `600→18f` · `1000→30f` · after → HOLD.

## Kinetic type (Do / Don’t)

Плоская 2D кинетика. Сетка и snap — как в `skills/Composition.md`.

### Do

- Flat 2D kinetic type: **slide**, **stack**, **scale**, **stagger**, offset repeats (`EXTEND` / `FFFFORWARD` style), vertical stacks, diagonal placements — **без** 3D-искажений.
- Game-like **overshoot / settle** через **`expressive`** или **`standardSmooth`** + короткие holds (ступени ladder).
- Terminal rhythm: monospace readouts (`mono`), counters, bracketed roles.

### Don’t (антипример)

- No **perspective** distortion of type.
- No **non-uniform height/width squash** of glyphs for “cool” warp.
- No **mesh-warp** type.

Uniform scale ок; squash/stretch глифов и 3D/mesh — нет.

## Easings

Код: `src/theme/easings.ts`. Другие bezier не подбирать без явного запроса.

| Token             | Cubic bezier              | Когда                                      |
| ----------------- | ------------------------- | ------------------------------------------ |
| `standardSmooth`  | `[0.40, 0.14, 0.30, 1.00]` | Обычное UI-движение                        |
| `decelerate`      | `[0.00, 0.00, 0.00, 1.00]` | Выезд / остановка                          |
| `expressive`      | `[0.50, 0.00, 0.00, 1.00]` | Акцент / характер                          |

Готовые Remotion-функции: `easingStandardSmooth`, `easingDecelerate`, `easingExpressive`.

Реэкспорт темы: `src/theme/index.ts`.

## Formats & grid

Источник правды: **`skills/Composition.md`**.

- `cellSizePx = 45`; дефолт **`feed-4x5`**. У формата обязательны `marginTop|Right|Bottom|Left` (клетки) — для **static** only.
- **staticGrid** — координаты внутри margins/safe-area; snap/typeSize; для заголовков/якорей; невидима.
- **dynamicGrid** — **без отступов**, full-bleed кадр; анимируемые ячейки; не для brand anchors.
- Debug `showGrid=false` по умолчанию; chrome — белая обводка.

## Media frame punch

Шейпы (овал…) = маски под футаж. Вход в media: короткий punch ~`ms500` (lens + cyan/pink ramp + mono caption scatter по staticGrid) → гаснет. Паттерн в `src/components/mediaFrame/` / `skills/Components.md` — переиспользовать, не копипастить one-off.

