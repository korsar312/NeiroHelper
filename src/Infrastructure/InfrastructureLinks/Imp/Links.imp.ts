import { LinksInterface } from "../Links.interface";
import { Readable } from "node:stream";
import { throwFn } from "../../../Utils";

class LinksImp implements LinksInterface.IAdapter {
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

	private createLink(param: LinksInterface.IRequest): string {
		const { link, query } = param;

		const url = new URL(link, undefined);
		const add: string[] = [];

		if (link) add.push(link);

		url.pathname += add.join("/");

		if (query) Object.entries(query).forEach(([key, value]) => url.searchParams.append(key, String(value)));

		return url.toString();
	}

	public request<T>(param: LinksInterface.IRequest): Promise<T> {
		const { method, data, saveLink } = param;

		const fullLink = this.createLink(param);

		return new Promise<T>((resolve, reject) => {
			const body = method !== LinksInterface.EMethod.GET ? JSON.stringify(data) : undefined;
			const headers = { "Content-Type": "application/json" };

			fetch(fullLink, { headers, body, method })
				.then(async (res) => {
					const response: T = await this.parse(res);

					resolve(response);
				})
				.catch((e) => {
					reject(new Error(`Ошибка в запросе ${saveLink || fullLink} \n== ${e}`));
				});
		});
	}
}

export default LinksImp;
