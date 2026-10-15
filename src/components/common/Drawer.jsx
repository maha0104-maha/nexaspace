import {React,useEffect} from "react";

const Drawer=({isOpen,onClose,title,children,side="right",className=""})=>{
    useEffect(()=>{
        if(!isOpen)return;
        const handleKeyDown=(e)=>e.key==="Escape"&&onClose?.();
        window.addEventListener("keydown",handleKeyDown);
        return()=>window.removeEventListener("keydown",handleKeyDown);
    },[isOpen,onClose]);

    if(!isOpen)return null;
    
    return(
        <div className="fixed inset-0 z-[300]">
            <button type="button" aria-label="Close drawer" className="absolute inset-0 bg-black/30" onClick={onClose}/>
            <aside role="dialog" aria-modal="true" aria-label={title||"Drawer"} className={`absolute top-0 h-full w-full max-w-md overflow-y-auto bg-[var(--color-surface)] shadow-xl ${side==="left"?"left-0":"right-0"} ${className}`}>
                <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
                    <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h2>
                    <button type="button" onClick={onClose} aria-label="Close drawer" className="rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]">✕</button>
                </div>
                <div className="p-4">{children}</div>
            </aside>
        </div>
    )
}

export default Drawer;