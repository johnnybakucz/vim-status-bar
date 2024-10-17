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

		function updateUserSettings() {
			const config = vscode.workspace.getConfiguration();
			const currentImports = config.get('vscode_custom_css.imports') as string[];

			// Remove old css file
			currentImports.filter((importPath) => !importPath.includes('vim-status-bar.css'));

			const useMonokai = config.get('vim-status-bar.useMonokai') as boolean;


			let cssFilePath = findExtensionPath('jonatanbakucz.vim-status-bar') as string;
			if (useMonokai) {
				cssFilePath = path.join(cssFilePath, '/monokai-vim-status-bar.css');
			} else {
				cssFilePath = path.join(cssFilePath, '/vim-status-bar.css');
			}

			let fileUri = `file://${cssFilePath}`;

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

		updateUserSettings();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
	vscode.commands.executeCommand('extension.unInstallCustomCSS');
}
