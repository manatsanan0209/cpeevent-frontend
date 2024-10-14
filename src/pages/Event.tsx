import { Tabs, Tab } from '@nextui-org/react';
import DefaultLayout from '@/layouts/default';
import AllEvent from '@/components/AllEvent';
import { events } from '../data/events.ts'
import { user } from '../data/user.ts'
import JoinedEvent from '@/components/JoinedEvent';

export default function Event() {

   return (
      <DefaultLayout>
         <div className="flex w-full pl-64 flex-col">
            <Tabs
               key="secondary"
               color="secondary"
               variant="underlined"
               fullWidth
               size="md"
               style={{ fontWeight: 'bold' }}
               

            >
               <Tab key="All" title="All">
                  <AllEvent events={events} user={user}/>
               </Tab>

               <Tab key="Joined" title="Joined">
                  <JoinedEvent events={events} user={user}/>
               </Tab>
            </Tabs>
         </div>
      </DefaultLayout>
   );
}
