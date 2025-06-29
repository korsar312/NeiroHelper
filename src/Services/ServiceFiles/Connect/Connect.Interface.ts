export namespace ConnectInterface {
	export interface BaseClass {
		addToFile(dirPath: string, addText: string): Promise<void>;

		readTxt<T>(dirPath: string): Promise<string>;

		readNdJson<T>(dirPath: string): Promise<T>;
	}

	export enum EFolder {
		RECURSES = "public",
	}

	export enum EFormat {
		JSON = ".JSON",
		JSONL = ".jsonl",
		TXT = ".txt",
	}

	export const EFilePath = {
		LEARN: `${EFolder.RECURSES}/learn/learn${EFormat.JSONL}`,
		HISTORY_DIALOG: (name: string) => `${EFolder.RECURSES}/history/users/${name}${EFormat.JSONL}`,
		AUTH: `${EFolder.RECURSES}/auth/auth${EFormat.JSONL}`,
		INSTRUCTION: `${EFolder.RECURSES}/promt/Instruction${EFormat.TXT}`,
	};
}
