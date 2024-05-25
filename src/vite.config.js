import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	// @see https://ja.vuejs.org/guide/scaling-up/testing#recipes
	test: {
		// jest ライクなグローバルテスト API を有効化
		globals: true,
		// happy-dom で DOM をシミュレーションします
		// （peer dependency として happy-dom のインストールが必要です）
		environment: "happy-dom",
	},
});
