import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import fondoImagen from '../images/fondo_forms.webp';
import Header from '../header';
import '../styles/catalogo-detalle.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getusu, getToken,  removeToken} from '../tokenStorage';


export function Catalogo_detalles() {
  const location = useLocation();
  const [producto, setProducto] = useState({});
  const [modelUrl, setModelUrl] = useState('');
  const [mostrarModelo, setMostrarModelo] = useState(false);  // Estado para controlar qué mostrar
  const [mostrarbotones, setMostrarbotones] = useState(true);  // Estado para controlar qué mostrar
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const navigate = useNavigate();


  const token = getToken();
  const id = getusu();

  const headers = useRef({
    Authorization: `${token}`,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    axios.get(`${process.env.REACT_APP_API_PRODUCTO}/producto/${params.get('id') || 0}`)
      .then(response => {
        setProducto(response.data.results);
        if (response.data.results.modelado === null || response.data.results.modelado === '') {
          setMostrarModelo(false);
          setMostrarbotones(false);
        } else {
          setModelUrl(`${process.env.REACT_APP_API_PRODUCTO}/${response.data.results.modelado}`);
          setMostrarModelo(true);
          setMostrarbotones(true);

        }
      })
      .catch(error => {
        console.error('Error al obtener producto:', error);
      });
  }, [location.search]);
  const handlePedido = () => {
    // Mostrar el diálogo de confirmación
    setMostrarConfirmacion(true);
  };

  const confirmarPedido = () => {

    const params = new URLSearchParams(location.search);
    const formData = {
      id_usuario: id,
      id_producto: params.get('id') || 0,
      estado: 'pendiente',
    }

    axios.post(`${process.env.REACT_APP_API_PEDIDO}/pedido`, formData, { headers: headers.current })
      .then(response => {
        console.log('producto registrado:', response.data);
        Swal.fire({
          title: "CORRECTO!",
          text: "Se Registro el pedido Correctamente al Sistema, el encargado se contactara con usted para la entrega del producto",
          icon: "success"
        }).then((result) => {
          if (result.isConfirmed) {
            // El usuario hizo clic en el botón "OK"
            navigate('/Home');
          }
        });

      })
      .catch(error => {
        console.log("entro al catch")
        if (error.response && error.response.status === 401) {
          Swal.fire({
            title: "ERROR!",
            text: "Debe Iniciar Sesion para realizar un pedido",
            icon: "error"
          }).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              removeToken();

              navigate('/login');
            }
          });

        } else {
          console.log('Error:', error);
          console.error('Error al registrar usuario:', error);
          Swal.fire({
            title: "ERROR!",
            text: "No se Registro el pedido Correctamente al Sistema, intente nuevamente",
            icon: "error"
          }).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              window.location.reload(); // Esto recarga la página

            }
          });
        }

      });
  };

  const cancelarPedido = () => {
    setMostrarConfirmacion(false); // Ocultar diálogo después de rechazar
  };
  const goBack =()=>{
    window.history.back();
};
  return (
    <div>
      <Header />
      <div className='principal-detalle'>
        <div className='detalles-catalogo'>
          <div className='contenido-texto'>

            <h1>Detalles del producto</h1>
            <p><span class="nombre_etiqueta">Nombre:</span> <span class="nombre_resultado">{producto.nombre} </span></p>
            <p><span class="nombre_etiqueta">detalle: </span> <span class="nombre_resultado">{producto.detalle}</span></p>
            <p><span class="nombre_etiqueta">Precio: </span> <span class="nombre_resultado">{producto.precio} Bs</span></p>
            <div className="detalles-linea">
              <p><span className="nombre_etiqueta">Altura: </span> <span className="nombre_resultado">{producto.altura} Cm</span></p>
              <p><span className="nombre_etiqueta">Ancho: </span> <span className="nombre_resultado">{producto.ancho} Cm</span></p>
            </div>
            <div>
              <button onClick={handlePedido}>Realizar pedido</button>
              {mostrarConfirmacion && (
                <div className="confirmacion-dialogo">
                  <p>¿Estás seguro que desea realizar el pedido?</p>
                  <button onClick={confirmarPedido}>Aceptar</button>
                  <button onClick={cancelarPedido}>Rechazar</button>
                </div>
              )}
            </div>
          </div>
          <div className='contenido-modelo'>
            {mostrarModelo ? (
              <model-viewer
                modes="scene-viewer quick-look webxr"
                src={modelUrl}
                auto-rotate
                camera-controls

              ></model-viewer>
            ) : (
              <img src={fondoImagen} alt="Imagen del producto" />
            )}
            {mostrarbotones && (
              <div className='botones'>
                {mostrarModelo ? (
                  <div>
                              <button onClick={() => goBack()}>Atras</button>
                  <button onClick={() => setMostrarModelo(false)}>Imagen</button>
                  </div>
                ) : (
                  <div>
                  <button onClick={() => goBack()}>Atras</button>

                  <button onClick={() => setMostrarModelo(true)}>Modelado</button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default Catalogo_detalles;