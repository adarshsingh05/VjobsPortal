import React, { useEffect, useState } from 'react';
import { fetchevents } from '@/api/eventsapi';// Assuming your API is in the './api' file
import { useUser } from '@clerk/clerk-react';
import { CirclePlus } from 'lucide-react';
import EventModal from '@/modals/EventModal';

const EventsList = ({ }) => {
 
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const {user}= useUser();

  const handleAddEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: Date.now(), isCompleted: false }]);
  };
  const toggleEventCompletion = (eventId) => {
    setEvents(events.map(event => (
        event.id === eventId ? { ...event, isCompleted: !event.isCompleted } : event
    )));
};

  const [error, setError] = useState(null);
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZ3JqeXpqcWxzb3psd2NmYWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjcyNjc0MSwiZXhwIjoyMDQyMzAyNzQxfQ.PQhre7cPVE8LSQSMANHD3EsmojWT0pvAzbjAwwx5An0'; // Ensure this is correct

  useEffect(() => {
    
    // Fetch the events on component mount
    const fetchData = async () => {
        
        
          const data = await fetchevents(token,user.id);
          console.log("Fetched Events:", data); // Log the fetched data
          if (data) {
            setEvents(data);
          } else {
            setError('No events found');
          }
        } 

    fetchData();
  }, [token]);


  if (error) return <p>{error}</p>;

  return (
    <>
    {/* Your Upcoming Events Section */}
    <div className='flex flex-col '>
          

          <div className='text-xl font-bold mt-4 text-center p-1 rounded-md border-[3px] border-[#41767c]'> Your Upcoming Events  <button className='ml-8' onClick={() => setShowModal(true)}>
          <CirclePlus />
        </button></div>
          <div>
            <div className='w-full lg:w-[90%] h-[380px] p-4 overflow-y-auto mt-5'>
            
                {events.map((event) => (
                  <div className='mb-4' key={event.id}>
                    <div className='flex items-center'>
                      <input
                        type="checkbox"
                        className="mr-4"
                        checked={event.isCompleted}
                        onChange={() => toggleEventCompletion(event.id)}
                      />
                      <div className={`flex-grow ${event.isCompleted ? 'line-through bg-red-300 border rounded-md' : ''}`}>
                        <h4 className="text-lg font-semibold">Event Name: {event.EventName}</h4>
                        <p className="text-sm text-gray-600">Description: {event.description}</p>
                      </div>
                      <p className= {`ml-4 font-semibold text-gray-600 ${event.isCompleted ? 'line-through bg-red-300 border rounded-md' : ''}`}> Date: {event.date} </p>
                    </div>
                  </div>
                ))}
              </div>
              <EventModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onAddEvent={handleAddEvent}
      />
            </div>
            </div>

    </>



  );
};

export default EventsList;
