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


export function ProductoComponentForm() {
  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: 'auto',
    minHeight: '100vh',
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
    id: '',
    nombre: '',
    detalle: '',
    stock: 0,
    altura: 0,
    ancho: '',
    categoria: '',
    precio: '',
    modo: '',
    id_usuario: id

  });

  useEffect(() => {
    /*    if (!token || token==="" || token===undefined) {
          navigate('/');
          console.log("entra al if");
          return;
        }*/

    const params = new URLSearchParams(location.search);
    console.log('params:', params)
    const productoData = {
      id_usuario: id,
      idproducto: params.get('idproducto') || 0,
      nombre: params.get('nombre') || '',
      detalle: params.get('detalle') || '',
      precio: params.get('precio') || 0,
      altura: params.get('altura') || 0,
      ancho: params.get('ancho') || 0,
      stock: params.get('stock') || 0,
      categoria: params.get('categoria') || '',
      modo: params.get('modo') || 'registrar'
    };

    setProducto(productoData);
  }, [location.search, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validación específica para el input de modelado
    if (name === 'modelado') {
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
    if (name === 'imagen') {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      if (fileExt !== 'png' && fileExt !== 'jpeg' && fileExt !== 'gif' && fileExt !== 'jpg') {
        Swal.fire({
          icon: 'error',
          title: 'Archivo no permitido',
          text: 'Solo se pueden subir archivos de imagen .png, .jpeg, .gif, .jpg',
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
      const { modo, idproducto, ...productoSinModo } = producto;
      const formData = new FormData();
      // Agregar ambos archivos si están disponibles
      if (modeladoInputRef.current?.files[0]) {
        formData.append('modelado', modeladoInputRef.current.files[0]);
      }
      if (imagenInputRef.current?.files[0]) {
        formData.append('imagen', imagenInputRef.current.files[0]);
      }
      Object.keys(productoSinModo).forEach(key => formData.append(key, producto[key]));
      // Ahora usuarioSinModo tiene todas las propiedades de usuario excepto 'modo'

      axios.post(`${process.env.REACT_APP_API_PRODUCTO}/producto`, formData, { headers: headers.current })
        .then(response => {
          console.log('producto registrado:', response.data);
          Swal.fire({
            title: "CORRECTO!",
            text: "Se Registro el producto Correctamente al Sistema",
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              navigate('/Producto-vista');
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
      console.log(producto)

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
              <h4>REGISTRO DE NUEVO PRODUCTO </h4>
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
                  <label className="label-plomo" htmlFor="nombre">NOMBRE:</label>
                  <input className="form-control-texto" type="text" name="nombre" value={producto.nombre} onChange={handleChange} required />
                </div>
                <div>
                  <label className="label-plomo" htmlFor="detalle">DETALLE:</label>
                  <input className="form-control-texto"
                    type="text"
                    name="detalle"
                    value={producto.detalle}
                    onChange={handleChange} required
                  />
                </div>
              </div>
              <div className="field-group">
                <div >
                  <label className="label-plomo" for="form2Example22">PRECIO (Bs):</label>
                  <input className="form-control-texto"
                    type="float"
                    name="precio"
                    value={producto.precio}
                    onChange={handleChange} required
                  /> </div>
                <div>
                  <label className="label-plomo" for="form2Example22">ALTURA (Cm):</label>
                  <input className="form-control-texto"
                    type="float"
                    name="altura"
                    value={producto.altura}
                    onChange={handleChange} required
                  /></div>
              </div>
              <div className="field-group">
                <div>
                  <label className="label-plomo" for="form2Example22">ANCHO (Cm):</label>
                  <input className="form-control-texto"
                    type="float"
                    name="ancho"
                    value={producto.ancho}
                    onChange={handleChange} required
                  /></div>
                <div>
                  <label className="label-plomo" for="form2Example22">STOCK:</label>
                  <input className="form-control-texto"
                    type="number"
                    name="stock"
                    value={producto.stock}
                    onChange={handleChange} required
                  /> </div>
              </div>
              <div className="field-group">
              {producto.modo === 'registrar' && (
                <div>
                  <label className="label-plomo" for="form2Example22">MODELADO:</label>
                  <input className="form-control-texto"
                    type="file"
                    name="modelado"
                    ref={modeladoInputRef}
                    accept=".glb"  // Aceptar solo archivos GLB

                    onChange={handleChange}
                  /></div>
              )}
                <div>
                  <label className="label-plomo" for="form2Example22">CATEGORIA:</label>
                  <select
                    className="form-control-texto"
                    name="categoria"
                    value={producto.categoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="dormitorio">Dormitorio</option>
                    <option value="comedor">Comedor</option>
                    <option value="cocina">Cocina</option>
                    <option value="living">living</option>
                    <option value="oficina">oficina</option>
                    {/* Agrega más opciones según sea necesario */}
                  </select> </div>
              </div>
              {producto.modo === 'registrar' && (
              <div>
                <div>
                  <label className="label-plomo" for="form2Example22">IMAGEN:</label>
                  <input className="form-control-texto"
                    type="file"
                    name="imagen"
                    ref={imagenInputRef}
                    accept=".png, .jpeg, .gif, .jpg"  // Aceptar solo PNG, JPEG, y GIF

                    onChange={handleChange} required
                  /> </div>
              </div>
              )}
              <div>
                <button type="submit" className="boton-submit">{producto.modo === 'registrar' ? 'Registrar Producto' : 'Actualizar Producto'}</button>
              </div>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}

export default ProductoComponentForm;