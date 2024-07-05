import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import fondoImagen from '../images/fondo_forms.webp'; // Asegúrate de tener la imagen de fondo en tus archivos
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getToken,removeToken} from '../tokenStorage';
import Header from '../header';
import '../styles/UsuarioTable.css';
import { ProductoDetalle } from './ProductoDetalle';
import SidebarGeneral from '../sidebars/SidebarGeneral';


export function ProductoTable() {

  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`, 
    backgroundSize: '100% 100%',  
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: 'auto', 
    minHeight: '100vh',
  };
  
  //para la paginacion
  const [pagina, setpagina] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 4; // Número de usuarios por página

// para el boton de acciones
  const [showDropdown, setShowDropdown] = useState(-1);  // Para controlar qué menú está visible
  const dropdownRef = useRef(null); // Referencia para el contenedor del menú desplegable


  const [selectedUser, setSelectedUser] = useState(null);

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  //const usuario=getusu();
//  const rol = getUsuarioT();

  const token = getToken();
  const headers = useRef ({
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
    try{

      //const header = getAuthHeaders()
      /*if (!token || token==="" || token===undefined) {
        navigate('/');
        console.log("entra al if");
        return;
      } */
        document.removeEventListener('click', handleClickOutside, true);

    axios.get(`${process.env.REACT_APP_API_PRODUCTO}/producto?size=4`,{ headers:headers.current })
      .then(response => {

        setProductos(response.data.results);
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
    }catch (error) {
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

    axios.get(`${process.env.REACT_APP_API_PRODUCTO}/producto?page=${newPage}&size=4`,{ headers:headers.current })
        .then(response => {
            setProductos(response.data.results);
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
  };
  const handleNext = () => {
    const newPage = pagina + 1;
    setpagina(newPage);

    axios.get(`${process.env.REACT_APP_API_PRODUCTO}/producto?page=${newPage}&size=4`,{ headers:headers.current })
        .then(response => {
            setProductos(response.data.results);
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
  };
  //---------------------------------------------
  const handleInputChange = (e) => {
    setBusqueda(e.target.value);

    // Realizar solicitud al backend cuando hay un valor en el campo de búsqueda
    if (e.target.value) {

      axios.get(`${process.env.REACT_APP_API_PRODUCTO}/producto/${e.target.value}`,{ headers:headers.current })
        .then(response => {
            setProductos(response.data.results);
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

      axios.get(`${process.env.REACT_APP_API_PRODUCTO}/producto`,{ headers:headers.current })
        .then(response => {
            setProductos(response.data.results);
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

    axios.delete(`${process.env.REACT_APP_API_PRODUCTO}/producto/${id}`,{ headers:headers.current })
      .then(response => {
        setProductos(productos.filter(usuario => usuario.id !== id));
        console.log('Usuario eliminado:', response.data);
        //navigate('/Usuario-vista');
        Swal.fire({
          title: "CORRECTO!",
          text: "Se Elimino correctamente el producto de la Lista",
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
  const handleActualizar = (producto) => {
    const queryParams = new URLSearchParams({
      idproducto: producto.idproducto,
      nombre: producto.nombre,
      detalle: producto.detalle,
      precio: producto.precio,
      altura: producto.altura,
      ancho: producto.ancho,
      stock: producto.stock,
      categoria: producto.categoria,
      modo: 'actualizar'
    }).toString();

    const url = `/Producto?${queryParams}`;

    window.location.href = url;
  };

  return (
    <>
    <Header />
      <div className="usuario-table-container"  style={estiloDeFondo}>
                  <SidebarGeneral></SidebarGeneral>
                  <div className="row">
                  <h4 >LISTA DE PRODUCTOS</h4>
                    <input 
                      type="text"
                      placeholder="Buscar por Nombre"
                      value={busqueda}
                      onChange={handleInputChange}
                    />
                    <div >
                      <table className="tablita">
                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>

                            <th>Modelado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productos.map((producto,index) => (
                            <tr key={producto.idproducto}>

                              <td><img src={`${process.env.REACT_APP_API_PRODUCTO}/${producto.imagen}`} alt={producto.nombre} width="100" height="100" /></td>
                              <td>{producto.nombre}</td>
                              <td>{producto.modelado === null || producto.modelado === undefined || producto.modelado === "" ? "No tiene Modelado" : "Tiene Modelado"}</td>
                              <td>
                              <div ref={dropdownRef} className={`action-button ${showDropdown === index ? 'show' : ''}`} onClick={() => toggleDropdown(index)}>
                                <button>⋮</button>
                                <div className="action-dropdown">
                                  <a href="#" onClick={(e) => { e.stopPropagation(); handleActualizar(producto); }}>Actualizar</a>
                                  <a href="#" onClick={(e) => { e.stopPropagation(); handleEliminar(producto.idproducto); }}>Eliminar</a>
                                  <a href="#" onClick={(e) => { e.stopPropagation(); handledetalles(producto); }}>Detalles</a>
                                </div>
                              </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {<ProductoDetalle produc={selectedUser} onClose={handleCloseModal} />
                      }

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

export default ProductoTable;