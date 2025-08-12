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
		PAYMENT = "pay",
	}

	export enum EFileName {
		LEARN = "learn",
		AUTH = "userAuthList",
		PROMPT = "Instruction",
		STAT = "Statistic",
		CONT = "Context",
	}

	export enum EFormat {
		JSON = ".JSON",
		JSONL = ".jsonl",
		TXT = ".txt",
		EXCEL = ".xlsx",
	}

	export const FilePath = {
		LOG_SAY: () => ({
			path: `${EFolder.RECURSES}/${EFolder.HISTORY}`,
			name: EFileName.STAT,
			format: EFormat.JSONL,
		}),

		LOG_PAY: () => ({
			path: `${EFolder.RECURSES}/${EFolder.PAYMENT}`,
			name: EFileName.STAT,
			format: EFormat.JSONL,
		}),

		LEARN: () => ({
			path: `${EFolder.RECURSES}/${EFolder.LEARN}`,
			name: EFileName.LEARN,
			format: EFormat.JSONL,
		}),

		INSTRUCTION: () => ({
			path: `${EFolder.RECURSES}/${EFolder.PROMPT}`,
			name: EFileName.PROMPT,
			format: EFormat.TXT,
		}),

		CONTEXT: () => ({
			path: `${EFolder.RECURSES}/${EFolder.PROMPT}`,
			name: EFileName.CONT,
			format: EFormat.TXT,
		}),

		STATISTIC: () => ({
			path: `${EFolder.RECURSES}/${EFolder.PROMPT}`,
			name: EFileName.STAT,
			format: EFormat.EXCEL,
		}),
	} satisfies Record<string, (name: string) => IParams>;

	export interface IParams {
		path: string;
		name: string;
		format: EFormat;
	}
}
