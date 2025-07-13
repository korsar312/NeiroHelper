import { FilesInterface } from "../Files.interface";
import { dirname, join } from "path";
import { promises as fs } from "fs";
import { createReadStream } from "node:fs";
import readline from "node:readline";
import readXlsxFile from "read-excel-file/node";
import { throwFn } from "../../../Utils";

class FilesImp implements FilesInterface.IAdapter {
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

	private async createPath(params: FilesInterface.IParams) {
		const dirPath = join(params.path, params.name + params.format);
		await this.ensureDir(params.path);
		await this.ensureDir(dirPath);

		return dirPath;
	}

	async readFile(params: FilesInterface.IParams) {
		const dirPath = await this.createPath(params);
		await this.createFile(params);

		switch (params.format) {
			case FilesInterface.EFormat.TXT:
				return await fs.readFile(dirPath, "utf8");
			case FilesInterface.EFormat.JSON:
				return JSON.parse(await fs.readFile(dirPath, "utf8"));
			case FilesInterface.EFormat.EXCEL:
				return await readXlsxFile(dirPath);
			case FilesInterface.EFormat.JSONL:
				return await this.ndJsonParse(dirPath);
			default:
				throwFn(`Неизвестный тип для чтения файла: ${params.format}`);
		}
	}

	async addToFile(params: FilesInterface.IParams, text: string) {
		const dirPath = await this.createPath(params);
		await this.createFile(params);

		await fs.appendFile(dirPath, text + "\n", { encoding: "utf8" });
	}

	async createFile(params: FilesInterface.IParams) {
		const dirPath = await this.createPath(params);

		try {
			await fs.access(dirPath);
		} catch {
			await fs.writeFile(dirPath, "", "utf8");
		}
	}
}

export default FilesImp;
