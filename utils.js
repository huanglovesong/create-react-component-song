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
    templatesActicityDir: path.join(__dirname, '/templates/marketActivity'),

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
      if (type === 'createReactActivityClassComponent') {
        type = 'class';
      }
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
      let filename = '';
      if (type === 'class' || type === 'createReactActivityClassComponent') {
        filename = `${componentDir}/components/${compName}/${compName}.js`
      } else {
        filename = `${componentDir}/${compName}.js`
      }
      return this.createFile(filename, componentContent);
    },
    // 创建新增页面模板
    createAddInfoFile: function (componentDir, componentName, type) {
      let dir = this.templatesDir;
      // 如果是营销活动
      if (type === 'activity') {
        dir = this.templatesActicityDir;
      }
      // 读取我们自定义的模板
      let templateFileName = dir + `/addInfo.template`;
      // 处理驼峰大小写的名称
      const compName = pascalCase(componentName);
      const cName = camelCase(componentName);
      let componentContent = fs
        .readFileSync(templateFileName)
        .toString().replace(/{componentName}/g, compName).replace(/{cName}/g, cName);
      // if 是初始化页面写入的路径 else 初始化页面整体模板
      let filename = `${componentDir}/components/${compName}/AddInfo.js`;

      return this.createFile(filename, componentContent);
    },
    // 创建less文件(活动)
    createActivityCss: function (componentDir, componentName, type) {
      let templateFileName = `${this.templatesActicityDir}/sass.template`;
      const compName = camelCase(componentName);
      let cssContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{componentName}/g, compName);
      let filename = `${componentDir}/components/${compName}/less/add.less`;
      return this.createFile(filename, cssContent);
    },
    // 步骤一(活动)
    createActivityStepOneFile: function (componentDir, componentName, type) {

      // 读取我们自定义的模板
      let templateFileName = this.templatesActicityDir + `/stepOne.template`;
      // 处理驼峰大小写的名称
      const compName = pascalCase(componentName);
      let componentContent = fs
        .readFileSync(templateFileName)
        .toString()
      // if 是初始化页面写入的路径 else 初始化页面整体模板
      let filename = `${componentDir}/components/${compName}/StepOne.js`;

      return this.createFile(filename, componentContent);
    },

    // 步骤二(活动)
    createActivityStepTwoFile: function (componentDir, componentName, type) {

      // 读取我们自定义的模板
      let templateFileName = this.templatesActicityDir + `/stepTwo.template`;
      // 处理驼峰大小写的名称
      const compName = pascalCase(componentName);
      let componentContent = fs
        .readFileSync(templateFileName)
        .toString()
      // if 是初始化页面写入的路径 else 初始化页面整体模板
      let filename = `${componentDir}/components/${compName}/StepTwo.js`;

      return this.createFile(filename, componentContent);
    },
    // 创建活动商品通用组件
    createActivityProductComponent: function (componentDir, componentName, type) {
      // 读取我们自定义的模板
      let templateFileName = this.templatesActicityDir + `/AddProduct.template`;
      // 处理驼峰大小写的名称
      const compName = pascalCase(componentName);
      let componentContent = fs
        .readFileSync(templateFileName)
        .toString()
      // if 是初始化页面写入的路径 else 初始化页面整体模板
      let filename = `${componentDir}/components/${compName}/components/AddProduct.js`;

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
    },
    updateRouterTopFile: function (componentDir, componentName) {
      let data = fs.readFileSync(`${componentDir}/Router.js`).toString();
      const compName = pascalCase(componentName);
      const topInsertText = `
  const ${compName} = dynamic({
    app,
    component: () => import('./components/${compName}'),
  });

  const ${compName}Add = dynamic({
    app,
    component: () => import('./components/${compName}/AddInfo'),
  });
`;
      let index = data.indexOf('const RouterWrapper') || data.indexOf('return (');

      if (index !== -1) {
        index = data.indexOf('\n', index);

        if (index === -1) {
          index += 'const RouterWrapper'.length;
        } else {
          index++;
        }

        const newData = [data.slice(0, index), topInsertText, data.slice(index)].join('');
        fs.writeFileSync(`${componentDir}/Router.js`, newData, 'utf8');
      } else {
        console.error("Can't find 'const RouterWrapper' in the file.");
      }
    },
    updateRouterLastFile: function (componentDir, componentName) {

      const compName = camelCase(componentName);
      const compNamePascalCase = pascalCase(componentName);
      let data = fs.readFileSync(`${componentDir}/Router.js`).toString();
      let lastIndex = -1;
      let lastInsertText = '';
      // 商户侧1.0
      if (data.indexOf('</Switch>') !== -1) {
        lastIndex = data.indexOf('</Switch>');
        lastInsertText = `
            <Route exact path="/${compName}" render={(props) => WraperRouter(props, ${compNamePascalCase})} />
            <Route exact path="/${compName}/${compName}Add" render={(props) => WraperRouter(props, ${compNamePascalCase}Add)} />
      `;
      }
      // 商户侧2.0
      else if (data.indexOf('<Route component={Flayout.Page404} />') !== -1) {
        lastIndex = data.indexOf('<Route component={Flayout.Page404} />');
        lastInsertText = `
            <Route exact path="/${compName}"  component={${compNamePascalCase}}  />
            <Route exact path="/${compName}/${compName}Add" component={${compNamePascalCase}Add}  />
      `;
      }
      const lastData = [data.slice(0, lastIndex), lastInsertText, data.slice(lastIndex)].join('');
      setTimeout(() => {
        fs.writeFileSync(`${componentDir}/Router.js`, lastData, 'utf8');

      }, 500);
    },
    updateIndexJS: function (componentDir, componentName) {
      const compName = camelCase(componentName);
      const data = fs.readFileSync(`${componentDir}/index.js`).toString();
      const insertText = `app.model(require('./models/${compName}').default);\n`;
      const index = data.indexOf('app.start');

      if (index !== -1) {
        const newData = [data.slice(0, index), insertText, data.slice(index)].join('');
        fs.writeFileSync(`${componentDir}/index.js`, newData, 'utf8');
      } else {
        console.error("Can't find 'app.start' in the file.");
      }
    },
  }
};
