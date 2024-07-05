import './styles/header.css';
import logo2 from './images/logo2.png'; // Asegúrate de tener el logo en tus archivos
import { IoPersonCircleSharp,IoLogOut } from "react-icons/io5";
import { NavLink,useNavigate } from "react-router-dom";
import { getToken,getusu,removeToken } from './tokenStorage';
export default function Header() {
    const token = getToken();
    const usuario = getusu();
    const navigate = useNavigate();
    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        removeToken();
        navigate('/');
    };
    return (
        <header className="UsuarioForm-header">
            <NavLink to="/Home" >
            <img src={logo2} alt="Logo" className="logo" style={{ verticalAlign: 'middle', marginRight: '15px' }} /></NavLink>
            <div className="contenido_header">
                {/*<h2>Mueblería armonia</h2>*/}

            </div>
                {usuario!== "" ? (
                    <div className="div-botones">
                        <NavLink to="/perfil" className="button-link">
                            <IoPersonCircleSharp /> Perfil
                        </NavLink>
                        <button onClick={handleLogout} className="button-link">
                        <IoLogOut /> Cerrar Sesión
                    </button>
                    </div>
                ) : (
                    <div className="div-botones">
                    <NavLink to="/login" className="button-link">
                        <IoPersonCircleSharp/> Acceder
                    </NavLink>
                    </div>
                )}

            <div className="wave"></div>
        </header>
    )
}