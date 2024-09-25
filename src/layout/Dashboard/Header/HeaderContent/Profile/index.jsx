import { useTheme } from '@mui/material/styles';
import { ButtonBase, CardContent, ClickAwayListener, Grid, Paper, IconButton, Popper, Stack, Tooltip, Typography, Box } from '@mui/material'

import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import MainCard from '../../../../../components/MainCard';
import Avatar from '../../../../../components/@extended/Avatar';
import Transitions from '../../../../../components/@extended/Transitions';

import avatar1 from '../../../../../assets/images/logo.png';
import { LogoutOutlined } from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
            {value === index && children}
        </div>
    );
}

export default function Profile() {
    const theme = useTheme();
    const username = useSelector((state) => state.auth.currentUser);
    const role = useSelector((state) => state.auth.roles);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleLogout = () => {
        dispatch(logoutAction());
        navigate('/login');
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const iconBackColorOpen = 'grey.100';

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <ButtonBase
                sx={{
                    p: 0.25,
                    bgcolor: open ? iconBackColorOpen : 'transparent',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'secondary.lighter' },
                    '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 }
                }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 0.5 }}>
                    <Avatar alt="profile user" src={avatar1} size="sm" />
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        {username}
                    </Typography>
                </Stack>
            </ButtonBase>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
                        <Paper sx={{ boxShadow: '3px', width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard elevation={0} border={false} content={false}>
                                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                                        <Grid container justifyContent="space-between" alignItems="center">
                                            <Grid item>
                                                <Stack direction="row" spacing={1.25} alignItems="center">
                                                    <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
                                                    <Stack>
                                                        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{username}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {role}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip title="Logout">
                                                    <IconButton size="large" sx={{ color: 'text.primary' }} onClick={handleLogout}>
                                                        <LogoutOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
}

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };  