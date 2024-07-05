import '../styles/UsuarioForm.css';
//import logo2 from '../images/logo2.png'; // Asegúrate de tener el logo en tus archivos
import fondoImagen from '../images/fondo_forms.webp'; // Asegúrate de tener la imagen de fondo en tus archivos
import { getToken, getUsuarioT, removeToken } from '../tokenStorage';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../header';
import SidebarGeneral from '../sidebars/SidebarGeneral';
import ToggleSwitch from '../sidebars/ToggleSwitch'; // Importa el componente ToggleSwitch


export function UsuarioComponentForm() {
  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: 'auto',
    minHeight: '100vh',
  };
  //const tipo = getUsuarioT();
  const location = useLocation();
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("");

  /*const { nombre, apellido, cargo, telefono, usuario1, contrasenia } = useParams();*/
  const token = getToken();
  const headers = useRef({
    Authorization: `Bearer ${token}`,
  });
  const [usuario, setUsuario] = useState({
    id: '',
    nombre: '',
    apellido: '',
    cargo: '',
    telefono: '',
    usuario: '',
    contrasenia: '',
    modo: ''
  });
  const fetchUserRole = async () => {
    try {
      const rol = await getUsuarioT(); // Espera a que la promesa se resuelva.
      console.log('Rol obtenido:', rol);
      setTipo(rol); // Actualiza el estado con el rol obtenido.
    } catch (error) {
      console.error('Error al obtener el rol:', error);
    }
  };
  useEffect(() => {
    /*    if (!token || token==="" || token===undefined) {
          navigate('/');
          console.log("entra al if");
          return;
        }*/
    fetchUserRole();
    const params = new URLSearchParams(location.search);
    const usuarioData = {
      idusuario: params.get('idusuario') || '',
      nombre: params.get('nombre') || '',
      apellido: params.get('apellido') || '',
      email: params.get('email') || '',
      telefono: params.get('telefono') || '',
      usuario: params.get('usuario') || '',
      id_tipo: params.get('tipo') || 2,
      estado: params.get('estado') === 'true', // Convertir a booleano
      modo: params.get('modo') || 'registrar'
    };
    if (usuarioData.estado === "true") {
      usuario.estado = true
    } else {
      usuario.estado = false
    }
    setUsuario(usuarioData);
  }, [location.search, navigate]);


  /*useEffect(() => {
    if (modo === 'actualizar' && usuarioActual) {
      setUsuario(usuarioActual);
    }
  }, [modo, usuarioActual]);
*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };
  const handleToggleChange = (e) => {
    setUsuario({ ...usuario, estado: e.target.checked });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (usuario.modo === 'registrar') {
      usuario.estado = true;
      // Desestructura el objeto usuario para excluir 'modo'
      const { modo, idusuario, ...usuarioSinModo } = usuario;

      // Ahora usuarioSinModo tiene todas las propiedades de usuario excepto 'modo'

      axios.post(`${process.env.REACT_APP_API_USUARIO}/usuario`, usuarioSinModo, { headers: headers.current })
        .then(response => {
          console.log('Usuario registrado:', response.data);
          Swal.fire({
            title: "CORRECTO!",
            text: "Se Registro el usuario Correctamente al Sistema",
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              navigate('/Usuario-vista');
            }
          });

        })
        .catch(error => {
          console.log("entro al catch")
          if (error.response && error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log(error.response && error.response.status === 400)
            if (error.response && error.response.status === 400) {
              Swal.fire({
                title: "No se registro el usuario!",
                text: `${error.response.data.error}`,
                icon: "error"
              }).then((result) => {
                if (result.isConfirmed) {
                  // El usuario hizo clic en el botón "OK"
                }
              });
            }
            console.log('Error:', error);
            console.error('Error al registrar usuario:', error);
          }

        });
    } else if (usuario.modo === 'actualizar') {
      const { modo, ...usuarioSinModo } = usuario;

      axios.put(`${process.env.REACT_APP_API_USUARIO}/usuario`, usuarioSinModo, { headers: headers.current })
        .then(response => {
          navigate('/Usuario-vista');
          console.log('Usuario actualizado:', response.data);
        })
        .catch(error => {

          console.log("entro al catch")
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


  return (
    <div >
      <Header />
      <div className="Side-form" style={estiloDeFondo} >
        {(tipo === "administrador" || tipo === "superuser") && (
          <SidebarGeneral></SidebarGeneral>
        )}

        <div className="formulario-usuario">

          <form onSubmit={handleSubmit}>

            <div >
              <h4>REGISTRO DE NUEVO USUARIO </h4>
            </div>
            <div>
              {usuario.modo === 'actualizar' && (
                <div>
                  <label for="form2Example22">ID:</label>
                  <input className="form-control-texto"
                    type="text"
                    name="idusuario"
                    value={usuario.idusuario}
                    readOnly
                  />
                </div>
              )}
              <div className="field-group">
                <div>
                  <label className="label-plomo" htmlFor="nombre">NOMBRE:</label>
                  <input className="form-control-texto" type="text" name="nombre" value={usuario.nombre} onChange={handleChange} required />
                </div>
                <div>
                  <label className="label-plomo" htmlFor="apellido">APELLIDO:</label>
                  <input className="form-control-texto"
                    type="text"
                    name="apellido"
                    value={usuario.apellido}
                    onChange={handleChange} required
                  />
                </div>
              </div>
              <div className="field-group">
                <div >
                  <label className="label-plomo" for="form2Example22">EMAIL:</label>
                  <input className="form-control-texto"
                    type="email"
                    name="email"

                    value={usuario.email}
                    onChange={handleChange} required
                  /> </div>
                <div>
                  <label className="label-plomo" for="form2Example22">TELEFONO:</label>
                  <input className="form-control-texto"
                    type="number"
                    name="telefono"
                    value={usuario.telefono}
                    onChange={handleChange} required
                  /></div>
              </div>
              <div className="field-group">
                <div>
                  <label className="label-plomo" for="form2Example22">USUARIO:</label>
                  <input className="form-control-texto"
                    type="text"
                    name="usuario"
                    value={usuario.usuario}
                    onChange={handleChange} required
                  /></div>
                {usuario.modo === 'actualizar' ? (

                  <div>
                    <label className="label-plomo" for="form2Example22">CONTRASEÑA:</label>
                    <input className="form-control-texto"
                      type="password"
                      name="contrasenia"
                      value={usuario.contrasenia}
                      minLength="8"
                      onChange={handleChange}
                    /> </div>
                ) : (
                  <div>
                    <label className="label-plomo" for="form2Example22">CONTRASEÑA:</label>
                    <input className="form-control-texto"
                      type="password"
                      name="contrasenia"
                      value={usuario.contrasenia}
                      onChange={handleChange} required
                      minLength="8"
                    /> </div>
                )}
              </div>
              <div className="field-group">

                {usuario.modo === 'actualizar' && (
                  <div>
                    <label className="label-plomo" htmlFor="form2Example22">ESTADO:</label>
                    <ToggleSwitch checked={usuario.estado} onChange={handleToggleChange} />
                  </div>
                )}

                {tipo === "administrador" || tipo === "superuser" && (
                  <div>
                    <label className="label-plomo" for="form2Example22">Tipo:</label>
                    <select
                      className="form-control-texto"
                      name="id_tipo"
                      value={usuario.id_tipo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione una categoría</option>
                      <option value="2">Cliente</option>
                      <option value="1">Administrador</option>
                      {tipo === "superuser" && (
                        <option value="3">superuser</option>
                      )}

                      {/* Agrega más opciones según sea necesario */}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div>

              <div>
                <button type="submit" className="boton-submit">{usuario.modo === 'registrar' ? 'Registrar Usuario' : 'Actualizar Usuario'}</button>
              </div>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}

export default UsuarioComponentForm;