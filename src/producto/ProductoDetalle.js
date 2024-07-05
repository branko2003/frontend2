import React, { useState, useRef } from 'react';
import '../styles/UsuarioDetalles.css';
import Swal from 'sweetalert2';
import Header from '../header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken,removeToken} from '../tokenStorage';
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';

import '../styles/UsuarioForm.css';

// Función componente para los detalles del usuario
export const ProductoDetalle = ({ produc, onClose }) => {
    const [isChangingImage, setIsChangingImage] = useState(false);
    const [isAddingModelado, setIsAddingModelado] = useState(false);
    const imagenInputRef = useRef(null);
    const modeladoInputRef = useRef(null);

    const navigate = useNavigate();
    const token = getToken();  
    const headers = useRef ({
        Authorization: `Bearer ${token}`,
      });
    if (!produc) {
        return null; // No renderiza nada si no hay usuario
    }
    console.log(produc);

    const handleImageChange = () => {
        setIsChangingImage(!isChangingImage);
        if (isAddingModelado) {
            setIsAddingModelado(false);
            if (modeladoInputRef.current) modeladoInputRef.current.value = '';
        }
    };

    const handleModeladoChange = () => {
        setIsAddingModelado(!isAddingModelado);
        if (isChangingImage) {
            setIsChangingImage(false);
            if (imagenInputRef.current) imagenInputRef.current.value = '';
        }
    };

    const handleImageSubmit = (event) => {
        event.preventDefault();
        const fileInput = event.target.elements.imagen;
        const file = fileInput.files[0];
        if (file) {
            const fileExt = file.name.split('.').pop();
            if (fileExt !== 'png' && fileExt !== 'jpeg' && fileExt !== 'gif' && fileExt !== 'jpg') {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo no permitido',
                    text: 'Solo se pueden subir archivos de imagen .png, .jpeg, .gif, .jpg',
                });
                // Resetear el valor del input
                fileInput.value = '';
                return;
            } else {
                const formData = new FormData();
                formData.append('imagen', file);
                formData.append('idproducto', produc.idproducto);

                axios.put(`${process.env.REACT_APP_API_PRODUCTO}/producto/imagen`, formData, { headers: headers.current })
                    .then(response => {
                        console.log('producto registrado:', response.data);
                        Swal.fire({
                            title: "CORRECTO!",
                            text: "Se actualizo la imagen del producto Correctamente al Sistema",
                            icon: "success"
                        }).then((result) => {
                            if (result.isConfirmed) {
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
                            console.error('Error al actualizar la imagen del producto:', error);
                        }

                    });
            }

        } else {
            Swal.fire({
                icon: 'error',
                title: 'No hay archivo',
                text: 'Debe ingresar un archivo para enviar',
            });
        }
    };

    const handleModeladoSubmit = (event) => {
        event.preventDefault();
        const fileInput = event.target.elements.modelado;
        const file = fileInput.files[0];
        if (file) {
            const fileExt = file.name.split('.').pop();
            if (fileExt !== 'glb') {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo no permitido',
                    text: 'Solo se pueden subir archivos .glb',
                });
                // Resetear el valor del input
                fileInput.value = '';
                return;
            }else{
                const formData = new FormData();
                formData.append('modelado', file);
                formData.append('idproducto', produc.idproducto);

                axios.put(`${process.env.REACT_APP_API_PRODUCTO}/producto/modelado`, formData, { headers: headers.current })
                    .then(response => {
                        console.log('producto registrado:', response.data);
                        Swal.fire({
                            title: "CORRECTO!",
                            text: "Se actualizo el modelo del producto Correctamente al Sistema",
                            icon: "success"
                        }).then((result) => {
                            if (result.isConfirmed) {
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
                            console.error('Error al actualizar modelo del producto:', error);
                        }

                    });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No hay archivo',
                text: 'Debe ingresar un archivo para enviar',
            });
        }
    };

    const handleClose = () => {
        setIsChangingImage(false);
        setIsAddingModelado(false);
        if (imagenInputRef.current) imagenInputRef.current.value = '';
        if (modeladoInputRef.current) modeladoInputRef.current.value = '';
        onClose();
    };
    const handleCaracteristica = () => {
        navigate(`/producto-caracteristica?idproducto=${produc.idproducto}`);
    };
    const handleVerCaracteristica = () =>{
        navigate(`/caracteristica-vista?idproducto=${produc.idproducto}`);
    };
    return (
        <div className="detalles">

            <h2>Detalles del Producto</h2>
            <div className="row-detalles">
                <p><strong>ID:</strong> {produc.idproducto}</p>
                <p><strong>Nombre:</strong> {produc.nombre}</p>
            </div>
            <div className="row-detalles">
                <p><strong>Detalle:</strong> {produc.detalle}</p>
                <p><strong>Precio:</strong> {produc.precio}</p>
            </div>

            <div className="row-detalles">
                <p><strong>Altura:</strong> {produc.altura}</p>
                <p><strong>Ancho:</strong> {produc.ancho}</p>
            </div>
            <div className="row-detalles">

                <p><img src={`${process.env.REACT_APP_API_PRODUCTO}/${produc.imagen}`} alt={produc.nombre} width="100" height="100" /></p>
                <p><strong>Modelado:</strong>{produc.modelado === null || produc.modelado === undefined || produc.modelado === "" ? "No tiene Modelado" : "Tiene Modelado"}</p>
            </div>

            <DropdownButton as={ButtonGroup} title="Opciones" id="bg-nested-dropdown">
                <Dropdown.Item className="dropdown-item-custom" onClick={handleImageChange}>
                    {isChangingImage ? 'Cancelar actualización de imagen' : 'Actualizar imagen'}
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item-custom" onClick={handleModeladoChange}>
                    {isAddingModelado ? 'Cancelar agregar modelado' : 'Agregar modelado'}
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item-custom" onClick={handleCaracteristica}>Añadir características</Dropdown.Item>
                <Dropdown.Item className="dropdown-item-custom" onClick={handleVerCaracteristica}>Ver características</Dropdown.Item>
            </DropdownButton>

            {isChangingImage && (
                <form onSubmit={handleImageSubmit}>
                    <input className="form-control-texto"
                        type="file"
                        name="imagen"
                        accept=".png, .jpeg, .gif, .jpg"  // Aceptar solo PNG, JPEG, y GIF
                        ref={imagenInputRef}
                    />
                    <button type="submit">Enviar imagen</button>
                </form>
            )}

            {isAddingModelado && (
                <form onSubmit={handleModeladoSubmit}>
                    <input className="form-control-texto"
                        type="file"
                        name="modelado"
                        accept=".glb"  // Aceptar solo archivos GLB
                        ref={modeladoInputRef}
                    />
                    <button type="submit">Enviar modelado</button>
                </form>
            )}
            <button onClick={handleClose} style={{ cursor: 'pointer', padding: '10px 20px' }}>Cerrar</button>

        </div>
    );
};