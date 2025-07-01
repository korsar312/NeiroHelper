import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { parseCommand } from "../Utils/ScriptParse";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.GET_BALANCE)
class GetBalance implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.USDT, MessageInterface.ELang.RU);

		const text = parseCommand(data.message?.text || "").text;
		let balance = await modules("Payment").invoke.checkBalanceUsdt(text);

		const wordBalance = `${wordFinish} ${balance / 1000000}`;

		modules("Telegram")
			.invoke.sendMessage(wordBalance, userId)
			.catch(() => {});
	}
}
