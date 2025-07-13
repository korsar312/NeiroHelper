import OrchestratorBase from "../OrchestratorBase";
import { TelegramInterface } from "../../Services/ServiceTelegram/Telegram.interface";

export abstract class DirectiveBase<Args extends unknown[] = [TelegramInterface.IUpdate]> extends OrchestratorBase {
	abstract invoke(...args: Args): Promise<void>;
}
