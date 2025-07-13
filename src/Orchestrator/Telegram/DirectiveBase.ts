import OrchestratorBase from "../OrchestratorBase";
import { TelegramInterface } from "../../Services/ServiceTelegram/Telegram.interface";

export abstract class DirectiveBase extends OrchestratorBase {
	abstract invoke(data?: TelegramInterface.IUpdate): Promise<void>;
}
