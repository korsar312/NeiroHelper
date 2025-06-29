export namespace HistoryInterface {
	export interface IAdapter {
		clearHistory(id: number): Promise<void>;

		setHistory(id: number, idMessage: number, question: string, answer: string): Promise<void>;

		getHistory(id: number, last: number): Promise<IHistoryField[]>;
	}

	export interface IHistoryField {
		question: string;
		answer: string;
	}
}
