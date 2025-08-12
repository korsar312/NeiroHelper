import ConnectBase from "../Connect.base";
import { dirname } from "path";
import { promises as fs } from "fs";
import { createReadStream } from "node:fs";
import readline from "node:readline";

class ConnectFS extends ConnectBase {
	private async ensureDir(dirPath: string): Promise<void> {
		const path = dirname(dirPath);

		await fs.mkdir(path, { recursive: true });
	}

	private async ndJsonParse(dirPath: string) {
		const stream = createReadStream(dirPath, { encoding: "utf8" });
		const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

		const result: Record<string, any>[] = [];
		for await (const line of rl) {
			if (!line.trim()) continue;

			try {
				result.push(JSON.parse(line));
			} catch (e) {
				console.log(`ndJsonParse ${e}`);
			}
		}

		return result;
	}

	async readNdJson(dirPath: string) {
		try {
			return JSON.parse(await fs.readFile(dirPath, "utf8"));
		} catch {
			return this.ndJsonParse(dirPath);
		}
	}

	async addToFile(dirPath: string, addText: string): Promise<void> {
		await this.ensureDir(dirPath);
		await fs.appendFile(dirPath, addText + "\n", { encoding: "utf8" });
	}

	async readTxt(dirPath: string): Promise<string> {
		await this.ensureDir(dirPath);
		return await fs.readFile(dirPath, { encoding: "utf8" });
	}
}

export default ConnectFS;
