import { Button, Card, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import "../css/Access.css"

const Access = () => {
    const [openDialog, setOpenDialog] = useState(false);

    const container = {
        width: "75%",
        height: "75%"
    };

    const location = {
        lat: 35.680959106959,
        lng: 139.76730676352
    }

    const map = (
        <div className="wrap">
            {/* 改善課題 APIKEYはenv経由で読ませる(なぜかmapがロードできないので暫定直読みで実装) */}
            <LoadScript googleMapsApiKey = "ここに自分のgoogle mapのapikeyを入れてください">
                 <GoogleMap mapContainerStyle={container} center={location} zoom={15}>
                     <MarkerF position={location} label={"テスト店舗です"} />
                 </GoogleMap>
            </LoadScript>
        </div>
    );
    return (
        <div>
            <Button sx={{ width:100 }} variant="contained" onClick={ () => setOpenDialog(true) }>アクセス</Button>
            <Dialog open = { openDialog }>
                <Card sx={{ margin:2, overflow: "auto", boxShadow: "none" }}>
                    <DialogTitle>アクセス</DialogTitle>
                    { map }
                    <Stack>
                        <p>〒100-0005 東京都千代田区丸の内1丁目</p>
                        <p>東京駅セントラルエリア2F南口</p>
                        <p>※架空の住所です</p>
                    </Stack>
                    <Stack direction = {"row"} justifyContent = {"end"} spacing = {2}>
                        <Button variant="contained" onClick={ () => setOpenDialog(false) }>閉じる</Button>
                    </Stack>
                </Card>
            </Dialog>
        </div>
    );
}
export default Access;