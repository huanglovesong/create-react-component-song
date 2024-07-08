/*
 * @Author: hjuangsong huangsong
 * @Date: 2024-07-08 19:26:18
 * @LastEditors: hjuangsong huangsong
 * @LastEditTime: 2024-07-08 19:27:00
 * @FilePath: \create-react-component-song\utils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
{
  "name": "create-react-component-song",
  "displayName": "create-react-component-song",
  "description": "Util made to quickly create folder with React component, its styles file and test file",
  "author": "834734438",
  "publisher": "834734438",
  "version": "0.1.14",
  "engines": {
    "vscode": "^1.30.0"
  },
  "categories": [
    "Other",
    "Snippets"
  ],
  "activationEvents": [
    "onCommand:extension.createReactClassComponent",
    "onCommand:extension.createReactActivityClassComponent",
    "onCommand:extension.initReactComponent"
  ],
  "main": "./extension.js",
  "contributes": {
    "commands": [
      {
        "command": "extension.createReactClassComponent",
        "title": "Create Class Component"
      },
      {
        "command": "extension.createReactActivityClassComponent",
        "title": "Create Class ActivityComponent"
      },
      {
        "command": "extension.initReactComponent",
        "title": "Init React Component"
      }
    ],
    "menus": {
      "explorer/context": [
        {
          "command": "extension.createReactClassComponent",
          "group": "navigation"
        },
        {
          "command": "extension.createReactActivityClassComponent",
          "group": "navigation"
        },
        {
          "command": "extension.initReactComponent",
          "group": "navigation"
        }
      ]
    }
  },
  "scripts": {
    "postinstall": "node ./node_modules/vscode/bin/install",
    "test": "node ./node_modules/vscode/bin/test",
    "publish": "vsce publish patch"
  },
  "devDependencies": {
    "@types/mocha": "^2.2.42",
    "@types/node": "^8.10.25",
    "eslint": "^4.11.0",
    "typescript": "^3.1.4",
    "vscode": "^1.1.36"
  },
  "dependencies": {
    "change-case": "^3.1.0",
    "fs": "0.0.1-security",
    "fs-extra": "^7.0.1"
  },
  "repository": "https://github.com/huanglovesong/create-react-component-song.git",
  "__npminstall_done": false
}
