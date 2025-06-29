import { AuthInterface } from "../Auth.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { OrchestratorTelegramInterface } from "../../../Orchestrator/Telegram/OrchestratorTelegram.interface";

const userAccess = [
	OrchestratorTelegramInterface.EDirective.CLEAR,
	OrchestratorTelegramInterface.EDirective.NO_AUTH,
	OrchestratorTelegramInterface.EDirective.SAY,
	OrchestratorTelegramInterface.EDirective.PAY,
];

const adminAccess = [
	...userAccess,
	OrchestratorTelegramInterface.EDirective.NO_AUTH,
	OrchestratorTelegramInterface.EDirective.LEARN,
	OrchestratorTelegramInterface.EDirective.GET_ALL_USER,
	OrchestratorTelegramInterface.EDirective.DEL_AUTH,
];

class AuthImp implements AuthInterface.IAdapter {
	protected Infrastructure: ProjectInterface.TDIInfrastructure;

	constructor(Infrastructure: ProjectInterface.TDIInfrastructure) {
		this.Infrastructure = Infrastructure;
	}

	public isAuthUser(userId: number, command: OrchestratorTelegramInterface.EDirective) {
		const user = this.Infrastructure("DB").invoke.read.grade(userId);

		const userTimeMs = +(user?.expiresAt || "0");
		const dateNowMs = new Date().getTime();
		const subscriptWorks = dateNowMs < userTimeMs;

		const userRole = user?.role as AuthInterface.EGrade;
		const isUser = userRole === AuthInterface.EGrade.GOY || undefined;
		const isAdmin = userRole === AuthInterface.EGrade.ADMIN;
		const isSuper = userRole === AuthInterface.EGrade.SUPER;

		if (isUser) return subscriptWorks || userAccess.includes(command);
		if (isAdmin) return subscriptWorks || adminAccess.includes(command);
		if (isSuper) return true;

		return false;
	}

	setUserGrade(userId: number, grade: AuthInterface.EGrade, date?: string) {
		this.Infrastructure("DB").invoke.create.grade(userId, grade, date);
	}

	getAllUser() {
		return this.Infrastructure("DB").invoke.readAll.grade();
	}

	removeUser(userId: number) {
		const user = this.Infrastructure("DB").invoke.read.grade(userId);
		const userRole = user?.role as AuthInterface.EGrade;

		if (userRole === AuthInterface.EGrade.SUPER) throw new Error(`Пользователя не удалить по причине пошел на хуй`);
		this.Infrastructure("DB").invoke.delete.grade(userId);
	}
}

export default AuthImp;
