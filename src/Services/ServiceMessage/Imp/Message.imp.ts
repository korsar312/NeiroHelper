import { MessageInterface } from "../Message.interface";
import Dictionary from "./Dictionary";
import { ProjectInterface } from "../../../DI/Project.interface";
import { FilesInterface } from "../../../Infrastructure/InfrastructureFiles/Files.interface";
import { listOfListsToCsv } from "../../../Utils";

class MessageImp implements MessageInterface.IAdapter {
	private readonly dictionary = Dictionary;
	protected Infrastructure: ProjectInterface.TDIInfrastructure;

	constructor(Infrastructure: ProjectInterface.TDIInfrastructure) {
		this.Infrastructure = Infrastructure;
	}

	public getWord(word: MessageInterface.EWord, lang: MessageInterface.ELang) {
		return this.dictionary[word][lang];
	}

	public async getSystemPromt() {
		const instruct = await this.Infrastructure("Files").invoke.readFile<string>(FilesInterface.FilePath.INSTRUCTION());
		const context = await this.Infrastructure("Files").invoke.readFile<string>(FilesInterface.FilePath.CONTEXT());
		const statistic = await this.Infrastructure("Files").invoke.readFile<Array<Array<string>>>(FilesInterface.FilePath.STATISTIC());

		const statText = listOfListsToCsv(statistic);

		return `
${instruct}

[CONTEXT]
${context}

[STATISTIC]
${statText}
		`;
	}
}

export default MessageImp;
