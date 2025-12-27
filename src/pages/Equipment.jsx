import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import EquipmentManager from '../components/EquipmentManager';

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [equipmentData, teamsData] = await Promise.all([
        api.equipment.getAll(),
        api.teams.getAll()
      ]);
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
    <EquipmentManager 
      equipment={equipment} 
      teams={teams} 
      onUpdate={loadData} 
    />
  );
}

