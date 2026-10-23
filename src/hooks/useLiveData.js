import { useEffect, useState } from "react";
import { getLiveProjects, getLiveTasks, DATA_EVENT } from "../utils/liveData";

// current projects and tasks, and updates when they change anywhere in the app
export default function useLiveData() {
  const [data, setData] = useState(() => ({ projects: getLiveProjects(), tasks: getLiveTasks() }));

  useEffect(() => {
    const refresh = () => setData({ projects: getLiveProjects(), tasks: getLiveTasks() });
    window.addEventListener(DATA_EVENT, refresh);
    return () => window.removeEventListener(DATA_EVENT, refresh);
  }, []);

  return data;
}
