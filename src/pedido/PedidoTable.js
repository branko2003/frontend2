import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import fondoImagen from '../images/fondo_forms.webp'; // Asegúrate de tener la imagen de fondo en tus archivos
import { useNavigate } from 'react-router-dom';
import Header from '../header';
import '../styles/UsuarioTable.css';
import { PedidoDetalle } from './PedidoDetalle';
import SidebarGeneral from '../sidebars/SidebarGeneral';
import { getusu, getToken, getUsuarioT, removeToken} from '../tokenStorage';

export function PedidoTable() {

  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: 'auto',
    minHeight: '100vh',
  };

  const [estadoSeleccionado, setEstadoSeleccionado] = useState('todos');


  const id = getusu();
  const [tipo, setTipo] = useState("");
  //para la paginacion
  const [pagina, setpagina] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5; // Número de pedidos por página

  // para el boton de acciones
  const [showDropdown, setShowDropdown] = useState(-1);  // Para controlar qué menú está visible
  const dropdownRef = useRef(null); // Referencia para el contenedor del menú desplegable


  const [selectedUser, setSelectedUser] = useState(null);

  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const token = getToken();
  const headers = useRef({
    Authorization: `Bearer ${token}`,
  });
  //const history = useHistory();
  /*const toggleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? -1 : index);
  };*/
  // Actualiza la función toggleDropdown para usar el ref
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
    const fetchUserRole = async () => {
      try {
        const rol = await getUsuarioT(); // Espera a que la promesa se resuelva.
        console.log(rol); // Verás esto inmediatamente cuando la promesa se resuelva.
        setTipo(rol); // Actualiza el estado con el rol obtenido.
      } catch (error) {
        console.error('Error al obtener el rol:', error);
      }
    };

    fetchUserRole();
  }, []); // Dependencias vacías para asegurar que solo se ejecuta una vez.
  useEffect(() => {
    try {
      //const header = getAuthHeaders()
      /*if (!token || token==="" || token===undefined) {
        navigate('/');
        console.log("entra al if");
        return;
      } */
      document.removeEventListener('click', handleClickOutside, true);
      console.log(tipo)
      if (tipo) {

        const url = tipo === (tipo === "administrador" || tipo==="superuser") ? `${process.env.REACT_APP_API_PEDIDO}/pedido` : `${process.env.REACT_APP_API_PEDIDO}/pedido/cliente/${id}`;
        axios.get(url, { headers: headers.current })
          .then(response => {
            setPedidos(response.data.results);
            const total = response.data.total;
            setTotalPages(Math.ceil(total / pageSize));
          })
          .catch(error => {
            if (error.response && error.response.status === 401) {
              removeToken();

              navigate('/');
            } else {
              console.error('Error al obtener ubicaciones:', error);
            }
          });
      }
      /*axios.get('http://localhost:4003/pedido',{ headers:headers.current })
        .then(response => {
          setPedidos(response.data.results);
          const total = response.data.total;
          setTotalPages(Math.ceil(total / pageSize));
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            navigate('/');
          } else {
            console.log('Error:', error);
          }
          
          console.error('Error al obtener pedidos:', error);
        });*/
    } catch (error) {
      console.log("entro al catch")
      if (error.response && error.response.status === 401) {
        removeToken();

        navigate('/');
      } else {
        console.log('Error:', error);
      }
    }

  }, [tipo]);
  //------------------------botones de paginacion---------------------
  const handlePrevious = () => {
    const newPage = pagina - 1;
    setpagina(newPage);

    const url = tipo === (tipo === "administrador" || tipo==="superuser") ? `${process.env.REACT_APP_API_PEDIDO}/pedido?page=${newPage}&size=5` : `${process.env.REACT_APP_API_PEDIDO}/pedido/cliente/${id}?page=${newPage}&size=5`;

    axios.get(url, { headers: headers.current })
      .then(response => {
        setPedidos(response.data.results);
      }).catch(error => {

        console.log("entro al catch")
        if (error.response.status === 401) {
          removeToken();

          navigate('/');
        } else {
          console.log('Error:', error);
          console.error('Error al obtener pedidos:', error);
        }
      });
  };
  const handleNext = () => {
    const newPage = pagina + 1;
    setpagina(newPage);

    const url = (tipo === "administrador" || tipo==="superuser") ? `${process.env.REACT_APP_API_PEDIDO}/pedido?page=${newPage}&size=5` : `${process.env.REACT_APP_API_PEDIDO}/pedido/cliente/${id}?page=${newPage}&size=5`;
    axios.get(url, { headers: headers.current })
      .then(response => {
        setPedidos(response.data.results);
      }).catch(error => {

        console.log("entro al catch")
        if (error.response.status === 401) {
          removeToken();

          navigate('/');
        } else {
          console.log('Error:', error);
          console.error('Error al obtener pedidos:', error);
        }
      });
  };
  //---------------------------------------------
  const handleInputChange = (e) => {
    setBusqueda(e.target.value);

    // Realizar solicitud al backend cuando hay un valor en el campo de búsqueda
    if (e.target.value) {

      axios.get(`${process.env.REACT_APP_API_PEDIDO}/pedido/${e.target.value}`, { headers: headers.current })
        .then(response => {
          setPedidos(response.data.results);
          console.log(e.target.value);
          console.log(response.data.results);
        })
        .catch(error => {

          console.log("entro al catch")
          if (error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al obtener pedidos:', error);
          }
        });
    }
    else {

      axios.get(`${process.env.REACT_APP_API_PEDIDO}/pedido`, { headers: headers.current })
        .then(response => {
          setPedidos(response.data.results);
        })
        .catch(error => {
          if (error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al obtener pedidos:', error);
          }
        });
    }
  };
  /*
    const filtrarUsuarios = () => {
      return usuarios.filter(usuario => usuario.id.toString().includes(busqueda));
      
    };*/
  const handledetalles = (pedido) => {
    setShowDropdown(-1); // Cierra el dropdown
    console.log(pedido);
    setSelectedUser(pedido);
    console.log(tipo)
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };
  const handleEstadoChange = (event) => {
    setEstadoSeleccionado(event.target.value);
    if (event.target.value === 'todos') {

      const url = (tipo === "administrador" || tipo==="superuser") ? `${process.env.REACT_APP_API_PEDIDO}/pedido` : `${process.env.REACT_APP_API_PEDIDO}/pedido/cliente/${id}`;

      axios.get(url, { headers: headers.current })
        .then(response => {
          setPedidos(response.data.results);
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

      const url = (tipo === "administrador" || tipo==="superuser") ? `${process.env.REACT_APP_API_PEDIDO}/pedido/${event.target.value}` : `${process.env.REACT_APP_API_PEDIDO}/pedido/cliente/${event.target.value}`;
      axios.get(url, { headers: headers.current })
        .then(response => {
          setPedidos(response.data.results);
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

  const handlemapa = (pedido) => {
    const queryParams = new URLSearchParams({
      id: pedido.id_ubicacion,
      modo: 'visualizar'
    }).toString();

    const url = `/mapa?${queryParams}`;

    window.location.href = url;
  };
  return (
    <>
      <Header />
      <div className="usuario-table-container" style={estiloDeFondo}>
        <SidebarGeneral />

        <div className="row">
          <h4 >LISTA DE PEDIDOS</h4>
          {(tipo === "administrador" || tipo==="superuser") ? (
            <input
              type="text"
              placeholder="Buscar por Cliente"
              value={busqueda}
              onChange={handleInputChange}
            />

          ) : (<div> </div>)}
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
                value="pendiente"
                checked={estadoSeleccionado === 'pendiente'}
                onChange={handleEstadoChange}
              /> Pendiente
            </div>
            <div className="radio-item">

              <input
                type="radio"
                name="estado"
                value="en proceso"
                checked={estadoSeleccionado === 'en proceso'}
                onChange={handleEstadoChange}
              /> En proceso
            </div>
            <div className="radio-item">

              <input
                type="radio"
                name="estado"
                value="rechazado"
                checked={estadoSeleccionado === 'rechazado'}
                onChange={handleEstadoChange}
              /> Rechazado
            </div>  <div className="radio-item">

              <input
                type="radio"
                name="estado"
                value="finalizado"
                checked={estadoSeleccionado === 'finalizado'}
                onChange={handleEstadoChange}
              /> Finalizado
            </div>
          </div>
          <div >
            <table className="tablita">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Direccion</th>
                  <th>Estado</th>

                  <th>Acciones</th>

                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido, index) => (
                  <tr key={pedido.idusuario}>
                    <td>{pedido.usuario.nombre}</td>
                    <td>{pedido.producto.nombre}</td>
                    <td>  {pedido.ubicacion === null ? "No se registró ubicación" : pedido.ubicacion.direccion}</td>
                    <td>{pedido.estado}</td>

                    <td>
                      <div ref={dropdownRef} className={`action-button ${showDropdown === index ? 'show' : ''}`} onClick={() => toggleDropdown(index)}>
                        <button>⋮</button>
                        <div className="action-dropdown">
                          <a href="#" onClick={(e) => { e.stopPropagation(); handledetalles(pedido); }}>Detalles</a>
                          {pedido.ubicacion !== null &&(
                          <a href="#" onClick={(e) => { e.stopPropagation(); handlemapa(pedido); }}>Ver mapa</a>
                        )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PedidoDetalle Pedido={selectedUser} onClose={handleCloseModal} tipo={tipo} />

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

export default PedidoTable;