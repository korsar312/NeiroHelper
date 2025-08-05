import { OpenAI } from "openai";
import { InferenceInterface } from "../Inference.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { EasyInputMessage } from "openai/src/resources/responses/responses";
import { throwFn } from "../../../Utils";
import ResponsesModel = OpenAI.ResponsesModel;

class InferenceImp implements InferenceInterface.IAdapter {
	private clients: OpenAI[] = [];
	private clientCount = 0;
	protected Infrastructure: ProjectInterface.TInfrastructure;

	constructor(tokens: string[], Infrastructure: ProjectInterface.TInfrastructure) {
		this.clients = tokens.map((token) => new OpenAI({ apiKey: token }));
		this.Infrastructure = Infrastructure;
	}

	public async getPromt(question: string, instructions: string, context: string, history: InferenceInterface.THistoryField[]) {
		const historyPrompt: InferenceInterface.IDialog = history.reduce((prev, cur) => {
			const user = createInput("user", cur.question);
			const assistant = createInput("assistant", cur.answer);

			prev.push(user);
			prev.push(assistant);

			return prev;
		}, [] as InferenceInterface.IDialog);

		const systemPrompt = createInput("system", instructions);
		const contextPrompt = createInput("developer", context);
		const userPrompt = createInput("user", question);

		const promt = [systemPrompt, contextPrompt, ...historyPrompt, userPrompt];

		const count = this.getCount();

		for (const model of modelGenerator()) {
			try {
				console.log(`Попытка: ${model}, ${count}`)
				return await this.getResponse(count, model, promt);
			} catch (e: any) {
				if (e.status === 429) {
					console.log(JSON.stringify(e, undefined, 2));
					console.log(`${model} не доступна`);
					await sleep(10);

					continue;
				}
				throw e;
			}
		}

		throwFn({ reasonUser: "Сеть перегружена" });
	}

	private getResponse(count:number, model: ResponsesModel, prompt: OpenAI.Responses.ResponseInput) {
		return this.clients[count]?.responses.create({
			/** Модель для ответа */
			model,

			/** Список сообщений, передаваемых в модель в данном запросе */
			input: prompt,

			/** Определяет формат вывода ответа */
			text: { format: { type: "text" } },

			/** Настройки для внутреннего «мышления» модели */
			reasoning: {},

			/** Перечень внешних плагинов, к которым модель имеет доступ в данном запросе */
			tools: [],

			/** Параметр, отвечающий за «творческую свободу» генерации. 0 - нет свободы */
			temperature: 0.3,

			/** Максимальное число токенов, которое модель может выдать в ответе */
			max_output_tokens: 2500,

			/** Вероятность подбора редких слов. 0 - высокая вероятность */
			top_p: 1,

			/** Модель для ответа*/
			store: false,
		});
	}

	private getCount() {
		const count = this.clientCount;

		if (this.clientCount + 1 > this.clients.length - 1) this.clientCount = 0;
		else this.clientCount += 1;

		return count;
	}
}

function createInput(role: EasyInputMessage["role"], text: string): EasyInputMessage {
	let content: unknown;

	switch (role) {
		case "assistant":
			content = [{ type: "output_text", text }];
			break;
		case "developer":
		case "system":
			content = [{ type: "input_text", text }];
			break;
		case "user":
			content = text;
			break;
	}

	return { role, content } as EasyInputMessage;
}

function* modelGenerator() {
	yield "gpt-4.1-2025-04-14";
	yield "gpt-4o";
	yield "gpt-4.1";
	yield "gpt-4.1-mini-2025-04-14";
}

function sleep(time: number) {
	return new Promise((res) => setTimeout(res, time * 1000));
}

export default InferenceImp;
