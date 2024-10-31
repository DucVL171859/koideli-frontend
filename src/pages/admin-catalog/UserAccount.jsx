import { useEffect, useState } from 'react';
import {
    Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import MainCard from 'components/MainCard';
import UserDialog from './dialog/UserDialog';
import { toast } from 'react-toastify';
import userServices from 'services/userServices';
import roleServices from 'services/roleServices';

const UserAccount = () => {
    const [user, setUser] = useState([]);
    const [role, setRole] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [mode, setMode] = useState('view');

    useEffect(() => {
        const fetchUsers = async () => {
            await getUser();
            await getRole();
        };

        fetchUsers();
    }, []);

    const getUser = async () => {
        let resOfUser = await userServices.getAllUser();
        if (resOfUser.data.data) {
            setUser(resOfUser.data.data);
        }
    }

    const getRole = async () => {
        let resOfRole = await roleServices.getRole();
        if (resOfRole.data.data) {
            let rolesMap = resOfRole.data.data.reduce((acc, role) => {
                acc[role.id] = role.name;
                return acc;
            }, {});
            setRole(rolesMap);
        }
    }

    const handleOpen = (user, mode) => {
        setCurrentUser(user);
        setMode(mode);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setCurrentUser(null);
    };

    const handleSubmit = async (data) => {
        if (data) {
            let updatedData = {
                name: data.name,
                email: data.email,
                password: data.password,
                phoneNumber: data.phoneNumber,
                roleId: data.roleId,
                gender: data.gender,
                confirmationToken: data.confirmationToken,
                isConfirmed: data.isConfirmed,
                urlAvatar: data.urlAvatar,
                address: data.address
            }

            let resOfUpdate = await userServices.updateUser(id, updatedData);
            if (resOfUpdate.data.data) {
                toast.success('Cập nhật thành công');
                handleClose();
            } else {
                toast.error('Cập nhật thất bại');
            }
        }
    };

    return (
        <>
            <MainCard>
                <Typography variant='h4' mb={2} fontWeight={600}>Tài khoản người dùng</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Vai trò</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {user && user.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNumber}</TableCell>
                                    <TableCell>{role[user.roleId] || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleOpen(user, 'view')}>Xem chi tiết</Button>
                                        <Button variant="outlined" onClick={() => handleOpen(user, 'update')}>Cập nhật</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>

            <UserDialog
                open={openDialog}
                onClose={handleClose}
                user={currentUser}
                onSubmit={handleSubmit}
                mode={mode}
                roles={role}
            />
        </>
    );
};

export default UserAccount;