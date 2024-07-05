import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import fondoImagen from '../images/fondo_forms.webp'; // Asegúrate de tener la imagen de fondo en tus archivos
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getToken, removeToken,getUsuarioT } from '../tokenStorage';
import Header from '../header';
import '../styles/UsuarioTable.css';
import { UsuarioDetalle } from './UsuarioDetalle';
import SidebarGeneral from '../sidebars/SidebarGeneral';


export function UsuarioTable() {

  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: 'auto',
    minHeight: '87.2vh',
  };


  const [estadoSeleccionado, setEstadoSeleccionado] = useState('todos');

  //para la paginacion
  const [pagina, setpagina] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5; // Número de usuarios por página

  // para el boton de acciones
  const [showDropdown, setShowDropdown] = useState(-1);  // Para controlar qué menú está visible
  const dropdownRef = useRef(null); // Referencia para el contenedor del menú desplegable


  const [selectedUser, setSelectedUser] = useState(null);

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  //const usuario=getusu();
  //  const rol = getUsuarioT();

  const token = getToken();
  const headers = useRef({
    Authorization: `Bearer ${token}`,
  });
  //const history = useHistory();
  /*const toggleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? -1 : index);
  };*/
  // Actualiza la función toggleDropdown para usar el ref

  const [tipo, setTipo] = useState("");

  const fetchUserRole = async () => {
    try {
      const rol = await getUsuarioT(); // Espera a que la promesa se resuelva.
      console.log('Rol obtenido:', rol);
      setTipo(rol); // Actualiza el estado con el rol obtenido.
    } catch (error) {
      console.error('Error al obtener el rol:', error);
    }
  };
  const toggleDropdown = (index) => {
    if (showDropdown === index) {
      setShowDropdown(-1); // Cierra el menú si ya está abierto
    } else {
      setShowDropdown(index); // Abre el menú
      document.addEventListener('click', handleClickOutside, true);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(-1); // Cierra el menú
      document.removeEventListener('click', handleClickOutside, true);
    }
  };

  useEffect(() => {
    try {

      //const header = getAuthHeaders()
      /*if (!token || token==="" || token===undefined) {
        navigate('/');
        console.log("entra al if");
        return;
      } */
        fetchUserRole();
      document.removeEventListener('click', handleClickOutside, true);

      axios.get(`${process.env.REACT_APP_API_USUARIO}/usuario`, { headers: headers.current })
        .then(response => {
          setUsuarios(response.data.results);
          const total = response.data.total;
          setTotalPages(Math.ceil(total / pageSize));
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            removeToken();
            navigate('/');
          } else {
            console.log('Error:', error);
          }

          console.error('Error al obtener usuarios:', error);
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
  //------------------------botones de paginacion---------------------
  const handlePrevious = () => {
    const newPage = pagina - 1;
    setpagina(newPage);
    if (estadoSeleccionado == "todos") {
      axios.get(`${process.env.REACT_APP_API_USUARIO}/usuario?page=${newPage}&size=5`, { headers: headers.current })
        .then(response => {
          setUsuarios(response.data.results);
        }).catch(error => {

          console.log("entro al catch")
          if (error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al obtener usuario:', error);
          }
        });
    } else {
      axios.get(`${process.env.REACT_APP_API_USUARIO}/usuario/${estadoSeleccionado}?page=${newPage}&size=5`, { headers: headers.current })
        .then(response => {
          setUsuarios(response.data.results);
          const total = response.data.total;
          setTotalPages(Math.ceil(total / pageSize));
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
          }
          console.error('Error al obtener pedidos:', error);
        });
    }
  };
  const handleNext = () => {
    const newPage = pagina + 1;
    setpagina(newPage);
    if (estadoSeleccionado == "todos") {
      axios.get(`${process.env.REACT_APP_API_USUARIO}/usuario?page=${newPage}&size=5`, { headers: headers.current })
        .then(response => {
          setUsuarios(response.data.results);
        }).catch(error => {

          console.log("entro al catch")
          if (error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al obtener usuario:', error);
          }
        });
    } else {
      axios.get(`${process.env.REACT_APP_API_USUARIO}/usuario/${estadoSeleccionado}?page=${newPage}&size=5`, { headers: headers.current })
        .then(response => {
          setUsuarios(response.data.results);
          const total = response.data.total;
          setTotalPages(Math.ceil(total / pageSize));
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
          }
          console.error('Error al obtener pedidos:', error);
        });
    }
  };
  //---------------------------------------------

  const handleEstadoChange = (event) => {
    console.log(event.target.value)
    setEstadoSeleccionado(event.target.value);
    if (event.target.value === 'todos') {
      setpagina(0);
      //    const url = tipo === "administrador" ? `${process.env.REACT_APP_API_PEDIDO}/pedido` : `${process.env.REACT_APP_API_PEDIDO}/pedido/cliente/${id}`;

      axios.get(`${process.env.REACT_APP_API_USUARIO}/usuario`, { headers: headers.current })
        .then(response => {
          setUsuarios(response.data.results);
          const total = response.data.total;
          setTotalPages(Math.ceil(total / pageSize));

        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
          }
          console.error('Error al obtener pedidos:', error);
        });
    } else {
      setpagina(0);

      //      const url = tipo === "administrador" ? `${process.env.REACT_APP_API_PEDIDO}/pedido/${event.target.value}` : `${process.env.REACT_APP_API_PEDIDO}/pedido/cliente/${event.target.value}`;
      axios.get(`${process.env.REACT_APP_API_USUARIO}/usuario/${event.target.value}`, { headers: headers.current })
        .then(response => {
          setUsuarios(response.data.results);
          const total = response.data.total;
          setTotalPages(Math.ceil(total / pageSize));
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
          }
          console.error('Error al obtener pedidos:', error);
        });
    };
  };
  const handleInputChange = (e) => {
    setBusqueda(e.target.value);

    // Realizar solicitud al backend cuando hay un valor en el campo de búsqueda
    if (e.target.value) {

      axios.get(`${process.env.REACT_APP_API_USUARIO}/usuario/${e.target.value}`, { headers: headers.current })
        .then(response => {
          setUsuarios(response.data.results);
          console.log(e.target.value);
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
    }
    else {

      axios.get(`${process.env.REACT_APP_API_USUARIO}/usuario`, { headers: headers.current })
        .then(response => {
          setUsuarios(response.data.results);
        })
        .catch(error => {
          if (error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al obtener usuario:', error);
          }
        });
    }
  };
  /*
    const filtrarUsuarios = () => {
      return usuarios.filter(usuario => usuario.id.toString().includes(busqueda));
      
    };*/
  const handledetalles = (usuario) => {
    setShowDropdown(-1); // Cierra el dropdown

    setSelectedUser(usuario);

  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };
  const handleEliminar = (id) => {

    axios.delete(`${process.env.REACT_APP_API_USUARIO}/usuario/${id}`, { headers: headers.current })
      .then(response => {
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
        console.log('Usuario eliminado:', response.data);
        //navigate('/Usuario-vista');
        Swal.fire({
          title: "CORRECTO!",
          text: "Se Elimino correctamente el usuario de la Lista",
          icon: "success"
        }).then((result) => {
          if (result.isConfirmed) {
            // El usuario hizo clic en el botón "OK"
            //navigate('/Usuario-vista');
            window.location.reload(); // Esto recarga la página

          }
        });

      })
      .catch(error => {
        console.error('Error al eliminar usuario:', error);
      });

  };
  const handleActualizar = (usuario) => {
    console.log(usuario)
    const queryParams = new URLSearchParams({
      idusuario: usuario.idusuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      usuario: usuario.usuario,
      estado: usuario.estado,
      tipo: usuario.id_tipo,
      modo: 'actualizar'
    }).toString();

    const url = `/Usuario?${queryParams}`;

    window.location.href = url;
  };

  return (
    <>
      <Header />
      <div className="usuario-table-container" style={estiloDeFondo}>
        <SidebarGeneral></SidebarGeneral>
        <div className="row">
          <h4 >LISTA DE USUARIOS</h4>
          <input
            type="text"
            placeholder="Buscar por Nombre"
            value={busqueda}
            onChange={handleInputChange}
          />
          {/* Radio buttons para seleccionar el estado */}
          <div className='radios'>
            <div className="radio-item">

              <input
                type="radio"
                name="estado"
                value="todos"
                checked={estadoSeleccionado === 'todos'}
                onChange={handleEstadoChange}
              /> Todos
            </div>
            <div className="radio-item">

              <input
                type="radio"
                name="estado"
                value="cliente"
                checked={estadoSeleccionado === 'cliente'}
                onChange={handleEstadoChange}
              /> Cliente
            </div>
            <div className="radio-item">

              <input
                type="radio"
                name="estado"
                value="administrador"
                checked={estadoSeleccionado === 'administrador'}
                onChange={handleEstadoChange}
              /> Administrador
            </div>
            {(tipo === "administrador" || tipo==="superuser") && (

            <div className="radio-item">
              <input
                type="radio"
                name="estado"
                value="superuser"
                checked={estadoSeleccionado === 'superuser'}
                onChange={handleEstadoChange}
              /> SuperUser
            </div>
            )}
          </div>
            

          <div >
            <table className="tablita">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario, index) => (
                  <tr key={usuario.idusuario}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>
                    <td>{usuario.telefono}</td>
                    <td>
                      <div ref={dropdownRef} className={`action-button ${showDropdown === index ? 'show' : ''}`} onClick={() => toggleDropdown(index)}>
                        <button>⋮</button>
                        <div className="action-dropdown">
                        {(tipo=="superuser" || (tipo=="administrador" && usuario.tipo.tipo !== "superuser" && usuario.tipo.tipo !== "administrador")) && (
                        <div>
                        <a href="#" onClick={(e) => { e.stopPropagation(); handleActualizar(usuario); }}>Actualizar</a>
                        <a href="#" onClick={(e) => { e.stopPropagation(); handleEliminar(usuario.idusuario); }}>Eliminar</a>
                       </div>
                        )}

                          <a href="#" onClick={(e) => { e.stopPropagation(); handledetalles(usuario); }}>Detalles</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <UsuarioDetalle user={selectedUser} onClose={handleCloseModal} />

            <div className="pagination-buttons">
              <button
                className="pagination-button"
                onClick={handlePrevious}
                disabled={pagina === 0}>
                Anterior
              </button>
              <span className="page-indicator">
                Página {pagina + 1} de {totalPages}
              </span>
              <button
                className="pagination-button"
                onClick={handleNext}
                disabled={pagina >= totalPages - 1}>
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsuarioTable;