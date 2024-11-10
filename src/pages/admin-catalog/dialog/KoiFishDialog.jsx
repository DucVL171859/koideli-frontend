import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const KoiFishSizeDialog = ({ open, handleClose, handleUpdate, fishData }) => {
    const [updatedFishData, setUpdatedFishData] = useState({
        size: '',
        volume: '',
        description: '',
    });

    useEffect(() => {
        if (fishData) {
            setUpdatedFishData({
                size: fishData.size || '',
                volume: fishData.volume || '',
                description: fishData.description || '',
            });
        }
    }, [fishData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedFishData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        handleUpdate(updatedFishData);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Cập nhật Kích Cỡ Koi</DialogTitle>
            <DialogContent>
                <TextField
                    label="Kích cỡ"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="size"
                    value={updatedFishData.size}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Thể tích"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="volume"
                    value={updatedFishData.volume}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Mô tả"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="description"
                    value={updatedFishData.description}
                    onChange={handleInputChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Hủy
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default KoiFishSizeDialog;
