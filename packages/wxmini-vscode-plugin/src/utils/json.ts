import * as vscode from 'vscode';
import * as fs from "fs"


export function readJSON(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}


export function updateJSON(filePath: string, key: string, value: string, method = '') {
  const appConfig = readJSON(filePath);

  if (method) {
    appConfig[key][method](value);
  } else {
    appConfig[key] = value;
  }

  fs.writeFileSync(filePath, JSON.stringify(appConfig, null, 2));
}
