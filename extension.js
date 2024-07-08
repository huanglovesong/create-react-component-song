/*
 * @Author: hjuangsong huangsong
 * @Date: 2024-06-26 14:17:44
 * @LastEditors: hjuangsong huangsong
 * @LastEditTime: 2024-07-08 19:27:11
 * @FilePath: \create-react-component-song\extension.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use strict';
const vscode = require('vscode');
const paramCase = require('change-case').paramCase;
const utils = require('./utils');
const { logger, generators } = utils;

function activate(context) {
  let createComponent = (uri, type) => {
    console.log('Create-react-component activated...');

    new Promise(resolve =>
      vscode.window
        .showInputBox({
          prompt: 'Enter component name'
        })
        .then(inputValue => resolve(inputValue))
    )
      .then(val => {
        if (val.length === 0) {
          logger('error', 'Component name can not be empty!');
          throw new Error('Component name can not be empty!');
        }

        let componentName = paramCase(val);
        // if 是初始化页面写入的路径 else 初始化页面整体模板
        let componentDir = null;
        if (type === 'initReactComponent') {
          componentDir = generators.createComponentDir(uri, componentName, true);
        }
        else if (type === 'createReactClassComponent') {
          componentDir = generators.createComponentDir(uri, componentName);
        } else if (type === 'createReactActivityClassComponent') {
          componentDir = generators.createComponentDir(uri, componentName);
        }
        // if 是初始化页面写入的路径 else 初始化页面整体模板
        if (type === 'initReactComponent') {
          return Promise.all([
            generators.createComponent(componentDir, componentName, type),
            generators.createTestFile(componentDir, componentName, type),
            generators.createCSS(componentDir, componentName, type),
          ]);
        }
        else if (type === 'createReactClassComponent') {
          return Promise.all([
            generators.createComponent(componentDir, componentName, type),
            generators.createModalComponent(componentDir, componentName, type),
            generators.createTestFile(componentDir, componentName),
            generators.createCSS(componentDir, componentName),
            generators.createAddInfoFile(componentDir, componentName),
            generators.createModelFile(componentDir, componentName),
            generators.createServiceFile(componentDir, componentName),
            generators.updateRouterTopFile(componentDir, componentName),
            generators.updateRouterLastFile(componentDir, componentName),
            generators.updateIndexJS(componentDir, componentName),
          ]);
        } else if (type === 'createReactActivityClassComponent') {
          return Promise.all([
            generators.createComponent(componentDir, componentName, type),
            generators.createModalComponent(componentDir, componentName, type),
            generators.createTestFile(componentDir, componentName),
            generators.createCSS(componentDir, componentName),
            generators.createAddInfoFile(componentDir, componentName,'activity'),
            generators.createActivityStepOneFile(componentDir, componentName),
            generators.createActivityStepTwoFile(componentDir, componentName),
            generators.createActivityProductComponent(componentDir, componentName),
            generators.createActivityCss(componentDir, componentName),
            generators.createModelFile(componentDir, componentName),
            generators.createServiceFile(componentDir, componentName),
            generators.updateRouterTopFile(componentDir, componentName),
            generators.updateRouterLastFile(componentDir, componentName),
            generators.updateIndexJS(componentDir, componentName),
          ]);
        }
      })
      .then(
        () => logger('success', 'React component successfully created!'),
        err => logger('error', err.message)
      );
  };
  // 注册命令
  const componentsList = [
    {
      type: 'class',
      commandID: 'extension.createReactClassComponent'
    },
    {
      type: 'createReactActivityClassComponent',
      commandID: 'extension.createReactActivityClassComponent'
    },
    {
      type: 'initReactComponent',
      commandID: 'extension.initReactComponent'
    }
  ];

  componentsList.forEach(comp => {
    let type = comp.type;
    let disposable = vscode.commands.registerCommand(comp.commandID, uri => {
      createComponent(uri, type);
    });
    context.subscriptions.push(disposable);
  });
}

/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
module.exports = {
  activate
};
