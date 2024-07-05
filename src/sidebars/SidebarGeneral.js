import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoPerson, IoPricetag, IoHome, IoLogOut, IoChevronDown, IoChevronUp, IoLocationSharp, IoReorderFour } from "react-icons/io5";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Collapse } from 'react-bootstrap';
import '../styles/sidebarGeneral.css';
import { removeToken, getUsuarioT} from '../tokenStorage';

const SidebarGeneral = ({ children }) => {
  //const tipo = getUsuarioT();
  const [isOpen, setIsOpen] = useState(false);
  const [tipo, setTipo] = useState("");
  const [isOpenProd, setisOpenProd] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };
  /*const fetchUserRole = async () => {
    try {
        const rol = await getUsuarioT(); // Espera a que la promesa se resuelva.
        console.log('Rol obtenido:', rol);
        setTipo(rol); // Actualiza el estado con el rol obtenido.
    } catch (error) {
        console.error('Error al obtener el rol:', error);
    }
};*/
useEffect(() => {
  const fetchUserRole = async () => {
    try {
      const rol = await getUsuarioT(); // Espera a que la promesa se resuelva.
      //console.log('Rol obtenido:', rol);
      setTipo(rol); // Actualiza el estado con el rol obtenido.
    } catch (error) {
      console.error('Error al obtener el rol:', error);
    }
  };
  fetchUserRole();
}, []); // El arreglo vací
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <>
      <div className="grid-container">
        <div className="menu-icon" onClick={openSidebar}>
          <span className="material-icons-outlined"><IoReorderFour /></span>
        </div>
        <aside id="sidebarGeneral" className={isSidebarOpen ? 'open' : ''}>

          <div className="sidebarGeneral-title">
            <span className="material-icons-outlined " style={{ cursor: 'pointer' }} onClick={closeSidebar}>
              close
            </span>
          </div>
          <ul className="sidebarGeneral-list">
            <li className="sidebarGeneral-list-item">
              <NavLink to="/home">
                <IoHome /> Inicio
              </NavLink>
            </li>
            {tipo === "cliente" && (
              <div>
            <li className="sidebarGeneral-list-item">
              <NavLink to="/perfil">
                <IoPerson /> Perfil
              </NavLink>
            </li>
            <li className="sidebarGeneral-list-item">
              <NavLink to="/mapa">
                <IoLocationSharp /> Ubicacion
              </NavLink>
            </li>
            <li className="sidebarGeneral-list-item">
              <NavLink to="/pedido-vista">
                <IoPricetag /> Pedidos
              </NavLink>
            </li>
            </div>
            )}
            {(tipo === "administrador" || tipo==="superuser") && (
              <div>
              <li className="sidebarGeneral-list-item">
                <p className="d-inline-flex gap-1">
                  <NavLink to=""
                    variant="link"  // Cambia el variant a "link" para que sea transparente
                    style={{ textDecoration: 'none', color: 'inherit' }} // Estilos en línea para el botón
                    onClick={() => setIsOpen(!isOpen)}
                    aria-controls="collapseExample"
                    aria-expanded={isOpen}
                  >
                    <IoPerson />Usuarios {isOpen ? <IoChevronUp /> : <IoChevronDown />}
                  </NavLink>
                </p>
                <Collapse in={isOpen}>
                  <div id="collapseExample" className="card card-body transparent-background">
                    <button style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <NavLink to="/usuario-vista">
                        <IoPerson /> Lista Usuarios
                      </NavLink>
                    </button>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <NavLink to="/usuario">
                        <IoPerson /> Registrar Usuarios
                      </NavLink>
                    </button>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <NavLink to="/perfil">
                        <IoPerson /> Perfil
                      </NavLink>
                    </button>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <NavLink to="/mapa">
                        <IoLocationSharp /> Ubicaciones
                      </NavLink>
                    </button>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <NavLink to="/pedido-vista">
                        <IoPricetag /> Pedidos
                      </NavLink>
                    </button>

                  </div>
                </Collapse>
                
              </li>
              <li className="sidebarGeneral-list-item">
                <p className="d-inline-flex gap-1">
                  <NavLink to=""
                    variant="link"  // Cambia el variant a "link" para que sea transparente
                    style={{ textDecoration: 'none', color: 'inherit' }} // Estilos en línea para el botón
                    onClick={() => setisOpenProd(!isOpenProd)}
                    aria-controls="collapseExample"
                    aria-expanded={isOpenProd}
                  >
                    <IoPerson />Productos {isOpenProd ? <IoChevronUp /> : <IoChevronDown />}
                  </NavLink>
                </p>
                <Collapse in={isOpenProd}>
                  <div id="collapseExample" className="card card-body transparent-background">
                    <button style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <NavLink to="/Producto">
                        <IoPerson /> Registrar Productos
                      </NavLink>
                    </button>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <NavLink to="/producto-vista">
                        <IoPerson /> Vista Productos
                      </NavLink>
                    </button>
                  </div>
                </Collapse>
                
              </li>
              </div>
            )}

            
          </ul>
        </aside>
        <div className="sidebarGeneral">
          {children}
        </div>
      </div>
    </>
  );
};


export default SidebarGeneral;