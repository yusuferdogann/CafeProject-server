const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function loginBody(body) {
  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return { error: "Email ve sifre gerekli" };
  }

  if (!EMAIL_RE.test(email)) {
    return { error: "Gecerli bir email girin" };
  }

  if (String(password).length < 4) {
    return { error: "Sifre en az 4 karakter olmali" };
  }

  return {
    value: {
      email: email.toLowerCase(),
      password,
    },
  };
}
