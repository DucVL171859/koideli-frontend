import { Box } from "@mui/material";
import Footer from "../layout/Home/Footer";
import Navbar from "../layout/Home/Navbar";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import SlideShow from "../layout/Home/SlideShow";

const HomePage = () => {
    const theme = createTheme();
    return (
        <>
            <Navbar />
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SlideShow />
            </ThemeProvider>
            <Box fontSize={500} bgcolor={"Menu"}>
                Hello
            </Box>
            <Box fontSize={500} bgcolor={"Menu"}>
                Hello
            </Box>
            <Box fontSize={500} bgcolor={"Menu"}>
                Hello
            </Box>
            <Footer />
        </>
    )
}

export default HomePage;