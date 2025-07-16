import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import Button from "@mui/material/Button";
import "../css/CardElementForm.css"
import { forwardRef, useImperativeHandle, useState } from "react";
import Stack from "@mui/material/Stack";
import axios from "axios";
import dayjs from "dayjs";
import { v4 as uuidv4} from "uuid";

import ResultDialog from "./ResultDialog.tsx";

type Props = {
    intentId: string;
    email: string;
    amount: number;
    reserveDateTime: dayjs.Dayjs;
    setShowDialog: (showDialog) => void;
};

const CardElementForm: React.FC<Props> = ({intentId = "", email = "",amount = 0 ,reserveDateTime = dayjs() ,setShowDialog}) => {

    // 結果表示用パラメータ
    const [ showAPIResult, setShowAPIResult ] = useState(false);
    const [ resultMsg, setResultMsg ] = useState("");

    // 全て完了後のcloseメソッド
    const closeResultModal = ()=>{
        setShowAPIResult(false);
    }

    // バリデーションチェック
    const validationCheck = (InputText: string): boolean => {
        const rule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        console.log(rule.test(InputText));
        return rule.test(InputText);
    };

    // 1.決済関連処理
    const stripe = useStripe();
    const elements = useElements();

    const reserveStripe = async(event) => {
        event.preventDefault();
        if(!validationCheck(email)){
            setResultMsg("正しい形式でメールアドレスを入力してください");
            setShowAPIResult(true);
            return;
        }

        // 顧客識別コード発行
        const waitCode = uuidv4();
        if (stripe && elements) {
            const cardElement = elements.getElement(CardElement);

            // 日付登録
            const dateApiResult = reserveDatetime(email, waitCode ,reserveDateTime);
            console.log(dateApiResult);
            // データがエラーならキャンセル処理を実装
            // if(!dateApiResult) return;

            // 日付登録が成功したら正式にstripeを作成
            await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement!
            }).then(result => {
                console.log(intentId);
                console.log(result.paymentMethod?.id);
                if(!result.paymentMethod) return;
                const stripeApiResult = createPaymentMethodAPI(result.paymentMethod?.id, waitCode);
                console.log(result);
            }).catch(error => {
                console.log(error);
            });
        }
        setShowAPIResult(true);
    }

    
    // 2.日時情報予約
    //　該当コンテナに予約情報を保存
    const reserveDatetime = (email: string, waitCode: String,reserveDate: dayjs.Dayjs) => {
        const options = {
            userId :email,
            waitCode : waitCode,
            expDate: reserveDate.format("YYYY-MM-DDTHH:mm:ss"),
            chargePrice: amount,
            // (店舗管理機能は未実装のため暫定対応)
            shopId:1
        }
        const apiResult = axios.post(process.env.REACT_APP_LOCAL_RESERVE_REGIST ?? "",options);
        if(apiResult){
            apiResult.then(result => {
                console.log(result.data);
                setResultMsg(result.data.message);
                return true;
            }).catch(error => {
                console.log(error);
                setResultMsg(error.data.message);
                return false;
            });
        }
        return false;
    }

    function createPaymentMethodAPI(paymentMethodId, waitCode){
        axios.post(process.env.REACT_APP_DEV_STRIPE_REGIST ?? "",{
            userId : email,
            intentId : intentId,
            paymentMethod : paymentMethodId,
            waitCode: waitCode,
            expDateTime: reserveDateTime.format("YYYY-MM-DDThh:mm:ss")
        }).then(result => {
            console.log(result.data);
            setResultMsg(result.data.message);
            return true;
        }).catch(error => {
            console.log(error);
            setResultMsg(error.data.message);
            return false;
        });
    }


    return (
        <div>
            <CardElement className="cardForm"/>
            <Stack direction="row" justifyContent="end" spacing={2}>
                <Button variant="contained" onClick={ reserveStripe }>注文する</Button>
                <Button variant="contained" onClick={() => setShowDialog(false)}>閉じる</Button>
            </Stack>
            <ResultDialog showAPIResult = { showAPIResult } message = { resultMsg } closeResultModal = {() => closeResultModal()}/>
        </div>
    );
}
export default CardElementForm;