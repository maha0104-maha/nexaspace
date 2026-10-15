const Tooltip=({children,content,position="top",className=""})=>{
    const positions={
        top:"bottom-full left-1/2 mb-2 -translate-x-1/2",
        bottom:"left-1/2 top-full mt-2 -translate-x-1/2",
        left:"right-full top-1/2 mr-2 -translate-y-1/2",
        right:"left-full top-1/2 ml-2 -translate-y-1/2"
    };
    return(
        <span className={`group relative inline-flex ${className}`}>
            {children}
            {content&&(
                <span role="tooltip" className={`pointer-events-none absolute z-50 w-max max-w-60 rounded-md bg-[var(--color-text-primary)] px-2.5 py-1.5 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${positions[position]||positions.top}`}>
                    {content}
                </span>
            )}
        </span>
    )
}

export default Tooltip;