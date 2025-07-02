#!/usr/bin/env ts-node

import { execSync } from "child_process";
import { existsSync, statSync, copyFileSync, cpSync, rmSync } from "fs";
import { resolve, join } from "path";

function main(): void {
	const rootDir = process.cwd();
	const distDir = resolve(rootDir, "dist");
	const envFile = resolve(rootDir, ".env");
	const publicDir = resolve(rootDir, "public");

	try {
		// 0) Очищаем dist/, если есть
		if (existsSync(distDir)) {
			console.log("🧹 Cleaning dist/ …");
			rmSync(distDir, { recursive: true, force: true });
		}

		// 1) Сборка ncc
		console.log("⚙️  Building with ncc…");
		execSync("ncc build src/index.ts -o dist", { stdio: "inherit" });

		// 2) Копируем .env
		if (existsSync(envFile) && statSync(envFile).isFile()) {
			copyFileSync(envFile, join(distDir, ".env"));
			console.log("✅  .env copied to dist/");
		} else {
			console.log("ℹ️  .env not found — skipping");
		}

		// 3) Копируем public/
		if (existsSync(publicDir) && statSync(publicDir).isDirectory()) {
			cpSync(publicDir, join(distDir, "public"), { recursive: true });
			console.log("✅  public/ copied to dist/public/");
		} else {
			console.log("ℹ️  public/ not found — skipping");
		}

		// 3) Упаковываем весь dist/ (+ .env) в один исполняемый файл через pkg
		//console.log("📦  Packaging into single executable with pkg …");
		//execSync("npx pkg dist/index.js --out-path dist --targets node20-linux-x64", { stdio: "inherit" });

		console.log("🎉  Build complete!");
	} catch (err) {
		console.error("❌  Build failed:", err);
		process.exit(1);
	}
}

main();
