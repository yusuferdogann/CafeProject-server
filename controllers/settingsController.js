import { mergeCafeSettings } from "../utils/settingsMerge.js";
import { isDbReady } from "../utils/dbState.js";
import {
  findBusinessById,
  findBusinessBySlug,
  updateBusinessSettings,
} from "../repositories/businessRepository.js";

export async function getAdminSettings(req, res) {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Veritabani baglantisi yok" });
  }

  const business = await findBusinessById(req.user.businessId);
  if (!business) {
    return res.status(404).json({ message: "Isletme bulunamadi" });
  }

  res.json({
    settings: mergeCafeSettings(business.settings),
    business: {
      id: business.id,
      name: business.name,
      slug: business.slug,
    },
  });
}

export async function updateAdminSettings(req, res) {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Veritabani baglantisi yok" });
  }

  const { settings } = req.body || {};
  if (!settings || typeof settings !== "object") {
    return res.status(400).json({ message: "settings objesi gerekli" });
  }

  const business = await updateBusinessSettings(
    req.user.businessId,
    mergeCafeSettings(settings)
  );

  if (!business) {
    return res.status(404).json({ message: "Isletme bulunamadi" });
  }

  res.json({
    message: "Ayarlar kaydedildi",
    settings: mergeCafeSettings(business.settings),
  });
}

export async function getPublicSettings(req, res) {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Veritabani baglantisi yok" });
  }

  const slug = req.params.slug?.toLowerCase?.()?.trim();
  if (!slug) {
    return res.status(400).json({ message: "Gecersiz slug" });
  }

  const business = await findBusinessBySlug(slug);
  if (!business) {
    return res.status(404).json({ message: "Isletme bulunamadi" });
  }

  res.json({
    settings: mergeCafeSettings(business.settings),
    business: {
      name: business.name,
      slug: business.slug,
    },
  });
}
