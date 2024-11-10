import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MainCard from 'components/MainCard'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import vehicleServices from 'services/vehicleServices';
import VehicleDialog from './dialog/VehicleDialog';

const Vehicle = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            getVehicle();
        }

        fetchData();
    }, []);

    const getVehicle = async () => {
        let resOfVehicle = await vehicleServices.getVehicle();
        if (resOfVehicle.data.data) {
            setVehicles(resOfVehicle.data.data);
        }
    }

    const handleOpenDialog = (vehicle) => {
        setSelectedVehicle(vehicle);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleUpdateVehicle = async (updatedVehicleData) => {
        try {
            let response = await vehicleServices.updateVehicle(selectedVehicle.id, updatedVehicleData);
            if (response.data) {
                setVehicles((prevVehicles) =>
                    prevVehicles.map((vehicle) =>
                        vehicle.id === selectedVehicle.id ? { ...vehicle, ...updatedVehicleData } : vehicle
                    )
                );
                setDialogOpen(false);
                toast.success('Cập nhật thành công');
            }
        } catch (error) {
            console.error('Error updating vehicle:', error);
            toast.error('Cập nhật thất bại');
        }
    };

    const handleDeleteVehicle = async (vehicleId) => {
        try {
            let response = await vehicleServices.deleteVehicle(vehicleId);
            if (response.data) {
                setVehicles((prev) => prev.filter((prev) => prev.id !== vehicleId));
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
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Tên</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Thể tích</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicles && vehicles.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                                <TableCell>{vehicle.id}</TableCell>
                                <TableCell>{vehicle.name}</TableCell>
                                <TableCell>{vehicle.vehicleVolume}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleOpenDialog(vehicle)}>Cập nhật</Button>
                                    <Button variant="outlined" color='error' onClick={() => handleDeleteVehicle(vehicle.id)}>Ẩn</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <VehicleDialog
                open={dialogOpen}
                handleClose={handleCloseDialog}
                handleUpdate={handleUpdateVehicle}
                vehicleData={selectedVehicle}
            />
        </MainCard>
    )
}

export default Vehicle