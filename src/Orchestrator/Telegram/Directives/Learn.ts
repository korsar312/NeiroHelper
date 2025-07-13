import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { parseCommand } from "../Utils/ScriptParse";
import { throwFn } from "../../../Utils";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";

@Directive.register(OrchestratorTelegramInterface.EDirective.LEARN)
export class Learn extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		try {
			const chatId = scriptGetChatId(data);

			if (data.message?.text) return await this.text(parseCommand(data.message.text).text, chatId);
			if (data.message?.document) return await this.file(data.message.document, chatId);
		} catch (e) {
			throwFn(`Ошибка сохранения`, e);
		}
	}

	private async text(text: string, chatId: number) {
		const wordStart = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.TEXT_WILL_BE_SAVE, MessageInterface.ELang.RU);
		const wordFinish = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.SAVE_TEXT, MessageInterface.ELang.RU);

		await this.modules.services("Telegram").invoke.sendMessage(wordStart, chatId);
		await this.modules.services("Files").invoke.addToLearn(this.createLearn(text));
		await this.modules.services("Telegram").invoke.sendMessage(wordFinish, chatId);
	}

	private async file(data: TelegramInterface.TDocument, chatId: number) {
		const textInfo = await this.downloadFile(data, chatId);

		await this.saveFile(textInfo, chatId);
	}

	private createLearn(text: string) {
		return JSON.stringify({ text });
	}

	private async downloadFile(data: TelegramInterface.TDocument, chatId: number) {
		const word = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.DOWNLOADING_FILE, MessageInterface.ELang.RU);

		await this.modules.services("Telegram").invoke.sendMessage(word, chatId);
		const file = await this.modules.services("Telegram").invoke.getFile(data.file_id);
		const chunks: Buffer[] = [];
		for await (const chunk of file) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));

		return Buffer.concat(chunks).toString("utf-8");
	}

	private async saveFile(text: string, chatId: number) {
		const word = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.SAVE_FILE, MessageInterface.ELang.RU);

		await this.modules.services("Files").invoke.addToLearn(this.createLearn(text));
		await this.modules.services("Telegram").invoke.sendMessage(word, chatId);
	}
}
