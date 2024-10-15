import { Link } from '@nextui-org/react';
import { BiCalendarStar } from 'react-icons/bi';
import { LuCalendarClock } from 'react-icons/lu';
import { GoChecklist } from 'react-icons/go';
import { link as linkStyles } from '@nextui-org/theme';
import clsx from 'clsx';

import { Logo } from '@/components/icons';
import { siteConfig } from '@/config/site';

export const Sidebar = () => {
   const events = [
      {
         id: '1',
         title: 'COMCAMP 34',
      },
      {
         id: '2',
         title: 'COMCAMP 35',
      },
      {
         id: '3',
         title: 'COMCAMP 36',
      },
   ];

   return (
      <aside
         aria-label="Sidebar"
         className="fixed h-full p-6 w-64 z-50 border-r transition-transform -translate-x-full md:translate-x-0"
         id="sidebar"
      >
         <div className="flex items-center justify-center h-32">
            <Link aria-label="Home" href="/">
               <Logo className="w-32 h-32 " />
            </Link>
         </div>
         {siteConfig.sideItems.map((item) => (
            <Link
               key={item.href}
               aria-label={item.label}
               className={clsx(
                  linkStyles({
                     color: 'foreground',
                  }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                  'flex items-center gap-2 my-4 p-2 rounded-lg hover:bg-default-100 dark:hover:bg-default-800 dark:hover:text-default-100',
               )}
               href={item.href}
            >
               {/* icon */}
               {item.icon === 'event' && (
                  <BiCalendarStar className="w-6 h-6 mx-4" />
               )}
               {item.icon === 'calendar' && (
                  <LuCalendarClock className="w-6 h-6 mx-4" />
               )}
               {item.icon === 'todo' && (
                  <GoChecklist className="w-6 h-6 mx-4" />
               )}
               {/* label */}
               <span className="font-medium">{item.label}</span>
            </Link>
         ))}
         <hr className="my-4 border-1 border-violet-200 dark:border-default-700" />
         {/* list events */}
         <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Events</h3>
            <ul className="flex flex-col gap-2 ml-2">
               {events.map((event) => (
                  <li key={event.id}>
                     <Link
                        aria-label={event.title}
                        className={clsx(
                           linkStyles({
                              color: 'foreground',
                           }),
                           'data-[active=true]:text-primary data-[active=true]:font-medium',
                           'flex items-center gap-2 p-2 rounded-lg hover:bg-default-100 dark:hover:bg-default-800 dark:hover:text-default-100',
                        )}
                        href={`/event/${event.id}`}
                     >
                        <span>{event.title}</span>
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      </aside>
   );
};
