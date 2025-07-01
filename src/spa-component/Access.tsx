import { Button, Card, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import "../css/Access.css"

const Access = () => {
    const [openDialog, setOpenDialog] = useState(false);

    const container = {
        width: "75%",
        height: "75%",
        margin: "auto"
    };

    const location = {
        lat: 35.680959106959,
        lng: 139.76730676352
    }

    return (
        <div>
            <Button sx={{ width:100 }} variant="contained" onClick={ () => setOpenDialog(true) }>アクセス</Button>
            <Dialog open = { openDialog }>
                <Card sx={{ margin: 2, overflow: "auto", boxShadow: "none" }}>
                    <div className="wrap">
                        <DialogTitle>アクセス</DialogTitle>
                        <DialogContent>
                            <p>〒100-0005 東京都千代田区丸の内1丁目</p>
                            <p>東京駅セントラルエリア2F南口</p>
                            <p>※架空の住所です</p>
                        </DialogContent>
                        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLEMAPKEY ?? ""}>
                            <GoogleMap mapContainerStyle={container} center={location} zoom={15}>
                                <MarkerF position={location} label={"テスト店舗です"} />
                            </GoogleMap>
                        </LoadScript>
                            <div className="space"/>
                        <Button sx={{ float:"right" }} variant="contained" onClick={ () => setOpenDialog(false) }>閉じる</Button>
                    </div>
                </Card>
            </Dialog>
        </div>
    );
}
export default Access;