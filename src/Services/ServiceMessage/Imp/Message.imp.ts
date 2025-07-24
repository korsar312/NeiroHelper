import { MessageInterface } from "../Message.interface";
import Dictionary from "./Dictionary";
import { ProjectInterface } from "../../../DI/Project.interface";
import { FilesInterface } from "../../../Infrastructure/InfrastructureFiles/Files.interface";
import { listOfListsToCsv } from "../../../Utils";

class MessageImp implements MessageInterface.IAdapter {
	private readonly dictionary = Dictionary;
	protected Infrastructure: ProjectInterface.TInfrastructure;

	constructor(Infrastructure: ProjectInterface.TInfrastructure) {
		this.Infrastructure = Infrastructure;
	}

	public getWord(word: MessageInterface.EWord, lang: MessageInterface.ELang, arrReplace?: string[]) {
		let text = this.dictionary[word][lang];

		if (arrReplace?.length) text = getText(text, arrReplace);

		return text;
	}

	public async getSystemPromt() {
		const instruct = await this.getSystemMassage();
		const context = await this.getSystemContext();

		return `
			${instruct}
			
			${context}
		`;
	}

	public async getSystemMassage() {
		return await this.Infrastructure("Files").invoke.readFile<string>(FilesInterface.FilePath.INSTRUCTION());
	}

	public async getSystemContext() {
		const context = await this.Infrastructure("Files").invoke.readFile<string>(FilesInterface.FilePath.CONTEXT());

		return `
			[CONTEXT]
			${context}
		`;
	}

	public async getSystemStat() {
		const stat = await this.Infrastructure("Files").invoke.readFile<Array<Array<string>>>(FilesInterface.FilePath.STATISTIC());
		const textStat = listOfListsToCsv(stat);

		return `
			[STATISTIC]
			${textStat}
		`;
	}
}

export default MessageImp;

function getText(text: string, arrReplace: Array<string | number>): string {
	return text.replace(/\{\{(\d+)\}\}/g, (_, group1) => {
		const idx = Number(group1) - 1; // {{1}} → индекс 0
		const replacement = arrReplace[idx];
		return replacement !== undefined // если есть замена
			? String(replacement) // – приводим к строке
			: `{{${group1}}}`; // – иначе оставляем как есть
	});
}
