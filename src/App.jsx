import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/SideBar";
import Header from "./components/layout/Header";


function App() {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen bg-[var(--color-background)]">
                <Sidebar />

                <div className="min-w-0 flex-1">
                    <Header />

                    
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;