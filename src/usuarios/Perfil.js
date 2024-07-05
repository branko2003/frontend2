import React, { useState, useEffect, useRef } from 'react';
import fondoImagen from '../images/fondo_forms.webp';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import SidebarGeneral from '../sidebars/SidebarGeneral';
import Header from '../header';
import perfil from '../images/perfil.png';
import '../styles/perfil.css';
import { getusu, getToken,removeToken} from '../tokenStorage';

function Perfil() {
  const estiloDeFondo = {
      backgroundImage: `url(${fondoImagen})`, 
      backgroundSize: '100% 100%',  
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: 'auto',
      minHeight: '100vh',
    };
  const [datosEditable, setDatosEditable] = useState(false);
  const [botonTexto, setBotonTexto] = useState("Actualizar Datos"); // Estado para el texto del botón


  const [DatosEditableCredenciales, setDatosEditableCredenciales] = useState(false);
  const [BotonTextoCredenciales, setBotonTextoCredenciales] = useState("Actualizar Credenciales"); // Estado para el texto del botón


  const [userData, setUserData] = useState([]);
  const [credenciales, setCredenciales] = useState([]);

  const id = getusu();
  const token = getToken();

  const navigate = useNavigate();
  const headers = useRef ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json' // Asegúrate de que el Content-Type sea correcto

  });
  useEffect(() => {
    try {

      axios.get(`${process.env.REACT_APP_API_USUARIO}/usuario/${id}`, { headers: headers.current })
        .then(response => {
          setUserData(response.data.results);
          credenciales.usuario=response.data.results.usuario;
        })
        .catch(error => {
          console.log("entro al catch")
          if (error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al obtener usuario:', error);
          }
        });
    } catch (error) {
      console.log("entro al catch")
      if (error.response && error.response.status === 401) {
        removeToken();

        navigate('/');
      } else {
        console.log('Error:', error);
      }
    }
  }, []);
  const handleUpdateData = () => {
    if(datosEditable==false){
      setDatosEditable(true); // Hace que los campos de datos sean editables
      setBotonTexto("Enviar Datos"); // Cambia el texto del botón
    }else{

        axios.patch(`${process.env.REACT_APP_API_USUARIO}/usuario`, userData, { headers:headers.current })
          .then(response => {
            window.location.reload(); // Esto recarga la página
          })
          .catch(error => {
            if (error.response && error.response.status === 401) {
              removeToken();

              navigate('/');
            } else {
              console.log('Error:', error);
              console.error('Error al actualizar usuario:', error);
            }
          });
    }
  };

  const handleUpdatePassword = () => {
    // Aquí manejarías la actualización de la contraseña, por ejemplo, enviar a una API
    if(DatosEditableCredenciales==false){
      setDatosEditableCredenciales(true); // Hace que los campos de datos sean editables
      setBotonTextoCredenciales("Enviar Credenciales"); // Cambia el texto del botón
    }else{
      credenciales.idusuario=id;

      axios.put(`${process.env.REACT_APP_API_USUARIO}/usuario/credenciales`, credenciales, { headers:headers.current })
      .then(response => {
          
        //window.location.reload(); // Esto recarga la página

        Swal.fire({
          title: "SUCCESS!",
          text: "Las credenciales se actualizaron correctamente",
          icon: "success"
      }).then((result) => {
          if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
        window.location.reload(); // Esto recarga la página
      }
      });
      })
      .catch(error => {

          if(error.response.status===400){ 
            Swal.fire({
              title: "ERROR!",
              text: "La contraseña actual no coincide",
              icon: "error"
          }).then((result) => {
              if (result.isConfirmed) {
                  // El usuario hizo clic en el botón "OK"
                  navigate('/Perfil');
              }
          });
          }

        if (error.response && error.response.status === 401) {
          removeToken();

          navigate('/');
        } else {
          console.log('Error:', error);
          console.error('Error al actualizar usuario:', error);
        }
      });
    }
    

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({ ...prevState, [name]: value }));
  };
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setCredenciales(prevState => ({ ...prevState, [name]: value }));
  };
  return (
    <div>
      <Header />
      <div style={estiloDeFondo}>
        <div className="userProfile">
        <SidebarGeneral></SidebarGeneral>
      <div className="todo">
          <div className="userProfile__image">
            <img src={perfil} alt="User" />
          </div>
          
          <div className="userProfile__info">
            <div className="userProfile__data">
              <h2 className="userProfile__title">Datos</h2>
              <form>
                {/* Fila para nombre y apellido */}
                <div className="userProfile__form-row">
                  <div className="userProfile__form-group">
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={userData.nombre} onChange={handleChange} readOnly={!datosEditable} />
                  </div>
                  <div className="userProfile__form-group">
                    <label>Apellido</label>
                    <input type="text" name="apellido" value={userData.apellido} onChange={handleChange} readOnly={!datosEditable} />
                  </div>
                </div>
                
                {/* Fila */}
                <div className="userProfile__form-row">
                  <div className="userProfile__form-group">
                    <label>Telefono</label>
                    <input type="text" name="telefono" value={userData.telefono} onChange={handleChange} readOnly={!datosEditable} />
                  </div>
                  <div className="userProfile__form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={userData.email} onChange={handleChange} readOnly={!datosEditable} />
                  </div>
                </div>
                <button type="button" onClick={handleUpdateData}>{botonTexto}</button>
                </form>
            </div>

            <div className="userProfile__credentials">
              <h2 className="userProfile__title">Credenciales</h2>
              <form >
              <div className="userProfile__form-row">
                <div className="userProfile__form-group">
                  <label>Usuario</label>
                  <input type="text" name="usuario" value={credenciales.usuario} onChange={handleChange2} readOnly={!DatosEditableCredenciales} />
                </div>
                <div className="userProfile__form-group">
                  <label>Contraseña Actual</label>
                  <input type="password" name="contrasenia" onChange={handleChange2} readOnly={!DatosEditableCredenciales} required/>
                </div>
              </div>
                <div className="userProfile__form-row">
                  <div className="userProfile__form-group">
                    <label>Nueva Contraseña</label>
                    <input type="password" name="contrasenia_nuevo" onChange={handleChange2} placeholder="Ingresa nueva contraseña"  readOnly={!DatosEditableCredenciales} required/>
                  </div>
                  <div className="userProfile__form-group">
                    
                  </div>
                </div>
                <button type="button" onClick={handleUpdatePassword} >{BotonTextoCredenciales}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Perfil;