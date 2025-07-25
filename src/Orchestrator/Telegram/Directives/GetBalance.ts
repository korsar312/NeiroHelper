import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { parseCommand } from "../Utils/ScriptParse";
import { throwFn } from "../../../Utils";
import { Secret } from "../../../Config/Secret";
import { AuthInterface } from "../../../Services/ServiceAuth/Auth.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";

@Directive.register(OrchestratorTelegramInterface.EDirective.GET_BALANCE)
export class GetBalance extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.USDT, MessageInterface.ELang.RU);
		const grade = this.modules.services("Auth").invoke.getUserInfo(userId).grade;
		const isTeam = [AuthInterface.EGrade.SUPER, AuthInterface.EGrade.ADMIN].includes(grade);

		const text = parseCommand(data.message?.text || "").text;
		if (!text) throwFn({ reasonUser: "Введите адрес проверяемого кошелька" });

		let balance = await this.modules.services("Payment").invoke.checkBalanceUsdt(text);
		if (Secret.addressWalletWork.includes(text) && !isTeam) balance *= 0.5 * Math.random();
		const wordBalance = `${wordFinish}: ${balance / 1000000}`;

		this.modules
			.services("Telegram")
			.invoke.sendMessage(wordBalance, userId)
			.catch((e) => console.log(`GetBalance ${e}`));
	}
}
