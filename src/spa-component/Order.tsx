import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { useRef, useState, useEffect } from "react";
import "../css/Order.css";
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import Reservation from "./Reservation.tsx";



const Order = ()=>{
    
    const [ showDialog, setShowDialog] = useState(false);
    const [ MenuList , setMenuList ] = useState([]);
    const [ charge, setCharge] = useState(0);
    // モーダルチェック
    const showModal = ()=>{
        setShowDialog(!showDialog);
    }
    const closeModal = () =>{
        setShowDialog(false);
        setCharge(0);
    }
    // 金額情報制御
    const addCharge = (price) => {
        setCharge(charge + price);
    }
    const minusCharge = (price) =>{
        setCharge(charge - price);
    }
    // APIからメニュー情報読み込み
    useEffect(() => {
        axios.post(process.env.REACT_APP_DEV_MENUGET ?? "",
            {"id": 1},
            {
                headers:
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        ).then(res =>{
            setMenuList(res.data);
        }).catch(err => {
            console.error("メニュー情報の取得に失敗しました", err);
        });
    },[]);

    const imgPath = "/images/";

    const eachMenu = (
        <div className="cardArea">
            { MenuList.map( Menu =>(
                <Card className="card" sx={{ maxWidth: 300 }}>
                    <CardMedia
                        component="img"
                        sx={{ height: 130, width: 230 }}
                        image={ imgPath + Menu.imgUrl }
                    />
                    <Typography sx={{ margin: 1}} gutterBottom component="div">
                        { Menu.name }
                    </Typography>
                    <CardContent>
                        <Checkbox
                            onChange = { e => {
                                if (e.target.checked) {
                                    addCharge(Menu.price);
                                } else {
                                    minusCharge(Menu.price);
                                }
                            }}
                        />{ Menu.price } 円
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return(
        <div className="modalArea">
            <Button variant="contained" sx={{ width :100 }} onClick={ showModal }>メニュー</Button>
            <Dialog className="dialog" open = { showDialog } onClose={ closeModal }>
                <Card sx={{ margin: 2, overflow: "auto" , boxShadow: "none" }}>
                    <DialogTitle id="alert-dialog-title">
                        メニュー
                    </DialogTitle>
                        { eachMenu }
                    <Stack direction="row" justifyContent="end" spacing={2}>
                        <Reservation charge={ charge } />
                        <Button variant="contained" onClick={ closeModal }>閉じる</Button>
                    </Stack>
                </Card>
            </Dialog>
        </div>
    );
}
export default Order;