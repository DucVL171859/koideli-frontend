import { Box, Grid, Typography, Link, Divider } from '@mui/material';
import Logo from "components/logo/LogoMain"; 

const FooterSection = ({ title, children }) => (
    <Box>
        <Typography variant="h6" component="div" gutterBottom fontWeight={600}>
            {title}
        </Typography>
        {children}
    </Box>
);

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: 'background.paper',
                padding: 4,
                marginTop: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Grid container spacing={2} justifyContent="center">
                {/* Column 1: Logo and Info */}
                <Grid item xs={12} sm={6} md={3}>
                    <FooterSection title="Store Info">
                        <Typography component='div' variant="body2" color="text.secondary">
                            <Logo
                                style={{ height: 60, marginBottom: 20, }}
                            />
                            <Typography>
                                Welcome to our store! We offer a variety of products to meet your needs.
                                Our mission is to provide high-quality items and excellent customer service.
                            </Typography>
                        </Typography>
                    </FooterSection>
                </Grid>

                {/* Column 2: Support */}
                <Grid item xs={12} sm={6} md={3}>
                    <FooterSection title="Support">
                        <Typography>
                            <Link href="#" underline="hover" color="inherit">
                                FAQ
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Contact Us
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Track Your Order
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Returns
                            </Link>
                        </Typography>
                    </FooterSection>
                </Grid>

                {/* Column 3: Policies */}
                <Grid item xs={12} sm={6} md={3}>
                    <FooterSection title="Policies">
                        <Typography>
                            <Link href="#" underline="hover" color="inherit">
                                Privacy Policy
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Terms of Service
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Shipping Policy
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Refund Policy
                            </Link>
                        </Typography>
                    </FooterSection>
                </Grid>

                {/* Column 4: Address and Phone */}
                <Grid item xs={12} sm={6} md={3}>
                    <FooterSection title="Contact Us">
                        <Typography>
                            <strong>Address:</strong>
                            <br />
                            1234 Main St, Suite 100
                            <br />
                            City, State, ZIP
                            <br />
                            <br />
                            <strong>Phone:</strong>
                            <br />
                            (123) 456-7890
                        </Typography>
                    </FooterSection>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Footer;