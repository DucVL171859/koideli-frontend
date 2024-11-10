import { Typography } from "@mui/material";
import MainCard from "components/MainCard"

const ManagerPage = () => {

    return (
        <>
            <MainCard title="Chào mừng người quản lý">
                <Typography variant="body2">
                    Chào mừng người quản lý đến với hệ thống Koi Deli.
                    Hãy có 1 ngày làm việc thật năng lượng.
                </Typography>
            </MainCard>
        </>
    )
}

export default ManagerPage;