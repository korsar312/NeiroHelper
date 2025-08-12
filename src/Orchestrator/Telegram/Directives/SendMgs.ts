import { DirectiveBase } from "../DirectiveBase";
import { parseCommand } from "../Utils/ScriptParse";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";

@Directive.register(OrchestratorTelegramInterface.EDirective.SEND_MASSAGE)
export class SendMgs extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const text = parseCommand(data.message?.text || "").text;
		const [id, ...word] = text.split(" ");

		const isUserExist = this.modules.services("Auth").invoke.isAuthUser(+id, OrchestratorTelegramInterface.EDirective.START);
		if (!isUserExist) return;

		await this.modules.services("Telegram").invoke.sendMessage(word.join(" "), +id);
	}
}
