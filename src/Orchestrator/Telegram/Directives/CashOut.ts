import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { Secret } from "../../../Config/Secret";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.CASH_OUT)
class CashOut implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.CASH_OUT, MessageInterface.ELang.RU);

		const totalCash = await modules("Payment").invoke.checkBalanceUsdt(Secret.addressWalletWork);

		const totalCashTest = totalCash / 1000000;

		const superPart = (totalCashTest / 100) * Secret.superPartPercent;
		const pidorPart = (totalCashTest - superPart) * 0.95;

		await modules("Payment").invoke.sendUsdtWallet(Secret.tokenWalletWork, Secret.addressWalletSuper, superPart);
		await modules("Payment").invoke.sendUsdtWallet(Secret.tokenWalletWork, Secret.addressWalletPidor, pidorPart);

		await modules("Telegram").invoke.sendMessage(`${wordFinish} ${pidorPart}`, userId);
	}
}
