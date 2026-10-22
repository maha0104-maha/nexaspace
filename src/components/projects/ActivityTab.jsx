import Avatar from "../common/Avatar";
import EmptyState from "../common/EmptyState";
import {getUserById} from "../../data";
import {timeAgo} from "../../utils/taskUtils";

function ActivityTab({ activities }) {
  if (activities.length === 0) return <EmptyState title="No activity yet" description="Changes to this project will be listed here." />;
  return (
    <div className="flex flex-col gap-5 p-5">
      {activities.map((a) => {
        const user = getUserById(a.userId);
        return (
          <div key={a.id} className="flex items-start gap-3">
            {user && <Avatar name={user.name} size="sm" style={{ backgroundColor: user.avatarBg, color: user.avatarFg }} />}
            <div className="min-w-0 flex-1 text-[13px] leading-5 text-[#4B5563]">
              <b className="text-[var(--color-text-primary)]">{user?.name}</b> {a.verb} <b className="text-[var(--color-text-primary)]">{a.target}</b> {a.suffix}
            </div>
            <span className="shrink-0 text-xs text-[#9CA3AF]">{timeAgo(a)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default ActivityTab;
