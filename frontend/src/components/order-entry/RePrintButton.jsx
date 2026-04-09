import { Printer } from "lucide-react";
import { COLORS } from "../../constants";
import { useRestaurant } from "../../contexts";
import { useState, useEffect } from "react";

const RePrintButton = () => {
  const { settings } = useRestaurant();
  
  // Initialize checkbox states from settings (auto values)
  const [kotChecked, setKotChecked] = useState(false);
  const [billChecked, setBillChecked] = useState(false);

  // Sync with settings when they load
  useEffect(() => {
    setKotChecked(settings?.autoKot ?? false);
    setBillChecked(settings?.autoBill ?? false);
  }, [settings?.autoKot, settings?.autoBill]);

  return (
    <div className="flex items-center gap-4">
      {/* Re-Print Button */}
      <button 
        className="flex items-center gap-2 px-4 py-2 rounded-full border"
        style={{ borderColor: COLORS.borderGray, color: COLORS.primaryGreen }}
        data-testid="reprint-kot-btn"
      >
        <Printer className="w-4 h-4" />
        <span className="text-sm font-medium">Re-Print</span>
      </button>

      {/* KOT Checkbox */}
      <label className="flex items-center gap-2 cursor-pointer" data-testid="auto-kot-checkbox">
        <input
          type="checkbox"
          checked={kotChecked}
          onChange={(e) => setKotChecked(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          style={{ accentColor: COLORS.primaryOrange }}
        />
        <span className="text-sm font-medium" style={{ color: COLORS.darkText }}>KOT</span>
      </label>

      {/* Bill Checkbox */}
      <label className="flex items-center gap-2 cursor-pointer" data-testid="auto-bill-checkbox">
        <input
          type="checkbox"
          checked={billChecked}
          onChange={(e) => setBillChecked(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
          style={{ accentColor: COLORS.primaryGreen }}
        />
        <span className="text-sm font-medium" style={{ color: COLORS.darkText }}>Bill</span>
      </label>
    </div>
  );
};

export default RePrintButton;
