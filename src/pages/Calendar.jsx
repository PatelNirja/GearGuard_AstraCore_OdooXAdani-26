import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import CalendarView from '../components/CalendarView';

export default function Calendar() {
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsData, equipmentData, teamsData] = await Promise.all([
        api.requests.getAll(),
        api.equipment.getAll(),
        api.teams.getAll()
      ]);
      setRequests(requestsData);
      setEquipment(equipmentData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <CalendarView 
      requests={requests} 
      equipment={equipment} 
      teams={teams} 
      onUpdate={loadData} 
    />
  );
}

