import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { parseCommand } from "../Utils/ScriptParse";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.SEND_MASSAGE)
class SendMgs implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const text = parseCommand(data.message?.text || "").text;
		const [id, ...word] = text.split(" ");

		const isUserExist = modules("Auth").invoke.isAuthUser(+id, OrchestratorTelegramInterface.EDirective.SAY);
		if (!isUserExist) return;

		await modules("Telegram").invoke.sendMessage(word.join(" "), +id);
	}
}
