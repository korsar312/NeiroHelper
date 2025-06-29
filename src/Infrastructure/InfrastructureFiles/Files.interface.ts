export namespace FilesInterface {
	export interface IAdapter {
		readFile<T>(params: IParams): Promise<T>;

		addToFile(params: IParams, text: string): Promise<void>;

		createFile(params: IParams): Promise<void>;
	}

	export enum EFolder {
		RECURSES = "public",
		LEARN = "learn",
		AUTH = "auth",
		PROMPT = "Instruction",
		HISTORY = "historyUser",
	}

	export enum EFileName {
		LEARN = "learn",
		AUTH = "userAuthList",
		PROMPT = "Instruction",
	}

	export enum EFormat {
		JSON = ".JSON",
		JSONL = ".jsonl",
		TXT = ".txt",
	}

	export const EFilePath = {
		LEARN: () => ({
			path: `${EFolder.RECURSES}/${EFolder.LEARN}`,
			name: EFileName.LEARN,
			format: EFormat.JSONL,
		}),

		HISTORY: (userId: string) => ({
			path: `${EFolder.RECURSES}/${EFolder.HISTORY}`,
			name: userId,
			format: EFormat.JSONL,
		}),

		AUTH: () => ({
			path: `${EFolder.RECURSES}/${EFolder.AUTH}`,
			name: EFileName.AUTH,
			format: EFormat.JSONL,
		}),

		INSTRUCTION: () => ({
			path: `${EFolder.RECURSES}/${EFolder.PROMPT}`,
			name: EFileName.PROMPT,
			format: EFormat.TXT,
		}),
	} satisfies Record<string, (name: string) => IParams>;

	export interface IParams {
		path: string;
		name: string;
		format: EFormat;
	}
}
