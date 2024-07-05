import './styles/login.css';
import React, { useState } from 'react';
import { useNavigate,NavLink } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { saveToken } from './tokenStorage';


export function LoginComponent() {
    const [formData, setFormData] = useState({
        usuario: '',
        contrasenia: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            const response = await axios.post(`${process.env.REACT_APP_API_AUTH}/auth`, formData);
            if (response.data) {
                console.log('Respuesta del usuario:', response.data);
                saveToken(response.data.accessToken,response.data.idusuario);
                Swal.fire({
                    title: "ACCESO CORRECTO",
                    text: "Bienvenido al Sistema",
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        // El usuario hizo clic en el botón "OK"
                        navigate('/Home');
                    }
                }); // Corregir aquí: cerrar el paréntesis de la función then
            } else {
                throw new Error('Error en la solicitud');
                
            }
        } catch (error) {
            Swal.fire({
                title: "ACCESO INCORRECTO",
                text: "No puede ingresar al Sistema",
                icon: "error"
            }).then((result) => {
                if (result.isConfirmed) {
                    // El usuario hizo clic en el botón "OK"
                    navigate('/login');
                }
            }); // Corregir aquí: cerrar el paréntesis de la función then
        }
    };

    return (
<div className="login-page">
      <section className="home">
        <div className="login-container">
              <h1>Muebleria Armonia</h1>
              <p>Bienvenido</p>
        </div>
      <div className="section-login">
          <div className="form-box">
              <form onSubmit={handleSubmit}>
                  <h2>Inicio de Sesión</h2>
                  <div className="inputbox">
                      <input name="usuario" value={formData.usuario} onChange={handleChange} type="text" required />
                      <label htmlFor="usuario">Usuario</label>
                  </div>
                  <div className="inputbox">
                      <input name="contrasenia" value={formData.contrasenia} onChange={handleChange} type="password" required />
                      <label htmlFor="contrasenia">Contraseña</label>
                  </div>
                  <div className="text-center">
                      <button type="submit">INGRESAR</button>
                      No tienes cuenta?<NavLink to="/usuario"> Regístrate</NavLink>
                  </div>
              </form>
          </div>
      </div>
  </section>
  </div>
    );
}

export default LoginComponent;