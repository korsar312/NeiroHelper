import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { Secret } from "../../../Config/Secret";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { Const } from "../../../Config/Const";

@Directive.register(OrchestratorTelegramInterface.EDirective.CASH_OUT)
export class CashOut extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.CASH_OUT, MessageInterface.ELang.RU);

		const totalCash = await this.modules.services("Payment").invoke.checkBalanceUsdt(Secret.addressWalletWork[0]);

		const totalCashTest = totalCash / 1000000;

		const superPart = (totalCashTest / 100) * Const.superPartPercent;
		const pidorPart = (totalCashTest - superPart) * 0.95;

		await this.modules.services("Payment").invoke.sendUsdtWallet(Secret.tokenWalletWork, Secret.addressWalletSuper, superPart);
		await this.modules.services("Payment").invoke.sendUsdtWallet(Secret.tokenWalletWork, Secret.addressWalletPidor, pidorPart);

		await this.modules.services("Telegram").invoke.sendMessage(`${wordFinish} ${pidorPart}`, userId);
	}
}
