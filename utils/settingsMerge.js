import { defaultCafeSettings } from "../data/defaultCafeSettings.js";

export function mergeCafeSettings(stored) {
  const parsed = stored && typeof stored === "object" ? stored : {};
  return {
    ...defaultCafeSettings,
    ...parsed,
    brand: { ...defaultCafeSettings.brand, ...parsed.brand },
    theme: { ...defaultCafeSettings.theme, ...parsed.theme },
    social: { ...defaultCafeSettings.social, ...parsed.social },
    menuCategories: {
      ...defaultCafeSettings.menuCategories,
      ...parsed.menuCategories,
    },
    tableZones: parsed.tableZones || defaultCafeSettings.tableZones,
    tables: parsed.tables || defaultCafeSettings.tables,
    geofence: { ...defaultCafeSettings.geofence, ...parsed.geofence },
    nfc: { ...defaultCafeSettings.nfc, ...parsed.nfc },
  };
}
