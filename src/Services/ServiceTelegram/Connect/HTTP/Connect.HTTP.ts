import { ConnectInterface } from "../Connect.Interface";
import { Readable } from "node:stream";
import ConnectBase from "../Connect.base";

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
				throw new Error(`Неизвестный тип для парсинга файла: ${contentType}`);
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
			throw new Error(`Ошибка создания ссылки \n== ${e}`);
		}
	}

	request<T>(param: ConnectInterface.TRequest): Promise<T> {
		const { method, data } = param;

		const fullLink = this.createLink(param);

		return new Promise((resolve, reject) => {
			const body = method !== ConnectInterface.EMethod.GET ? JSON.stringify(data) : undefined;
			const headers = { "Content-Type": "application/json" };

			fetch(fullLink, { headers, body, method })
				.then(async (res) => {
					const response: ConnectInterface.TRes<T> = await this.parse(res);

					if (!response.ok) throw new Error(`Запрос отвелил response.ok: ${response.ok}`);
					resolve(response.result);
				})
				.catch((e) => {
					reject(new Error(`Ошибка в запроса ${param.link} \n== ${e}`));
				});
		});
	}
}

export default ConnectHTTP;
