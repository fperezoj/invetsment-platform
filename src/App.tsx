import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import DashboardPage from '@/modules/dashboard/DashboardPage'
import KycPage from '@/modules/kyc/KycPage'
import BenchmarkPage from '@/modules/benchmark/BenchmarkPage'
import MesaDineroPage from '@/modules/mesa-dinero/MesaDineroPage'
import OptimizadorPage from '@/modules/optimizador/OptimizadorPage'
import IpsPage from '@/modules/ips/IpsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/"                    element={<DashboardPage />} />
          <Route path="/kyc"                 element={<KycPage />} />
          <Route path="/benchmark-saa"       element={<BenchmarkPage />} />
          <Route path="/mesa-dinero"         element={<MesaDineroPage />} />
          <Route path="/optimizador-tactico" element={<OptimizadorPage />} />
          <Route path="/ips"                 element={<IpsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
