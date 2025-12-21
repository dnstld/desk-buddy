export function parseEmailDomain(email: string) {
  if (typeof email !== 'string' || !email.includes('@')) {
    throw new Error('E-mail inválido');
  }

  const [, domainRaw] = email.split('@');
  const domain = domainRaw.toLowerCase().replace(/^www\./, '');
  const parts = domain.split('.');

const isShort = (str: string): boolean => str.length <= 3;
  let companyName;

  if (
    parts.length >= 3 &&
    isShort(parts.at(-1) ?? '') &&
    isShort(parts.at(-2) ?? '')
  ) {
    companyName = parts.at(-3);
  } else {
    companyName = parts.at(-2);
  }

  return {
    domain,
    companyName,
  };
}
