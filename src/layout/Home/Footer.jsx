import { Box, Grid, Typography, Link } from '@mui/material';
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
                backgroundColor: '#000000', // Dark background
                color: 'white', // Light text color
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
                    <FooterSection title="Thông Tin Cửa Hàng">
                        <Typography component='div' variant="body2" color="text.secondary">
                            <Logo style={{ height: 60, marginBottom: 20 }} />
                            <Typography>
                                Chào mừng bạn đến với cửa hàng của chúng mình! Chúng mình cung cấp nhiều loại sản phẩm để đáp ứng nhu cầu của bạn.
                                Sứ mệnh của chúng mình là cung cấp những mặt hàng chất lượng cao và dịch vụ khách hàng xuất sắc.
                            </Typography>
                        </Typography>
                    </FooterSection>
                </Grid>

                {/* Column 2: Support */}
                <Grid item xs={12} sm={6} md={3}>
                    <FooterSection title="Hỗ Trợ">
                        <Typography>
                            <Link href="#" underline="hover" color="inherit">
                                Câu Hỏi Thường Gặp
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Liên Hệ Chúng Mình
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Theo Dõi Đơn Hàng
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Đổi Trả
                            </Link>
                        </Typography>
                    </FooterSection>
                </Grid>

                {/* Column 3: Policies */}
                <Grid item xs={12} sm={6} md={3}>
                    <FooterSection title="Chính Sách">
                        <Typography>
                            <Link href="#" underline="hover" color="inherit">
                                Chính Sách Bảo Mật
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Điều Khoản Dịch Vụ
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Chính Sách Vận Chuyển
                            </Link>
                            <br />
                            <Link href="#" underline="hover" color="inherit">
                                Chính Sách Hoàn Tiền
                            </Link>
                        </Typography>
                    </FooterSection>
                </Grid>

                {/* Column 4: Address and Phone */}
                <Grid item xs={12} sm={6} md={3}>
                    <FooterSection title="Liên Hệ Chúng Mình">
                        <Typography>
                            <strong>Địa chỉ:</strong>
                            <br />
                            1234 Main St, Suite 100
                            <br />
                            Thành phố, Tỉnh, Mã Bưu Điện
                            <br />
                            <br />
                            <strong>Điện thoại:</strong>
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
