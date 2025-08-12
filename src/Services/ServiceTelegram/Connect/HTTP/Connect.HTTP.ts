import { ConnectInterface } from "../Connect.Interface";
import { Readable } from "node:stream";
import ConnectBase from "../Connect.base";
import { throwFn } from "../../../../Utils";

class ConnectHTTP extends ConnectBase {
	private async parse(response: Response) {
		const contentType = response.headers.get("content-type");

		switch (contentType) {
			case "application/json":
				return response.json();
			case "application/pdf":
				const buffer = Buffer.from(await response.arrayBuffer());

				return { ok: true, result: buffer };
			case "application/octet-stream": {
				const nodeReadable = Readable.fromWeb(response.body as any);

				return { ok: true, result: nodeReadable };
			}
			default:
				throwFn(`Неизвестный тип для парсинга файла: ${contentType}`);
		}
	}

	private createLink(param: ConnectInterface.TLink, isSecret?: boolean): string {
		try {
			const { type, link, addLink, query } = param;

			const url = new URL(this.link, undefined);
			const add: string[] = [];

			if (type) add.push(type);
			if (!isSecret) add.push(`bot${this.token}`);
			if (link) add.push(link);
			if (addLink) add.push(addLink);

			url.pathname += add.join("/");

			if (query) Object.entries(query).forEach(([key, value]) => url.searchParams.append(key, String(value)));

			return url.toString();
		} catch (e) {
			throwFn(`Ошибка создания ссылки`, e);
		}
	}

	async request<T>(param: ConnectInterface.TRequest): Promise<T> {
		const { method, data } = param;

		const fullLink = this.createLink(param);

		const body = method !== ConnectInterface.EMethod.GET ? JSON.stringify(data) : undefined;
		const headers = { "Content-Type": "application/json" };

		const res = await fetch(fullLink, { headers, body, method });
		const response: ConnectInterface.TRes<T> = await this.parse(res);

		if (!response.ok) throwFn(`Запрос ${param.link} отвелил response.ok: ${response.ok}`);

		return response.result;
	}
}

export default ConnectHTTP;
