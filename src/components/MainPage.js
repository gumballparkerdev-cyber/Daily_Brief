import React, { useState, useEffect } from 'react'
import '../CSS/mainPage.css'
import { useBrief } from '../hooks/useBrief'

function MainPage({ onStreakUpdate }) {
  const { brief, loading, error, streak, actionType, markDone, skipBrief } = useBrief();
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Update parent component when streak changes
  useEffect(() => {
    if (onStreakUpdate) {
      onStreakUpdate(streak);
    }
  }, [streak, onStreakUpdate]);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'text-bg-success'; // green
      case 'hard': return 'text-bg-danger';  // red
      case 'normal': 
      default: return 'text-bg-warning';     // yellow
    }
  };

  const handleDone = async () => {
    if (actionType === 'done' || actionLoading) return;
    
    try {
      setActionLoading(true);
      await markDone();
      setSuccessMessage(`🎉 Task completed!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to mark done:', err);
      setSuccessMessage('❌ Failed to mark as done');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSkip = async () => {
    if (actionType === 'done' || actionLoading) return;
    
    try {
      setActionLoading(true);
      await skipBrief();
      setSuccessMessage(`⏭️ Task skipped, loading new task...`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to skip:', err);
      setSuccessMessage('❌ Failed to skip task');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='main'>
        <div className="card">
          <h2>Loading your task...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='main'>
        <div className="card">
          <span className="badge text-bg-danger">Error</span>
          <h2>Failed to load task: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className='main' style={{ 
      position: 'relative',
      padding: '10px',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>

{/* Fixed position success message - doesn't move UI */}
{successMessage && (
  <div style={{ 
    position: 'fixed',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    textAlign: 'center' ,
    padding: '10px 20px', 
    backgroundColor: successMessage.includes('❌') ? '#ff6b6b' : '#51cf66',
    color: 'white',
    borderRadius: '8px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    maxWidth: '90vw',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)'
  }}>
    {successMessage}
  </div>
)}

<div className="card" style={{ 
  marginBottom: '20px',
  padding: '20px',
  position: 'relative',
  minHeight: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
  <span className={`badge ${getDifficultyColor(brief?.difficulty)}`} style={{ 
    position: 'absolute',
    top: '15px',
    left: '15px',
    fontSize: '0.9rem',
    margin: '0'
  }}>
    {brief?.difficulty || 'normal'}
  </span>
  <h2 style={{ 
    textDecoration: actionType === 'done' ? 'line-through' : 'none',
    opacity: actionType === 'done' ? 0.6 : 1,
    transition: 'all 0.3s ease',
    textAlign: 'center',
    margin: '0',
    maxWidth: '85%',
    lineHeight: '1.4',
    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)'
  }}>
    {brief?.text || 'No task available'}
  </h2>
</div>


<div className="move-btn" style={{ 
  display: 'flex', 
  justifyContent: 'center',
  gap: '15px',
  flexWrap: 'wrap',
  padding: '0 10px'
}}>
<div className="btn-group" role="group" aria-label="Basic example" style={{
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%'
}}>
{/* this is my done button */}
 <button
      onClick={handleDone}
      disabled={actionLoading || actionType === 'done'}
      style={{
        WebkitBoxReflect:
          "below 0px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4))",
        minWidth: '120px',
        maxWidth: '200px',
        flex: '1 1 auto'
      }}
      className="px-10 py-3 bg-gradient-to-r from-green-600 to-green-400 rounded-full shadow-xl group-hover:shadow-2xl group-hover:shadow-green-700 shadow-green-700 uppercase font-serif tracking-widest relative overflow-hidden group text-transparent cursor-pointer z-10 after:absolute after:rounded-full after:bg-white after:h-[85%] after:w-[95%] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 hover:saturate-[1.15] active:saturate-[1.4] disabled:opacity-50"
    >
      Button
      <p className="absolute z-40 font-semibold bg-gradient-to-r from-green-500 to-green-300 bg-clip-text text-transparent top-1/2 left-1/2 -translate-x-1/2 group-hover:-translate-y-full h-full w-full transition-all duration-300 -translate-y-[30%] tracking-widest">
        {actionLoading ? 'LOADING...' : 'DONE'}
      </p>
<p
  className="
    absolute z-40 font-extrabold text-green-100
    top-1/2 left-1/2
    -translate-x-1/2 -translate-y-1/2
    opacity-0
    group-hover:opacity-100
    transition-opacity duration-500
    tracking-widest
  "
>
  yay
</p>
      <svg
        className="absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group-hover:animate-none animate-pulse group-hover:-translate-y-[45%] transition-all duration-300"
        viewBox="0 0 2400 800"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <linearGradient id="nature-grad" y2="100%" x2="50%" y1="0%" x1="50%">
            <stop offset="0%" stopOpacity="1" stopColor="hsl(145, 63%, 42%)" />
            <stop offset="100%" stopOpacity="1" stopColor="hsl(120, 40%, 85%)" />
          </linearGradient>
        </defs>
        <g transform="matrix(1,0,0,1,0,-91)" fill="url(#nature-grad)">
          {/* keep your <path> waves here unchanged */}
        </g>
      </svg>
      <svg
        className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] group-hover:-translate-y-[33%] group-hover:scale-95 transition-all duration-500 z-40 fill-green-500"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,288L9.2,250.7C18.5,213,37,139,55,133.3C73.8,128,92,192,111,224C129.2,256,148,256,166,256C184.6,256,203,256,222,250.7C240,245,258,235,277,213.3C295.4,192,314,160,332,170.7C350.8,181,369,235,388,229.3C406.2,224,425,160,443,122.7C461.5,85,480,75,498,74.7C516.9,75,535,85,554,101.3C572.3,117,591,139,609,170.7C627.7,203,646,245,665,256C683.1,267,702,245,720,245.3C738.5,245,757,267,775,266.7C793.8,267,812,245,831,234.7C849.2,224,868,224,886,218.7C904.6,213,923,203,942,170.7C960,139,978,85,997,53.3C1015.4,21,1034,11,1052,48C1070.8,85,1089,171,1108,197.3C1126.2,224,1145,192,1163,197.3C1181.5,203,1200,245,1218,224C1236.9,203,1255,117,1274,106.7C1292.3,96,1311,160,1329,170.7C1347.7,181,1366,139,1385,128C1403.1,117,1422,139,1431,149.3L1440,160L1440,320Z"
          fillOpacity="1"
        />
      </svg>
    </button>



{/* end of done button */}

{/* this is my danger button */}

<button 
  onClick={handleSkip} 
  disabled={actionLoading || actionType === 'done'} 
  className='skip'
  style={{ 
    opacity: (actionLoading || actionType === 'done') ? 0.3 : 1,
    cursor: actionType === 'done' ? 'not-allowed' : 'pointer',
    minWidth: '120px',
    maxWidth: '200px',
    flex: '1 1 auto',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    padding: '12px 20px'
  }}
>
  {actionLoading ? 'Loading...' : actionType === 'done' ? 'Completed' : 'Skip'}
</button>

{/* end of danger button */}
</div>
</div>




</div>
  )
}

export default MainPage;