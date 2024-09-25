import { Stack } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";

const SocialLogin = () => {
    const errorMessage = (error) => {
        console.error(error);
    };

    return (
        <Stack
            direction="row"
            justifyContent={{ xs: 'center', sm: 'center' }}
            sx={{ '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 }, ml: { xs: 0, sm: -0.5 } } }}
        >
            <GoogleLogin
                onError={errorMessage}
            />
        </Stack>
    );
}

export default SocialLogin;