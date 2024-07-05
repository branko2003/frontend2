import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import React, { useState, useEffect, useRef } from 'react';
import { IconLocation, actualizacionIcon, NuevoIcon } from "./IconLocation";
import Header from '../header';
import 'leaflet/dist/leaflet.css';
import '../styles/mapa.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SidebarGeneral from '../sidebars/SidebarGeneral';

import { useLocation } from 'react-router-dom';


import { getusu, getToken, getUsuarioT,removeToken} from '../tokenStorage';

function ClickMap({ onMapClick }) {
  const map = useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });

  return null;
}

function UsuarioMap() {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [Coordenadas_usuario, SetCoordenadas_usuario] = useState([]);
  const [cargar_mapa, Setcargar_mapa] = useState([]);

  const [direccion, setDireccion] = useState('');  // Estado para almacenar la dirección ingresada
  const [markerIcon, setMarkerIcon] = useState(IconLocation); // Estado inicial con el ícono predeterminado
  const [isDraggable, setIsDraggable] = useState(false); // Estado para controlar si el marcador es arrastrable
  const [idToUpdate, setIdToUpdate] = useState(null);
  const [tipo, setTipo] = useState("");

  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(-1);  // Para controlar qué menú está visible

  const location = useLocation();

  //para la paginacion
  const [pagina, setpagina] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5; // Número de usuarios por página
  const token = getToken();
  const id = getusu();
  const headers = useRef({
    Authorization: `Bearer ${token}`,
  });
  const toggleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? -1 : index);
  };

  //------------------------botones de paginacion---------------------
  const handlePrevious = () => {
    const newPage = pagina - 1;
    setpagina(newPage);
    const url = (tipo === "administrador" || tipo==="superuser") ? `${process.env.REACT_APP_API_USUARIO}/ubicacion?page=${newPage}&size=5` : `${process.env.REACT_APP_API_USUARIO}/ubicacion/${id}?page=${newPage}&size=5`;

    axios.get(url, { headers: headers.current })
      .then(response => {
        SetCoordenadas_usuario(response.data.results);
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
    const url = (tipo === "administrador" || tipo==="superuser") ? `${process.env.REACT_APP_API_USUARIO}/ubicacion?page=${newPage}&size=5` : `${process.env.REACT_APP_API_USUARIO}/ubicacion/${id}?page=${newPage}&size=5`;

    axios.get(url, { headers: headers.current })
      .then(response => {
        SetCoordenadas_usuario(response.data.results);
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


  /*const fetchUserRole = async () => {
  try {
      const rol = await getUsuarioT(); // Espera a que la promesa se resuelva.
      console.log(rol)
      setTipo(rol); // Actualiza el estado con el rol obtenido.
  } catch (error) {
      console.error('Error al obtener el rol:', error);
  }
};*/

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
    const params = new URLSearchParams(location.search);
    const localicacion = {
      idubicacion: params.get('id') || 0,
      modo: params.get('modo') || 'normal'
    };
    Setcargar_mapa(localicacion)
    fetchUserRole();
  }, []); // Dependencias vacías para asegurar que solo se ejecuta una vez.


  useEffect(() => {
    try {
      /*if (!token || token === "" || token === undefined) {
        navigate('/');
        console.log("entra al if");
        return;
      }*/
      if (cargar_mapa.modo === 'normal') {
        if (tipo) {

          const url = (tipo === "administrador" || tipo==="superuser") ? `${process.env.REACT_APP_API_USUARIO}/ubicacion` : `${process.env.REACT_APP_API_USUARIO}/ubicacion/${id}`;
          axios.get(url, { headers: headers.current })
            .then(response => {
              SetCoordenadas_usuario(response.data.results);
              setTotalPages(Math.ceil(response.data.total / pageSize));
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
      } else {
        console.log("esto es mi cargar_mapa", cargar_mapa)
        
        axios.get(`${process.env.REACT_APP_API_USUARIO}/ubicacion/ubi/${cargar_mapa.idubicacion}`, { headers: headers.current })
          .then(response => {
            const results = Array.isArray(response.data.results) ? response.data.results : [response.data.results];

            console.log(results)
            SetCoordenadas_usuario(results);
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


  const sendCoordinates = (e) => {
    try {
      e.preventDefault();

      if (markerPosition && direccion) {
        const Datos = {
          id_usuario: id,
          latitud: markerPosition.lat,
          longitud: markerPosition.lng,
          direccion: direccion
        };
        //const url = idToUpdate ? `http://localhost:4001/ubicacion/${idToUpdate}` : 'http://localhost:4001/ubicacion';
        //const method = idToUpdate ? 'put' : 'post';
        if (idToUpdate == null) {
          console.log("entro al post");

          axios.post(`${process.env.REACT_APP_API_USUARIO}/ubicacion`, Datos, { headers: headers.current })
            .then(response => {
              console.log('Usuario registrado:', response.data);
              Swal.fire({
                title: "CORRECTO!",
                text: "Se Registro la ubicacion Correctamente al Sistema",
                icon: "success"
              }).then((result) => {
                if (result.isConfirmed) {
                  // El usuario hizo clic en el botón "OK"
                  window.location.reload(); // Esto recarga la página
                }
              });

            })
            .catch(error => {
              console.log("entro al catch")
              if (error.response && error.response.status === 401) {
                removeToken();

                navigate('/');
              } else {
                console.log('Error:', error);
                console.error('Error al registrar usuario:', error);
              }

            });
        }
        else {
          console.log("entro al put");
          Datos.idubicacion = idToUpdate;

          axios.put(`${process.env.REACT_APP_API_USUARIO}/ubicacion`, Datos, { headers: headers.current })
            .then(response => {
              console.log('Ubicacion registrado:', response.data);
              Swal.fire({
                title: "CORRECTO!",
                text: "Se Actualizo la ubicacion Correctamente al Sistema",
                icon: "success"
              }).then((result) => {
                if (result.isConfirmed) {
                  // El usuario hizo clic en el botón "OK"
                  window.location.reload(); // Esto recarga la página
                }
              });

            })
            .catch(error => {
              console.log("entro al catch")
              if (error.response && error.response.status === 401) {
                removeToken();

                navigate('/');
              } else {
                console.log('Error:', error);
                console.error('Error al actualizar ubicacion:', error);
              }

            });

        }

      }
    } catch (error) {
      console.log("entro al catch")
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/');
      } else {
        console.log('Error:', error);
      }
    }

  };
  const handleEliminar = (id) => {

    axios.delete(`${process.env.REACT_APP_API_USUARIO}/ubicacion/${id}`, { headers: headers.current })
      .then(response => {
        console.log('Usuario eliminado:', response.data);
        //navigate('/Usuario-vista');
        Swal.fire({
          title: "CORRECTO!",
          text: "Se Elimino correctamente la ubicacion de la Lista",
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
  const handleActualizar = (coord) => {
    setMarkerPosition({ lat: coord.latitud, lng: coord.longitud }); // Establece la nueva posición
    setDireccion(coord.direccion); // Establece la dirección
    setMarkerIcon(actualizacionIcon); // Cambia el ícono
    setIsDraggable(true); // Hace que el marcador sea arrastrable
    setIdToUpdate(coord.idubicacion); // Guarda el ID del marcador a actualizar

  };
  const back = () => {

    window.history.back();
  };
  return (
    < >
      <Header />
      <div className="todo">
        <SidebarGeneral></SidebarGeneral>
        <div className="container-mapa">
        <div className="mapa">
          <MapContainer center={{ lat: '-17.3895', lng: '-66.1568' }} zoom={14}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href= "https://www.openstreetmap.org/copyright"> OpenStreetMap</a> contributors' />
            <ClickMap onMapClick={setMarkerPosition} />
            {
              markerPosition === null ? null : <Marker position={markerPosition}
                //icon={IconLocation} 
                icon={null === idToUpdate ? markerIcon : NuevoIcon}
              />}
            {Coordenadas_usuario.map((coord, index) => (
              <Marker key={index} position={{ lat: coord.latitud, lng: coord.longitud }}
                //icon={IconLocation}
                icon={coord.idubicacion === idToUpdate ? markerIcon : IconLocation}
                draggable={coord.idubicacion === idToUpdate ? isDraggable : false}
                eventHandlers={{
                  dragend: (e) => {
                    setMarkerPosition(e.target.getLatLng());
                  }
                }}
              >
                <Popup>
                  Direccion: {coord.direccion}<br />
                  Nombre: {coord.usuario.nombre}<br />
                  telefono: {coord.usuario.telefono}<br />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="mapa-clase">
          {cargar_mapa.modo === "normal" && (
            <div className="formulario-mapa">
              <form onSubmit={sendCoordinates}>
                <h4>Añadir Direccion</h4>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ingrese la dirección" required
                />
                <button type="submit" onClick={sendCoordinates}>  {idToUpdate ? "Actualizar Dirección" : "Registrar Dirección"}
                </button>
              </form>

            </div>
          )}
          <h4>Direcciones Guardadas</h4>
          <table className="tablita">
            <thead>
              <tr>
                <th>Direccion</th>
                {cargar_mapa.modo === "normal" && (
                  <th>Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(Coordenadas_usuario) && Coordenadas_usuario.map((coord, index) => (
                <tr key={coord.idubicacion}>
                  <td>{coord.direccion}</td>
                  {cargar_mapa.modo === "normal" && (
                    <td>
                      <div className={`action-button ${showDropdown === index ? 'show' : ''}`} onClick={() => toggleDropdown(index)}>
                        <button>⋮</button>
                        <div className="action-dropdown">
                          <a href="#" onClick={(e) => { e.stopPropagation(); handleActualizar(coord); }}>Actualizar</a>
                          <a href="#" onClick={(e) => { e.stopPropagation(); handleEliminar(coord.idubicacion); }}>Eliminar</a>
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {cargar_mapa.modo === "normal" && (
            <div >
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
            </div>)}
            {cargar_mapa.modo === "visualizar" && (
            
            <div className="formulario-mapa">
          <button onClick={back}> Atras</button>
          </div>
            )}
        </div>
</div>
      </div>
    </>
  );
}
export default UsuarioMap;