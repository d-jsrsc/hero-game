import { Routes, Route, useLocation } from 'react-router-dom';

import { WrapProvider } from './hooks/WrapProvider';
import { Provider as ContractProvider } from './contract';

import Layout from './components/Layout';
import Heros from './pages/Heros';
import { HerosView, HerosModal } from './pages/HerosVIew';
import Market from './pages/Market';
import NoMatch from './pages/NoMatch';
import Test from './pages/Test';

function AppRoute() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Market />} />
          <Route path="/heros" element={<Heros />} />
          <Route path="/heros/:rootkey" element={<HerosView />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>

      {/* Show the modal when a `backgroundLocation` is set */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/heros/:rootkey" element={<HerosModal />} />
        </Routes>
      )}
    </>
  );
}

const App = () => {
  return (
    <WrapProvider>
      <ContractProvider>
        <AppRoute />
      </ContractProvider>
    </WrapProvider>
  );
};

export default App;
