import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fondoImagen from '../images/fondo_forms.webp'; // Asegúrate de tener la imagen de fondo en tus archivos

import '../styles/catalogo.css';
import Header from '../header';
import Sidebar from '../sidebars/Sidebar';

export function Catalogo() {
    const estiloDeFondo = {
        backgroundImage: `url(${fondoImagen})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
      };
  //para la paginacion
  const [pagina, setpagina] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12; // Número de usuarios por página
  const [selectedCategory, setSelectedCategory] = useState('dormitorio'); // categoría inicial
  const [productos, setProductos] = useState([]);

  useEffect(() => {

    const fetchProductos = async () => {
        try {      

          const response = await axios.get(`${process.env.REACT_APP_API_PRODUCTO}/producto/imagen/${selectedCategory}`);
          console.log("VARIABLE DE ENTORNO ",process.env.REACT_APP_API_PRODUCTO)

          setProductos(response.data.results);
          const total = response.data.total;
          setTotalPages(Math.ceil(total / pageSize));
          console.log('Productos cargados:', response.data.results);
        } catch (error) {
          console.error('Error al cargar productos', error);
        }
      };
    
      fetchProductos();
    }, [selectedCategory]);  // Dependencia para re-ejecutar el efecto cuando cambie la categoría

 //------------------------botones de paginacion---------------------
 const handlePrevious = () => {
  const newPage = pagina - 1;
  setpagina(newPage);

  axios.get(`${process.env.REACT_APP_API_PRODUCTO}/producto/imagen/${selectedCategory}?page=${newPage}&size=12`)
  .then(response => {
    setProductos(response.data.results);
  }).catch(error => {

    console.log("entro al catch")
    
      console.error('Error al obtener usuario:', error);
    
  });

};
const handleNext = () => {
  const newPage = pagina + 1;
  setpagina(newPage);

  axios.get(`${process.env.REACT_APP_API_PRODUCTO}/producto/imagen/${selectedCategory}?page=${newPage}&size=12`)
  .then(response => {
    setProductos(response.data.results);
  }).catch(error => {

    console.log("entro al catch")
    
      console.log('Error:', error);
      console.error('Error al obtener usuario:', error);
    
  });
  
};
//---------------------------------------------
const handleDetalles = (id) => {
  const queryParams = new URLSearchParams({
    id: id
  }).toString();

  const url = `/catalogo-detail?${queryParams}`;

  window.location.href = url;
};
    return (
    <div >
    <Header/>
    
    <div className="cata" style={estiloDeFondo}>
    <div className="catalogo">
      <Sidebar onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
      <div className="productos">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-card">
              <h3>{producto.nombre}</h3>

            <img src={`${process.env.REACT_APP_API_PRODUCTO}/${producto.imagen}`} alt={producto.nombre} />
            <div className="producto-detail">
            <p>Detalle: {producto.detalle}</p>
            <p>Precio: {producto.precio}</p>
            <button onClick={() => handleDetalles(producto.idproducto)}>Ver detalles</button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
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
    
  );
}

export default Catalogo;