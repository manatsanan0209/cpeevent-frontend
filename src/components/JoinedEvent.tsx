import { Accordion, AccordionItem, Button, Input, Kbd, Select, SelectItem } from "@nextui-org/react";
import { GrStatusGoodSmall } from "react-icons/gr";
import { SearchIcon } from "./icons";


// define type of data
interface Event {
   _id: number;
   eventName: string;
   eventDescription: string;
   nParticipant: number;
   participants: string[];
   nStaff: number;
   startDate: string;
   endDate: string;
   president: string;
   kind: string;
   role: any[];
   icon: string | null;
   poster: string | null;
}

// 
interface User {
   student_id: string;
}

interface AllEventProps {
   events: Event[];
   user: User;
}

export default function JoinedEvent({ events, user }: AllEventProps) {

  const searchInput = (
    <Input
       aria-label="Search"
       classNames={{
          inputWrapper: 'bg-white shadow-lg',
          input: 'text-sm',
       }}
       endContent={
          <Kbd className="hidden lg:inline-block" keys={['command']}>
            K
          </Kbd>
       }
       labelPlacement="outside"
       placeholder="Search"
       startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
       }
       type="search"
    />
 );

  function getCurrentTime(): string {
    const now = new Date();
    return now.toISOString();
 }

 function eventStatus(event: any) {
    const current_time = getCurrentTime();
    if (current_time < event.startDate) {
       return 'Upcoming';
    } else if (current_time > event.endDate) {
       return 'Ended';
    } else {
       return 'Ongoing';
    }
 }

 function displayEventStatus(event: any) {
    const status = eventStatus(event);
    if (status == 'Upcoming') {
       return (
          <span className="flex flex-row">
             <span> <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-green-500" /> </span>
             <span className="text-blue-500">Upcoming</span>
          </span>
       );
    } else if (status == 'Ended') {
       return (
          <span className="flex flex-row">
             <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-rose-600" />
             <span className="text-blue-500">Ended</span>
          </span>
       );
    } else {
       return (
          <span className="flex flex-row">
             <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-yellow-500" />
             <span className="text-blue-500">Ongoing</span>
          </span>
       );
    }
 }

   return (
      <>
               <div className="flex flex-row justify-between ">
                  {/* Search */}
                  <div className=" w-1/4 mx-20 my-8 justify-start mb-4 md:mb-0" >
                     {searchInput}
                  </div>
                  {/* Sort by */}
                  <div className=" w-1/4 mx-20 my-8 item-start flex flex-row">
                     <div className="w-20 mt-2 text-sm">Sort by</div>
                     <Select
                        variant="bordered"
                        style={{
                           boxShadow: '0 8px 10px rgba(82, 82, 91, 0.1)',
                        }}
                        className="max-w-xs"
                     >
                        <SelectItem key="Name" value="Name">
                           Name
                        </SelectItem>
                        <SelectItem key="Datelow" value="Datelow">
                           Date ( low - high )
                        </SelectItem>
                        <SelectItem key="Datehigh" value="Datehigh">
                           Date ( high - low )
                        </SelectItem>
                     </Select>
                  </div>
               </div>

               <div className="mx-8">
                  <Accordion variant="splitted">
                     {events.map((event) => (
                        <AccordionItem
                           key={event._id}
                           aria-label={event.eventName}
                           title={
                              <p className="flex flex-row">
                                 <span className="w-5/12 text-zinc-600" style={{ fontWeight: 'bold' }}>
                                    {event.eventName}
                                 </span>
                                 <span className="text-sm w-3/12 pt-1">
                                    {displayEventStatus(event)}
                                 </span>
                                 <span className="flex justify-end text-sm w-4/12 pt-1 pr-8">
                                    <p className="text-zinc-600" style={{ fontWeight: 'bold' }}>Start Date :{''}</p>
                                    <p className="text-blue-500 ml-2">{event.startDate
                                       .substring(0, 10)
                                       .replace(/-/g, '/')}</p>
                                 </span>
                              </p>
                           }
                        >
                           <div className="flex flex-row">
                              <div className="flex flex-col text-wrap w-1/2 mx-12 my">
                                 <div className="text-zinc-600" style={{ fontWeight: 'bold' }}>Description</div>
                                 <p className="text-zinc-500">{event.eventDescription}</p>
                              </div>
                              <div className="flex flex-col text-wrap w-1/4">
                                 <div className="text-zinc-600" style={{ fontWeight: 'bold' }}>Poster</div>
                                 <p className="text-zinc-500">
                                    {event.poster ? (
                                       <img src={event.poster} alt="Poster" />
                                    ) : (
                                       'No poster available'
                                    )}
                                 </p>
                              </div>
                              <div className="flex flex-col text-wrap w-1/4">
                                 <Button
                                    className="mx-12 my-5 bg-violet-700 text-white"
                                    isDisabled={
                                       event.participants.includes(
                                          user.student_id,
                                       ) || eventStatus(event) != 'Upcoming'
                                    }
                                 >
                                    <strong>Join</strong>
                                 </Button>
                                 <Button
                                    className="mx-12 my-5 bg-blue-500 text-white"
                                    isDisabled={
                                       !event.participants.includes(
                                          user.student_id,
                                       )
                                    }
                                 >
                                    <strong>Workspace</strong>
                                 </Button>
                              </div>
                           </div>
                        </AccordionItem>
                     ))}
                  </Accordion>
               </div>
      </>
   );
}
