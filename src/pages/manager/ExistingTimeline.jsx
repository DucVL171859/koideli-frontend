import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import vehicleServices from 'services/vehicleServices';
import branchServices from 'services/branchServices';
import { useNavigate } from 'react-router-dom';

const formatDateTime = (dateString) => {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', options).replace(',', '');
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'Pending':
            return 'Chưa hoạt động';
        case 'Delivering':
            return 'Đang hoạt động';
        case 'Completed':
            return 'Hoàn thành';
        default:
            return 'Không xác định';
    }
};

const StatusCircle = ({ status }) => {
    let color;
    switch (status) {
        case 'Pending':
            color = '#b3b37e';
            break;
        case 'Delivering':
            color = '#66cbec';
            break;
        case 'Completed':
            color = '#66ec9e';
            break;
        default:
            color = 'gray';
    }

    return (
        <span
            style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: color,
                marginRight: '5px',
            }}
        />
    );
};

const ExistingTimelines = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);

    const [existingTimelines, setExistingTimelines] = useState([]);
    const [filteredTimelines, setFilteredTimelines] = useState([]);

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await getBranches();
            await getExistingTimelines();
            await getVehicles();
        };

        fetchData();
    }, []);

    const getExistingTimelines = async () => {
        let resOfExistingTimeline = await timelineDeliveryServices.getTimelineDeliveryEnable();
        if (resOfExistingTimeline.data.data) {
            setExistingTimelines(resOfExistingTimeline.data.data);
            setFilteredTimelines(resOfExistingTimeline.data.data);
        }
    }

    const getVehicles = async () => {
        let resOfVehicles = await vehicleServices.getVehicle();
        if (resOfVehicles.data.data) {
            setVehicles(resOfVehicles.data.data);
        }
    }

    const getBranches = async () => {
        let resOfBranches = await branchServices.getBranch();
        if (resOfBranches.data.data) {
            setBranches(resOfBranches.data.data);
        }
    }

    const handleBranchChange = (event) => {
        const selectedBranchId = event.target.value;
        setSelectedBranch(selectedBranchId);

        if (selectedBranchId) {
            const filtered = existingTimelines.filter(timeline => timeline.branchId === selectedBranchId);
            setFilteredTimelines(filtered);
        } else {
            setFilteredTimelines(existingTimelines);
        }
    };

    const handleViewDetail = (slug) => {
        navigate(`/manager/timeline/${slug}/create-order-timeline`);
    };

    return (
        <div>
            <FormControl margin="normal" sx={{ width: '300px' }}>
                <InputLabel id="branch-select-label">Chọn Chuyến Nhỏ</InputLabel>
                <Select
                    labelId="branch-select-label"
                    value={selectedBranch}
                    onChange={handleBranchChange}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    {branches.map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                            {branch.startPoint} - {branch.endPoint}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Xe</TableCell>
                            <TableCell>Các chuyến nhỏ</TableCell>
                            <TableCell>Dự kiến bắt đầu - kết thúc</TableCell>
                            <TableCell>Thời điểm kết thúc</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTimelines && filteredTimelines.map((timeline) => {
                            const vehicle = vehicles.find(v => v.id === timeline.vehicleId) || {};
                            return (
                                <TableRow key={timeline.id}>
                                    <TableCell>{vehicle.name || 'Không xác định'}</TableCell>
                                    <TableCell>{branches.find(branch => branch.id === timeline.branchId).name}</TableCell>
                                    <TableCell>{formatDateTime(timeline.startDay)} - {formatDateTime(timeline.endDay)}</TableCell>
                                    <TableCell>{timeline.timeCompleted || 'Chưa hoàn thành'}</TableCell>
                                    <TableCell>
                                        <StatusCircle status={timeline.isCompleted} />
                                        {getStatusLabel(timeline.isCompleted)}
                                    </TableCell>
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
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ExistingTimelines;