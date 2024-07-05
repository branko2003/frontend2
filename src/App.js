import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import LoginComponent from './LoginComponent';
import UsuarioComponentForm from './usuarios/UsuarioComponentForm';
import UsuarioTable from './usuarios/UsuarioTable';
import Perfil from './usuarios/Perfil';
import UsuarioMap from './usuarios/UsuarioMap';
import ProductoComponentForm from './producto/ProductoComponentForm';
import Catalogo_detalles from './producto/Catalogo-detalles';
import PedidoTable from './pedido/PedidoTable';
import Catalogo from './producto/Catalogo';
import ProductoTable from './producto/ProductoTable';
import ProductoCaracteristicaForm from './producto/ProductoCaracteristicaForm';
import CaracteristicaTable from './producto/CaracteristicaTable';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/usuario" element={<UsuarioComponentForm />} />
        <Route path="/usuario-vista" element={<UsuarioTable />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/mapa" element={<UsuarioMap />} />
        <Route path="/producto" element={<ProductoComponentForm />} />
        <Route path="/catalogo-detail" element={< Catalogo_detalles/>} />
        <Route path="/Home" element={< Catalogo/>} />
        <Route path="/pedido-vista" element={<PedidoTable />} />
        <Route path="/producto-vista" element={<ProductoTable />} />
        <Route path="/producto-caracteristica" element={<ProductoCaracteristicaForm />} />
        <Route path="/caracteristica-vista" element={<CaracteristicaTable />} />
        <Route path="*" element={<Navigate to="/Home" />} />

      </Routes>
    </Router>
  );
}

export default App;
