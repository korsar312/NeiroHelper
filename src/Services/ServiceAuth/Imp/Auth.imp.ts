import { AuthInterface } from "../Auth.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { OrchestratorTelegramInterface } from "../../../Orchestrator/Telegram/OrchestratorTelegram.interface";
import { throwFn } from "../../../Utils";

const allAccess = [
	OrchestratorTelegramInterface.EDirective.START,
	OrchestratorTelegramInterface.EDirective.NO_AUTH,
	OrchestratorTelegramInterface.EDirective.PAY,
];

const userAccess = [...allAccess, OrchestratorTelegramInterface.EDirective.CLEAR, OrchestratorTelegramInterface.EDirective.SAY];

const adminAccess = [
	...userAccess,
	OrchestratorTelegramInterface.EDirective.GET_MY_BALANCE,
	OrchestratorTelegramInterface.EDirective.TRANSFER,
	OrchestratorTelegramInterface.EDirective.GET_BALANCE,
	OrchestratorTelegramInterface.EDirective.LEARN,
	OrchestratorTelegramInterface.EDirective.GET_ALL_USER,
	OrchestratorTelegramInterface.EDirective.DEL_AUTH,
	OrchestratorTelegramInterface.EDirective.ADD_AUTH,
	OrchestratorTelegramInterface.EDirective.SEND_MASSAGE,
	OrchestratorTelegramInterface.EDirective.CASH_OUT,
	OrchestratorTelegramInterface.EDirective.SEND_ALL,
];

class AuthImp implements AuthInterface.IAdapter {
	protected Infrastructure: ProjectInterface.TInfrastructure;

	constructor(Infrastructure: ProjectInterface.TInfrastructure) {
		this.Infrastructure = Infrastructure;
	}

	public isAuthUser(userId: number, command: OrchestratorTelegramInterface.EDirective) {
		const user = this.Infrastructure("DB").invoke.read.grade(userId);

		if (!user) this.setUserGrade(userId, AuthInterface.EGrade.GOY);

		const userTimeMs = +(user?.expiresAt || "0");
		const dateNowMs = new Date().getTime();
		const subscriptWorks = dateNowMs < userTimeMs;

		const userRole = user?.role as AuthInterface.EGrade;

		const isUser = userRole === AuthInterface.EGrade.GOY || userRole === undefined;
		const isAdmin = userRole === AuthInterface.EGrade.ADMIN;
		const isSuper = userRole === AuthInterface.EGrade.SUPER;

		console.log("=============");
		console.log(new Date().toLocaleDateString("ru-RU"));
		console.log(new Date(userTimeMs).toLocaleDateString("ru-RU"));
		console.log(userId);
		console.log(userRole);
		console.log(command);
		console.log("=============");

		if (isSuper) return true;
		if (isAdmin) return subscriptWorks && adminAccess.includes(command);
		if (isUser) return subscriptWorks ? userAccess.includes(command) : allAccess.includes(command);

		return false;
	}

	public setUserGrade(userId: number, grade: AuthInterface.EGrade, date?: string) {
		this.Infrastructure("DB").invoke.create.grade(userId, grade, date);
	}

	public addUserTime(userId: number, time: number) {
		const user = this.getUserInfo(userId);

		const now = user.isOverSub ? new Date() : new Date(Number(user.timeOver));
		now.setHours(now.getHours() + time);

		const newDate = now.getTime();
		this.setUserGrade(user.userId, user.grade, String(newDate));

		return newDate;
	}

	public getAllUser(): AuthInterface.TUserInfo[] {
		const user = this.Infrastructure("DB").invoke.read.allUsers();

		return user?.map((el) => this.getUserInfo(el.id)) || [];
	}

	public getUserInfo(userId: number): AuthInterface.TUserInfo {
		const user = this.Infrastructure("DB").invoke.read.grade(userId);

		if (!user) {
			const startRole = AuthInterface.EGrade.GOY;
			this.setUserGrade(userId, startRole);

			return { userId, isOverSub: true, timeLeft: 0, grade: startRole };
		}

		const userTimeOverStamp = user.expiresAt || 0;
		const timeLeftCalc = +userTimeOverStamp - new Date().getTime();
		const timeLeft = timeLeftCalc < 0 ? 0 : timeLeftCalc;
		const isOverSub = timeLeft <= 0;

		return { userId, isOverSub, timeLeft, grade: user.role as AuthInterface.EGrade, timeOver: user.expiresAt };
	}

	removeUser(userId: number) {
		const user = this.Infrastructure("DB").invoke.read.grade(userId);
		const userRole = user?.role as AuthInterface.EGrade;

		if (userRole === AuthInterface.EGrade.SUPER) throwFn({ reasonUser: `Невозможно удалить Super пользователя` });
		this.Infrastructure("DB").invoke.delete.grade(userId);
	}
}

export default AuthImp;
