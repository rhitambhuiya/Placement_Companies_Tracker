// Web Audio API chime sounds for user feedback

export const playCompletionChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    
    // Play a friendly victory chime: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  } catch (e) {
    console.log('Audio playback prevented or unsupported', e);
  }
};

export const playNotificationChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    
    // Friendly reminder ding
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.setValueAtTime(1320, now + 0.1); // E6
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    console.log('Audio notification error', e);
  }
};

export const formatDateTime = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const now = new Date();
  
  // Format in IST (Asia/Kolkata)
  const isToday = date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) === 
                  now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

  const timeStr = date.toLocaleTimeString('en-IN', { 
    timeZone: 'Asia/Kolkata', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
  
  const dateStr = date.toLocaleDateString('en-IN', { 
    timeZone: 'Asia/Kolkata', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  if (isToday) {
    return `Today @ ${timeStr} IST`;
  }
  return `${dateStr} @ ${timeStr} IST`;
};

export const getDueDateBadgeStatus = (isoString: string, isCompleted: boolean) => {
  if (isCompleted) return { label: 'Completed', colorClass: 'badge-completed' };
  
  const due = new Date(isoString);
  const now = new Date();

  if (due < now) {
    return { label: 'Overdue', colorClass: 'badge-overdue' };
  }

  const isToday = due.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) === 
                  now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
                  
  if (isToday) {
    return { label: 'Due Today', colorClass: 'badge-today' };
  }

  return { label: 'Upcoming', colorClass: 'badge-upcoming' };
};
