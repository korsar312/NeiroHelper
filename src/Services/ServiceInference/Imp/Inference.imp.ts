import { OpenAI } from "openai";
import { InferenceInterface } from "../Inference.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { EasyInputMessage } from "openai/src/resources/responses/responses";

class InferenceImp implements InferenceInterface.IAdapter {
	private client: OpenAI | undefined;
	protected Infrastructure: ProjectInterface.TDIInfrastructure;

	constructor(token: string, Infrastructure: ProjectInterface.TDIInfrastructure) {
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

		const systemPrompt = createInput("system", /*instructions*/ +"\n" + context);
		const userPrompt = createInput("user", question);

		console.log([systemPrompt, ...historyPrompt, userPrompt]);

		return this.client?.responses.create({
			model: "gpt-4.1-mini",
			input: [systemPrompt, ...historyPrompt, userPrompt],
			text: { format: { type: "text" } },
			reasoning: {},
			tools: [],
			temperature: 1,
			max_output_tokens: 2048,
			top_p: 1,
			store: true,
		});
	}
}

function createInput(role: EasyInputMessage["role"], text: string): EasyInputMessage {
	let content: unknown;

	switch (role) {
		case "assistant":
			content = [{ type: "output_text", text }];
			break;
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
