import Avatar from "./Avatar";
const AvatarGroup=({users=[],max=4,size="md",className=""})=>{
    const visibleUsers=users.slice(0,max);
    const remainingCount=Math.max(0,users.length-max);

    return(
        <div className={`flex items-center ${className}`} aria-label={`${users.length} team members`}>
            {visibleUsers.map((user,index)=>(
                <div key={user.id||user.email||`${user.name}-${index}`} className={index>0?"-ml-2":""} style={{zIndex:visibleUsers.length-index}}>
                    <Avatar name={user.name} src={user.avatar} size={size} className="ring-2 ring-[var(--color-surface)]"/>
                </div>
            ))}
            {remainingCount>0&&(
                <span className={`-ml-2 inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-background)] font-medium text-[var(--color-text-secondary)] ring-2 ring-[var(--color-surface)] ${
                    size==="xs"?"h-6 w-6 text-[10px]":
                    size==="sm"?"h-8 w-8 text-xs":
                    size==="lg"?"h-11 w-11 text-sm":
                    size==="xl"?"h-14 w-14 text-base":
                    "h-9 w-9 text-[11px]"
                }`} aria-label={`${remainingCount} additional team members`}>
                    +{remainingCount}
                </span>
            )}
        </div>
    )
}

export default AvatarGroup;