// Station Service - Kitchen Station API calls

import api from '../axios';

/**
 * Station View Storage Key
 */
export const STATION_VIEW_STORAGE_KEY = 'mygenie_station_view_config';

/**
 * Default station view config
 */
export const DEFAULT_STATION_VIEW_CONFIG = {
  enabled: false,
  stations: [],
  displayMode: 'stacked', // 'stacked' | 'accordion'
};

/**
 * Get station view config from localStorage
 * @returns {Object} Station view configuration
 */
export const getStationViewConfig = () => {
  try {
    const stored = localStorage.getItem(STATION_VIEW_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_STATION_VIEW_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('[StationService] Failed to parse station view config:', e);
  }
  return DEFAULT_STATION_VIEW_CONFIG;
};

/**
 * Fetch aggregated station data (employee-menu API)
 * Returns categories with item counts per station
 * 
 * @param {string} stationName - Station name (e.g., 'KDS', 'BAR')
 * @returns {Promise<Object>} - { categories: [...], totalItems: number }
 */
export const fetchStationData = async (stationName = 'KDS') => {
  try {
    console.log(`[StationService] Fetching station data for ${stationName}...`);
    const response = await api.get('/api/v1/vendoremployee/employee-menu');
    
    console.log('[StationService] Raw API response:', response.data);
    
    const data = response.data;
    
    // Parse the ordered_categories response
    // Format: { ordered_categories: [{ category_name: "...", food_counts: ["Item:count", ...] }] }
    const categories = (data.ordered_categories || []).map(cat => {
      const items = (cat.food_counts || []).map(itemStr => {
        // Parse "Item Name:count" format
        const parts = itemStr.split(':');
        const name = parts[0] || itemStr;
        const count = parseInt(parts[1], 10) || 0;
        return { name, count };
      });
      
      const totalCount = items.reduce((sum, item) => sum + item.count, 0);
      
      return {
        name: cat.category_name,
        items,
        totalCount,
      };
    }).filter(cat => cat.totalCount > 0); // Only show categories with items
    
    const totalItems = categories.reduce((sum, cat) => sum + cat.totalCount, 0);
    
    console.log(`[StationService] Parsed ${categories.length} categories, ${totalItems} total items`);
    
    return {
      stationName,
      categories,
      totalItems,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`[StationService] Failed to fetch station data for ${stationName}:`, error);
    console.error('[StationService] Error details:', error.response?.data || error.message);
    return {
      stationName,
      categories: [],
      totalItems: 0,
      error: error.message,
    };
  }
};

/**
 * Fetch data for multiple stations in parallel
 * 
 * @param {string[]} stations - Array of station names
 * @returns {Promise<Object>} - { [stationName]: stationData }
 */
export const fetchMultipleStationsData = async (stations = []) => {
  if (stations.length === 0) {
    return {};
  }
  
  // For now, employee-menu returns combined data, not per-station
  // So we fetch once and use for all stations
  const data = await fetchStationData(stations[0]);
  
  // Return same data for all stations (API doesn't filter by station yet)
  const result = {};
  stations.forEach(station => {
    result[station] = { ...data, stationName: station };
  });
  
  return result;
};

export default {
  getStationViewConfig,
  fetchStationData,
  fetchMultipleStationsData,
  STATION_VIEW_STORAGE_KEY,
  DEFAULT_STATION_VIEW_CONFIG,
};
