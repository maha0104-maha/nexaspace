const Avatar=({name="",src,size="md",className="",style,user})=>{
    // pass a user object to get its name and colors
    const shownName=user?user.name:name;
    const shownStyle=user?.avatarBg?{backgroundColor:user.avatarBg,color:user.avatarFg,...style}:style;
    const sizes={
        xs:"h-6 w-6 text-[10px]",
        compact:"h-7 w-7 text-[10px]",
        sm:"h-8 w-8 text-xs",
        md:"h-9 w-9 text-[13px]",
        lg:"h-11 w-11 text-sm",
        xl:"h-14 w-14 text-base"
    };

    const initials=shownName.trim().split(/\s+/).filter(Boolean).map((part)=>
    part[0]).join("").toUpperCase();

    return(
        <div className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-light)] font-medium text-[var(--color-primary)] ${sizes[size] || sizes.md} ${className}`} role="img" style={shownStyle}
        aria-label={shownName||"User avatar"}>
            {src?(<img src={src} alt="profileimage" className="h-full w-full object-cover" />)
            :(initials||"?")
            }

        </div>
      
    )
}

export default Avatar;