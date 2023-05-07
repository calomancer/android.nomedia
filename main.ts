/*
 * This plugin was developed with the assistance of ChatGPT, a language model created by OpenAI.
 * https://openai.com/
 */
import { Plugin, TFolder } from 'obsidian';

export default class MyPlugin extends Plugin {
	private createListener: (abstractFile: any) => void;

	async onload() {
		console.log('My plugin has loaded!');
		// Check if a .nomedia file already exists in the vault root

		const rootNomediaPath = `${this.app.vault.getRoot().path}/.nomedia`;
		const rootNomediaExists = await this.app.vault.adapter.exists(rootNomediaPath);

		if (!rootNomediaExists) {
			this.app.vault.create(rootNomediaPath, '');
			console.log(`Created .nomedia file in ${this.app.vault.getRoot().path}`);
		} else {
			console.log(`.nomedia file already exists in ${this.app.vault.getRoot().path}`);
		}

		// Create .nomedia files in new folders
		this.createListener = async (abstractFile) => {
			if (abstractFile instanceof TFolder) {
				const folderNomediaPath = `${abstractFile.path}/.nomedia`;
				const folderNomediaExists = await this.app.vault.adapter.exists(folderNomediaPath);
				if (!folderNomediaExists) {
					await this.app.vault.create(folderNomediaPath, '');
					console.log(`Created .nomedia file in ${abstractFile.path}`);
				} else {
					console.log(`.nomedia file already exists in ${abstractFile.path}`);
				}
			}
		};

		// Register the create event listener
		this.app.vault.on('create', this.createListener);
	}

	async onunload() {
		// Unregister the create event listener on plugin unload
		this.app.vault.off('create', this.createListener);
		console.log('My plugin has been unloaded!');
	}
}
