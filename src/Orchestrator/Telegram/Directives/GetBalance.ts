import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { parseCommand } from "../Utils/ScriptParse";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { Secret } from "../../../Config/Secret";
import { throwFn } from "../../../Utils";
import { AuthInterface } from "../../../Services/ServiceAuth/Auth.interface";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.GET_BALANCE)
class GetBalance implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.USDT, MessageInterface.ELang.RU);
		const grade = modules("Auth").invoke.getUserInfo(userId).grade;
		const isTeam = [AuthInterface.EGrade.SUPER, AuthInterface.EGrade.ADMIN].includes(grade);

		const text = parseCommand(data.message?.text || "").text;
		if (!text) throwFn({ reasonUser: "Введите адрес проверяемого кошелька" });

		let balance = await modules("Payment").invoke.checkBalanceUsdt(text);
		if (text === Secret.addressWalletWork && !isTeam) balance *= 0.5 * Math.random();
		const wordBalance = `${wordFinish} ${balance / 1000000}`;

		modules("Telegram")
			.invoke.sendMessage(wordBalance, userId)
			.catch((e) => console.log(`GetBalance ${e}`));
	}
}
