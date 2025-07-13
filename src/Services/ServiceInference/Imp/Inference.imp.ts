import { OpenAI } from "openai";
import { InferenceInterface } from "../Inference.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { EasyInputMessage } from "openai/src/resources/responses/responses";

class InferenceImp implements InferenceInterface.IAdapter {
	private client: OpenAI | undefined;
	protected Infrastructure: ProjectInterface.TInfrastructure;

	constructor(token: string, Infrastructure: ProjectInterface.TInfrastructure) {
		this.client = new OpenAI({ apiKey: token });
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

		return this.client?.responses.create({
			/** Модель для ответа */
			model: "gpt-4.1-mini-2025-04-14",

			/** Список сообщений, передаваемых в модель в данном запросе */
			input: [systemPrompt, contextPrompt, ...historyPrompt, userPrompt],

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

export default InferenceImp;
