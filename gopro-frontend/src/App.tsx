import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Index } from "./views/Index";
import { Streaming } from "./views/Streaming";
import { Layout } from "./components/Layout/Layout";
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <AnimatePresence>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="streaming" element={<Streaming />} />
          <Route path="*" element={<Index />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
