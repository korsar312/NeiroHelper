import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { parseCommand } from "../Utils/ScriptParse";
import { throwFn } from "../../../Utils";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";

@Directive.register(OrchestratorTelegramInterface.EDirective.TRANSFER)
export class Trans extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.CASH_OUT, MessageInterface.ELang.RU);

		const text = parseCommand(data.message?.text || "").text;
		const [key, address, amount] = text.split(" ");

		if (!key || !address || !amount) throwFn({ reasonUser: "Ошибка параметров команды" });

		await this.modules.services("Payment").invoke.sendUsdtWallet(key, address, +amount);
		await this.modules.services("Telegram").invoke.sendMessage(`${wordFinish} ${amount}`, userId);
	}
}
