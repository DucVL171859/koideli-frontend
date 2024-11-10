import MainCard from "components/MainCard";
import { useEffect, useState } from "react";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Divider,
} from "@mui/material";

const Timeline = () => {
    const [timelines, setTimelines] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            getAllTimeline();
        };

        fetchData();
    }, []);

    const getAllTimeline = async () => {
        let resOfTimeline = await timelineDeliveryServices.getTimelineDeliveryEnable();
        if (resOfTimeline.data.data) {
            console.log(resOfTimeline.data.data);
            setTimelines(resOfTimeline.data.data);
        }
    };

    const translateStatus = (status) => {
        switch (status) {
            case "Pending":
                return "Chưa bắt đầu";
            case "Delivering":
                return "Đang vận chuyển";
            case "Completed":
                return "Đã kết thúc";
            default:
                return status;
        }
    };

    return (
        <MainCard>
            <Typography variant="h5" gutterBottom>
                Lịch trình
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Mã xe</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Mã kho</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Dự kiến bắt đầu</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Dự kiến kết thúc</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Thời gian kết thúc</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timelines && timelines.map((timeline) => (
                            <TableRow key={timeline.id}>
                                <TableCell>{timeline.id}</TableCell>
                                <TableCell>{timeline.vehicleId}</TableCell>
                                <TableCell>{timeline.branchId}</TableCell>
                                <TableCell>{new Date(timeline.startDay).toLocaleString()}</TableCell>
                                <TableCell>{new Date(timeline.endDay).toLocaleString()}</TableCell>
                                <TableCell>{translateStatus(timeline.isCompleted)}</TableCell>
                                <TableCell>{new Date(timeline.timeCompleted).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
};

export default Timeline;