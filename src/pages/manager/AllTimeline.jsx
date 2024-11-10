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
    Divider,
    Button,
} from "@mui/material";
import vehicleServices from "services/vehicleServices";
import branchServices from "services/branchServices";
import { useNavigate } from "react-router-dom";

const formatDateTime = (dateString) => {
    let options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    let date = new Date(dateString);
    return date.toLocaleString('en-GB', options).replace(',', '');
};

const AllTimeline = () => {
    const navigate = useNavigate();

    const [timelines, setTimelines] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            getAllTimelines();
            getVehicles();
            getBranches();
        };

        fetchData();
    }, []);

    const getAllTimelines = async () => {
        let resOfTimeline = await timelineDeliveryServices.getTimelineDeliveryEnable();
        if (resOfTimeline.data.data) {
            setTimelines(resOfTimeline.data.data);
        }
    };

    const getVehicles = async () => {
        let resOfVehicle = await vehicleServices.getVehicle();
        if (resOfVehicle.data.data) {
            setVehicles(resOfVehicle.data.data)
        }
    }

    const getBranches = async () => {
        let resOfBranch = await branchServices.getBranch();
        if (resOfBranch.data.data) {
            setBranches(resOfBranch.data.data);
        }
    }

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

    const getVehicleName = (vehicleId) => {
        let vehicle = vehicles.find(v => v.id === vehicleId);
        return vehicle ? vehicle.name : 'Không xác định';
    };

    const getBranchName = (branchId) => {
        let branch = branches.find(b => b.id === branchId);
        return branch ? branch.name : 'Không xác định';
    }

    const handleViewDetail = (slug) => {
        navigate(`/manager/timeline/${slug}/create-order-timeline`);
    };

    return (
        <div>
            <Divider sx={{ marginBottom: 2 }} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Mã xe</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Các chuyển nhỏ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Dự kiến bắt đầu - kết thúc</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timelines && timelines.map((timeline) => (
                            <TableRow key={timeline.id}>
                                <TableCell>{timeline.id}</TableCell>
                                <TableCell>{getVehicleName(timeline.vehicleId)}</TableCell>
                                <TableCell>{getBranchName(timeline.branchId)}</TableCell>
                                <TableCell>{formatDateTime(timeline.startDay)} - {formatDateTime(timeline.endDay)}</TableCell>
                                <TableCell>{translateStatus(timeline.isCompleted)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewDetail(timeline.id)}
                                    >
                                        Xem Chi Tiết
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AllTimeline;