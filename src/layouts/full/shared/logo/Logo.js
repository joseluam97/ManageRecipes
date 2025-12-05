import { Link } from 'react-router-dom';
// 1. Cambiar la importación: usar la importación por defecto para PNG
import LogoImage from 'src/assets/images/logos/logo_horizontal.png';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'block',
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      {/* 2. Usar un componente <img> y pasar la importación como la prop 'src' */}
      <img
        src={LogoImage}
        alt="Logo de Recetas" // Es buena práctica añadir un texto alternativo
        height={70}
        style={{ width: 'auto', display: 'block' }} // Asegura que la imagen se vea correctamente dentro del contenedor
      />
    </LinkStyled>
  );
};

export default Logo;
