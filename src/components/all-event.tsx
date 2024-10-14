import { Tabs, Tab } from '@nextui-org/react';
import { Input, Kbd, Select, SelectItem } from '@nextui-org/react';
import { SearchIcon } from '@/components/icons';
import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import { GrStatusGoodSmall } from 'react-icons/gr';
import DefaultLayout from '@/layouts/default';

export default function AllEvent() {
   // search
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

   const dummy_data = [
      {
         _id: 1,
         eventName: 'COMCAMP34',
         eventDescription: 'คอมแคมป์ เพื่อความสนุกสนานและการทดสอบระบบนะจ๊ะ',
         nParticipant: 0,
         participants: ['65070501003', '65070501038'],
         nStaff: 15,
         startDate: '2024-04-30T00:00:00Z',
         endDate: '2024-04-30T00:00:00Z',
         president: '65070501050',
         kind: 'camp',
         role: [],
         icon: null,
         poster: null,
      },
      {
         _id: 2,
         eventName: 'Open House 2025',
         eventDescription: 'โอเพ่นเฮาส์ เพื่อความสนุกสนานและการทดสอบระบบนะจ๊ะ',
         nParticipant: 0,
         participants: ['65070501038', '65070501064'],
         nStaff: 15,
         startDate: '2026-04-30T00:00:00Z',
         endDate: '2026-05-10T00:00:00Z',
         president: '65070501059',
         kind: 'camp',
         role: [],
         icon: null,
         poster: null,
      },
      {
         _id: 3,
         eventName: 'COMCAMP345',
         eventDescription: 'คอมแคมป์ เพื่อความสนุกสนานและการทดสอบระบบนะจ๊ะ',
         nParticipant: 0,
         participants: ['65070501003', '65070501038'],
         nStaff: 15,
         startDate: '2024-04-30T00:00:00Z',
         endDate: '2026-04-30T00:00:00Z',
         president: '65070501050',
         kind: 'camp',
         role: [],
         icon: null,
         poster: null,
      },
      {
         _id: 4,
         eventName: 'COMCAMP347',
         eventDescription: 'คอมแคมป์ เพื่อความสนุกสนานและการทดสอบระบบนะจ๊ะ',
         nParticipant: 0,
         participants: ['65070501003', '65070501038'],
         nStaff: 15,
         startDate: '2025-04-30T00:00:00Z',
         endDate: '2025-04-30T00:00:00Z',
         president: '65070501050',
         kind: 'camp',
         role: [],
         icon: null,
         poster: null,
      },
      {
         _id: 5,
         eventName: 'Something',
         eventDescription: 'คอมแคมป์ เพื่อความสนุกสนานและการทดสอบระบบนะจ๊ะ',
         nParticipant: 0,
         participants: ['65070501000', '65070501038'],
         nStaff: 15,
         startDate: '2024-04-30T00:00:00Z',
         endDate: '2024-04-30T00:00:00Z',
         president: '65070501050',
         kind: 'camp',
         role: [],
         icon: null,
         poster: null,
      },
      {
         _id: 6,
         eventName: 'Something',
         eventDescription: 'คอมแคมป์ เพื่อความสนุกสนานและการทดสอบระบบนะจ๊ะ',
         nParticipant: 0,
         participants: ['65070501000', '65070501038'],
         nStaff: 15,
         startDate: '2024-04-30T00:00:00Z',
         endDate: '2026-04-30T00:00:00Z',
         president: '65070501050',
         kind: 'camp',
         role: [],
         icon: null,
         poster: null,
      },
   ];

   const dummy_user_data = {
      student_id: '65070501003',
   };

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
               <GrStatusGoodSmall className="text-xs mt-0.5 mr-1 text-green-500" />
               Upcoming
            </span>
         );
      } else if (status == 'Ended') {
         return (
            <span className="flex flex-row">
               <GrStatusGoodSmall className="text-xs mt-0.5 mr-1 text-rose-800" />
               Ended
            </span>
         );
      } else {
         return (
            <span className="flex flex-row">
               <GrStatusGoodSmall className="text-xs mt-0.5 mr-1 text-yellow-600" />
               Ongoing
            </span>
         );
      }
   }

   return (
      <DefaultLayout>
         {/* Tab bar */}
         <Tabs
            key="secondary"
            color="secondary"
            className="flex w-full"
            variant="underlined"
            fullWidth
            size="md"
         >
            {/* Tab All */}
            <Tab
               className="flex flex-col md:flex-col w-full"
               key="All"
               title="All"
            >
               <div className="flex flex-row justify-between ">
                  {/* Search */}
                  <div className=" w-1/4 mx-20 my-8 justify-start mb-4 md:mb-0">
                     {searchInput}
                  </div>
                  {/* Sort by */}
                  <div className=" w-1/4 mx-20 my-8 item-start flex flex-row">
                     <div className="w-20 mt-2 text-sm">Sort by</div>
                     <Select
                        variant="bordered"
                        style={{
                           boxShadow: '0 8px 10px rgba(0, 0, 0, 0.1)',
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
                     {dummy_data.map((event) => (
                        <AccordionItem
                           key={event._id}
                           aria-label={event.eventName}
                           title={
                              <p className="flex flex-row">
                                 <span className="w-5/12">
                                    {event.eventName}
                                 </span>
                                 <span className="text-sm w-3/12 pt-1">
                                    {displayEventStatus(event)}
                                 </span>
                                 <span className="flex justify-end text-sm w-4/12 pt-1 pr-8">
                                    Start Date :{' '}
                                    {event.startDate
                                       .substring(0, 10)
                                       .replace(/-/g, '/')}
                                 </span>
                              </p>
                           }
                        >
                           <div className="flex flex-row">
                              <div className="flex flex-col text-wrap w-1/2 mx-12 my">
                                 <div>Description</div>
                                 <p>{event.eventDescription}</p>
                              </div>
                              <div className="flex flex-col text-wrap w-1/4">
                                 <div>Poster</div>
                                 <p>
                                    {event.poster ? (
                                       <img src={event.poster} alt="Poster" />
                                    ) : (
                                       'No poster available'
                                    )}
                                 </p>
                              </div>
                              <div className="flex flex-col text-wrap w-1/4">
                                 <Button
                                    className="mx-12 my-5 bg-violet-800 text-white"
                                    isDisabled={
                                       event.participants.includes(
                                          dummy_user_data.student_id,
                                       ) || eventStatus(event) != 'Upcoming'
                                    }
                                 >
                                    <strong>Join</strong>
                                 </Button>
                                 <Button
                                    className="mx-12 my-5 bg-blue-600 text-white"
                                    isDisabled={
                                       !event.participants.includes(
                                          dummy_user_data.student_id,
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
            </Tab>

            {/* Tab New */}
            <Tab className="" key="New" title="New">
               <div></div>
            </Tab>

            {/* Tab Joined */}
            <Tab key="Joined" title="Joined">
               <div className="flex justify-end">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
               </div>
            </Tab>
         </Tabs>
      </DefaultLayout>
   );
}
