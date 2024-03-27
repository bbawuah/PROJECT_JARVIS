import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Index } from "./views/Index";
import { About } from "./views/About";
import { Layout } from "./components/Layout/Layout";
import { AnimatePresence } from "framer-motion";
import { Dashboard } from "./views/Dashboard";

function App() {
  return (
    <AnimatePresence>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<Index />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
