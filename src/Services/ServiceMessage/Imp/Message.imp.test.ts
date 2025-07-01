import { MessageInterface } from "../Message.interface";
import Dictionary from "./Dictionary";
import { ProjectInterface } from "../../../DI/Project.interface";
import { FilesInterface } from "../../../Infrastructure/InfrastructureFiles/Files.interface";

class MessageImpTest implements MessageInterface.IAdapter {
	private readonly dictionary = Dictionary;
	protected Infrastructure: ProjectInterface.TDIInfrastructure;

	constructor(Infrastructure: ProjectInterface.TDIInfrastructure) {
		this.Infrastructure = Infrastructure;
	}

	public getWord(word: MessageInterface.EWord, lang: MessageInterface.ELang) {
		if (Math.round(Math.random())) throw "getWord";

		return "Тест";
	}

	public getSystemPromt() {
		if (Math.round(Math.random())) throw "getWord";

		return new Promise<string>((resolve) => resolve("Тест"));
	}
}

export default MessageImpTest;
