import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import RequestModal from './RequestModal';

const CalendarView = ({ requests, equipment, teams, onUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const preventiveRequests = requests.filter(req => req.requestType === 'Preventive');

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getRequestsForDate = (date) => {
    if (!date) return [];
    return preventiveRequests.filter(req => {
      const reqDate = new Date(req.scheduledDate);
      return reqDate.toDateString() === date.toDateString();
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Preventive Maintenance Calendar</h2>
          <p className="text-slate-600 mt-1">Schedule and track preventive maintenance</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex-1 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-2xl font-bold text-slate-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200">
          {dayNames.map(day => (
            <div key={day} className="p-4 text-center font-semibold text-slate-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1">
          {days.map((day, index) => {
            const dayRequests = day ? getRequestsForDate(day) : [];
            const isToday = day && day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                onClick={() => day && handleDateClick(day)}
                className={`border-r border-b border-slate-200 p-3 min-h-[120px] ${
                  day ? 'cursor-pointer hover:bg-slate-50' : 'bg-slate-50'
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold mb-2 ${
                      isToday ? 'text-blue-600' : 'text-slate-700'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayRequests.slice(0, 3).map(req => (
                        <div
                          key={req._id}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded truncate"
                          title={req.subject}
                        >
                          {req.subject}
                        </div>
                      ))}
                      {dayRequests.length > 3 && (
                        <div className="text-xs text-slate-500">
                          +{dayRequests.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <RequestModal
          equipment={equipment}
          teams={teams}
          onClose={() => {
            setShowModal(false);
            setSelectedDate(null);
          }}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default CalendarView;
