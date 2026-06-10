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

const DEV_USERS = [
  {
    id: "dev-admin",
    businessId: DEV_BUSINESS.id,
    name: "Admin",
    email: "admin@gmail.com",
    password: "1234",
    role: "admin",
    active: true,
  },
  {
    id: "dev-garson",
    businessId: DEV_BUSINESS.id,
    name: "Garson",
    email: "garson@gmail.com",
    password: "1234",
    role: "garson",
    active: true,
  },
];

const devUsers = DEV_USERS.map((user) => ({ ...user }));

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

export async function seedDefaults() {
  if (!isDbReady()) return;

  let business = await findBusinessBySlug("cafe-project");
  if (!business) {
    business = await createBusiness({
      name: "Cafe Project",
      slug: "cafe-project",
      settings: defaultCafeSettings,
      subscription: createTrialSubscription(),
    });
    console.log("Seed: isletme olusturuldu");
  } else {
    const patch = {};
    if (!business.settings) patch.settings = defaultCafeSettings;
    if (!business.subscription?.currentPeriodEnd) {
      patch.subscription = createTrialSubscription();
    }
    if (Object.keys(patch).length) {
      business = await patchBusiness(business.id, patch);
      console.log("Seed: isletme varsayilanlari guncellendi");
    }
  }

  const defaults = [
    { name: "Admin", email: "admin@gmail.com", password: "1234", role: "admin" },
    { name: "Garson", email: "garson@gmail.com", password: "1234", role: "garson" },
  ];

  for (const item of defaults) {
    const exists = await findUserByEmailInBusiness(business.id, item.email);
    if (exists) continue;
    await createUser({
      businessId: business.id,
      name: item.name,
      email: item.email,
      passwordHash: await hashPassword(item.password),
      role: item.role,
    });
    console.log(`Seed: ${item.email} olusturuldu`);
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

export function listDevEmployees(businessId = DEV_BUSINESS.id) {
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

export { DEV_BUSINESS };
