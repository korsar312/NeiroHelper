import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { Secret } from "../../../Config/Secret";

@Directive.register(OrchestratorTelegramInterface.EDirective.GET_MY_BALANCE)
export class GetMyBalance extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.USDT, MessageInterface.ELang.RU);
		const addressWork = Secret.addressWalletWork;

		let sumText = "";

		for (const el of addressWork) {
			const sum = await this.modules.services("Payment").invoke.checkBalanceUsdt(el);
			sumText += `${wordFinish}: ${sum / 1000000}\n`;
		}

		await this.modules.services("Telegram").invoke.sendMessage(sumText, userId);
	}
}
