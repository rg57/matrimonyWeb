import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "../components/layout/Layout"
import Users from "../pages/Users"

function Dashboard() {
  return <h2>Dashboard Page</h2>
}

function Reports() {
  return <h2>Reports Page</h2>
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
