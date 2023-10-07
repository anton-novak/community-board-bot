import { CSSProperties } from "react";
import "./Notification.css";

export default function Notification({ notification }: { notification: string}) {
    
    const style: CSSProperties = {
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        padding: "1rem",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        animation: "fadeOut 2s ease-in-out forwards"
    };
    
    return (
        <div className="notification is-link mt-2" style={style}>
            {notification}
        </div>
    )
}