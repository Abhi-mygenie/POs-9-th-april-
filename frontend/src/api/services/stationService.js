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
  enabled: true,  // Enabled by default
  stations: [],
  displayMode: 'stacked', // 'stacked' | 'accordion'
};

/**
 * Extract unique station names from products
 * @param {Array} products - Products array with station field
 * @returns {Array} - Unique station names
 */
export const extractUniqueStations = (products) => {
  if (!Array.isArray(products)) return [];
  
  const stationSet = new Set();
  products.forEach(product => {
    if (product.station) {
      stationSet.add(product.station);
    }
  });
  
  // Convert to array and sort
  const stations = Array.from(stationSet).sort();
  console.log('[StationService] Extracted unique stations:', stations);
  return stations;
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
 * Fetch aggregated station data (station-order-list API)
 * Returns categories with item counts per station
 * 
 * @param {string} stationName - Station name (e.g., 'KDS', 'BAR')
 * @returns {Promise<Object>} - { categories: [...], totalItems: number }
 */
export const fetchStationData = async (stationName = 'KDS') => {
  try {
    console.log(`[StationService] Fetching station data for ${stationName}...`);
    
    // Use station-order-list API which returns orders by station
    const formData = new FormData();
    formData.append('role_name', stationName);
    formData.append('def_order_status', '1'); // Preparing status
    
    const response = await api.post('/api/v1/vendoremployee/station-order-list', formData);
    
    console.log('[StationService] Raw API response:', response.data);
    
    const orders = response.data?.orders || [];
    
    // Aggregate items by category from orders
    const categoryMap = new Map();
    
    orders.forEach(order => {
      const foodItems = order.order_details_food || [];
      foodItems.forEach(item => {
        // Only count items for this station
        if (item.station === stationName || !item.station) {
          const foodName = item.food_details?.name || 'Unknown Item';
          const categoryName = item.food_details?.category_name || 'Other';
          const quantity = item.quantity || 1;
          
          if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, new Map());
          }
          
          const itemsMap = categoryMap.get(categoryName);
          const currentCount = itemsMap.get(foodName) || 0;
          itemsMap.set(foodName, currentCount + quantity);
        }
      });
    });
    
    // Convert to array format
    const categories = Array.from(categoryMap.entries()).map(([catName, itemsMap]) => {
      const items = Array.from(itemsMap.entries()).map(([name, count]) => ({ name, count }));
      const totalCount = items.reduce((sum, item) => sum + item.count, 0);
      return {
        name: catName,
        items,
        totalCount,
      };
    }).filter(cat => cat.totalCount > 0);
    
    const totalItems = categories.reduce((sum, cat) => sum + cat.totalCount, 0);
    
    console.log(`[StationService] Parsed ${categories.length} categories, ${totalItems} total items from ${orders.length} orders`);
    
    return {
      stationName,
      categories,
      totalItems,
      orderCount: orders.length,
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
  
  // Fetch each station data in parallel
  const results = await Promise.all(
    stations.map(station => fetchStationData(station))
  );
  
  const result = {};
  stations.forEach((station, idx) => {
    result[station] = results[idx];
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
