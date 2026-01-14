import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useBrief = () => {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streak, setStreak] = useState(0);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [actionType, setActionType] = useState(null); // 'done' or 'skip'

  const fetchBrief = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTodaysBrief();
      setBrief(response.brief);
      // Initialize streak from user state if available
      if (response.userState && response.userState.streak !== undefined) {
        setStreak(response.userState.streak);
      }
      // Initialize action state from backend
      if (response.userState) {
        setActionCompleted(response.userState.actionCompleted || false);
        setActionType(response.userState.lastActionType || null);
      } else {
        setActionCompleted(false);
        setActionType(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markDone = async () => {
    if (actionType === 'done') return { streak }; // Only prevent if already done
    
    try {
      const response = await apiService.markBriefDone();
      setStreak(response.streak);
      setActionCompleted(true);
      setActionType('done');
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const skipBrief = async () => {
    if (actionType === 'done') return { streak }; // Only prevent if task is done
    
    try {
      const response = await apiService.skipBrief();
      setStreak(response.streak);
      // Don't set actionCompleted or actionType - allow unlimited skips
      // Fetch a new brief after skipping - faster response
      setTimeout(() => {
        fetchBrief();
      }, 200);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchBrief();
  }, []);

  return {
    brief,
    loading,
    error,
    streak,
    actionCompleted,
    actionType,
    markDone,
    skipBrief,
    refetch: fetchBrief,
  };
};
