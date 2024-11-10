import { Typography } from "@mui/material";
import MainCard from "components/MainCard"

const SalePage = () => {
    return (
        <>
            <MainCard title="Chào mừng nhân viên bán hàng">
                <Typography variant="body2">
                    Chào mừng nhân viên bán hàng đến với hệ thống Koi Deli.
                    Hãy có 1 ngày làm việc thật năng lượng.
                </Typography>
            </MainCard>
        </>
    )
}

export default SalePage;