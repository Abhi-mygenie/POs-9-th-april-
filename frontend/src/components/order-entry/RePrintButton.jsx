import { Printer, Loader2 } from "lucide-react";
import { COLORS } from "../../constants";
import { useRestaurant } from "../../contexts";
import { useState, useEffect } from "react";
import { printOrder } from "../../api/services/orderService";
import { useToast } from "../../hooks/use-toast";

// Re-Print button only (for placed items) - Now wired to API
export const RePrintOnlyButton = ({ orderId }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const { toast } = useToast();

  const handlePrintKot = async () => {
    if (!orderId || isPrinting) return;
    
    setIsPrinting(true);
    try {
      await printOrder(orderId, 'kot');
      toast({ title: "KOT request sent", description: `Order #${orderId}` });
    } catch (error) {
      console.error('[RePrint] KOT print error:', error);
      toast({ title: "Failed to send KOT request", variant: "destructive" });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <button 
      className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isPrinting ? 'opacity-50' : ''}`}
      style={{ borderColor: COLORS.borderGray, color: COLORS.primaryGreen }}
      data-testid="reprint-kot-btn"
      onClick={handlePrintKot}
      disabled={isPrinting || !orderId}
      title={orderId ? "Re-Print KOT" : "Save order first to re-print"}
    >
      {isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
      <span className="text-sm font-medium">Re-Print</span>
    </button>
  );
};

// KOT/Bill checkboxes only (for new items to be placed)
export const KotBillCheckboxes = () => {
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

// Legacy component - keeps both together for backward compatibility
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
