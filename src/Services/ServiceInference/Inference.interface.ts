import { OpenAI } from "openai";

export namespace InferenceInterface {
	export interface IAdapter {
		getPromt(question: string, instructions: string, context: string, history: THistoryField[]): Promise<IGenerate | undefined>;
	}

	interface IGenerate extends OpenAI.Responses.Response {}

	export type THistoryField = {
		question: string;
		answer: string;
	};

	export interface IDialog extends OpenAI.Responses.ResponseInput {}
}
