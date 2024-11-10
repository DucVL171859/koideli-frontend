import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const VehicleDialog = ({ open, handleClose, handleUpdate, vehicleData }) => {
    const [updatedVehicle, setUpdatedVehicle] = useState({
        name: '',
        vehicleVolume: '',
    });

    useEffect(() => {
        if (vehicleData) {
            setUpdatedVehicle({
                name: vehicleData.name || '',
                vehicleVolume: vehicleData.vehicleVolume || '',
            });
        }
    }, [vehicleData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedVehicle((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        handleUpdate(updatedVehicle);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Cập nhật thông tin xe</DialogTitle>
            <DialogContent>
                <TextField
                    label="Tên xe"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="name"
                    value={updatedVehicle.name}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Thể tích xe"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="vehicleVolume"
                    value={updatedVehicle.vehicleVolume}
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

export default VehicleDialog;