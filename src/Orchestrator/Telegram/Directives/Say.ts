import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { parseCommand } from "../Utils/ScriptParse";
import { ProjectInterface } from "../../../DI/Project.interface";
import { Secret } from "../../../Config/Secret";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { throwFn } from "../../../Utils";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.SAY)
class Say implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		try {
			if (data.message?.text) return await this.text(modules, parseCommand(data.message.text).text, scriptGetChatId(data));
		} catch (e) {
			console.log(`Ошибка ответа нейросети \\n== ${e}`);
			throwFn(`Ошибка ответа нейросети`, e);
		}
	}

	async text(modules: ProjectInterface.TDIService, text: string, chatId: number) {
		const wordGetTo = modules("Message").invoke.getWord(MessageInterface.EWord.GET_TO_LLM, MessageInterface.ELang.RU);
		const instruct = await modules("Message").invoke.getSystemPromt();

		const message = await modules("Telegram").invoke.sendMessage(wordGetTo, chatId);
		const history = await modules("History").invoke.getHistory(chatId, Secret.historyQty);
		const generate = await modules("Inference").invoke.getPromt(text, instruct, history);

		if (generate?.output_text === undefined) throwFn(`Отсутствие поля ответа \n== ${generate}`);
		const reply = generate.output_text;

		console.log(text + "\n", reply);

		await modules("History").invoke.setHistory(chatId, new Date().getTime(), text, reply);
		await modules("Telegram").invoke.editMessage(reply, chatId, message.message_id);
	}
}
