import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/SideBar";
import Header from "./components/layout/Header";


import Overview from "./pages/Overview";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen bg-[var(--color-background)]">
                <Sidebar />

                <div className="min-w-0 flex-1">
                    <Header />

                    <main>
                        <Routes>
                           
                            <Route path="/" element={<Overview />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/:projectId" element={<ProjectDetails />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;