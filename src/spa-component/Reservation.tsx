import { useEffect, useRef, useState } from "react";
import "../css/Reservation.css";
import { Button, Dialog, DialogTitle, TextField, Card } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { loadStripe } from "@stripe/stripe-js"
import { Elements} from "@stripe/react-stripe-js"
import axios from "axios";
import CardElementForm from "./CardElementForm.tsx";
import ResultDialog from "./ResultDialog.tsx";
import { v4 as uuidv4} from "uuid";


const Reservation = (amount = 0) =>{

    const [ email, setEmail] = useState("");
    const [ reserveDate, setReservaDate] = useState(dayjs());
    const [ options, setOptions ] = useState([]);
    const [ showDialog, setShowDialog ] = useState(false);
    const [ showAPIResult, setShowAPIResult ] = useState(false);
    const [ resultMsg, setResultMsg ] = useState("");

    // バリデーションチェック
    const validationCheck = (InputText: string): boolean => {
        const rule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        console.log(rule.test(InputText));
        return rule.test(InputText);
    };


    // 1.基本パラメータ
    // モーダルチェック
    const showModal = () => {
        setShowDialog(!showDialog);
    }
    const closeModal = () => {
        setShowDialog(false);
    }
    const closeResultModal = () =>{
        setShowAPIResult(false);
    }
    // 日付監視
    const chooseDate = (dateTime) => {
        setReservaDate(dateTime);
    }
    // 名前変更
    const changeEmail = (email) => {
        setEmail(email);
    }
    // stripe設定
    const getOptions = (data) =>{
        setOptions(data);
    }

    // 2.日時入力設定
    const calendar = (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                    <DateTimePicker
                        sx={{marginBottom:1}}
                        className="dateForm"
                        label="予約可能日から日時を選択してください"
                        timeSteps={{ minutes: 5 }}
                        onChange={(dateTime) => {chooseDate(dateTime)}}
                        ampm = {false}
                    />
                </DemoContainer>
            </LocalizationProvider>
    );

    // 日時のみ予約の登録API
    const reserveDatetime = (email: string, reserveDate: dayjs.Dayjs) => {

        if(!validationCheck(email)){
            setResultMsg("正しい形式でメールを入力してください");
            setShowAPIResult(true);
            return;
        }
        const options = {
            userId :email,
            waitCode : uuidv4(),
            expDate: reserveDate.format("YYYY-MM-DDTHH:mm:ss"),
            chargePrice: amount.charge,
            // (店舗管理機能は未実装のため暫定対応)
            shopId:1
        }
        const apiResult = axios.post(process.env.REACT_APP_LOCAL_RESERVE_REGIST ?? "",options);
        if(apiResult){
            apiResult.then(res => {
                setResultMsg(res.data.message);
                setShowAPIResult(true);
                console.log(res.data);
            }).catch(error => {
                console.log(error);
            });
        }
    }
    // 3.stripe関連の呼び出し
    // stripe設定(注文選択時のみ)
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPEKEY ?? "");
    useEffect(() => {
        if(amount.charge > 0 ){
            axios.post(process.env.REACT_APP_LOCAL_STRIPE_SET ?? "",
                {
                    "amount": amount.charge,
                    "currency": 'jpy'
                },
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            ).then(res => {
                console.log(res);
                getOptions(res.data);
            }).catch(error =>{
                console.log(error);
            })
        }
    },[amount.charge]);
    
    // stripeForm設定
    const stripeOptions = {
        appearance:{
          theme: 'stripe' as 'stripe',
        },
        // PaymentIntentのclientSecretを入力する
        clientSecret: options.clientSecret,
    };
    const stripeForm = (
        <div className="layout">
            <Elements stripe={stripePromise} options={stripeOptions}>
                <CardElementForm
                    amount = {amount.charge}
                    email = {email}
                    intentId = {options.intentId} 
                    reserveDateTime = {reserveDate} 
                    setShowDialog = {setShowDialog} />
            </Elements>
        </div>
    );

    // 4.コンポーネント全体
    return (
        <div className="modalArea">
            <Button variant="contained" sx = {{ width :100 }} onClick = { showModal }>予約へ</Button>
            <Dialog className="dialog" open = { showDialog } onClose = { closeModal }>
                <DialogTitle id="alert-dialog-title">
                    予約&選択メニュー注文
                </DialogTitle>
                <Card sx={{ width: 500, margin: 2, overflow: "auto", boxShadow: "none" }}> 
                    {/* calendarまでは標準入力フォーム */}
                    <TextField 
                        sx = {{ marginTop:1,marginBottom:1 }}
                        type = { "email" }
                        className = "emailForm" 
                        label = "メールアドレスを入力してください"
                        onChange={(event) =>  changeEmail(event.target.value)}
                        />
                    { calendar }

                    { amount.charge > 0 ?
                    // 決済フォーム呼び出し
                    stripeForm:
                    //　日時のみ登録呼び出し
                    <div >
                        <Stack direction="row" justifyContent="end" spacing={2}>
                            <Button variant="contained" onClick ={() => reserveDatetime(email, reserveDate)}> 予約する</Button>
                            <Button variant="contained" onClick = {closeModal}>閉じる</Button>
                        </Stack>
                    </div> 
                    }
                </Card>
            </Dialog>
            <ResultDialog 
                showAPIResult = {showAPIResult} 
                message = {resultMsg} 
                closeResultModal = {() => closeResultModal()}
                validationCheck = {() => validationCheck("")}
                />
        </div>
    );
}

export default Reservation;