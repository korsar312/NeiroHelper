import Infrastructure from "../DI/Create.infrastructure";
import { ServiceAuth } from "../Services/ServiceAuth";
import ConnectFS from "../Services/ServiceFiles/Connect/FS/Connect.FS";
import FilesImp from "../Services/ServiceFiles/Imp/Files.imp";
import { ServiceFiles } from "../Services/ServiceFiles";
import { ServiceHistory } from "../Services/ServiceHistory";
import { Secret } from "../Config/Secret";
import { ServiceInference } from "../Services/ServiceInference";
import { ServiceMessage } from "../Services/ServiceMessage";
import { ServicePayment } from "../Services/ServicePayment";
import ConnectHTTP from "../Services/ServiceTelegram/Connect/HTTP/Connect.HTTP";
import { ServiceTelegram } from "../Services/ServiceTelegram";
import DI from "../DI/DI";
import { ProjectInterface } from "../DI/Project.interface";
import AuthImpTest from "../Services/ServiceAuth/Imp/Auth.imp.test";
import HistoryImpTest from "../Services/ServiceHistory/Imp/History.imp.test";
import InferenceImpTest from "../Services/ServiceInference/Imp/Inference.imp.test";
import MessageImpTest from "../Services/ServiceMessage/Imp/Message.imp.test";
import PaymentImpTest from "../Services/ServicePayment/Imp/Payment.imp.test";
import TelegramImpTest from "../Services/ServiceTelegram/Imp/Telegram.imp.test";
import Orchestrator from "../Orchestrator/Orchestrator";
import OrchestratorTelegram from "../Orchestrator/Telegram/OrchestratorTelegram";
import AuthImp from "../Services/ServiceAuth/Imp/Auth.imp";
import HistoryImp from "../Services/ServiceHistory/Imp/History.imp";
import InferenceImp from "../Services/ServiceInference/Imp/Inference.imp";
import MessageImp from "../Services/ServiceMessage/Imp/Message.imp";
import PaymentImp from "../Services/ServicePayment/Imp/Payment.imp";
import TelegramImp from "../Services/ServiceTelegram/Imp/Telegram.imp";

const authImpTest = new AuthImpTest(Infrastructure.get);
const authImp = new AuthImp(Infrastructure.get);
const auth = new ServiceAuth(authImp);

const filesConnect = new ConnectFS();
const filesImp = new FilesImp(filesConnect, Infrastructure.get);
const files = new ServiceFiles(filesImp);

const historyImpTest = new HistoryImpTest(Infrastructure.get);
const historyImp = new HistoryImp(Infrastructure.get);
const history = new ServiceHistory(historyImp);

const inferenceImpTest = new InferenceImpTest(Secret.openAiToken, Infrastructure.get);
const inferenceImp = new InferenceImp(Secret.openAiToken, Infrastructure.get);
const inference = new ServiceInference(inferenceImpTest);

const messageImpTest = new MessageImpTest(Infrastructure.get);
const messageImp = new MessageImp(Infrastructure.get);
const message = new ServiceMessage(messageImp);

const paymentImpTest = new PaymentImpTest(Infrastructure.get, {
	addressWalletMain: Secret.addressWalletSuper,
	addressWalletSecond: Secret.addressWalletPidor,

	addressWalletCollector: Secret.addressWalletWork,
	tokenWalletCollector: Secret.tokenWalletWork,

	fullHost: Secret.fullHost,
	USDT_CONTRACT: Secret.usdtContract,
});
const paymentImp = new PaymentImp(Infrastructure.get, {
	addressWalletMain: Secret.addressWalletSuper,
	addressWalletSecond: Secret.addressWalletPidor,

	addressWalletCollector: Secret.addressWalletWork,
	tokenWalletCollector: Secret.tokenWalletWork,

	fullHost: Secret.fullHost,
	USDT_CONTRACT: Secret.usdtContract,
});
const payment = new ServicePayment(paymentImpTest);

const telegramConnect = new ConnectHTTP({ token: Secret.tokenTg, link: Secret.linkTg });
const telegramImpTest = new TelegramImpTest(telegramConnect, Infrastructure.get);
const telegramImp = new TelegramImp(telegramConnect, Infrastructure.get);
const telegram = new ServiceTelegram(telegramImpTest);

const service = new DI<ProjectInterface.TModuleService>();

service.use("Auth", auth);
service.use("Files", files);
service.use("History", history);
service.use("Inference", inference);
service.use("Message", message);
service.use("Payment", payment);
service.use("Telegram", telegram);

//======================================

const DIService = service;

const orchestrator = new Orchestrator(DIService.get);

orchestrator.use(OrchestratorTelegram);
orchestrator.start();
