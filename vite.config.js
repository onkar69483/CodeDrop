import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { isoImport } from 'vite-plugin-iso-import';
export default defineConfig({

plugins: [sveltekit(), isoImport()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	optimizeDeps: {
		exclude: [
			'@mapbox/node-pre-gyp',
			'mock-aws-s3',
			'aws-sdk',
			'nock',
			'bcrypt'
		]
	}
});



