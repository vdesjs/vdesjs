import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { startClient, LanguageClientConstructor } from '../wxmlClient';
import { getNodeFSRequestService } from './nodeFs';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';
import TelemetryReporter from 'vscode-extension-telemetry';


let telemetry: TelemetryReporter | undefined;


export function wxmlClient(context: vscode.ExtensionContext) {
  let clientPackageJSON = getPackageInfo(context);

  const serverMain = "src/wxml/server/dist/server.js"
  const serverModule = context.asAbsolutePath(
    serverMain
  );
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	};

  const newLanguageClient: LanguageClientConstructor = (id: string, name: string, clientOptions: LanguageClientOptions) => {
		return new LanguageClient(id, name, serverOptions, clientOptions);
	};

	const timer = {
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): vscode.Disposable {
			const handle = setTimeout(callback, ms, ...args);
			return { dispose: () => clearTimeout(handle) };
		}
	};

  startClient(context, newLanguageClient, { fs: getNodeFSRequestService(), TextDecoder, telemetry, timer });




}


interface IPackageInfo {
	name: string;
	version: string;
	aiKey: string;
	main: string;
}

function getPackageInfo(context: vscode.ExtensionContext): IPackageInfo {
	const location = context.asAbsolutePath('./package.json');
	try {
		return JSON.parse(fs.readFileSync(location).toString());
	} catch (e) {
		console.log(`Problems reading ${location}: ${e}`);
		return { name: '', version: '', aiKey: '', main: '' };
	}
}
