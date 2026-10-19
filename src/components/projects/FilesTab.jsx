import { PenTool, FileText, Image as ImageIcon } from "lucide-react";
import Avatar from "../../common/Avatar";
import EmptyState from "../../common/EmptyState";
import { FILE_TYPE_STYLES, getUserById } from "../../../data";

const ICONS = { fig: PenTool, pdf: FileText, png: ImageIcon, doc: FileText };

function FileCard({ file }) {
  const style = FILE_TYPE_STYLES[file.type] || FILE_TYPE_STYLES.doc;
  const Icon = ICONS[file.type] || FileText;
  const user = getUserById(file.uploadedBy);
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-white p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: style.bg, color: style.color }}>
        <Icon size={18} strokeWidth={1.7} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold">{file.name}</p>
        <p className="truncate text-xs text-[#6B7280]">{file.sizeMb.toFixed(1)} MB · {file.taskTitle}</p>
      </div>
      {user && <Avatar name={user.name} size="xs" style={{ backgroundColor: user.avatarBg, color: user.avatarFg }} />}
    </div>
  );
}

function FilesTab({ files }) {
  if (files.length === 0) return <EmptyState title="No files yet" description="Files attached to tasks will show up here." />;
  return (
    <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
      {files.map((f) => <FileCard key={f.id} file={f} />)}
    </div>
  );
}

export default FilesTab;