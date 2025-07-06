import { OpenAI } from "openai";

export namespace InferenceInterface {
	export interface IAdapter {
		getPromt(question: string, instructions: string, getPromt: string, history: THistoryField[]): Promise<IGenerate | undefined>;
	}

	export interface IGenerate extends OpenAI.Responses.Response {}

	export type THistoryField = {
		question: string;
		answer: string;
	};

	export interface IDialog extends OpenAI.Responses.ResponseInput {}
}
