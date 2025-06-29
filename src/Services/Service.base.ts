import ServiceProxy from "../Common/ServiceProxy";

class BaseService<T extends object> extends ServiceProxy<T> {}

export default BaseService;
