
import { useState } from "react";
import { Dialog,DialogTitle, Card, Stack, Button } from "@mui/material";

type Props = {
    message: String;
    showAPIResult: boolean;
    closeAllModal:() => void;
}

const ResultDialog:React.FC<Props> = ({ showAPIResult = true, message = "", closeAllModal}) => {


    // 結果表示ダイアログ
    return ( 
        <div>
            <Dialog open={showAPIResult} onClose={closeAllModal}>
                <DialogTitle>
                    送信結果
                    <Card sx={{ margin:2, boxShadow:"none" }}>
                        {message}
                    </Card>
                    <div>
                        <Stack direction="row" justifyContent="end" spacing={2}>
                            <Button variant="contained" onClick = {closeAllModal}>戻る</Button>
                        </Stack>
                    </div>
                </DialogTitle>
            </Dialog>
        </div>
    );
}
export default ResultDialog;