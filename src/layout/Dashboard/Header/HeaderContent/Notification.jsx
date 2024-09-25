import { useRef, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { Avatar, Badge, Box, ClickAwayListener, Divider, IconButton, List, ListItemButton, ListItemAvatar, ListItemText, ListItemSecondaryAction, Paper, Popper, Tooltip, Typography, useMediaQuery } from '@mui/material';

import MainCard from '../../../../components/MainCard';
import Transitions from '../../../../components/@extended/Transitions';

import { NotificationsOutlined, CheckCircleOutlined, GifOutlined, MessageOutlined, SettingsOutlined } from '@mui/icons-material'

const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

const actionSX = {
    mt: '6px',
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',

    transform: 'none'
};

export default function Notification() {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const anchorRef = useRef(null);
    const [read, setRead] = useState(2);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const iconBackColorOpen = 'grey.100';

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <IconButton
                color="secondary"
                variant="light"
                sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : 'transparent' }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Badge badgeContent={read} color="primary">
                    <NotificationsOutlined />
                </Badge>
            </IconButton>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper sx={{ boxShadow: '3px', width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard
                                    title="Notification"
                                    elevation={0}
                                    border={false}
                                    content={false}
                                    secondary={
                                        <>
                                            {read > 0 && (
                                                <Tooltip title="Mark as all read">
                                                    <IconButton color="success" size="small" onClick={() => setRead(0)}>
                                                        <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </>
                                    }
                                >
                                    <List
                                        component="nav"
                                        sx={{
                                            p: 0,
                                            '& .MuiListItemButton-root': {
                                                py: 0.5,
                                                '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                                                '& .MuiAvatar-root': avatarSX,
                                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                                            }
                                        }}
                                    >
                                        <ListItemButton selected={read > 0}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                                                    <GifOutlined />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6">
                                                        It&apos;s{' '}
                                                        <Typography component="span" variant="subtitle1">
                                                            Cristina danny&apos;s
                                                        </Typography>{' '}
                                                        birthday today.
                                                    </Typography>
                                                }
                                                secondary="2 min ago"
                                            />
                                            <ListItemSecondaryAction>
                                                <Typography variant="caption" noWrap>
                                                    3:00 AM
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                        <Divider />
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                                                    <MessageOutlined />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6">
                                                        <Typography component="span" variant="subtitle1">
                                                            Aida Burg
                                                        </Typography>{' '}
                                                        commented your post.
                                                    </Typography>
                                                }
                                                secondary="5 August"
                                            />
                                            <ListItemSecondaryAction>
                                                <Typography variant="caption" noWrap>
                                                    6:00 PM
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                        <Divider />
                                        <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6" color="primary">
                                                        View All
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </List>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
}