import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface Event {
  id: number;
  date: string;
  title: string;
  description: string;
  time: string;
  type: 'birthday' | 'comeback' | 'concert' | 'broadcast';
  icon?: string;
}

const events: Event[] = [
  {
    id: 1,
    date: '2025-01-09',
    title: 'JISOO Birthday',
    description: 'Happy Birthday to JISOO! 🎂',
    time: 'All Day',
    type: 'birthday',
    icon: '🎂',
  },
  {
    id: 2,
    date: '2025-01-15',
    title: 'New Album Release',
    description: '새 미니앨범 발매! 많은 스트리밍 부탁드립니다.',
    time: '6:00 PM KST',
    type: 'comeback',
    icon: '💿',
  },
  {
    id: 3,
    date: '2025-01-20',
    title: 'Music Bank Performance',
    description: 'KBS Music Bank 컴백 무대',
    time: '5:00 PM KST',
    type: 'broadcast',
    icon: '📺',
  },
  {
    id: 4,
    date: '2025-01-25',
    title: 'Fan Meeting',
    description: '서울 팬미팅 - 티켓팅 오픈',
    time: '7:00 PM KST',
    type: 'concert',
    icon: '🎤',
  },
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function AllSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedEvent(null);
  };

  const getEventForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find((event) => event.date === dateStr);
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'birthday':
        return 'bg-pink-300';
      case 'comeback':
        return 'bg-purple-300';
      case 'concert':
        return 'bg-blue-300';
      case 'broadcast':
        return 'bg-yellow-300';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100/50">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="w-9 h-9 bg-purple-100 hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-purple-600" />
              </button>
              <button
                onClick={nextMonth}
                className="w-9 h-9 bg-purple-100 hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-purple-600" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells before first day */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const event = getEventForDate(day);
              const isToday = day === 8; // Today is Dec 8

              return (
                <button
                  key={day}
                  onClick={() => event && setSelectedEvent(event)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all text-sm relative ${
                    event
                      ? `${getEventColor(event.type)} hover:scale-105 shadow-md cursor-pointer`
                      : 'bg-gray-50 hover:bg-gray-100'
                  } ${isToday ? 'ring-2 ring-purple-500' : ''}`}
                >
                  <span className={`${event ? 'text-white' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {event && (
                    <span className="text-xs mt-0.5">{event.icon}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-purple-200/50">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-pink-300"></div>
              <span className="text-xs text-gray-600">Birthday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-300"></div>
              <span className="text-xs text-gray-600">Comeback</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-300"></div>
              <span className="text-xs text-gray-600">Concert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-300"></div>
              <span className="text-xs text-gray-600">Broadcast</span>
            </div>
          </div>
        </div>

        {/* Event Detail Panel */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100/50">
          <h4 className="text-gray-800 mb-4">Event Details</h4>
          {selectedEvent ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <span className="text-4xl">{selectedEvent.icon}</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-gray-800">{selectedEvent.title}</h4>
                <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                <div className="pt-3 border-t border-purple-200/50">
                  <p className="text-xs text-purple-600 mb-1">Date</p>
                  <p className="text-sm text-gray-700">{selectedEvent.date}</p>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-purple-600 mb-1">Time</p>
                  <p className="text-sm text-gray-700">{selectedEvent.time}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p className="text-sm">Click on a date to view event details</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events Timeline */}
      <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100/50">
        <h4 className="text-gray-800 mb-4">Upcoming Events</h4>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`flex-shrink-0 w-56 p-4 rounded-xl transition-all ${
                selectedEvent?.id === event.id
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 shadow-md scale-105'
                  : 'bg-white/80 hover:bg-purple-50/80'
              } border border-purple-100/30`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{event.icon}</span>
                <div className="text-left">
                  <p className="text-sm text-gray-800 mb-1">{event.title}</p>
                  <p className="text-xs text-purple-600">{event.date}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
