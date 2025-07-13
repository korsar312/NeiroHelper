import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { parseCommand } from "../Utils/ScriptParse";
import { throwFn } from "../../../Utils";
import { Secret } from "../../../Config/Secret";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { FilesInterface } from "../../../Infrastructure/InfrastructureFiles/Files.interface";

@Directive.register(OrchestratorTelegramInterface.EDirective.SAY)
export class Say extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		try {
			if (data.message?.text) {
				return await this.text(parseCommand(data.message.text).text, scriptGetChatId(data));
			}
		} catch (e) {
			console.log(`Ошибка ответа нейросети \\n== ${e}`);
			throwFn(`Ошибка ответа нейросети`, e);
		}
	}

	async text(text: string, chatId: number) {
		const wordGetTo = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.GET_TO_LLM, MessageInterface.ELang.RU);
		const instruct = await this.modules.services("Message").invoke.getSystemPromt();

		await this.modules.services("Telegram").invoke.sendMessage(wordGetTo, chatId);

		const history = await this.modules.services("History").invoke.getHistory(chatId, Secret.historyQty);
		const generate = await this.modules.services("Inference").invoke.getPromt(text, instruct, "", history);

		if (generate?.output_text === undefined) throwFn(`Отсутствие поля ответа \n== ${generate}`);
		const reply = generate.output_text;
		const log = { userId: chatId, date: new Date().toLocaleString("ru-RU"), question: text, answer: reply };

		console.log(text + "\n", reply);

		await this.modules.services("History").invoke.setHistory(chatId, new Date().getTime(), text, reply);
		await this.modules.services("Telegram").invoke.sendManyMessage(reply, chatId, { parseMode: "HTML" });
		await this.modules.infrastructure("Files").invoke.addToFile(FilesInterface.FilePath.LOG_SAY(), JSON.stringify(log));
	}
}
