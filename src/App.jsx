import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/SideBar";
import Header from "./components/layout/Header";
import Overview from "./pages/Overview";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import MyTasks from "./pages/MyTasks";
import Calendar from "./pages/Calendar";
import Team from "./pages/Team";
import Reports from "./pages/Reports";
import Inbox from "./pages/Inbox";
import WorkspaceSettings from "./pages/WorkspaceSettings";

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
                            <Route path="/mytasks" element={<MyTasks />} />
                            <Route path="/calendar" element={<Calendar />} />
                            <Route path="/team" element={<Team />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/inbox" element={<Inbox />} />
                            <Route path="/settings" element={<WorkspaceSettings />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;