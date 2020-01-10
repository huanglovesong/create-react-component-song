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

    createComponentDir: function (uri, componentName, isInit) {
      let contextMenuSourcePath;

      if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
        contextMenuSourcePath = uri.fsPath;
      } else if (uri) {
        contextMenuSourcePath = path.dirname(uri.fsPath);
      } else {
        contextMenuSourcePath = vscode.workspace.rootPath;
      }

      let componentDir = isInit ? `${contextMenuSourcePath}/${pascalCase(
        componentName
      )}` : `${contextMenuSourcePath}`;
      fse.mkdirsSync(componentDir);

      return componentDir;
    },

    createComponent: function (componentDir, componentName, type) {
      let templateFileName = this.templatesDir + `/${type}.template`;

      const compName = pascalCase(componentName);
      const cName = camelCase(componentName);
      console.log(componentDir, 23123);
      let componentContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{componentName}/g, compName).replace(/{cName}/g, cName);
      // 如果是不同的东西生成的路径不一样
      let filename = type === 'class' ? `${componentDir}/components/${compName}/${compName}.js` : `${componentDir}/${compName}.js`;

      return this.createFile(filename, componentContent);
    },
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
    // createTestFile: function (componentDir, componentName) {
    //   let templateFileName = this.templatesDir + `/test.template`;

    //   const compName = pascalCase(componentName);

    //   let componentContent = fs
    //     .readFileSync(templateFileName)
    //     .toString()
    //     .replace(/{componentName}/g, compName);

    //   let filename = `${componentDir}/${compName}.test.js`;

    //   return this.createFile(filename, componentContent);
    // },

    // createPackageJSON: function(componentDir, componentName) {
    //   let templateFileName = this.templatesDir + '/package.template';

    //   const compName = pascalCase(componentName);
    //   let indexContent = fs
    //     .readFileSync(templateFileName)
    //     .toString()
    //     .replace(/{componentName}/g, compName);

    //   let filename = `${componentDir}/package.json`;

    //   return this.createFile(filename, indexContent);
    // },

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
