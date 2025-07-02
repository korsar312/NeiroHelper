import { LoggerInterface } from "../Logger.interface";

class LoggerImp implements LoggerInterface.IAdapter {
	public info(param: LoggerInterface.ILog) {}
	public warn(param: LoggerInterface.ILog) {}
	public error(param: LoggerInterface.ILog) {}

	private log(param: LoggerInterface.ILog) {}
}

export default LoggerImp;
