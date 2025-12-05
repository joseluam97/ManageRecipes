import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    Stack,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getUserLogin } from 'src/services/userService';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'src/components/snackbar/SnackbarProvider';
import { useIsUserLoggedIn } from 'src/services/userService'
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthLogin = ({ title, subtitle, subtext }) => {
    const isLoggedIn = useIsUserLoggedIn();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        // Check  if user is logged in
        if (isLoggedIn == true) {
            navigate('/');
        }

    }, []);

    const tryLogin = async (event) => {
        event.preventDefault();

        // 2. Usar await para esperar que getLoginAbout termine
        const loginResult = await getLoginAbout();

        if (loginResult != undefined) {
            showSnackbar('Successful login.', 'success');
            navigate('/dashboard');
        } else {
            // View message error to user
            showSnackbar('An error occurred while attempting to log in.', 'error');
        }
    }

    const getLoginAbout = async () => {
        // Asumiendo que getUserLogin devuelve una Promesa
        let result_method = await getUserLogin(username, password, dispatch);
        console.log("result_method");
        console.log(result_method);
        return result_method; // Es buena práctica devolver el resultado si es necesario
    }

    return (
        <>
            <Stack
                component="form"
                onSubmit={tryLogin}
            >
                <Box>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='username' mb="5px">Username (o Email)</Typography>
                    <CustomTextField
                        id="username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Box>
                <Box mt="25px">
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" >Password</Typography>
                    <CustomTextField
                        id="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>

                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Remeber this Device"
                        />
                    </FormGroup>
                </Stack>

                <Box>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                    >
                        Sign In
                    </Button>
                </Box>
            </Stack>
        </>
    );
};

export default AuthLogin;