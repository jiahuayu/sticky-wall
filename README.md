# DSH 便签墙 / Sticky Wall

给 [DeepSeek Harness](https://github.com/deepseek-ai) 的一个便签墙插件：左侧栏入口，整页彩色便签，随手记灵感。

![便签墙页面](docs/preview.svg)

## 功能

- 左侧栏导航新增「便签墙」入口，点开在主区域整页展示
- 彩色便签纸：黄、粉、蓝、绿、紫、米白；默认「随机」，每贴一张换一种颜色
- 分类标签：可选，便签左上角显示；分类行始终占位，保证正文对齐
- 原地编辑：点便签底部的编辑图标，直接改写文字和分类
- 置顶：卡片右上角的箭头，点了就排到最前面
- 搜索：同时匹配正文和分类
- 删除：鼠标移上去出现删除按钮，删掉后 8 秒内可以撤销
- 自动保存：便签和没写完的草稿都存在浏览器 localStorage，刷新页面不丢

## 安装

这是一个 DeepSeek Harness 插件包（bundle）。

1. 克隆或下载本仓库到本地
2. 打开 DSH → 设置 → 插件 → 添加插件 → 选择本仓库根目录
3. 左侧栏出现「便签墙」这一行

## 目录结构

```
package.json        插件清单，声明 bundle patch 与客户端入口
cordis.patch.yml    把插件插进 profile 的 loader 补丁
index.js            Host 端（本插件无 Host 逻辑，留空）
client.js           客户端全部 UI 与交互
locale/*.json       插件列表里显示的名称与描述（中/英）
docs/               插件详情页的说明与预览图
icon.svg            插件图标
```

## 说明

- 便签数据只保存在本机浏览器的 localStorage（键名前缀 `dsh-sticky-wall:`），不上传任何地方
- 换浏览器或清空站点数据，便签会消失

## License

MIT
