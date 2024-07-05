import '../styles/UsuarioForm.css';
//import logo2 from '../images/logo2.png'; // Asegúrate de tener el logo en tus archivos
import fondoImagen from '../images/fondo_forms.webp'; // Asegúrate de tener la imagen de fondo en tus archivos
import { getusu, getToken,removeToken} from '../tokenStorage';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../header';
import SidebarGeneral from '../sidebars/SidebarGeneral';


export function ProductoCaracteristicaForm() {
  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '87.4vh',
  };


  const modeladoInputRef = useRef(); // Referencia para el input de archivo
  const imagenInputRef = useRef(); // Referencia para el input de archivo

  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();
  const id = getusu();

  const headers = useRef ({
    Authorization: `Bearer ${token}`,
  });
  const [producto, setProducto] = useState({
    idcaracteristica: '',
    nombre: '',
    caracteristica: '',
    modelo: '',
    idproducto: 0,

  });

  useEffect(() => {
    /*    if (!token || token==="" || token===undefined) {
          navigate('/');
          console.log("entra al if");
          return;
        }*/

    const params = new URLSearchParams(location.search);
    const productoData = {
      idcaracteristica: params.get('idcaracteristica') || '',
      nombre: params.get('nombre') || '',
      caracteristica: params.get('caracteristica') || '',
      idproducto: params.get('idproducto') || 0,
      modelo: params.get('modelo') || '',
      modo: params.get('modo') || 'registrar'
    };
    console.log(productoData.idproducto)
    setProducto(productoData);
  }, [location.search, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validación específica para el input de modelado
      // Si el input es de tipo file, maneja el caso de que no haya archivos seleccionados
  if (e.target.type === 'file') {
    const file = e.target.files[0];
    if (!file) { // Si no hay archivo seleccionado (canceló la selección)
      console.log('No se seleccionó ningún archivo');
      return; // Termina la función para evitar errores
    }}

    if (name === 'modelo') {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      if (fileExt !== 'glb') {
        Swal.fire({
          icon: 'error',
          title: 'Archivo no permitido',
          text: 'Solo se pueden subir archivos .glb',
        });
        // Resetear el valor del input
        e.target.value = '';
        return;
      }
    }
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (producto.modo === 'registrar') {
      // Desestructura el objeto usuario para excluir 'modo'
      const { modo,idcaracteristica, ...productoSinModo } = producto;
      const formData = new FormData();
      // Agregar ambos archivos si están disponibles
      if (modeladoInputRef.current?.files[0]) {
        formData.append('modelo', modeladoInputRef.current.files[0]);
      }
      Object.keys(productoSinModo).forEach(key => formData.append(key, producto[key]));
      // Ahora usuarioSinModo tiene todas las propiedades de usuario excepto 'modo'

      axios.post(`${process.env.REACT_APP_API_PRODUCTO}/caracteristica`, formData, { headers: headers.current })
        .then(response => {
          console.log('producto registrado:', response.data);
          Swal.fire({
            title: "CORRECTO!",
            text: "Se Registro la caracteristica del producto Correctamente al Sistema",
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              navigate(`/caracteristica-vista?idproducto=${producto.idproducto}`);
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
        
    } else if (producto.modo === 'actualizar') {

      axios.put(`${process.env.REACT_APP_API_PRODUCTO}/producto`, producto, { headers: headers.current })
        .then(response => {
          navigate('/producto-vista');
          console.log('producto actualizado:', response.data);
        })
        .catch(error => {

          console.log("entro al catch")
          if (error.response && error.response.status === 401) {
            removeToken();

            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al actualizar producto:', error);
          }
        });
    }
  };

  return (
    <div >
      <Header />
      <div className='Side-form' style={estiloDeFondo} >
<SidebarGeneral></SidebarGeneral>
        <div className="formulario-usuario">

          <form onSubmit={handleSubmit}>

            <div >
              <h4>REGISTRO DE NUEVA CARACTERISTICA DEL PRODUCTO </h4>
            </div>
            <div>
              {producto.modo === 'actualizar' && (
                <div>
                  <label for="form2Example22">ID:</label>
                  <input className="form-control-texto"
                    type="text"
                    name="idproducto"
                    value={producto.idproducto}
                    readOnly
                  />
                </div>
              )}
              <div className="field-group">
                <div>
                  <label className="label-plomo" for="form2Example22">NOMBRE:</label>
                  <select
                    className="form-control-texto"
                    name="nombre"
                    value={producto.nombre}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un nombre </option>
                    <option value="cambio_color">Cambio de color</option>
                    <option value="abrir_puertas">Abrir puertas</option>
                    <option value="quitar_colchon">Quitar colchon</option>
                    <option value="abrir_cajon">Abrir cajones</option>
                    {/* Agrega más opciones según sea necesario */}
                  </select> 
                </div>
                {producto.nombre === 'cambio_color' && (
                <div>
                  <label className="label-plomo" for="form2Example22">Caracteristica:</label>
                  <select
                    className="form-control-texto"
                    name="caracteristica"
                    value={producto.caracteristica}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una caracteristica </option>
                    <option value="rojo">Rojo</option>
                    <option value="azul">Azul</option>
                    <option value="verde">Verde</option>
                    <option value="plomo">Plomo</option>
                    {/* Agrega más opciones según sea necesario */}
                  </select> 
                </div>
                )};
              </div>
              <div className="field-group">
                <div>
                  <label className="label-plomo" for="form2Example22">MODELADO:</label>
                  <input className="form-control-texto"
                    type="file"
                    name="modelo"
                    ref={modeladoInputRef}
                    accept=".glb"  // Aceptar solo archivos GLB

                    onChange={handleChange}
                  /></div>
               
              </div>

              <div>
                <button type="submit" className="boton-submit">{producto.modo === 'registrar' ? 'Registrar Caracteristica' : 'Actualizar Caracteristica'}</button>
              </div>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}

export default ProductoCaracteristicaForm;