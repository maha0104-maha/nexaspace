import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Dropdown from "../common/Dropdown";
import { PROJECT_PRIORITIES } from "../../data";
function Body({ project, onClose, onSave }) {
  const [v, setV] = useState({ name: project.name, description: project.description || "", client: project.client, dueDate: project.dueDate, priority: project.priority });
  const [error, setError] = useState("");
  const set = (key) => (e) => setV({ ...v, [key]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!v.name.trim()) return setError("Project name is required");
    if (v.dueDate < project.startDate) return setError("Deadline can't be before the start date");
    onSave({ ...v, name: v.name.trim(), client: v.client.trim() || "Internal" });
  };
  return (
    <Modal isOpen onClose={onClose} title="Project settings"
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" form="settings-form">Save changes</Button></>}>
      <form id="settings-form" onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Input name="s-name" label="Project name" value={v.name} onChange={set("name")} error={error} autoFocus />
        <Textarea name="s-desc" label="Description" rows={3} value={v.description} onChange={set("description")} />
        <Input name="s-client" label="Client or department" value={v.client} onChange={set("client")} />
        <div className="grid grid-cols-2 gap-4">
          <Input type="date" name="s-due" label="Deadline" min={project.startDate} value={v.dueDate} onChange={set("dueDate")} />
          <Dropdown name="s-priority" label="Priority" placeholder={null} value={v.priority} onChange={set("priority")} options={PROJECT_PRIORITIES.map((p) => ({ label: p, value: p }))} />
        </div>
      </form>
    </Modal>
  );
}
export default function ProjectSettingsModal({ isOpen, project, onClose, onSave }) {
  return isOpen ? <Body project={project} onClose={onClose} onSave={onSave} /> : null;
}
