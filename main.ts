/*
 * This plugin was developed with the assistance of ChatGPT, a language model created by OpenAI.
 * https://openai.com/
 */

import { Plugin } from 'obsidian';
import * as path from 'path';

export default class MyPlugin extends Plugin {
	private updateTimer: number;

	async onload() {
		console.log('My plugin has loaded!');

		// Run the plugin when it is first loaded
		await this.updateFolders();

		// Register an interval to check for updates to the folder structure
		this.updateTimer = window.setInterval(async () => {
			await this.updateFolders();
		}, 5000);
	}

	async onunload() {
		window.clearInterval(this.updateTimer);
	}

	async updateFolders() {
		const vault = this.app.vault;
		const fm = this.app.vault.adapter;

		// Get all the files in the vault
		const files = vault.getMarkdownFiles();

		// Loop through each file
		for (const file of files) {
			// Get the parent directory of the file
			const dirPath = path.dirname(file.path);
			if (!dirPath) {
				console.log(`Unable to find parent folder for file ${file.path}`);
				continue;
			}

			const nomediaPath = path.join(dirPath, '.nomedia');

			// Check if the .nomedia file already exists in the directory or its parent
			if (!await vault.adapter.exists(nomediaPath)) {
				const parentDirPath = path.dirname(dirPath);
				const parentNomediaPath = path.join(parentDirPath, '.nomedia');
				if (!await vault.adapter.exists(parentNomediaPath)) {
					// If not, create the .nomedia file in the parent directory
					await vault.create(parentNomediaPath, 'nomedia');
					await fm.append(path.normalize(parentDirPath), '.nomedia');
					console.log(`Created ${parentNomediaPath}`);
				}
			}
		}
	}
}
