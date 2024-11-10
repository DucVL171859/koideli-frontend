import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import boxServices from 'services/boxServices';

const Box = () => {
    const [boxes, setBoxes] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            getBox();
        }

        fetchData();
    }, []);

    const getBox = async () => {
        let resOfBox = await boxServices.getBox();
        if (resOfBox.data) {
            setBoxes(resOfBox.data);
        }
    };

    return (
        <MainCard>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Tên Hộp</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Thể tích tối đa (lít)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Giá</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boxes && boxes.map((box) => (
                            <TableRow key={box.id}>
                                <TableCell>{box.id}</TableCell>
                                <TableCell>{box.name}</TableCell>
                                <TableCell>{box.maxVolume}</TableCell>
                                <TableCell>{box.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" sx={{ mr: 2 }}>Cập nhật</Button>
                                    <Button variant="outlined" color='error'>Ẩn</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
};

export default Box;