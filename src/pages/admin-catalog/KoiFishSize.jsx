import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import koiFishServices from 'services/koiFishServices';
import { toast } from 'react-toastify';
import KoiFishSizeDialog from './dialog/KoiFishDialog';

const KoiFishSize = () => {
    const [koiFishSizes, setKoiFishSizes] = useState([]);
    const [selectedFish, setSelectedFish] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

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

    const handleOpenDialog = (fish) => {
        setSelectedFish(fish);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleUpdateFish = async (updatedFishData) => {
        console.log(updatedFishData)
        try {
            let response = await koiFishServices.updateKoiFish(selectedFish.id, updatedFishData);
            if (response.data) {
                setKoiFishSizes((prevSizes) =>
                    prevSizes.map((fish) =>
                        fish.id === selectedFish.id ? { ...fish, ...updatedFishData } : fish
                    )
                );
                setDialogOpen(false);
                toast.success('Cập nhật thành công');
            }
        } catch (error) {
            console.log('Error updating Koi fish size:', error);
            toast.error('Cập nhật thất bại');
        }
    };

    const handleDeleteFish = async (fishId) => {
        try {
            let response = await koiFishServices.deleteKoiFish(fishId);
            if (response.data) {
                setKoiFishSizes((prev) => prev.filter((prev) => prev.id !== fishId));
                toast.success('Ẩn thành công');
            }
        } catch (error) {
            console.log('Error deleting box:', error);
            toast.error('Ẩn thất bại');
        }
    };

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
                                    <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleOpenDialog(fish)}>Cập nhật</Button>
                                    <Button variant="outlined" color='error' onClick={() => handleDeleteFish(fish.id)}>Ẩn</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <KoiFishSizeDialog
                open={dialogOpen}
                handleClose={handleCloseDialog}
                handleUpdate={handleUpdateFish}
                fishData={selectedFish}
            />
        </MainCard>
    );
};

export default KoiFishSize;