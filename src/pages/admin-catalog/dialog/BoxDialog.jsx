import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const BoxDialog = ({ open, handleClose, boxData, handleUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        maxVolume: '',
        price: '',
    });

    useEffect(() => {
        if (boxData) {
            setFormData({
                name: boxData.name,
                maxVolume: boxData.maxVolume,
                price: boxData.price,
            });
        }
    }, [boxData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        handleUpdate(formData);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Cập nhật Hộp</DialogTitle>
            <DialogContent>
                <TextField
                    label="Tên Hộp"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Thể tích tối đa (lít)"
                    name="maxVolume"
                    value={formData.maxVolume}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Giá"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                    sx={{ mb: 2 }}
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

export default BoxDialog;
