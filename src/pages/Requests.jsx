import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import KanbanBoard from '../components/KanbanBoard';
import { authStore } from '../utils/auth';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const user = authStore.getUser();
    const role = user?.role?.toUpperCase();
    if (role !== 'TECHNICIAN') return;

    const id = setInterval(() => {
      loadData();
    }, 8000);

    return () => clearInterval(id);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = authStore.getUser();
      const role = user?.role?.toUpperCase();

      const requestsPromise = role === 'MANAGER'
        ? api.requests.getManager()
        : role === 'TECHNICIAN'
          ? api.requests.getTechnician()
          : api.requests.getAll();

      const techniciansPromise = role === 'MANAGER'
        ? api.requests.getTechnicians()
        : Promise.resolve([]);

      const [requestsData, equipmentData, teamsData] = await Promise.all([
        requestsPromise,
        api.equipment.getAll(),
        api.teams.getAll()
      ]);
      setRequests(requestsData);
      setEquipment(equipmentData);
      setTeams(teamsData);

      const techs = await techniciansPromise;
      setTechnicians(techs);
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
    <KanbanBoard 
      requests={requests} 
      equipment={equipment} 
      teams={teams} 
      technicians={technicians}
      onUpdate={loadData} 
    />
  );
}

