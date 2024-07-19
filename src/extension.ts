// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('vim-status-bar.toggle', () => {
		let customCssExtension = vscode.extensions.getExtension('be5invis.vscode-custom-css');

		if (customCssExtension?.isActive) {

		} else {
			customCssExtension?.activate();
		}

		vscode.window.showInformationMessage('Hello World from vim-status-bar!');

		const cssContent = `
			#workbench\.parts\.statusbar:has([aria-label="-- NORMAL --"]) {
				background-color: #27981a !important;
			}

			#workbench\.parts\.statusbar:has([aria-label="-- INSERT --"]) {
				background-color: #de080f !important;
			}

			#workbench\.parts\.statusbar:has([aria-label="-- VISUAL --"]) {
				background-color: #8362b1 !important;
			}

			#workbench\.parts\.statusbar:has([aria-label="-- VISUAL LINE --"]) {
				background-color: #62b1b1 !important;
			}
		 `;

		function getGlobalVSCodePath(): string {
			const homeDir = os.homedir();
			let vscodePath: string;

			switch (process.platform) {
				case 'win32':
					vscodePath = path.join(homeDir, 'AppData', 'Roaming', 'Code');
					break;
				case 'darwin':
					vscodePath = path.join(homeDir, 'Library', 'Application Support', 'Code');
					break;
				default: // linux and others
					vscodePath = path.join(homeDir, '.config', 'Code');
					break;
			}

			return vscodePath;
		}

		function findExtensionPath(extensionId: string): string | undefined {
			const extension = vscode.extensions.getExtension(extensionId) || vscode.extensions.getExtension('undefined_publisher.' + extensionId.split('.')[1]);
			return extension?.extensionPath;
		}

		// Define the file path
		let filePath = findExtensionPath('johnnybakucz.vim-status-bar');
		if (filePath) {
			filePath = path.join(filePath, '/vim-status-bar.css');
			// Write the CSS content to the file
			fs.writeFile(filePath, cssContent, (err) => {
				if (err) {
					vscode.window.showErrorMessage('Failed to create CSS file: ' + err.message);
				} else {
					vscode.window.showInformationMessage('CSS file created successfully at: ' + filePath);
				}
			});
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
