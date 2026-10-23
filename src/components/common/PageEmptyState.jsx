import {useNavigate} from "react-router-dom";
import Button from "./Button";
// a page that is not built yet
const PageEmptyState=({icon:Icon,title})=>{
    const navigate=useNavigate();
    return(
        <div className="flex flex-col items-center px-6 pt-[72px] text-center">
            <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <Icon size={24} strokeWidth={1.6}/>
            </span>
            <h2 className="mt-[28px] text-[22px] font-bold leading-[28px] tracking-[-0.4px] text-[var(--color-text-primary)]">{title}</h2>
            <Button variant="outline" className="mt-[20px]" onClick={()=>navigate("/")}>Back to Overview</Button>
        </div>
    )
}
export default PageEmptyState;
