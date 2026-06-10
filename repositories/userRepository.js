import User from "../models/User.js";
import { env } from "../config/env.js";
import { pgQuery } from "../config/postgres.js";

function mapMongoUser(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    businessId: doc.businessId.toString(),
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.role,
    active: doc.active,
  };
}

function mapPgUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    active: row.active,
  };
}

export async function findUserById(id) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery("SELECT * FROM users WHERE id = $1", [id]);
    return mapPgUser(rows[0]);
  }
  return mapMongoUser(await User.findById(id));
}

export async function findActiveUserByEmail(email) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery(
      "SELECT * FROM users WHERE email = $1 AND active = TRUE LIMIT 1",
      [email]
    );
    return mapPgUser(rows[0]);
  }
  return mapMongoUser(await User.findOne({ email, active: true }));
}

export async function findUserByEmailInBusiness(businessId, email) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery(
      "SELECT * FROM users WHERE business_id = $1 AND email = $2 LIMIT 1",
      [businessId, email]
    );
    return mapPgUser(rows[0]);
  }
  return mapMongoUser(await User.findOne({ businessId, email }));
}

export async function listEmployeesByBusiness(businessId) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery(
      "SELECT id, business_id, name, email, role, active FROM users WHERE business_id = $1 AND role = 'garson'",
      [businessId]
    );
    return rows.map(mapPgUser);
  }

  const users = await User.find({ businessId, role: "garson" }).select("-passwordHash");
  return users.map(mapMongoUser);
}

export async function createUser({ businessId, name, email, passwordHash, role }) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery(
      `INSERT INTO users (business_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [businessId, name, email, passwordHash, role]
    );
    return mapPgUser(rows[0]);
  }

  const doc = await User.create({ businessId, name, email, passwordHash, role });
  return mapMongoUser(doc);
}

export async function findEmployeeById(businessId, id) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery(
      "SELECT * FROM users WHERE id = $1 AND business_id = $2 AND role = 'garson'",
      [id, businessId]
    );
    return mapPgUser(rows[0]);
  }
  return mapMongoUser(
    await User.findOne({ _id: id, businessId, role: "garson" })
  );
}

export async function updateEmployee(businessId, id, patch) {
  const employee = await findEmployeeById(businessId, id);
  if (!employee) return null;

  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery(
      `UPDATE users
       SET name = $3, email = $4, password_hash = $5, active = $6, updated_at = NOW()
       WHERE id = $1 AND business_id = $2 AND role = 'garson'
       RETURNING *`,
      [
        id,
        businessId,
        patch.name ?? employee.name,
        patch.email ?? employee.email,
        patch.passwordHash ?? employee.passwordHash,
        patch.active ?? employee.active,
      ]
    );
    return mapPgUser(rows[0]);
  }

  const doc = await User.findOne({ _id: id, businessId, role: "garson" });
  if (!doc) return null;
  if (patch.name) doc.name = patch.name;
  if (patch.email) doc.email = patch.email;
  if (patch.passwordHash) doc.passwordHash = patch.passwordHash;
  if (typeof patch.active === "boolean") doc.active = patch.active;
  await doc.save();
  return mapMongoUser(doc);
}

export async function deleteEmployee(businessId, id) {
  if (env.DB_PROVIDER === "postgres") {
    const { rowCount } = await pgQuery(
      "DELETE FROM users WHERE id = $1 AND business_id = $2 AND role = 'garson'",
      [id, businessId]
    );
    return rowCount > 0;
  }

  const doc = await User.findOneAndDelete({ _id: id, businessId, role: "garson" });
  return !!doc;
}
