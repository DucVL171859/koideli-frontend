import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Logo from 'components/logo/LogoMain';

const RightSection = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto'
}));

const NavButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(2),
}));

const Header = () => {
    return (
        <AppBar position="static"
            sx={{
                bgcolor: '#FFF', boxShadow: 'unset',
                p: 0, m: 0, boxSizing: 'unset'
            }}
        >
            <Toolbar>
                <Logo />
                <RightSection>
                    <NavButton sx={{ color: '#7d6e48', fontWeight: 600 }}>Services</NavButton>
                    <NavButton sx={{ color: '#7d6e48', fontWeight: 600 }}>Instructions</NavButton>
                    <NavButton sx={{ color: '#7d6e48', fontWeight: 600 }}>Pricing</NavButton>
                    <NavButton sx={{ color: '#7d6e48', fontWeight: 600 }}>About</NavButton>
                    <NavButton sx={{ color: '#7d6e48', fontWeight: 600 }}>Contact</NavButton>
                    <NavButton href='/login' sx={{ color: '#7d6e48', fontWeight: 600 }}>Login/Register</NavButton>
                </RightSection>
            </Toolbar>
        </AppBar>
    );
};

export default Header;