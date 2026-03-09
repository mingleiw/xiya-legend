# xiya-legend — 夕雅传说（可玩版 MVP）

一个用 **Capacitor** 包装的轻量文字冒险游戏原型。

## 试玩
直接打开 `www/index.html` 就能玩（自动存档到 localStorage）。

## 写剧情
主要改 `www/story.js`：
- `STORY.scenes` 里加 scene
- 每个 scene 有 `text` 和 `choices`

## 存档
- 自动保存：`localStorage`
- UI 提供导出/导入（复制 JSON）
