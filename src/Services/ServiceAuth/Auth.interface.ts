export namespace AuthInterface {
	export interface IAdapter {
		isAuthUser(userId: number, command: string): boolean;

		setUserGrade(userId: number, grade: EGrade, date?: string): void;

		addUserTime(userId: number, time: number): number;

		getUserInfo(userId: number): TUserInfo;

		getAllUser(): Array<TUserInfo>;

		removeUser(userId: number): void;
	}

	export enum EGrade {
		GOY = "GOY",
		ADMIN = "ADMIN",
		SUPER = "SUPER",
	}

	export type TUserInfo = {
		userId: number;
		grade: EGrade;
		isOverSub: boolean;
		timeLeft: number;
		timeOver?: string;
	};
}
