
import axios from 'axios';


export function saveToken(token, id){
    localStorage.setItem("ACCESS_TOKEN",token);
    localStorage.setItem("ID",id);
    //this.token = token;
};

export function getusu(){
    
    const usu = localStorage.getItem("ID") || "";
    
    return usu;
};

export function getToken(){
    const token = localStorage.getItem("ACCESS_TOKEN");
    return localStorage.getItem("ACCESS_TOKEN");
};


export async function getUsuarioT(){
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_USUARIO}/tipo/${getusu()}`);
        console.log(response.data.rol)
        return response.data.rol;  // Ahora esto devolverá el rol como se espera
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Manejar error de autorización o otros errores
        } else {
            console.log('Error:', error);
        }
    }
}
/*
export function getAuthHeaders(){
    const headers = useRef ({
        Authorization: `${getToken()}`,
      });
      return headers;
};*/

export function removeToken(){
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("ID");
};

export function hola(){
    
console.log("hola desde tokenStorage.js")
};