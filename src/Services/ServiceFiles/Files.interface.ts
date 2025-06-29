export namespace FilesInterface {
	export interface IAdapter {
		addToLearn(text: string): any;

		addToDialog(userId: string, text: string): any;

		getAuth(): any;

		setAuth(text: string): any;

		getInstruction(): any;

		setInstruction(): any;
	}
}
