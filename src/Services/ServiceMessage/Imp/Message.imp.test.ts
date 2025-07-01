import { MessageInterface } from "../Message.interface";
import Dictionary from "./Dictionary";
import { ProjectInterface } from "../../../DI/Project.interface";

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
}

export default MessageImpTest;
