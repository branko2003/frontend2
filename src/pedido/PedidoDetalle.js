import '../styles/UsuarioDetalles.css';
import axios from 'axios';
import React, { useState, useRef,useEffect } from 'react';
import { getusu, getToken,removeToken} from '../tokenStorage';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Función componente para los detalles del usuario
export const PedidoDetalle = ({ Pedido, onClose, tipo }) => {
    // Inicializar estados aquí, antes de cualquier condicional
    const [direcciones, setDirecciones] = useState([]);

    const [editModeDireccion, setEditModeDireccion] = useState(false);
    const [editMode, setEditMode] = useState(false);
    let [newState, setNewState] = useState();
    let [newDireccion, setNewDireccion] = useState();

    const [error, setError] = useState(''); // Para manejar mensajes de error
    const token = getToken();
    const id = getusu();
    const headers = useRef({
        Authorization: `Bearer ${token}`,
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (Pedido) {
            setNewState(Pedido.estado);
            setNewDireccion(Pedido.id_ubicacion);
        }
    }, [Pedido]);

    if (!Pedido) {
        return null; // No renderiza nada si no hay usuario
    }

    const getColor = (estado) => {
        switch (estado) {
            case 'finalizado':
                return 'green'; // Verde para finalizado
            case 'rechazado':
                return 'red'; // Rojo para rechazado
            case 'pendiente':
                return 'yellow'; // Amarillo para pendiente
            case 'en proceso':
                return 'white'; // Blanco para en proceso
            default:
                return 'grey'; // Un color por defecto si no hay estado reconocido
        }
    };

    const handleEstadoChange = (e) => {
        setNewState(e.target.value);
        setError(''); // Limpia el error cuando se selecciona un valor

    };
    const handleDireccionChange = (e) => {
        setNewDireccion(e.target.value);
        setError(''); // Limpia el error cuando se selecciona un valor

    };
    const toggleEditMode = () => {
        setEditMode(!editMode);
        setError(''); // Limpia errores cuando se alterna el modo de edición

    };
    const toggleEditModDireccion = async () => {
        // Reemplaza la URL con tu endpoint de API
        //newDireccion = Pedido.id_ubicacion
        console.log("inicial de ubicacion ", newDireccion)
        console.log("inicial de estado ", newState)

        await axios.get(`${process.env.REACT_APP_API_USUARIO}/ubicacion/${id}?page=0&size=1000`, { headers: headers.current })
            .then(response => {
                console.log(response.data)
                setDirecciones(response.data.results);
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
        setEditModeDireccion(!editModeDireccion);
        setError(''); // Limpia errores cuando se alterna el modo de edición

    };
    const saveEstado = () => {
        if (!newState || newState === '') {
            setError('Necesita escoger una opcion');
            return; // Detiene la función si el estado es vacío
        }
        // Aquí debes agregar la lógica para enviar newState al servidor o API
        console.log('Guardando nuevo estado:', newState);
        let pedidoedit = {
            idpedido: Pedido.idpedido,
            estado: newState
        }

        axios.put(`${process.env.REACT_APP_API_PEDIDO}/pedido`, pedidoedit, { headers: headers.current })
            .then(response => {

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
                    console.error('Error al actualizar usuario:', error);
                }
            });
        pedidoedit = {};
        setEditMode(false); // Cierra el modo de edición
        // Actualiza el estado del pedido (esto requeriría propiedades adicionales o un efecto de lado para realizar la actualización)
    };

    const saveDireccion = () => {
        if (!newDireccion || newDireccion === '') {
            setError('Necesita escoger una opcion');
            return; // Detiene la función si el estado es vacío
        }
        // Aquí debes agregar la lógica para enviar newState al servidor o API
        console.log('Guardando nuevo estado:', newState);
        let pedidoedit = {
            idpedido: Pedido.idpedido,
            id_ubicacion: newDireccion
        }

        axios.put(`${process.env.REACT_APP_API_PEDIDO}/pedido`, pedidoedit, { headers: headers.current })
            .then(response => {
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
                    console.error('Error al actualizar usuario:', error);
                }
            });
        pedidoedit = {};
        setEditModeDireccion(false); // Cierra el modo de edición
        // Actualiza el estado del pedido (esto requeriría propiedades adicionales o un efecto de lado para realizar la actualización)
    };
    const cancelEdit = () => {
        setNewState(Pedido.estado); // Restablece al estado original del pedido
        setEditMode(false);
        setError(''); // Limpia cualquier mensaje de error
    };
    const cancelEditDireccion = () => {
        setNewDireccion(Pedido.ubicacion)
        setEditModeDireccion(false);
        setError(''); // Limpia cualquier mensaje de error
    };

    return (
        <div className="detalles">

            <h2>Detalles del Pedido</h2>
            <div className="row-detalles">
                <p><strong>Cliente:</strong> {Pedido.usuario.nombre}</p>
                <p><strong>Producto:</strong> {Pedido.producto.nombre}</p>
            </div>
            <div className="row-detalles">
                <p><strong>Precio:</strong> {Pedido.producto.precio}</p>
                <p><strong>Teléfono:</strong> {Pedido.usuario.telefono}</p>
            </div>

            <div className="row-detalles">
                <p><strong>Fecha Registro:</strong> {Pedido.createdAt}</p>
            </div>
            <div className="row-detalles">
                <p><strong>Estado:</strong>
                    {!editMode ? (
                        <span style={{
                            fontWeight: 'bold',
                            color: 'black',
                            backgroundColor: getColor(Pedido.estado),
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginLeft: '5px'
                        }}>
                            {Pedido.estado}
                        </span>
                    ) : (
                        <>
                            <select value={newState} onChange={handleEstadoChange} style={{
                                padding: '2px 6px',
                                borderRadius: '4px',
                            }} >
                                <option value="">Seleccione un estado</option>
                                <option value="en proceso">En proceso</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="rechazado">Rechazado</option>
                                <option value="finalizado">Finalizado</option>
                            </select>
                            {error && <p style={{ color: 'white', background: 'red' }}>{error}</p>}
                        </>
                    )}
                </p>
            </div>
            <div className="row-detalles">
                <p><strong>Ubicacion:</strong>
                    {!editModeDireccion ? (
                        <span>
                            {Pedido.ubicacion === null ? "No se registró ubicación" : Pedido.ubicacion.direccion}
                        </span>
                    ) : (
                        <>
                            <select value={newDireccion} onChange={handleDireccionChange}
                                style={{
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    maxHeight: '150px', // Altura máxima antes de activar el scroll
                                    overflowY: 'auto',  // Habilita el scroll vertical
                                }} >
                                <option value="">Seleccione una dirección</option>
                                {direcciones.map((direccion) => (
                                    <option value={direccion.idubicacion}>
                                        {direccion.direccion}
                                    </option>
                                ))}
                            </select>
                            {error && <p style={{ color: 'white', background: 'red' }}>{error}</p>}
                        </>
                    )}
                </p>


            </div>
            <div className='botones-final'>
                {!editMode && !editModeDireccion && <button onClick={onClose} style={{ cursor: 'pointer', padding: '10px 20px' }}>Cerrar</button>}
                {(tipo === "administrador" || tipo === "superuser") && (
                    <div>
                        {!editMode ? (
                            <button onClick={toggleEditMode} style={{ cursor: 'pointer', padding: '10px 20px' }}>Actualizar estado</button>
                        ) : (
                            <>
                                <button onClick={saveEstado} style={{ cursor: 'pointer', padding: '10px 20px' }}>Guardar estado</button>
                                <button onClick={cancelEdit} style={{ cursor: 'pointer', padding: '10px 20px' }}>Cancelar</button>
                            </>
                        )}
                    </div>

                )}

                {!editModeDireccion ? (
                    <button onClick={toggleEditModDireccion} style={{ cursor: 'pointer', padding: '10px 20px' }}>Añadir direccion</button>
                ) : (
                    <>
                        <button onClick={saveDireccion} style={{ cursor: 'pointer', padding: '10px 20px' }}>Guardar direccion</button>
                        <button onClick={cancelEditDireccion} style={{ cursor: 'pointer', padding: '10px 20px' }}>Cancelar</button>
                    </>
                )}
            </div>
        </div>
    );
};