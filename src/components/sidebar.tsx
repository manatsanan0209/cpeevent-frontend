import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";
import { Link } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { BiCalendarStar } from "react-icons/bi";
import { LuCalendarClock } from "react-icons/lu";
import { GoChecklist } from "react-icons/go";

export const Sidebar = () => {
  return (

    <aside id="sidebar" className="fixed h-full p-6 w-64 z-50 border-r" aria-label="Sidebar">
        {/* logo */}
        <div className="flex items-center justify-center h-32">
            <Link href="/" aria-label="Home">
                <Logo className="w-32 h-32" />
            </Link>
        </div>
        {siteConfig.sideItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-2 p-4 text-default-900 rounded-lg hover:bg-default-200 dark:hover:bg-default-700 dark:text-default-100" aria-label={item.label}>
                {/* icon */}
                {item.icon === "event" && <BiCalendarStar className="w-6 h-6" />}
                {item.icon === "calendar" && <LuCalendarClock className="w-6 h-6" />}
                {item.icon === "todo" && <GoChecklist className="w-6 h-6" />}
                {/* label */}
                <span>{item.label}</span>
            </Link>
        ))}
        

    </aside>
  );
};