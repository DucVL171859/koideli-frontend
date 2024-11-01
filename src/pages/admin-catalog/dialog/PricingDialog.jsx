import { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField
} from '@mui/material';

const PricingDialog = ({ open, onClose, data, onSubmit, type }) => {
    const [formData, setFormData] = useState({ price: '' });

    useEffect(() => {
        if (data) {
            setFormData({
                price: data.price || '',
                ...(type === 'boxPrice' && { maxVolume: data.maxVolume })
            });
        }
    }, [data, type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onSubmit({ ...data, ...formData });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <DialogTitle>Cập nhật giá</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="id"
                    label="ID"
                    type="text"
                    value={data?.id || ''}
                    fullWidth
                    disabled
                />
                <TextField
                    margin="dense"
                    name="name"
                    label={type === 'boxPrice' ? "Loại hộp" : "Khoảng cách"}
                    type="text"
                    value={type === 'boxPrice' ? data?.name || '' : `${data?.rangeDistance} KM` || ''}
                    fullWidth
                    disabled
                />
                {type === 'box' && (
                    <TextField
                        margin="dense"
                        name="maxVolume"
                        label="Thể tích tối đa"
                        type="text"
                        value={formData.maxVolume || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                )}
                <TextField
                    autoFocus
                    margin="dense"
                    name="price"
                    label="Giá"
                    type="text"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={handleSubmit}>Cập nhật</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PricingDialog;