export namespace LoggerInterface {
	export interface IAdapter {
		info(param: ILog): void;
		warn(param: ILog): void;
		error(param: ILog): void;
	}

	export interface ILog {
		service: string;
		reason: string;
		date: string;
		function: string;
		level: string;
		userId?: string;
		data?: unknown;
	}
}
