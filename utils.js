'use strict';
const vscode = require('vscode');
const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const pascalCase = require('change-case').pascalCase;
const camelCase = require('change-case').camelCase;

function logger(type, msg = '') {
  switch (type) {
    case 'success':
      return vscode.window.setStatusBarMessage(`Success: ${msg}`, 5000);
    case 'warning':
      return vscode.window.showWarningMessage(`Warning: ${msg}`);
    case 'error':
      return vscode.window.showErrorMessage(`Failed: ${msg}`);
  }
}

module.exports = {
  logger,
  generators: {
    templatesDir: path.join(__dirname, '/templates'),

    createFile: (file, data) =>
      new Promise(resolve => {
        let output = fse.outputFile(file, data);
        resolve(output);
      }),

    resolveWorkspaceRoot: path =>
      path.replace('${workspaceFolder}', vscode.workspace.rootPath),
    // 返回需要返回的路径
    createComponentDir: function (uri, componentName, isInit) {
      let contextMenuSourcePath;

      if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
        contextMenuSourcePath = uri.fsPath;
      } else if (uri) {
        contextMenuSourcePath = path.dirname(uri.fsPath);
      } else {
        contextMenuSourcePath = vscode.workspace.rootPath;
      }
      // if 是初始化页面写入的路径 else 初始化页面整体模板
      let componentDir = isInit ? `${contextMenuSourcePath}/${pascalCase(
        componentName
      )}` : `${contextMenuSourcePath}`;
      fse.mkdirsSync(componentDir);

      return componentDir;
    },
    // 创建组件
    createComponent: function (componentDir, componentName, type) {
      // 读取我们自定义的模板
      let templateFileName = this.templatesDir + `/${type}.template`;
      // 处理驼峰大小写的名称
      const compName = pascalCase(componentName);
      const cName = camelCase(componentName);
      console.log(componentDir, 23123);
      let componentContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{componentName}/g, compName).replace(/{cName}/g, cName);
      // if 是初始化页面写入的路径 else 初始化页面整体模板
      let filename = type === 'class' ? `${componentDir}/components/${compName}/${compName}.js` : `${componentDir}/${compName}.js`;

      return this.createFile(filename, componentContent);
    },
    // 创建modal弹框组件
    createModalComponent: function (componentDir, componentName, type) {
      // 读取我们自定义的模板
      let templateFileName = this.templatesDir + `/showModal.template`;
      // 处理驼峰大小写的名称
      const compName = pascalCase(componentName);
      let componentContent = fs
        .readFileSync(templateFileName)
        .toString()
      // if 是初始化页面写入的路径 else 初始化页面整体模板
      let filename = `${componentDir}/components/${compName}/ShowModal.js`;

      return this.createFile(filename, componentContent);
    },
    // 创建index.js
    createTestFile: function (componentDir, componentName, type) {
      let templateFileName = this.templatesDir + `/test.template`;

      const compName = pascalCase(componentName);

      let componentContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{componentName}/g, compName);

      let filename = type ? `${componentDir}/index.js` : `${componentDir}/components/${compName}/index.js`;

      return this.createFile(filename, componentContent);
    },
    // 创建models文件
    createModelFile: function (componentDir, componentName) {
      let templateFileName = this.templatesDir + `/models.template`;

      const compName = camelCase(componentName);

      let componentContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{componentName}/g, compName);

      let filename = `${componentDir}/models/${compName}.js`;

      return this.createFile(filename, componentContent);
    },
    // 创建services文件
    createServiceFile: function (componentDir, componentName) {
      let templateFileName = this.templatesDir + `/services.template`;

      const compName = camelCase(componentName);

      let componentContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{componentName}/g, compName);

      let filename = `${componentDir}/services/${compName}.js`;

      return this.createFile(filename, componentContent);
    },
    // 创建less文件
    createCSS: function (componentDir, componentName, type) {
      let templateFileName = `${this.templatesDir}/sass.template`;

      const compName = camelCase(componentName);
      let cssContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{componentName}/g, compName);

      let filename = type ? `${componentDir}/less/${compName}.less` : `${componentDir}/components/${compName}/less/${compName}.less`;

      return this.createFile(filename, cssContent);
    }
  }
};
