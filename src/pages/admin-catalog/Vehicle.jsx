import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MainCard from 'components/MainCard'
import { useEffect, useState } from 'react'
import vehicleServices from 'services/vehicleServices';

const Vehicle = () => {
    const [vehicles, setVehicles] = useState([]);

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
                                    <Button variant="outlined" sx={{ mr: 2 }}>Cập nhật</Button>
                                    <Button variant="outlined" color='error'>Ẩn</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    )
}

export default Vehicle