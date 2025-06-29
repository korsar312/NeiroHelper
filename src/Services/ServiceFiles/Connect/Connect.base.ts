import { ConnectInterface } from "./Connect.Interface";

abstract class ConnectBase implements ConnectInterface.BaseClass {
	abstract addToFile(dirPath: string, addText: string): Promise<void>;

	abstract readTxt<T>(dirPath: string): Promise<string>;

	abstract readNdJson<T>(dirPath: string): Promise<T>;
}

export default ConnectBase;
