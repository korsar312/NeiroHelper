import DI from "./DI";
import { ProjectInterface } from "./Project.interface";
import Infrastructure from "./Create.infrastructure";
import { Secret } from "../Config/Secret";
import AuthImp from "../Services/ServiceAuth/Imp/Auth.imp";
import { ServiceAuth } from "../Services/ServiceAuth";
import ConnectFS from "../Services/ServiceFiles/Connect/FS/Connect.FS";
import FilesImp from "../Services/ServiceFiles/Imp/Files.imp";
import { ServiceFiles } from "../Services/ServiceFiles";
import HistoryImp from "../Services/ServiceHistory/Imp/History.imp";
import { ServiceHistory } from "../Services/ServiceHistory";
import InferenceImp from "../Services/ServiceInference/Imp/Inference.imp";
import { ServiceInference } from "../Services/ServiceInference";
import MessageImp from "../Services/ServiceMessage/Imp/Message.imp";
import { ServiceMessage } from "../Services/ServiceMessage";
import PaymentImp from "../Services/ServicePayment/Imp/Payment.imp";
import { ServicePayment } from "../Services/ServicePayment";
import ConnectHTTP from "../Services/ServiceTelegram/Connect/HTTP/Connect.HTTP";
import TelegramImp from "../Services/ServiceTelegram/Imp/Telegram.imp";
import { ServiceTelegram } from "../Services/ServiceTelegram";
import { Links } from "../Config/Links";

const authImp = new AuthImp(Infrastructure.get);
const auth = new ServiceAuth(authImp);

const filesConnect = new ConnectFS();
const filesImp = new FilesImp(filesConnect, Infrastructure.get);
const files = new ServiceFiles(filesImp);

const historyImp = new HistoryImp(Infrastructure.get);
const history = new ServiceHistory(historyImp);

const inferenceImp = new InferenceImp(Secret.openAiToken, Infrastructure.get);
const inference = new ServiceInference(inferenceImp);

const messageImp = new MessageImp(Infrastructure.get);
const message = new ServiceMessage(messageImp);

const paymentImp = new PaymentImp(Infrastructure.get, {
	tokenWalletCollector: Secret.tokenWalletWork,
	USDT_CONTRACT: Secret.usdtContract,
});
const payment = new ServicePayment(paymentImp);

const telegramConnect = new ConnectHTTP({ token: Secret.tokenTg, link: Links.linkTg });
const telegramImp = new TelegramImp(telegramConnect, Infrastructure.get);
const telegram = new ServiceTelegram(telegramImp);

const service = new DI<ProjectInterface.TModuleService>();

service.use("Auth", auth);
service.use("Files", files);
service.use("History", history);
service.use("Inference", inference);
service.use("Message", message);
service.use("Payment", payment);
service.use("Telegram", telegram);

export default service;
