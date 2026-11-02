# Components

## DisplayHeadline

`src/components/DisplayHeadline.tsx` — H1 на **staticGrid** (TT Bluescreens).

- Props: `text`, `col`, `row`, `sizeSteps`, `lineHeightSteps`, `grid?` (= `staticGrid`)
- Якорь только через static + margins. Не через dynamicGrid.

## DebugGrid

`src/components/DebugGrid.tsx` — оверлей **staticGrid**.

- `showGrid` default **false** (в финале сетка невидима).

## DynamicGrid / GridCell

`src/components/dynamicGrid/` (реэкспорт `src/components/index.ts`).

### DynamicGrid

Props: `formatId`, `cols`, `rows`, `keyframes: { frame, colEdges[], rowEdges[] }[]`, `easingId`, `showGrid?=false`, `epsilon?`.

- Интерполяция рёбер: `useCurrentFrame` + `interpolate` + `easingById` (без чужих API).
- Edges монотонные, длина `cols+1` / `rows+1`, доли 0…1 **полного кадра** (без margins / safe-area).
- `showGrid` default false.
- Морф: `EDGES_2X2` → `EDGES_3X3` → `EDGES_FULL_CENTER` (`DynamicGridMorphDemo`). Handoff continuous — next scene frame 0 = last edges.
- Дефолт composition: `RebootMotionIdentity` = этот морф (без HELLO WORLD).

### GridCell

Props: `col`, `row`, `colSpan?`, `rowSpan?`, `content?: 'media' | 'type'`, `children`.

- Wrapper `overflow: hidden`. Track/площадь < ε → `null` (не монтировать).
- `media` — cover/fill, скейлится с ячейкой.
- `type` — только клип; кегль из typography / `staticGrid.typeSize` (не от размера ячейки).

### MediaPlaceholder

Stand-in для media-ячеек: **transparent + white stroke** (`gridStroke`). Без ярких заливок.

### CellVideoFill

`src/components/dynamicGrid/CellVideoFill.tsx` — cover-видео в ячейке (`OffthreadVideo`).

- Props: `col`, `row`, `src?` (default `footage/center-sensor.mp4`), `keepMounted?`
- `resolveRectRaw` + `keepMounted`: при нулевой площади opacity 0, но слой **не размонтируется** → seamless expand к full frame.
- Не скейлит type снаружи; только media cover внутри ячейки.

## Media frame intro pattern

`src/components/mediaFrame/` — язык входа в футаж внутри shape-mask.

| Export | Role |
|---|---|
| `MediaFrame` | Овал (и др.) как маска/фрейм под media |
| `FrameChrome` | Крестики в углах кадра + тики у овала (white stroke) |
| `LensDistort` | Barrel UV warp (WebGL fragment); `amount` 1→0; не CSS `filter:url` |
| `ColorRamp` | Duotone cyan/pink (theme); mix → 0 |
| `CaptionScatter` | JetBrains Mono; poses step по `staticGrid`; после punch `active=false` → unmount |
| `useMediaIntroPunch` | `amountLens` / `amountRamp` / `active` за `ms500` (decelerate / standardSmooth) |
| `MediaFrameIntro` | Сборка паттерна: `<MediaFrameIntro src? amountLens? amountRamp? />` |

Паттерн переиспользуемый для любого входа в медиа во фрейме, не сцена-одноразовка.

