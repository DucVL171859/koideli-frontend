import { useEffect, useState } from 'react';
import {
    Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import MainCard from 'components/MainCard';
import PricingDialog from './dialog/PricingDialog';
import boxServices from 'services/boxServices';
import { toast } from 'react-toastify';
import { PriceFormat } from 'utils/tools';
import distanceServices from 'services/distanceServices';

const PricingTable = () => {
    const [boxPrice, setBoxPrice] = useState([]);
    const [distance, setDistance] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [currentType, setCurrentType] = useState(null);
    const [mode] = useState('update');

    useEffect(() => {
        const fetchData = async () => {
            await getBoxPrice();
            await getDistance();
        }

        fetchData();
    }, []);

    const getBoxPrice = async () => {
        let resOfBoxPrice = await boxServices.getBoxEnable();
        if (resOfBoxPrice.data.data) {
            setBoxPrice(resOfBoxPrice.data.data);
        }
    }

    const getDistance = async () => {
        let resOfDistance = await distanceServices.getDistanceEnable();
        if (resOfDistance.data.data) {
            setDistance(resOfDistance.data.data);
        }
    }

    const handleOpen = (data, type) => {
        setCurrentData(data);
        setCurrentType(type);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setCurrentData(null);
        setCurrentType(null);
    };

    const handleSubmit = async (data) => {
        if (data) {
            if (currentType === 'boxPrice') {
                let updatedData = {
                    name: data.name,
                    maxVolume: data.maxVolume,
                    price: data.price
                }

                let resOfUpdateBoxPrice = await boxServices.updateBox(data.id, updatedData);
                if (resOfUpdateBoxPrice) {
                    console.log(resOfUpdateBoxPrice)
                    toast.success('Cập nhật giá mới thành công');
                } else {
                    toast.error('Cập nhật giá mới thất bại');
                }

            } else if (currentType === 'distance') {
                let updatedData = {
                    rangeDistance: data.rangeDistance,
                    price: data.price
                }

                let resOfUpdateDistancePrice = await distanceServices.updateDistance(data.id, updatedData);
                if (resOfUpdateDistancePrice) {
                    toast.success('Cập nhật giá vận chuyển thành công');
                } else {
                    toast.error('Cập nhật giá vận chuyển thất bại');
                }
            }
        }
    };

    return (
        <>
            <MainCard>
                <Typography variant='h4' mb={2} fontWeight={600}>Bảng giá hộp cá đóng gói</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Loại hộp</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {boxPrice && boxPrice.map((boxPrice) => (
                                <TableRow key={boxPrice.id}>
                                    <TableCell>{boxPrice.id}</TableCell>
                                    <TableCell>{boxPrice.name}</TableCell>
                                    <TableCell><PriceFormat price={boxPrice.price} /></TableCell>
                                    <TableCell>
                                        <Button variant="outlined" onClick={() => handleOpen(boxPrice, 'boxPrice')}>Cập nhật giá</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>

            <MainCard sx={{ mt: 2 }}>
                <Typography variant='h4' mb={2} fontWeight={600}>Bảng giá vận chuyển theo khoảng cách</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Khoảng cách</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {distance && distance.map((distance) => (
                                <TableRow key={distance.id}>
                                    <TableCell>{distance.id}</TableCell>
                                    <TableCell>{distance.rangeDistance} KM</TableCell>
                                    <TableCell><PriceFormat price={distance.price} /></TableCell>
                                    <TableCell>
                                        <Button variant="outlined" onClick={() => handleOpen(distance, 'distance')}>Cập nhật giá</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>

            <PricingDialog
                open={openDialog}
                onClose={handleClose}
                data={currentData}
                onSubmit={handleSubmit}
                type={currentType}
            />
        </>
    );
};

export default PricingTable;