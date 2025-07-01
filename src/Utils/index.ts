/**
 * Преобразует массив массивов в CSV-строку.
 * Первый вложенный массив считается заголовками столбцов.
 *
 * @param data - Массив строк, каждая строка — массив ячеек (string | number)
 * @param delimiter - Разделитель полей (по умолчанию ',')
 * @returns CSV-представление переданных данных
 */
export function listOfListsToCsv(data: Array<Array<string | number>>, delimiter: string = ","): string {
	const escapeCell = (cell: string | number): string => {
		const str = String(cell);
		// Если в ячейке есть кавычки, запятые, переносы строк — оборачиваем в двойные кавычки
		if (/[\"\r\n${delimiter}]/.test(str)) {
			// Экранируем все двойные кавычки внутри ячейки
			const escaped = str.replace(/"/g, '""');
			return `"${escaped}"`;
		}
		return str;
	};

	return data.map((row) => row.map(escapeCell).join(delimiter)).join("\n");
}
