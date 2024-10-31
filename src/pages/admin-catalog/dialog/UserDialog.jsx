import { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    Grid,
    Avatar
} from '@mui/material';

const UserDialog = ({ open, onClose, user, onSubmit, mode, roles }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = name === "roleId" ? parseInt(value, 10) : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleToggleChange = (e) => {
        console.log(e.target.checked)
        setFormData({ ...formData, isConfirmed: e.target.checked });
    };

    const handleSubmit = () => {
        onSubmit({ ...formData });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{mode === 'update' ? 'Thông tin tài khoản' : 'Cập nhật tài khoản'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            name="ID"
                            label="ID"
                            type="text"
                            value={formData.id}
                            className='col-3'
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isConfirmed}
                                    onChange={handleToggleChange}
                                    name="isConfirmed"
                                />
                            }
                            label={formData.isConfirmed ? 'Đã xác minh' : 'Chưa xác minh'}
                        />
                    </Grid>
                </Grid>

                {mode === 'update' ? (
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="role-select-label">Vai trò</InputLabel>
                        <Select
                            labelId="role-select-label"
                            name="roleId"
                            value={formData.roleId || ''}
                            onChange={handleChange}
                            className='col-6'
                        >
                            {Object.entries(roles).map(([id, roleName]) => (
                                <MenuItem key={id} value={id}>
                                    {roleName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <TextField
                        margin="dense"
                        name="role"
                        label="Vai trò"
                        type="text"
                        value={roles[formData.roleId] || 'N/A'}
                        className='col-6'
                        disabled
                    />
                )}

                <Grid container spacing={2} alignItems="center" mt={2}>
                    <Grid item xs={6} container justifyContent="center">
                        {formData.urlAvatar && (
                            <Avatar
                                alt="User Avatar"
                                src={formData.urlAvatar}
                                sx={{ width: 250, height: 250 }}
                            />
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            name="name"
                            label="Tên"
                            type="text"
                            value={formData.name}
                            fullWidth
                            disabled
                        />
                        <TextField
                            margin="dense"
                            name="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            fullWidth
                            disabled
                        />
                        <TextField
                            margin="dense"
                            name="phoneNumber"
                            label="Số điện thoại"
                            type="text"
                            value={formData.phoneNumber}
                            fullWidth
                            disabled
                        />
                        <TextField
                            margin="dense"
                            name="gender"
                            label="Giới tính"
                            type="text"
                            value={formData.gender}
                            fullWidth
                            disabled
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                {mode === 'update' && <Button onClick={handleSubmit}>Cập nhật</Button>}
            </DialogActions>
        </Dialog>
    );
};

export default UserDialog;