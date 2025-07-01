import { OpenAI } from "openai";
import { InferenceInterface } from "../Inference.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { EasyInputMessage } from "openai/src/resources/responses/responses";

class InferenceImpTest implements InferenceInterface.IAdapter {
	private client: OpenAI | undefined;
	protected Infrastructure: ProjectInterface.TDIInfrastructure;

	constructor(token: string, Infrastructure: ProjectInterface.TDIInfrastructure) {
		this.client = new OpenAI({ apiKey: token });
		this.Infrastructure = Infrastructure;
	}

	public async getPromt(question: string, instructions: string, context: string, history: InferenceInterface.THistoryField[]) {
		return new Promise<InferenceInterface.IGenerate>((resolve, reject) => {
			if (Math.round(Math.random())) reject("getPromt");

			resolve({ output_text: "fsd" } as InferenceInterface.IGenerate);
		});
	}
}

export default InferenceImpTest;
