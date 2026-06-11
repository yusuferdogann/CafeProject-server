import { TRIAL_DAYS } from "../config/plans.js";
import { defaultCafeSettings } from "../data/defaultCafeSettings.js";
import { hashPassword } from "../utils/auth.js";
import { isDbReady } from "./dbState.js";
import {
  createBusiness,
  findBusinessBySlug,
  patchBusiness,
} from "../repositories/businessRepository.js";
import {
  createUser,
  findUserByEmailInBusiness,
} from "../repositories/userRepository.js";

const DEV_BUSINESS = {
  id: "dev-business",
  name: "Cafe Project",
  slug: "cafe-project",
};

const TENANT_SEEDS = [
  {
    name: "Rahim",
    email: "rahim@gmail.com",
    slug: "rahim-cafe",
    businessName: "Rahim Cafe",
  },
  {
    name: "Yusuf",
    email: "yusuf@gmail.com",
    slug: "yusuf-cafe",
    businessName: "Yusuf Cafe",
  },
  {
    name: "Mustafa",
    email: "mustafa@gmail.com",
    slug: "mustafa-cafe",
    businessName: "Mustafa Cafe",
  },
];

const DEV_USERS = TENANT_SEEDS.map((tenant) => ({
  id: `dev-${tenant.slug}`,
  businessId: `dev-${tenant.slug}`,
  name: tenant.name,
  email: tenant.email,
  password: "1234",
  role: "admin",
  active: true,
  businessName: tenant.businessName,
  businessSlug: tenant.slug,
}));

const devUsers = DEV_USERS.map((user) => ({ ...user }));

function settingsForBusiness(businessName) {
  return {
    ...defaultCafeSettings,
    brand: {
      ...defaultCafeSettings.brand,
      title: businessName,
      subtitle: `${businessName} — dijital menu ve masa yonetimi`,
    },
  };
}

function sanitizeDevUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function createTrialSubscription() {
  const now = new Date();
  const end = new Date();
  end.setDate(end.getDate() + TRIAL_DAYS);
  return {
    plan: "trial",
    status: "active",
    platform: "trial",
    currentPeriodStart: now,
    currentPeriodEnd: end,
    trialEndsAt: end,
    cancelAtPeriodEnd: false,
  };
}

async function seedTenant(tenant) {
  let business = await findBusinessBySlug(tenant.slug);
  if (!business) {
    business = await createBusiness({
      name: tenant.businessName,
      slug: tenant.slug,
      settings: settingsForBusiness(tenant.businessName),
      subscription: createTrialSubscription(),
    });
    console.log(`Seed: isletme olusturuldu — ${tenant.businessName}`);
  } else {
    const patch = {};
    if (!business.settings) patch.settings = settingsForBusiness(tenant.businessName);
    if (!business.subscription?.currentPeriodEnd) {
      patch.subscription = createTrialSubscription();
    }
    if (Object.keys(patch).length) {
      business = await patchBusiness(business.id, patch);
      console.log(`Seed: ${tenant.businessName} varsayilanlari guncellendi`);
    }
  }

  const exists = await findUserByEmailInBusiness(business.id, tenant.email);
  if (exists) return;

  await createUser({
    businessId: business.id,
    name: tenant.name,
    email: tenant.email,
    passwordHash: await hashPassword("1234"),
    role: "admin",
  });
  console.log(`Seed: ${tenant.email} olusturuldu`);
}

export async function seedDefaults() {
  if (!isDbReady()) return;

  for (const tenant of TENANT_SEEDS) {
    await seedTenant(tenant);
  }
}

export function findDevUser(email, password) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = devUsers.find(
    (entry) => entry.email === normalizedEmail && entry.active !== false
  );
  if (!user || user.password !== password) return null;
  return sanitizeDevUser(user);
}

export function listDevEmployees(businessId) {
  return devUsers
    .filter((user) => user.role === "garson" && user.businessId === businessId)
    .map(sanitizeDevUser);
}

export function createDevEmployee({ businessId, name, email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  if (devUsers.some((user) => user.email === normalizedEmail)) {
    return null;
  }

  const employee = {
    id: `dev-${Date.now()}`,
    businessId,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "garson",
    active: true,
  };

  devUsers.push(employee);
  return sanitizeDevUser(employee);
}

export function updateDevEmployee(id, { businessId, name, email, password, active }) {
  const index = devUsers.findIndex(
    (user) => user.id === id && user.role === "garson" && user.businessId === businessId
  );
  if (index === -1) return null;

  if (email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (devUsers.some((user, i) => i !== index && user.email === normalizedEmail)) {
      return { conflict: true };
    }
    devUsers[index].email = normalizedEmail;
  }

  if (name) devUsers[index].name = name.trim();
  if (typeof active === "boolean") devUsers[index].active = active;
  if (password) devUsers[index].password = password;

  return sanitizeDevUser(devUsers[index]);
}

export function deleteDevEmployee(id, businessId) {
  const index = devUsers.findIndex(
    (user) => user.id === id && user.role === "garson" && user.businessId === businessId
  );
  if (index === -1) return false;
  devUsers.splice(index, 1);
  return true;
}

export { DEV_BUSINESS, TENANT_SEEDS };
