import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, ClickAwayListener, Paper, IconButton, Popper, Toolbar } from '@mui/material';
import { ExpandMoreOutlined } from '@mui/icons-material';

import Search from './Search';
import Profile from './Profile';
import Transitions from '../../../../components/@extended/Transitions';

export default function MobileSection() {
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const iconBackColorOpen = 'grey.300';
    const iconBackColor = 'grey.100';

    return (
        <>
            <Box sx={{ flexShrink: 0, ml: 0.75 }}>
                <IconButton
                    sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                    aria-label="open more menu"
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    color="secondary"
                    variant="light"
                >
                    <ExpandMoreOutlined />
                </IconButton>
            </Box>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                sx={{ width: '100%' }}
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
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        <Paper sx={{ boxShadow: '3px' }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <AppBar color="inherit">
                                    <Toolbar>
                                        <Search />
                                        <Profile />
                                    </Toolbar>
                                </AppBar>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
}