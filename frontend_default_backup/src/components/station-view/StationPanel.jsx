// Station Panel Component - Displays aggregated kitchen station items

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchStationData, getStationViewConfig } from '../../api/services/stationService';

// Color scheme matching the app
const COLORS = {
  primaryOrange: '#F27329',
  primaryGreen: '#2E7D32',
  darkText: '#1a1a1a',
  grayText: '#666666',
  lightBg: '#f8f9fa',
  borderGray: '#e0e0e0',
  white: '#ffffff',
};

/**
 * Station Item Row - Single item with count
 */
const StationItem = ({ name, count }) => (
  <div 
    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded"
    style={{ borderBottom: `1px solid ${COLORS.borderGray}` }}
  >
    <span className="text-sm truncate flex-1" style={{ color: COLORS.darkText }}>
      {name}
    </span>
    <span 
      className="text-sm font-semibold ml-2 px-2 py-0.5 rounded-full"
      style={{ 
        backgroundColor: `${COLORS.primaryOrange}15`,
        color: COLORS.primaryOrange,
      }}
    >
      {count}
    </span>
  </div>
);

/**
 * Station Category - Collapsible category with items
 */
const StationCategory = ({ category, isExpanded, onToggle, displayMode }) => {
  const [expanded, setExpanded] = useState(isExpanded);
  
  useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  const handleToggle = () => {
    if (displayMode === 'accordion') {
      setExpanded(!expanded);
      onToggle?.();
    }
  };

  return (
    <div className="mb-2">
      {/* Category Header */}
      <div
        onClick={handleToggle}
        className={`flex items-center justify-between py-2 px-3 rounded-lg ${
          displayMode === 'accordion' ? 'cursor-pointer hover:bg-gray-100' : ''
        }`}
        style={{ 
          backgroundColor: expanded ? `${COLORS.primaryGreen}10` : COLORS.lightBg,
        }}
      >
        <div className="flex items-center gap-2">
          {displayMode === 'accordion' && (
            expanded 
              ? <ChevronDown className="w-4 h-4" style={{ color: COLORS.primaryGreen }} />
              : <ChevronRight className="w-4 h-4" style={{ color: COLORS.grayText }} />
          )}
          <span 
            className="font-medium text-sm"
            style={{ color: expanded ? COLORS.primaryGreen : COLORS.darkText }}
          >
            {category.name}
          </span>
        </div>
        <span 
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ 
            backgroundColor: COLORS.primaryGreen,
            color: COLORS.white,
          }}
        >
          {category.totalCount}
        </span>
      </div>
      
      {/* Category Items */}
      {(displayMode === 'stacked' || expanded) && (
        <div className="ml-2 mt-1">
          {category.items.map((item, idx) => (
            <StationItem key={idx} name={item.name} count={item.count} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Single Station Panel
 */
const SingleStationPanel = ({ stationName, stationIcon, data, loading, error, displayMode, onRefresh }) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // In stacked mode, all categories are expanded by default
  useEffect(() => {
    if (displayMode === 'stacked' && data?.categories) {
      setExpandedCategories(new Set(data.categories.map((_, i) => i)));
    } else if (displayMode === 'accordion') {
      // In accordion mode, expand first category by default
      setExpandedCategories(new Set([0]));
    }
  }, [displayMode, data?.categories]);

  const toggleCategory = (idx) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ 
        backgroundColor: COLORS.white,
        borderRight: `1px solid ${COLORS.borderGray}`,
      }}
    >
      {/* Station Header */}
      <div 
        className="flex items-center justify-between p-3 sticky top-0 z-10"
        style={{ 
          backgroundColor: COLORS.white,
          borderBottom: `2px solid ${COLORS.primaryOrange}`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{stationIcon}</span>
          <span className="font-bold text-lg" style={{ color: COLORS.darkText }}>
            {stationName}
          </span>
          {data?.totalItems > 0 && (
            <span 
              className="text-sm font-bold px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: COLORS.primaryOrange,
                color: COLORS.white,
              }}
            >
              {data.totalItems}
            </span>
          )}
        </div>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          <RefreshCw 
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
            style={{ color: COLORS.grayText }}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading && !data?.categories?.length && (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="w-6 h-6 animate-spin" style={{ color: COLORS.primaryOrange }} />
          </div>
        )}

        {error && (
          <div 
            className="flex items-center gap-2 p-3 rounded-lg"
            style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Failed to load station data</span>
          </div>
        )}

        {!loading && !error && data?.categories?.length === 0 && (
          <div 
            className="flex flex-col items-center justify-center h-32 text-center"
            style={{ color: COLORS.grayText }}
          >
            <span className="text-3xl mb-2">✓</span>
            <span className="text-sm">No pending items</span>
          </div>
        )}

        {data?.categories?.map((category, idx) => (
          <StationCategory
            key={idx}
            category={category}
            isExpanded={expandedCategories.has(idx)}
            onToggle={() => toggleCategory(idx)}
            displayMode={displayMode}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Station Panel Container - Main component
 * Reads config from localStorage and renders station panels
 */
const StationPanel = ({ className = '' }) => {
  const [config, setConfig] = useState(null);
  const [stationData, setStationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Station icons mapping
  const stationIcons = {
    KDS: '🍳',
    BAR: '🍺',
    GRILL: '🔥',
    DEFAULT: '📋',
  };

  // Load config from localStorage
  useEffect(() => {
    const loadConfig = () => {
      const storedConfig = getStationViewConfig();
      setConfig(storedConfig);
    };
    
    loadConfig();
    
    // Listen for storage changes (in case settings change in another tab)
    window.addEventListener('storage', loadConfig);
    return () => window.removeEventListener('storage', loadConfig);
  }, []);

  // Fetch station data
  const fetchData = useCallback(async () => {
    if (!config?.enabled || !config?.stations?.length) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch data for first station (API returns combined data)
      const data = await fetchStationData(config.stations[0]);
      
      // Apply same data to all selected stations
      const newStationData = {};
      config.stations.forEach(station => {
        newStationData[station] = { ...data, stationName: station };
      });
      
      setStationData(newStationData);
    } catch (err) {
      console.error('[StationPanel] Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [config?.enabled, config?.stations]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh handler
  const handleRefresh = () => {
    fetchData();
  };

  // Don't render if disabled or no stations selected
  if (!config?.enabled || !config?.stations?.length) {
    return null;
  }

  return (
    <div 
      className={`flex flex-col h-full ${className}`}
      style={{ 
        width: '280px',
        minWidth: '280px',
        maxWidth: '320px',
      }}
      data-testid="station-panel"
    >
      {config.stations.map((stationName) => (
        <SingleStationPanel
          key={stationName}
          stationName={stationName}
          stationIcon={stationIcons[stationName] || stationIcons.DEFAULT}
          data={stationData[stationName]}
          loading={loading}
          error={error}
          displayMode={config.displayMode}
          onRefresh={handleRefresh}
        />
      ))}
    </div>
  );
};

export default StationPanel;
