export namespace LinksInterface {
	export interface IAdapter {
		request<T>(param: IRequest): Promise<T>;
	}

	export enum EMethod {
		GET = "GET",
		POST = "POST",
	}

	export interface IRequest {
		link: string;
		method: EMethod;
		query?: Record<string, any>;
		data?: Record<string, any>;
		saveLink?: string;
	}
}
