import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import koiFishServices from 'services/koiFishServices';

const KoiFishSize = () => {
    const [koiFishSizes, setKoiFishSizes] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            getKoiFishSize();
        }

        fetchData();
    }, []);

    const getKoiFishSize = async () => {
        let resOfKoiFishSize = await koiFishServices.getKoiFish();
        if (resOfKoiFishSize.data) {
            setKoiFishSizes(resOfKoiFishSize.data);
        }
    }

    return (
        <MainCard>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Kích cỡ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Thể tích</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Mô tả</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {koiFishSizes && koiFishSizes.map((fish) => (
                            <TableRow key={fish.id}>
                                <TableCell>{fish.id}</TableCell>
                                <TableCell>{fish.size}</TableCell>
                                <TableCell>{fish.volume}</TableCell>
                                <TableCell>{fish.description}</TableCell>
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

export default KoiFishSize;