import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Dropdown from "../common/Dropdown";
import { users, currentUserId, DEMO_TODAY, TASK_STATUSES, TASK_PRIORITIES, TASK_LABELS } from "../../data";
import { addDaysIso } from "../../utils/taskUtils";
const opts = (list) => list.map((x) => ({ label: x, value: x }));
function Body({ onClose, onCreate, projectList, projectId, status }) {
  const [v, setV] = useState({ title: "", projectId, assigneeId: currentUserId, status, priority: "Medium", dueDate: addDaysIso(DEMO_TODAY, 7), label: "" });
  const [error, setError] = useState("");
  const set = (key) => (e) => setV({ ...v, [key]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!v.title.trim()) return setError("Title is required");
    if (!v.dueDate) return setError("Pick a due date");
    onCreate({ ...v, title: v.title.trim() });
  };
  return (
    <Modal isOpen onClose={onClose} title="Create task" className="!max-w-[560px]"
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" form="task-form">Create task</Button></>}>
      <p className="-mt-2 mb-4 text-xs text-[#6B7280]">It appears on the board, lists and dashboard right away.</p>
      <form id="task-form" onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Input name="task-title" label="Title *" placeholder="e.g. Write onboarding email copy" value={v.title} onChange={(e) => { setV({ ...v, title: e.target.value }); setError(""); }} error={error} autoFocus />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Dropdown name="task-project" label="Project *" placeholder={null} value={v.projectId} onChange={set("projectId")} options={projectList.map((p) => ({ label: p.name, value: p.id }))} />
          <Dropdown name="task-assignee" label="Assignee" placeholder={null} value={v.assigneeId} onChange={set("assigneeId")} options={users.map((u) => ({ label: u.name, value: u.id }))} />
          <Dropdown name="task-status" label="Status" placeholder={null} value={v.status} onChange={set("status")} options={opts(TASK_STATUSES)} />
          <Dropdown name="task-priority" label="Priority" placeholder={null} value={v.priority} onChange={set("priority")} options={opts(TASK_PRIORITIES)} />
          <Input type="date" name="task-due" label="Due date" value={v.dueDate} onChange={set("dueDate")} />
          <Dropdown name="task-label" label="Label" placeholder="None" value={v.label} onChange={set("label")} options={opts(TASK_LABELS)} />
        </div>
      </form>
    </Modal>
  );
}
export default function CreateTaskModal({ isOpen, onClose, onCreate, projectList, projectId, status = "To Do" }) {
  return isOpen ? <Body onClose={onClose} onCreate={onCreate} projectList={projectList} projectId={projectId} status={status} /> : null;
}
