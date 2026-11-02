# Composition

Skill про композицию кадра / motion-layout. Не путать с `src/Composition.tsx`.

## Мультиформатность

Каталог: `src/theme/formats.ts`. `cellSizePx = 45`. Дефолт превью: **`feed-4x5`**.

| id | Ratio | Frame cells | px | Margins (cells, default) |
|---|---|---|---|---|
| `feed-9x16` | 9:16 | 45×80 | 2025×3600 | 1 / 1 / 1 / 1 |
| `feed-4x5` | 4:5 | 24×30 | **1080×1350** | 1 / 1 / 1 / 1 |
| `feed-1x1` | 1:1 | 45×45 | 2025×2025 | 1 / 1 / 1 / 1 |
| `landscape-16x9` | 16:9 | 32×18 | 1440×810 | 1 / 1 / 1 / 1 |

Обязательные поля формата: `marginTop`, `marginRight`, `marginBottom`, `marginLeft` (в **клетках**; px = n × `cellSizePx`). Safe-area = кадр минус margins. Контент и **staticGrid** живут внутри safe-area, не от (0,0) кадра. `getSafeAreaRect(format)`.

## Две сетки

### staticGrid (данные)

Код: `src/theme/grid.ts` → `createStaticGrid` / `staticGrid` / `staticGridFor`.

- Только координаты: `origin` (с margins), `step`, `cols×rows` (рабочее поле), `snapPoint`, `typeSize`, `lineHeight`.
- **Не анимируется. Не рисуется** в финале.
- Заголовки, брендовые якоря, «можно ставить сюда» — **только staticGrid (+ margins)**.

### dynamicGrid (движение)

Код: `src/components/dynamicGrid/*` → `DynamicGrid`, `GridCell`.

- Может анимировать рёбра / порождать локальные ячейки для временных объектов.
- **Не** подменяет static для заголовков и brand anchors.
- **Без отступов (no margins):** edges 0…1 от **полного кадра** `(0,0)→(widthPx,heightPx)`. Не использует `margin*` / safe-area формата — это только для staticGrid.
- `easingId` из `theme/easings`. Схлоп track < ε → ячейку не монтировать.
- `showGrid` default **false**. Chrome: белая обводка, без ярких заливок.

#### Морф 2×2 → 3×3 → full (вырожденные рёбра)

Демо = дефолт studio: `DynamicGridMorphDemo` → composition **`RebootMotionIdentity`**.

- Топология **всегда 3×3** (`edges.length = 4`). Не менять count DOM mid-flight; zero-area → не монтировать.
- **2×2:** `EDGES_2X2 = [0, 0.5, 0.5, 1]`
- **3×3:** `EDGES_3X3 = [0, 1/3, 2/3, 1]` — центр растёт из креста
- **Full handoff:** `EDGES_FULL_CENTER = [0, 0, 1, 1]` — ячейка `(1,1)` на весь кадр
- **Center fill:** `CellVideoFill` + `public/footage/center-sensor.mp4` (`keepMounted`) — видео не размонтируется при схлопе; рост 3×3→full **seamless**. Chrome-ячейки + `gridOpacity` гаснут к handoff.
- **Длительность:** holds на 2×2 / 3×3 ≥ `holdTextMinFrames` (60ф); full-frame hold = `2×holdTextMinFrames + ms1000` — морф и сенсор в одном continuous таймлайне (`DYNAMIC_GRID_MORPH_DURATION`).
- Debug: `showGrid` + `gridOpacity` на морфе; prod `showGrid` default false

#### Continuous transitions (как AE pre-compose handoff)

Сетка и сцены **continuous**: если ячейка выросла в full frame (`EDGES_FULL_CENTER`), **следующая сцена / Sequence** открывается с **тех же edges** на своём frame 0 (`sceneAfterHandoffKeyframes`, `MORPH_HANDOFF_FRAME`). Без hard cut и без смены топологии mid-flight.


## Сетка невидима

Debug клеток/уголков (`DebugGrid`, `DynamicGrid.showGrid`) — **выкл по умолчанию**. В превью только явно (`showGrid={true}` / `SHOW_DEBUG_GRID`).

Когда сетка/ячейки всё же видны (debug или chrome): **белая обводка, без ярких заливок** — см. `skills/Identity.md` → Заливки.

## Display headline

`DisplayHeadline` — только `staticGrid`. Props: `text`, `col`, `row`, `sizeSteps`, `lineHeightSteps`.

## Media frame intro (переход к футажу)

Переиспользуемый **язык перехода** к медиа во фрейме — не one-off сцены.

- Примитивные шейпы (**овал** и др.) = **фреймы/маски** под футаж (`MediaFrame`).
- Короткий **punch** ~`ms500`: лёгкий lens/barrel + color ramp (cyan/pink из theme) + step-разлёт caption’ов JetBrains Mono по **staticGrid** → всё гаснет; дальше чистый футаж в маске.
- API: `useMediaIntroPunch`, `<MediaFrameIntro src amountLens amountRamp />`, `<CaptionScatter items />`, `LensDistort`, `ColorRamp`, `FrameChrome`.
- Type снаружи маски **не** скейлится от media. Caption позиции только step/snap по staticGrid (без lerp px).
- Демо: composition id **`MediaFrameIntro`** (`src/compositions/MediaFrameIntroDemo.tsx`).

Детали компонентов → `skills/Components.md`.

## Kinetic type / timing

Do/Don’t → `skills/Identity.md`. Timing ladder → ниже / `src/theme/timing.ts`.

- Masters **30 fps**; loops **on twos**; text/infographics ≥ **2.0 s** hold.
- Ladder: `<100→2–3f` · `400→12` · `500→15` · `600→18` · `1000→30` · after → HOLD.
