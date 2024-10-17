import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('vim-status-bar.toggle', () => {
		let customCssExtension = vscode.extensions.getExtension('be5invis.vscode-custom-css');

		if (!customCssExtension?.isActive) {
			customCssExtension?.activate();
		}

		function findExtensionPath(extensionId: string): string | undefined {
			const extension = vscode.extensions.getExtension(extensionId) || vscode.extensions.getExtension('undefined_publisher.' + extensionId.split('.')[1]);
			return extension?.extensionPath;
		}

		function updateUserSettings(fileUri: string) {
			const config = vscode.workspace.getConfiguration();
			const currentImports = config.get('vscode_custom_css.imports') as string[];
			const useMonokai = config.get('vim-status-bar.useMonokai') as boolean;

			if (useMonokai) {
				applyMonokaiColors();
			}

			if (!currentImports.includes(fileUri)) {
				config.update('vscode_custom_css.imports', [...currentImports, fileUri], vscode.ConfigurationTarget.Global)
					.then(() => {
						vscode.commands.executeCommand('extension.installCustomCSS');
						vscode.commands.executeCommand('extension.installCustomCSS');
						vscode.commands.executeCommand('extension.reloadCustomCSS');
						vscode.commands.executeCommand('extension.reloadCustomCSS');
					}, (error) => {
						vscode.window.showErrorMessage('Failed to update settings: ' + error);
					});
			} else {
				vscode.window.showInformationMessage('CSS file is already in settings.');
				vscode.commands.executeCommand('extension.installCustomCSS');
				vscode.commands.executeCommand('extension.installCustomCSS');
				vscode.commands.executeCommand('extension.reloadCustomCSS');
				vscode.commands.executeCommand('extension.reloadCustomCSS');
			}
		}

		function applyMonokaiColors() {
			const monokaiColors = {
				normal: '#A6E22E',
				insert: '#F92672',
				visual: '#66D9EF',
				visualLine: '#AE81FF',
				visualBlock: '#FD971F'
			};

			const cssContent = `
				#workbench\\.parts\\.statusbar:has([aria-label="-- NORMAL --"]) {
					background-color: ${monokaiColors.normal} !important;
				}
				#workbench\\.parts\\.statusbar:has([aria-label="-- INSERT --"]) {
					background-color: ${monokaiColors.insert} !important;
				}
				#workbench\\.parts\\.statusbar:has([aria-label="-- VISUAL --"]) {
					background-color: ${monokaiColors.visual} !important;
				}
				#workbench\\.parts\\.statusbar:has([aria-label="-- VISUAL LINE --"]) {
					background-color: ${monokaiColors.visualLine} !important;
				}
				#workbench\\.parts\\.statusbar:has([aria-label="-- VISUAL BLOCK --"]) {
					background-color: ${monokaiColors.visualBlock} !important;
				}
			`;

			const filePath = path.join(context.extensionPath, 'monokai-status-bar.css');
			const fs = require('fs');
			fs.writeFileSync(filePath, cssContent);
			updateUserSettings(`file://${filePath}`);
		}

		let filePath = findExtensionPath('jonatanbakucz.vim-status-bar');
		if (filePath) {
			filePath = path.join(filePath, '/vim-status-bar.css');
			updateUserSettings(`file://${filePath}`);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
	vscode.commands.executeCommand('extension.unInstallCustomCSS');
}
