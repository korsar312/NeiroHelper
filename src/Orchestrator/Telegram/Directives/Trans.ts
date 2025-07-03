import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { parseCommand } from "../Utils/ScriptParse";
import { throwFn } from "../../../Utils";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.TRANSFER)
class Trans implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.CASH_OUT, MessageInterface.ELang.RU);

		const text = parseCommand(data.message?.text || "").text;
		const [key, address, amount] = text.split(" ");

		if (!key || !address || !amount) throwFn({ reasonUser: "Ошибка параметров команды" });

		await modules("Payment").invoke.sendUsdtWallet(key, address, +amount);
		await modules("Telegram").invoke.sendMessage(`${wordFinish} ${amount}`, userId);
	}
}
