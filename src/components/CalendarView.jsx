import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { authStore } from '../utils/auth';
import RequestModal from './RequestModal';

const CalendarView = ({ requests, equipment, teams, onUpdate }) => {
  const user = authStore.getUser();
  const userRole = user?.role?.toUpperCase() || 'USER';
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter calendar requests based on user role
  let calendarRequests = requests;

  // For technicians, only show requests assigned to them (any type)
  if (userRole === 'TECHNICIAN') {
    calendarRequests = calendarRequests.filter(req =>
      req.assignedTo && req.assignedTo.email?.toLowerCase() === user?.email?.toLowerCase()
    );
  }
  
  // Only managers and users can create requests by clicking dates
  const canCreateOnDateClick = userRole === 'MANAGER' || userRole === 'USER';

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
    return calendarRequests.filter(req => {
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
    // Only allow creating requests on date click for managers and users
    if (canCreateOnDateClick) {
      // Validate: Cannot select past dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        alert('Cannot schedule tasks for past dates. Please select a future date.');
        return;
      }
      
      setSelectedDate(date);
      setShowModal(true);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Preventive Maintenance Calendar</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Schedule and track preventive maintenance</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex-1 flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1">
          {days.map((day, index) => {
            const dayRequests = day ? getRequestsForDate(day) : [];
            const isToday = day && day.toDateString() === new Date().toDateString();

            // Check if date is in the past
            const isPastDate = day && day < new Date(new Date().setHours(0, 0, 0, 0));
            const canClickDate = day && canCreateOnDateClick && !isPastDate;

            return (
              <div
                key={index}
                onClick={() => day && canClickDate && handleDateClick(day)}
                className={`border-r border-b border-slate-200 dark:border-slate-800 p-2.5 min-h-[100px] ${
                  day ? (canClickDate ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800' : isPastDate ? 'opacity-50 cursor-not-allowed' : 'cursor-default') : 'bg-slate-50 dark:bg-slate-950'
                } ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold mb-2 ${
                      isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayRequests.slice(0, 3).map(req => (
                        <div
                          key={req._id}
                          className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded truncate font-medium"
                          title={req.subject}
                        >
                          {req.subject}
                        </div>
                      ))}
                      {dayRequests.length > 3 && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
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
          initialScheduledDate={selectedDate ? selectedDate.toISOString().split('T')[0] : null}
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
