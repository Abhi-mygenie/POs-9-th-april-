// Station Panel Component - Displays aggregated kitchen station items

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchStationData } from '../../api/services/stationService';
import { useStations, useMenu } from '../../contexts';

// Color scheme matching the app
const COLORS = {
  primaryOrange: '#F27329',
  primaryGreen: '#2E7D32',
  darkText: '#1a1a1a',
  grayText: '#666666',
  lightBg: '#f8f9fa',
  borderGray: '#e0e0e0',
  white: '#ffffff',
  headerBg: '#FFF3E0', // Light orange for header
};

// Category colors (cycle through these)
const CATEGORY_COLORS = [
  '#F27329', // Orange
  '#8B4513', // Brown
  '#DC3545', // Red
  '#28A745', // Green
  '#6C63FF', // Purple
  '#17A2B8', // Teal
  '#E91E63', // Pink
  '#FF9800', // Amber
];

/**
 * Get color for category based on index
 */
const getCategoryColor = (index) => {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
};

/**
 * Station Item Row - Single item with category and count (table row style)
 */
const StationItemRow = ({ itemName, categoryName, count, categoryColor }) => (
  <div 
    className="grid grid-cols-12 items-center py-2 px-3 border-b"
    style={{ borderColor: COLORS.borderGray }}
  >
    {/* Item Name - 5 cols */}
    <div className="col-span-5 text-sm" style={{ color: COLORS.darkText }}>
      {itemName}
    </div>
    
    {/* Dotted line - 3 cols */}
    <div className="col-span-3 border-b border-dotted mx-1" style={{ borderColor: COLORS.grayText }}></div>
    
    {/* Category - 2 cols */}
    <div className="col-span-2 text-xs font-medium truncate" style={{ color: categoryColor }}>
      {categoryName}
    </div>
    
    {/* Quantity - 2 cols */}
    <div className="col-span-2 text-right">
      <span 
        className="text-sm font-bold px-2 py-0.5 rounded"
        style={{ 
          backgroundColor: `${COLORS.primaryGreen}15`,
          color: COLORS.primaryGreen,
        }}
      >
        {count}
      </span>
    </div>
  </div>
);

/**
 * Category Header Row
 */
const CategoryHeaderRow = ({ categoryName, totalCount, categoryColor, isExpanded, onToggle, displayMode }) => (
  <div 
    className={`grid grid-cols-12 items-center py-2 px-3 ${displayMode === 'accordion' ? 'cursor-pointer' : ''}`}
    style={{ 
      backgroundColor: `${categoryColor}15`,
      borderLeft: `3px solid ${categoryColor}`,
    }}
    onClick={displayMode === 'accordion' ? onToggle : undefined}
  >
    {/* Toggle icon + Item label */}
    <div className="col-span-5 flex items-center gap-2">
      {displayMode === 'accordion' && (
        isExpanded 
          ? <ChevronDown className="w-4 h-4" style={{ color: categoryColor }} />
          : <ChevronRight className="w-4 h-4" style={{ color: COLORS.grayText }} />
      )}
      <span className="text-xs font-semibold uppercase" style={{ color: COLORS.grayText }}>Item</span>
    </div>
    
    {/* Spacer */}
    <div className="col-span-3"></div>
    
    {/* Category Name */}
    <div className="col-span-2 text-sm font-bold truncate" style={{ color: categoryColor }}>
      {categoryName}
    </div>
    
    {/* Quantity */}
    <div className="col-span-2 text-right">
      <span 
        className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ 
          backgroundColor: categoryColor,
          color: COLORS.white,
        }}
      >
        {totalCount}
      </span>
    </div>
  </div>
);

/**
 * Station Category - Category header + items
 */
const StationCategory = ({ category, categoryIndex, isExpanded, onToggle, displayMode }) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const categoryColor = getCategoryColor(categoryIndex);
  
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
    <div className="mb-1">
      {/* Category Header */}
      <CategoryHeaderRow
        categoryName={category.name}
        totalCount={category.totalCount}
        categoryColor={categoryColor}
        isExpanded={expanded}
        onToggle={handleToggle}
        displayMode={displayMode}
      />
      
      {/* Category Items */}
      {(displayMode === 'stacked' || expanded) && (
        <div>
          {category.items.map((item, idx) => (
            <StationItemRow 
              key={idx} 
              itemName={item.name} 
              categoryName={category.name}
              count={item.count}
              categoryColor={categoryColor}
            />
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
            categoryIndex={idx}
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
 * Reads data from StationContext (loaded at app start)
 */
const StationPanel = ({ className = '' }) => {
  const { 
    enabledStations, 
    stationData, 
    stationViewEnabled, 
    displayMode,
    isLoading,
    setAllStationData 
  } = useStations();
  
  // Get categories from MenuContext for lookup
  const { categories } = useMenu();

  // Station icons mapping
  const stationIcons = {
    KDS: '🍳',
    BAR: '🍺',
    GRILL: '🔥',
    DEFAULT: '📋',
  };

  // Build categories map for lookup
  const categoriesMap = React.useMemo(() => {
    const map = {};
    if (categories && Array.isArray(categories)) {
      categories.forEach(cat => {
        if (cat.categoryId) {
          map[cat.categoryId] = cat.name;
          map[String(cat.categoryId)] = cat.name;
        }
      });
    }
    return map;
  }, [categories]);

  // Refresh handler - re-fetch station data
  const handleRefresh = useCallback(async () => {
    if (!enabledStations?.length) return;
    
    try {
      const stationDataPromises = enabledStations.map(station => 
        fetchStationData(station, categoriesMap)
      );
      const results = await Promise.all(stationDataPromises);
      
      const newData = {};
      enabledStations.forEach((station, idx) => {
        newData[station] = results[idx];
      });
      
      setAllStationData(newData);
    } catch (error) {
      console.error('[StationPanel] Error refreshing data:', error);
    }
  }, [enabledStations, setAllStationData, categoriesMap]);

  // Don't render if disabled or no stations
  if (!stationViewEnabled || !enabledStations?.length) {
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
      {enabledStations.map((stationName) => (
        <SingleStationPanel
          key={stationName}
          stationName={stationName}
          stationIcon={stationIcons[stationName] || stationIcons.DEFAULT}
          data={stationData[stationName]}
          loading={isLoading}
          error={null}
          displayMode={displayMode}
          onRefresh={handleRefresh}
        />
      ))}
    </div>
  );
};

export default StationPanel;
