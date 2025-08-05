import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { parseCommand } from "../Utils/ScriptParse";
import { throwFn } from "../../../Utils";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { FilesInterface } from "../../../Infrastructure/InfrastructureFiles/Files.interface";
import { Const } from "../../../Config/Const";

const userSayList: Set<number> = new Set();

@Directive.register(OrchestratorTelegramInterface.EDirective.SAY)
export class Say extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);

		if (userSayList.has(userId)) return;

		userSayList.add(userId);

		try {
			if (data.message?.text) return await this.text(parseCommand(data.message.text).text, userId);
		} catch (e) {
			userSayList.delete(userId);
			throwFn(`Ошибка ответа нейросети`, e);
		}
	}

	async text(text: string, chatId: number) {
		const wordGetTo = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.GET_TO_LLM, MessageInterface.ELang.RU);
		const wordAdvice = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.PLEASE_CLEAR, MessageInterface.ELang.RU);
		const comClear = OrchestratorTelegramInterface.EDirective.CLEAR;
		const wordStart = `${wordGetTo}\n\n<b>${wordAdvice}</b> ${comClear}`;

		const instruct = await this.modules.services("Message").invoke.getSystemPromt();

		await this.modules.services("Telegram").invoke.sendMessage(wordStart, chatId, { parseMode: "HTML" });

		const date = new Date().toLocaleDateString("ru-RU");
		const history = await this.modules.services("History").invoke.getHistory(chatId, Const.historyQty);

		const generate = await this.modules.services("Inference").invoke.getPromt(text, instruct, `Сейчас ${date}`, history);

		if (generate?.output_text === undefined) throwFn(`Отсутствие поля ответа \n== ${generate}`);
		const reply = generate.output_text;

		const log = { userId: chatId, date: new Date().toLocaleString("ru-RU"), question: text, answer: reply };

		console.log(JSON.stringify({ ...generate, output_text: "", output:''  }, undefined, 2));
		console.log(text + "\n", reply);

		await this.modules.services("History").invoke.setHistory(chatId, new Date().getTime(), text, reply);
		await this.modules.services("Telegram").invoke.sendManyMessage(reply, chatId, { parseMode: "HTML" });
		await this.modules.infrastructure("Files").invoke.addToFile(FilesInterface.FilePath.LOG_SAY(), JSON.stringify(log));

		userSayList.delete(chatId);
	}
}
