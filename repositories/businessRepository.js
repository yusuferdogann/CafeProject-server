import Business from "../models/Business.js";
import { env } from "../config/env.js";
import { pgQuery } from "../config/postgres.js";

function mapMongoBusiness(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    settings: doc.settings,
    subscription: doc.subscription,
  };
}

function mapPgBusiness(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    settings: row.settings,
    subscription: row.subscription,
  };
}

export async function findBusinessById(id) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery("SELECT * FROM businesses WHERE id = $1", [id]);
    return mapPgBusiness(rows[0]);
  }
  return mapMongoBusiness(await Business.findById(id));
}

export async function findBusinessBySlug(slug) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery("SELECT * FROM businesses WHERE slug = $1", [slug]);
    return mapPgBusiness(rows[0]);
  }
  return mapMongoBusiness(await Business.findOne({ slug }));
}

export async function createBusiness({ name, slug, settings, subscription }) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery(
      `INSERT INTO businesses (name, slug, settings, subscription)
       VALUES ($1, $2, $3::jsonb, $4::jsonb)
       RETURNING *`,
      [name, slug, JSON.stringify(settings ?? null), JSON.stringify(subscription ?? null)]
    );
    return mapPgBusiness(rows[0]);
  }

  const doc = await Business.create({ name, slug, settings, subscription });
  return mapMongoBusiness(doc);
}

export async function updateBusinessSettings(id, settings) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery(
      `UPDATE businesses
       SET settings = $2::jsonb, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, JSON.stringify(settings)]
    );
    return mapPgBusiness(rows[0]);
  }

  const doc = await Business.findByIdAndUpdate(id, { settings }, { new: true });
  return mapMongoBusiness(doc);
}

export async function updateBusinessSubscription(id, subscription) {
  if (env.DB_PROVIDER === "postgres") {
    const { rows } = await pgQuery(
      `UPDATE businesses
       SET subscription = $2::jsonb, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, JSON.stringify(subscription)]
    );
    return mapPgBusiness(rows[0]);
  }

  const doc = await Business.findByIdAndUpdate(id, { subscription }, { new: true });
  return mapMongoBusiness(doc);
}

export async function patchBusiness(id, patch) {
  if (env.DB_PROVIDER === "postgres") {
    const current = await findBusinessById(id);
    if (!current) return null;

    const nextSettings = patch.settings ?? current.settings;
    const nextSubscription = patch.subscription ?? current.subscription;

    const { rows } = await pgQuery(
      `UPDATE businesses
       SET settings = $2::jsonb, subscription = $3::jsonb, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, JSON.stringify(nextSettings), JSON.stringify(nextSubscription)]
    );
    return mapPgBusiness(rows[0]);
  }

  const doc = await Business.findById(id);
  if (!doc) return null;
  if (patch.settings) doc.settings = patch.settings;
  if (patch.subscription) doc.subscription = patch.subscription;
  await doc.save();
  return mapMongoBusiness(doc);
}
