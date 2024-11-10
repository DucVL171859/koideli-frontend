import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import boxServices from 'services/boxServices';
import BoxDialog from './dialog/BoxDialog';
import { toast } from 'react-toastify';

const Box = () => {
    const [boxes, setBoxes] = useState([]);
    const [selectedBox, setSelectedBox] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

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

    const handleOpenDialog = (box) => {
        setSelectedBox(box);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleUpdateBox = async (updatedBoxData) => {
        try {
            let response = await boxServices.updateBox(selectedBox.id, updatedBoxData);
            if (response.data) {
                setBoxes((prevBoxes) =>
                    prevBoxes.map((box) =>
                        box.id === selectedBox.id ? { ...box, ...updatedBoxData } : box
                    )
                );
                setDialogOpen(false);
                toast.success('Cập nhật thành công');
            }
        } catch (error) {
            console.log('Error updating box:', error);
            toast.error('Cập nhật thất bại');
        }
    };

    const handleDeleteBox = async (boxId) => {
        try {
            let response = await boxServices.deleteBox(boxId);
            if (response.data) {
                setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== boxId));
                toast.success('Ẩn hộp thành công');
            }
        } catch (error) {
            console.log('Error deleting box:', error);
            toast.error('Ẩn hộp thất bại');
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
                                    <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleOpenDialog(box)}>Cập nhật</Button>
                                    <Button variant="outlined" color='error' onClick={() => handleDeleteBox(box.id)}>Ẩn</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <BoxDialog
                open={dialogOpen}
                handleClose={handleCloseDialog}
                boxData={selectedBox}
                handleUpdate={handleUpdateBox}
            />
        </MainCard>
    );
};

export default Box;