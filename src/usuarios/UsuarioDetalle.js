import React from 'react';
import '../styles/UsuarioDetalles.css';


// Función componente para los detalles del usuario
export const UsuarioDetalle = ({ user, onClose }) => {
    if (!user) {
        return null; // No renderiza nada si no hay usuario
    }
    console.log(user);
    return (
        <div className="detalles">

            <h2>Detalles del Usuario</h2>
            <div className="row-detalles">
                <p><strong>ID:</strong> {user.idusuario}</p>
                <p><strong>Nombre:</strong> {user.nombre}</p>    
            </div>
            <div className="row-detalles">
                <p><strong>Apellido:</strong> {user.apellido}</p>
                <p><strong>Teléfono:</strong> {user.telefono}</p>
            </div>

            <div className="row-detalles">
                <p><strong>Usuario:</strong> {user.usuario}</p>
                <p><strong>email:</strong> {user.email}</p>
            </div>
            <div className="row-detalles">
                <p><strong>Estado:</strong> <span style={{
                        fontWeight: 'bold', // Hace el texto en negrita
                        color: 'black', // Color de texto negro
                        backgroundColor: user.estado ? 'green' : 'red', // Fondo verde si activo, rojo si inactivo
                        padding: '2px 6px', // Padding para dar un poco de espacio alrededor del texto
                        borderRadius: '4px', // Bordes redondeados
                        marginLeft: '5px' // Espacio a la izquierda para separar del texto "Estado:"
                    }}>
                    {user.estado ? 'Activo' : 'Inactivo'}</span></p>
            </div>
            <button onClick={onClose} style={{ cursor: 'pointer', padding: '10px 20px' }}>Cerrar</button>
        </div>
    );
};