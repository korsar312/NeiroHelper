export function listOfListsToCsv(data: Array<Array<string | number>>, delimiter: string = ","): string {
	const escapeCell = (cell: string | number): string => {
		const str = String(cell);
		if (/[\"\r\n${delimiter}]/.test(str)) {
			const escaped = str.replace(/"/g, '""');
			return `"${escaped}"`;
		}
		return str;
	};

	return data.map((row) => row.map(escapeCell).join(delimiter)).join("\n");
}

export interface IThrow {
	error: string;
	reasonUser: string;
}

export function throwFn(error: string | { reasonUser: string }, lairError?: unknown): never {
	let reason = {
		error: JSON.stringify(error) + JSON.stringify(lairError),
		reasonUser: "",
	};

	if (typeof error === "object" && "reasonUser" in error) {
		reason.reasonUser += error.reasonUser;
	}

	if (typeof lairError === "object" && lairError !== null && "reasonUser" in lairError) {
		reason.reasonUser += lairError.reasonUser;
	}

	throw reason;
}
