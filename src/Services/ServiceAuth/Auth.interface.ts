export namespace AuthInterface {
	export interface IAdapter {
		isAuthUser(userId: number, command: string): boolean;

		setUserGrade(userId: number, grade: EGrade, date?: string): void;

		getAllUser(): Array<{ id: { role: string; expiresAt?: string }[] }>;

		removeUser(userId: number): void;
	}

	export enum EGrade {
		GOY = "GOY",
		ADMIN = "ADMIN",
		SUPER = "SUPER",
	}
}
