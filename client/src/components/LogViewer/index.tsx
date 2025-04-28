import React, { useState, useEffect } from 'react';
import logger, { LogEntry, LogLevel } from '../../utils/logger';

interface LogViewerProps {
  maxLogs?: number;
}

const LogViewer: React.FC<LogViewerProps> = ({ maxLogs = 50 }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'ALL'>('ALL');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  // Load logs from localStorage
  useEffect(() => {
    const loadLogs = () => {
      const allLogs = logger.getLogs();
      setLogs(allLogs.slice(-maxLogs));
    };

    loadLogs();
    
    // Set up interval to refresh logs
    const interval = setInterval(loadLogs, 1000);
    
    return () => clearInterval(interval);
  }, [maxLogs]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll) {
      const logContainer = document.getElementById('log-container');
      if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    }
  }, [logs, autoScroll]);

  // Filter logs based on search term and level
  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === '' || 
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.category.toLowerCase().includes(filter.toLowerCase());
    
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    
    return matchesFilter && matchesLevel;
  });

  // Get color for log level
  const getLevelColor = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG: return 'text-gray-500';
      case LogLevel.INFO: return 'text-blue-500';
      case LogLevel.WARN: return 'text-yellow-500';
      case LogLevel.ERROR: return 'text-red-500';
      default: return 'text-gray-700';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Clear logs
  const handleClearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  return (
    <div className="log-viewer border rounded p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Logs</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleClearLogs}
            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
          >
            Clear
          </button>
          <label className="flex items-center space-x-1 text-sm">
            <input 
              type="checkbox" 
              checked={autoScroll} 
              onChange={() => setAutoScroll(!autoScroll)}
              className="form-checkbox"
            />
            <span>Auto-scroll</span>
          </label>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          placeholder="Filter logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-grow p-1 border rounded text-sm"
        />
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as LogLevel | 'ALL')}
          className="p-1 border rounded text-sm"
        >
          <option value="ALL">All Levels</option>
          <option value={LogLevel.DEBUG}>Debug</option>
          <option value={LogLevel.INFO}>Info</option>
          <option value={LogLevel.WARN}>Warn</option>
          <option value={LogLevel.ERROR}>Error</option>
        </select>
      </div>
      
      <div 
        id="log-container"
        className="h-64 overflow-y-auto border rounded bg-white p-2 font-mono text-xs"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 italic">No logs to display</div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="mb-1">
              <span className="text-gray-500">{formatTimestamp(log.timestamp)}</span>
              <span className={`font-bold ${getLevelColor(log.level)}`}> [{log.level}]</span>
              <span className="text-purple-600"> [{log.category}]</span>
              <span className="ml-1">{log.message}</span>
              {log.data && (
                <pre className="mt-1 ml-4 text-xs bg-gray-100 p-1 rounded overflow-x-auto">
                  {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogViewer; 