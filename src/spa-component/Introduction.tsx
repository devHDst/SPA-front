import {Button, Card, CardMedia, Dialog, DialogTitle, Stack, Typography} from "@mui/material";
import { useState } from "react";

const Introduction = () =>{
 
    const [openDialog, setOpenDialog] = useState(false);

    const imgPath = "/images/構成.jpg"
    const content = (
        <div>
            <Typography component="p">
                    学習目的の題材で当初はログイン機能付きのマルチ店舗管理を想定。
                    ただ途中から行きつけのお店の予約システムが面白そうだったのと、予約時に決済が確定してしまう点が不便という改善点を思いつき急遽以下の構成に変更。
            </Typography>
            <CardMedia
                component="img"
                image = {imgPath}
            />
            <p>・「複数コンテナ要らなくない？」</p>
            <p>・「これmq必要？」</p>
            <Typography>
                    ええ仰る通りでございますもっとコンパクトに纏められます。
                    これに関しましてはmqに興味があったのと学習目的なので折角spring使うなら色々FW機能使いたかっただけです。本来はもっと効率よくまとめるものです。
            </Typography>
        </div>
    );

    return (
        <div>
            <Button variant="contained" sx={{ width:100 }} onClick={() => setOpenDialog(true)}>概要</Button>
            <Dialog open = { openDialog } onClose = { () => setOpenDialog(false) }>
                <Card className="card" sx={{ margin: 2, overflow: "auto", boxShadow: "none" }}>
                    <DialogTitle>
                        <p>作成の経緯</p>
                    </DialogTitle>
                    {content}
                    <Stack direction={"row"} justifyContent = {"end"} spacing={2}>
                        <Button variant="contained" onClick={() => setOpenDialog(false)}>閉じる</Button>
                    </Stack>
                </Card>
            </Dialog>
        </div>
    );
}

export default Introduction;