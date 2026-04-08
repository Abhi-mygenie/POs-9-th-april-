import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, RotateCcw, Save, Eye, EyeOff } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import { COLORS } from "../constants";
import { useToast } from "../hooks/use-toast";
import { useStations } from "../contexts";

// LocalStorage key for enabled statuses
const STORAGE_KEY = 'mygenie_enabled_statuses';

// LocalStorage key for station view config
const STATION_VIEW_STORAGE_KEY = 'mygenie_station_view_config';

// LocalStorage key for channel visibility
const CHANNEL_VISIBILITY_STORAGE_KEY = 'mygenie_channel_visibility';

// Station icons mapping
const STATION_ICONS = {
  KDS: '🍳',
  BAR: '🍺',
  GRILL: '🔥',
  DEFAULT: '📋',
};

// Default station view config
const DEFAULT_STATION_VIEW_CONFIG = {
  enabled: true,  // Enabled by default
  stations: [],
  displayMode: 'stacked', // 'stacked' | 'accordion'
};

// Available channels
const ALL_CHANNELS = [
  { id: 'dine_in', label: 'Dine-In', description: 'In-restaurant dining orders', icon: '🍽️' },
  { id: 'takeaway', label: 'TakeAway', description: 'Takeaway/pickup orders', icon: '🥡' },
  { id: 'delivery', label: 'Delivery', description: 'Delivery orders', icon: '🚗' },
  { id: 'room', label: 'Room', description: 'Room service orders', icon: '🛏️' },
];

// Default channel visibility config - all enabled
const DEFAULT_CHANNEL_CONFIG = {
  enabled: true,
  channels: ALL_CHANNELS.map(c => c.id),  // All channels enabled by default
};

// All 9 status definitions (same as Header.jsx)
const ALL_STATUSES = [
  { id: "pending", fOrderStatus: 7, label: "YTC", description: "Yet to Confirm orders" },
  { id: "preparing", fOrderStatus: 1, label: "Preparing", description: "Orders being prepared" },
  { id: "ready", fOrderStatus: 2, label: "Ready", description: "Orders ready for pickup/serve" },
  { id: "running", fOrderStatus: 8, label: "Running", description: "Active running orders" },
  { id: "served", fOrderStatus: 5, label: "Served", description: "Orders already served" },
  { id: "pendingPayment", fOrderStatus: 9, label: "Pending Pay", description: "Awaiting payment" },
  { id: "paid", fOrderStatus: 6, label: "Paid", description: "Paid/completed orders" },
  { id: "cancelled", fOrderStatus: 3, label: "Cancelled", description: "Cancelled orders" },
  { id: "reserved", fOrderStatus: 10, label: "Reserved", description: "Reserved tables/orders" },
];

// Default: Only status 7, 1, 2, 5 enabled (YTC, Preparing, Ready, Served)
const DEFAULT_ENABLED = ["pending", "preparing", "ready", "served"];  // Status 7, 1, 2, 5

/**
 * StatusConfigPage - Configure which statuses are visible on the dashboard
 * Follows same pattern as Audit Report page
 */
const StatusConfigPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSilentMode, setIsSilentMode] = useState(false);
  
  // Get available stations from context (loaded from products)
  const { availableStations, saveConfig: saveStationConfig } = useStations();
  
  // Build station list with icons
  const AVAILABLE_STATIONS = availableStations.map(station => ({
    id: station,
    label: station,
    description: `${station} Station`,
    icon: STATION_ICONS[station] || STATION_ICONS.DEFAULT,
  }));
  
  // Enabled statuses state
  const [enabledStatuses, setEnabledStatuses] = useState(DEFAULT_ENABLED);
  const [hasChanges, setHasChanges] = useState(false);

  // Station View config state
  const [stationViewConfig, setStationViewConfig] = useState(DEFAULT_STATION_VIEW_CONFIG);

  // Load from localStorage on mount
  useEffect(() => {
    // Load status config
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEnabledStatuses(parsed);
        }
      } catch (e) {
        console.error('Failed to parse stored statuses:', e);
      }
    }

    // Load station view config
    const storedStationConfig = localStorage.getItem(STATION_VIEW_STORAGE_KEY);
    if (storedStationConfig) {
      try {
        const parsed = JSON.parse(storedStationConfig);
        setStationViewConfig({ ...DEFAULT_STATION_VIEW_CONFIG, ...parsed });
      } catch (e) {
        console.error('Failed to parse stored station view config:', e);
      }
    }
  }, []);

  // Toggle a status
  const toggleStatus = (statusId) => {
    setEnabledStatuses(prev => {
      const isEnabled = prev.includes(statusId);
      // Prevent disabling all statuses (at least 1 must be enabled)
      if (isEnabled && prev.length === 1) {
        toast({
          title: "Cannot disable",
          description: "At least one status must be enabled.",
          variant: "destructive",
        });
        return prev;
      }
      const next = isEnabled 
        ? prev.filter(id => id !== statusId)
        : [...prev, statusId];
      setHasChanges(true);
      return next;
    });
  };

  // Enable all
  const enableAll = () => {
    setEnabledStatuses(DEFAULT_ENABLED);
    setHasChanges(true);
  };

  // Disable all except one (first one)
  const disableAll = () => {
    setEnabledStatuses([DEFAULT_ENABLED[0]]);
    setHasChanges(true);
  };

  // Reset to default
  const resetToDefault = () => {
    setEnabledStatuses(DEFAULT_ENABLED);
    setStationViewConfig(DEFAULT_STATION_VIEW_CONFIG);
    setHasChanges(true);
  };

  // Toggle station view enabled
  const toggleStationViewEnabled = () => {
    setStationViewConfig(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }));
    setHasChanges(true);
  };

  // Toggle a station
  const toggleStation = (stationId) => {
    setStationViewConfig(prev => {
      const isSelected = prev.stations.includes(stationId);
      return {
        ...prev,
        stations: isSelected
          ? prev.stations.filter(id => id !== stationId)
          : [...prev.stations, stationId],
      };
    });
    setHasChanges(true);
  };

  // Change display mode
  const setDisplayMode = (mode) => {
    setStationViewConfig(prev => ({
      ...prev,
      displayMode: mode,
    }));
    setHasChanges(true);
  };

  // Save to localStorage
  const saveConfiguration = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledStatuses));
    localStorage.setItem(STATION_VIEW_STORAGE_KEY, JSON.stringify(stationViewConfig));
    setHasChanges(false);
    toast({
      title: "Configuration saved",
      description: `${enabledStatuses.length} status(es) enabled. ${stationViewConfig.enabled ? `Station View ON (${stationViewConfig.stations.length} stations)` : 'Station View OFF'}`,
    });
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: COLORS.background }}>
      {/* Sidebar */}
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        isSilentMode={isSilentMode}
        setIsSilentMode={setIsSilentMode}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="px-6 py-4 flex items-center justify-between"
          style={{ 
            backgroundColor: COLORS.lightBg, 
            borderBottom: `1px solid ${COLORS.borderGray}` 
          }}
        >
          <div className="flex items-center gap-4">
            <button
              data-testid="back-btn"
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: COLORS.darkText }} />
            </button>
            <h1 className="text-xl font-semibold" style={{ color: COLORS.darkText }}>
              Status Configuration
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Reset Button */}
            <button
              data-testid="reset-btn"
              onClick={resetToDefault}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
              style={{ borderColor: COLORS.borderGray, color: COLORS.grayText }}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset to Default</span>
            </button>

            {/* Save Button */}
            <button
              data-testid="save-btn"
              onClick={saveConfiguration}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: hasChanges ? COLORS.primaryOrange : COLORS.borderGray, 
                color: 'white' 
              }}
            >
              <Save className="w-4 h-4" />
              <span className="text-sm">Save Configuration</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Info Card */}
            <div 
              className="p-4 rounded-lg mb-6"
              style={{ backgroundColor: `${COLORS.primaryOrange}10`, border: `1px solid ${COLORS.primaryOrange}30` }}
            >
              <p className="text-sm" style={{ color: COLORS.darkText }}>
                <strong>Note:</strong> Select which order statuses should be visible on the dashboard. 
                In Channel View, these will appear as filter pills. In Status View, these will appear as columns.
                <br />
                <span style={{ color: COLORS.grayText }}>
                  This configuration is stored locally and will persist until you change it.
                  In future, this will be controlled by user role permissions.
                </span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 mb-6">
              <button
                data-testid="enable-all-btn"
                onClick={enableAll}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors hover:opacity-80"
                style={{ backgroundColor: COLORS.primaryGreen, color: 'white' }}
              >
                <Eye className="w-4 h-4" />
                Enable All
              </button>
              <button
                data-testid="disable-all-btn"
                onClick={disableAll}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors hover:opacity-80"
                style={{ backgroundColor: COLORS.grayText, color: 'white' }}
              >
                <EyeOff className="w-4 h-4" />
                Disable All
              </button>
              <span className="text-sm ml-auto" style={{ color: COLORS.grayText }}>
                {enabledStatuses.length} of {ALL_STATUSES.length} enabled
              </span>
            </div>

            {/* Status Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_STATUSES.map((status) => {
                const isEnabled = enabledStatuses.includes(status.id);
                return (
                  <div
                    key={status.id}
                    data-testid={`status-card-${status.id}`}
                    onClick={() => toggleStatus(status.id)}
                    className="p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md"
                    style={{
                      backgroundColor: isEnabled ? `${COLORS.primaryOrange}05` : COLORS.lightBg,
                      borderColor: isEnabled ? COLORS.primaryOrange : COLORS.borderGray,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="font-semibold"
                            style={{ color: isEnabled ? COLORS.primaryOrange : COLORS.darkText }}
                          >
                            {status.label}
                          </span>
                          <span 
                            className="text-xs px-2 py-0.5 rounded"
                            style={{ 
                              backgroundColor: COLORS.borderGray,
                              color: COLORS.grayText,
                            }}
                          >
                            Status {status.fOrderStatus}
                          </span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: COLORS.grayText }}>
                          {status.description}
                        </p>
                      </div>
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: isEnabled ? COLORS.primaryOrange : COLORS.borderGray,
                        }}
                      >
                        {isEnabled && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ============== STATION VIEW CONFIGURATION ============== */}
            <div className="mt-10 pt-8" style={{ borderTop: `2px solid ${COLORS.borderGray}` }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: COLORS.darkText }}>
                    Station View
                  </h2>
                  <p className="text-sm mt-1" style={{ color: COLORS.grayText }}>
                    Display aggregated kitchen station items on dashboard
                  </p>
                </div>
                
                {/* Enable/Disable Toggle */}
                <button
                  data-testid="station-view-toggle"
                  onClick={toggleStationViewEnabled}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: stationViewConfig.enabled ? COLORS.primaryGreen : COLORS.borderGray,
                    color: 'white',
                  }}
                >
                  {stationViewConfig.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {stationViewConfig.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </button>
              </div>

              {/* Station View Options (only show when enabled) */}
              {stationViewConfig.enabled && (
                <>
                  {/* Info Card */}
                  <div 
                    className="p-4 rounded-lg mb-6"
                    style={{ backgroundColor: `${COLORS.primaryGreen}10`, border: `1px solid ${COLORS.primaryGreen}30` }}
                  >
                    <p className="text-sm" style={{ color: COLORS.darkText }}>
                      <strong>Station View</strong> shows aggregated item counts from kitchen stations before the order columns on your dashboard.
                      Select which stations to display and how they should appear.
                    </p>
                  </div>

                  {/* Display Mode Selection */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block" style={{ color: COLORS.darkText }}>
                      Display Mode
                    </label>
                    <div className="flex gap-4">
                      <label 
                        className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all flex-1"
                        style={{
                          borderColor: stationViewConfig.displayMode === 'stacked' ? COLORS.primaryOrange : COLORS.borderGray,
                          backgroundColor: stationViewConfig.displayMode === 'stacked' ? `${COLORS.primaryOrange}05` : COLORS.lightBg,
                        }}
                      >
                        <input
                          type="radio"
                          name="displayMode"
                          value="stacked"
                          checked={stationViewConfig.displayMode === 'stacked'}
                          onChange={() => setDisplayMode('stacked')}
                          className="sr-only"
                        />
                        <div 
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: stationViewConfig.displayMode === 'stacked' ? COLORS.primaryOrange : COLORS.borderGray }}
                        >
                          {stationViewConfig.displayMode === 'stacked' && (
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.primaryOrange }} />
                          )}
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: COLORS.darkText }}>Stacked</span>
                          <p className="text-xs mt-0.5" style={{ color: COLORS.grayText }}>
                            All stations visible, scroll to see more
                          </p>
                        </div>
                      </label>

                      <label 
                        className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all flex-1"
                        style={{
                          borderColor: stationViewConfig.displayMode === 'accordion' ? COLORS.primaryOrange : COLORS.borderGray,
                          backgroundColor: stationViewConfig.displayMode === 'accordion' ? `${COLORS.primaryOrange}05` : COLORS.lightBg,
                        }}
                      >
                        <input
                          type="radio"
                          name="displayMode"
                          value="accordion"
                          checked={stationViewConfig.displayMode === 'accordion'}
                          onChange={() => setDisplayMode('accordion')}
                          className="sr-only"
                        />
                        <div 
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: stationViewConfig.displayMode === 'accordion' ? COLORS.primaryOrange : COLORS.borderGray }}
                        >
                          {stationViewConfig.displayMode === 'accordion' && (
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.primaryOrange }} />
                          )}
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: COLORS.darkText }}>Accordion</span>
                          <p className="text-xs mt-0.5" style={{ color: COLORS.grayText }}>
                            Click to expand/collapse each station
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Station Selection */}
                  <div>
                    <label className="text-sm font-medium mb-3 block" style={{ color: COLORS.darkText }}>
                      Select Stations ({stationViewConfig.stations.length} selected)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {AVAILABLE_STATIONS.map((station) => {
                        const isSelected = stationViewConfig.stations.includes(station.id);
                        return (
                          <div
                            key={station.id}
                            data-testid={`station-card-${station.id}`}
                            onClick={() => toggleStation(station.id)}
                            className="p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md"
                            style={{
                              backgroundColor: isSelected ? `${COLORS.primaryGreen}05` : COLORS.lightBg,
                              borderColor: isSelected ? COLORS.primaryGreen : COLORS.borderGray,
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{station.icon}</span>
                                  <span 
                                    className="font-semibold"
                                    style={{ color: isSelected ? COLORS.primaryGreen : COLORS.darkText }}
                                  >
                                    {station.label}
                                  </span>
                                </div>
                                <p className="text-sm mt-1" style={{ color: COLORS.grayText }}>
                                  {station.description}
                                </p>
                              </div>
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ 
                                  backgroundColor: isSelected ? COLORS.primaryGreen : COLORS.borderGray,
                                }}
                              >
                                {isSelected && <Check className="w-4 h-4 text-white" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Changes Indicator */}
            {hasChanges && (
              <div 
                className="fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
                style={{ backgroundColor: COLORS.darkText }}
              >
                <span className="text-sm text-white">You have unsaved changes</span>
                <button
                  onClick={saveConfiguration}
                  className="px-3 py-1.5 rounded-md text-sm font-medium"
                  style={{ backgroundColor: COLORS.primaryOrange, color: 'white' }}
                >
                  Save Now
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StatusConfigPage;
