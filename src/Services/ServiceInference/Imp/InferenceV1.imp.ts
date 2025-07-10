//import { OpenAI } from "openai";
//import { InferenceInterface } from "../Inference.interface";
//import { ProjectInterface } from "../../../DI/Project.interface";
//import { EasyInputMessage } from "openai/src/resources/responses/responses";
//import { throwFn } from "../../../Utils";
//
//class InferenceV1Imp implements InferenceInterface.IAdapter {
//	private readonly client: OpenAI | undefined;
//	private Infrastructure: ProjectInterface.TDIInfrastructure;
//
//	constructor(token: string, Infrastructure: ProjectInterface.TDIInfrastructure) {
//		this.client = new OpenAI({ apiKey: token });
//		this.Infrastructure = Infrastructure;
//	}
//
//	public async getPromt(question: string, history: InferenceInterface.THistoryField[]) {
//		if (!this.client) throw new Error("OpenAI client not initialized");
//
//		const thread = await this.client.beta.threads.create();
//
//		for (const entry of history) {
//			await this.client.beta.threads.messages.create(thread.id, { role: "user", content: entry.question });
//			await this.client.beta.threads.messages.create(thread.id, { role: "assistant", content: entry.answer });
//		}
//
//		await this.client.beta.threads.messages.create(thread.id, { role: "user", content: question });
//
//		const run = await this.client.beta.threads.runs.create(thread.id, { assistant_id: "asst_BuFyleYMScAUVlOGSBXvpT3E" });
//		let runStatus = await this.client.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
//
//		while (runStatus.status !== "completed" && runStatus.status !== "failed") {
//			await new Promise((res) => setTimeout(res, 1000));
//			runStatus = await this.client.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
//		}
//
//		if (runStatus.status === "failed") throwFn(`Run failed${JSON.stringify(runStatus, undefined, 2)}`);
//
//		const messages = await this.client.beta.threads.messages.list(thread.id);
//		const lastAssistantMessage = messages.data.filter((msg) => msg.role === "assistant").sort((a, b) => b.created_at - a.created_at)[0];
//
//		if (!lastAssistantMessage) throwFn("No assistant response found");
//
//		console.log(JSON.stringify(lastAssistantMessage));
//		return lastAssistantMessage.content.map((c) => ("text" in c ? c.text.value : "")).join("\n");
//	}
//}
//
//function createInput(role: EasyInputMessage["role"], text: string): EasyInputMessage {
//	let content: unknown;
//
//	switch (role) {
//		case "assistant":
//			content = [{ type: "output_text", text }];
//			break;
//		case "developer":
//		case "system":
//			content = [{ type: "input_text", text }];
//			break;
//		case "user":
//			content = text;
//			break;
//	}
//
//	return { role, content } as EasyInputMessage;
//}
//
//export default InferenceV1Imp;
