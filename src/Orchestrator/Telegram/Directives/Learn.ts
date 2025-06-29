import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { parseCommand } from "../Utils/ScriptParse";
import { ProjectInterface } from "../../../DI/Project.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.LEARN)
class Learn implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		try {
			const chatId = scriptGetChatId(data);

			if (data.message?.text) return await this.text(modules, parseCommand(data.message.text).text, chatId);
			if (data.message?.document) return await this.file(modules, data.message.document, chatId);
		} catch (e) {
			throw new Error(`Ошибка сохранения \n== ${e}`);
		}
	}

	private async text(modules: ProjectInterface.TDIService, text: string, chatId: number) {
		const wordStart = modules("Message").invoke.getWord(MessageInterface.EWord.TEXT_WILL_BE_SAVE, MessageInterface.ELang.RU);
		const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.SAVE_TEXT, MessageInterface.ELang.RU);

		await modules("Telegram").invoke.sendMessage(wordStart, chatId);
		await modules("Files").invoke.addToLearn(this.createLearn(text));
		await modules("Telegram").invoke.sendMessage(wordFinish, chatId);
	}

	private async file(modules: ProjectInterface.TDIService, data: TelegramInterface.TDocument, chatId: number) {
		const textInfo = await this.downloadFile(modules, data, chatId);

		await this.saveFile(modules, textInfo, chatId);
	}

	private createLearn(text: string) {
		return JSON.stringify({ text });
	}

	private async downloadFile(modules: ProjectInterface.TDIService, data: TelegramInterface.TDocument, chatId: number) {
		const word = modules("Message").invoke.getWord(MessageInterface.EWord.DOWNLOADING_FILE, MessageInterface.ELang.RU);

		await modules("Telegram").invoke.sendMessage(word, chatId);
		const file = await modules("Telegram").invoke.getFile(data.file_id);
		const chunks: Buffer[] = [];
		for await (const chunk of file) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));

		return Buffer.concat(chunks).toString("utf-8");
	}

	private async saveFile(modules: ProjectInterface.TDIService, text: string, chatId: number) {
		const word = modules("Message").invoke.getWord(MessageInterface.EWord.SAVE_FILE, MessageInterface.ELang.RU);

		await modules("Files").invoke.addToLearn(this.createLearn(text));
		await modules("Telegram").invoke.sendMessage(word, chatId);
	}
}
