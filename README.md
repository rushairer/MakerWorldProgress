# MakerWorld Progress 积分进度插件

## 功能介绍
<img width="536" height="390" alt="image" src="https://github.com/user-attachments/assets/3a795614-cd59-4925-a414-724dff1fd844" />

这是一个 Chrome 浏览器插件，用于显示 MakerWorld 网站的积分进度。它可以帮助用户设置积分目标，并实时显示当前积分达成的百分比，让用户更直观地了解自己的积分完成情况。

## 主要特性

-   支持自定义积分目标设置
-   实时显示当前积分和目标完成百分比
-   自动在积分数字旁显示进度
-   支持 makerworld.com 和 makerworld.com.cn 域名

## 安装说明

1. 下载本项目的所有文件
2. 打开 Chrome 浏览器，进入扩展程序页面（chrome://extensions/）
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择本项目所在的文件夹

## 使用方法

1. 安装完成后，点击 Chrome 工具栏中的插件图标
2. 在弹出的设置窗口中输入您的目标积分数值
3. 点击「保存设置」按钮
4. 访问 MakerWorld 网站，您将看到积分数字旁边显示目标完成百分比

## 文件说明

-   `manifest.json`: 插件配置文件
-   `popup.html`: 设置界面的 HTML 文件
-   `popup.js`: 设置界面的交互逻辑
-   `content.js`: 负责在网页中注入和更新进度显示的脚本

## 注意事项

-   请确保输入的目标积分为正整数
-   插件会自动保存您设置的目标积分
-   进度百分比保留两位小数显示
