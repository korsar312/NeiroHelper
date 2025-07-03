export namespace MessageInterface {
	export interface IAdapter {
		getWord(text: EWord, lang: ELang, arrReplace?: Array<string | number>): string;
		getSystemPromt(): Promise<string>;
	}

	export enum EWord {
		PAY_THROTTLE = "PAY_THROTTLE",
		TRC20 = "TRC20",
		MAJOR_INSTRUCTION = "MAJOR_INSTRUCTION",
		MAJOR_HELLO = "MAJOR_HELLO",
		FOR_CAN_WORK = "FOR_CAN_WORK",
		YOUR_ID = "YOUR_ID",
		USDT = "USDT",
		SUBSCRIBE_PERIOD = "SUBSCRIBE_PERIOD",
		CHOICE_PAY_DAY = "CHOICE_PAY_DAY",
		USER_ADDED = "USER_ADDED",
		USER_DELETED = "USER_DELETED",
		BALANCE_DISC = "BALANCE_DISC",
		USER_NOT_FOUND = "USER_NOT_FOUND",
		PAY_DISC = "PAY_DISC",
		TIME_LEFT = "TIME_LEFT",
		SUBSCRIBE_COMPLETE = "SUBSCRIBE_COMPLETE",
		PAY_ADDRESS = "PAY_ADDRESS",
		PAY_SUM = "PAY_SUM",
		PAY_INSTRUCTION = "PAY_INSTRUCTION",
		CLEAR_DISC = "CLEAR_DISC",
		LANG_DISC = "LANG_DISC",
		HISTORY_CLEAN = "HISTORY_CLEAN",
		NO_AUTH = "NO_AUTH",
		SAVE_FILE = "SAVE_FILE",
		GET_FILE_INFO = "GET_FILE_INFO",
		DOWNLOADING_FILE = "DOWNLOADING_FILE",
		TEXT_WILL_BE_SAVE = "TEXT_WILL_BE_SAVE",
		SAVE_TEXT = "SAVE_TEXT",
		GET_TO_LLM = "GET_TO_LLM",
	}

	export enum ELang {
		RU = "RU",
	}

	export type TDictionary = Record<EWord, TMapWord>;
	type TMapWord = Record<ELang, string>;
}
