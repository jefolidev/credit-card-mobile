import api from "../../api";
import { ResponseAuthCard, ResponseBuyByQrCodeDto, ResponseGetAllCardsUser, ResponseGetBalanceCard, ResponseGetBillingDetails, ResponseGetBillingsCards, ResponseSellByQrCodeDto, ResponseWithMessageDto } from "./responses-dto";
import AuthCardDTO from "./validations/auth-card-dto";
import BodyPayQrCodeDto from "./validations/body-pay-qr-code.dto";
import ChangePasswordDto from "./validations/change-password-dto";
import QuerySearchSellsCardDTO from "./validations/query-search-sells-card-dto";

const getCards = async (): Promise<ResponseGetAllCardsUser> => {
  const {data} = await api.get('/buyer/cards');
  return data;
}

const authCard = async (body: AuthCardDTO): Promise<ResponseAuthCard> => {
    const {data} = await api.post('/buyer/card/auth', body);
    return data;
}

/*
    Daqui pra baixo todos os endpoints vão ter que receber o token no header
    authorization_card: `Bearer ${token}`
    Esse token vc obtem na resposta do endpoint de autenticação do cartão que está na função acima
    Trate os endpoint a seguir da forma que achar melhor, mas lembre-se de adicionar o token no header

    O id do cartão é obtido nesse token, por isso não é necessário enviar o id do cartão nos endpoints abaixo
*/

const getBalanceCard = async (): Promise<ResponseGetBalanceCard> => {
    const {data} = await api.get('/buyer/card/balance');
    return data;
}

const getBillingsCards = async (): Promise<ResponseGetBillingsCards> => {
    const {data} = await api.get('/buyer/card/billings');
    return data;
}

const getBillingsDetailsCard = async (billingId: string): Promise<ResponseGetBillingDetails> => {
    const {data} = await api.get(`/buyer/card/billings/${billingId}/transactions`);
    return data;
}

const getSellsCard = async (query: QuerySearchSellsCardDTO): Promise<ResponseGetBillingDetails> => {
    const {data} = await api.get('/buyer/card/transactions', {params: query});
    return data;
}

const changePasswordCard = async (body: ChangePasswordDto): Promise<ResponseWithMessageDto> => {
    const {data} = await api.patch('/buyer/card/password', body);
    return data;
}

const blockCard = async (): Promise<ResponseWithMessageDto> => {
    const {data} = await api.patch('/buyer/card/block');
    return data;
}

/////Esse id é o que for lido no QR Code
const getDetailsQrCode = async (id: string): Promise<ResponseSellByQrCodeDto> => {
    const {data} = await api.get(`/buyer/qrcode/`+id);
    return data;
}

const payQrCode = async (id: string, body: BodyPayQrCodeDto): Promise<ResponseBuyByQrCodeDto> => {
    const {data} = await api.post(`/buyer/qrcode/`+id, body);
    return data;
}

export {
    getCards,
    authCard,
    getBalanceCard,
    getBillingsCards,
    getBillingsDetailsCard,
    getSellsCard,
    getDetailsQrCode,
    payQrCode,
    changePasswordCard,
    blockCard
}