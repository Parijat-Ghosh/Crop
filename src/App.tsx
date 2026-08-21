import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Fields from './pages/Fields';
import FieldAnalysis from './pages/FieldAnalysis';
import CropHealth from './pages/CropHealth';
import SoilIntelligence from './pages/SoilIntelligence';
import PestRisk from './pages/PestRisk';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fields" element={<Fields />} />
          <Route path="/fields/:id" element={<FieldAnalysis />} />
          <Route path="/health" element={<CropHealth />} />
          <Route path="/soil" element={<SoilIntelligence />} />
          <Route path="/pest-risk" element={<PestRisk />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
