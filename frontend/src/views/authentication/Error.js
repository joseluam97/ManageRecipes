import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Error = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      {/*<img src={ErrorImg} alt="404" style={{ width: '100%', maxWidth: '500px' }} />*/}
      <Typography align="center" variant="h1" mb={4}>
        Opps!!!
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
      Esta página que estás buscando no se pudo encontrar.
      </Typography>
      <Button color="primary" variant="contained" component={Link} to="/" disableElevation>
        Volver al home
      </Button>
    </Container>
  </Box>
);

export default Error;
