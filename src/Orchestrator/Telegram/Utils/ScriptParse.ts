import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";

export function parseCommand(textParse: string = ""): OrchestratorTelegramInterface.TDirectiveParse {
	let command: string = OrchestratorTelegramInterface.EDirective.SAY;
	let text = textParse;

	if (text.startsWith("/")) {
		command = text.trim().split(/\s+/)[0];
		text = text.slice(command.length + 1);
	}

	return { command, text };
}
