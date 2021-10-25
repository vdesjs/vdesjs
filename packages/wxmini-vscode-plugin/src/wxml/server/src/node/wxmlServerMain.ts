
import { createConnection, Connection, Disposable } from 'vscode-languageserver/node';
import { RuntimeEnvironment, startServer } from '../wxmlServer';
import { getNodeFSRequestService } from './nodeFs';


const connection: Connection = createConnection();

// console.log = connection.console.log.bind(connection.console);
// console.error = connection.console.error.bind(connection.console);

const runtime: RuntimeEnvironment = {
	timer: {
		setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable {
			const handle = setImmediate(callback, ...args);
			return { dispose: () => clearImmediate(handle) };
		},
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
			const handle = setTimeout(callback, ms, ...args);
			return { dispose: () => clearTimeout(handle) };
		}
	},
	file: getNodeFSRequestService()
};

startServer(connection, runtime)

