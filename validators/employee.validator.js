const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function employeeBody(body, { requirePassword = false } = {}) {
  const name = body.name?.trim();
  const email = body.email?.trim()?.toLowerCase();
  const password = body.password;
  const active = body.active;

  if (requirePassword) {
    if (!name || !email || !password) {
      return { error: "Ad, email ve sifre gerekli" };
    }
  }

  if (email && !EMAIL_RE.test(email)) {
    return { error: "Gecerli bir email girin" };
  }

  if (password && String(password).length < 4) {
    return { error: "Sifre en az 4 karakter olmali" };
  }

  if (active !== undefined && typeof active !== "boolean") {
    return { error: "active alani boolean olmali" };
  }

  return {
    value: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(password ? { password } : {}),
      ...(active !== undefined ? { active } : {}),
    },
  };
}

export function employeeIdParams(params) {
  const id = params.id?.trim();
  if (!id) {
    return { error: "Calisan kimligi gerekli" };
  }
  return { value: { id } };
}
