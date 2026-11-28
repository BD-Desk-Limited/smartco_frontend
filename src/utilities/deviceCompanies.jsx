'use client';

/*
  The companies this browser is authorized for. A device's authorization is per company (its own
  token in each company's trusted devices), and `companyData` in localStorage only holds the one in
  use, so every authorization is also kept here: [{ id, name, authorizationToken }].
  The login page lists them so the user can say which company they are logging in to.
*/
const KEY = 'deviceCompanies';

const readList = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list)
      ? list.filter((c) => c?.id && c?.authorizationToken)
      : [];
  } catch {
    return [];
  }
};

const writeList = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage full or blocked: the list is a convenience, login still works without it
  }
};

// The list, including the company in `companyData` (browsers authorized before the list existed).
export const readDeviceCompanies = () => {
  const list = readList();
  try {
    const current = JSON.parse(localStorage.getItem('companyData') || 'null');
    if (
      current?.id &&
      current?.authorizationToken &&
      !list.some((c) => String(c.id) === String(current.id))
    ) {
      list.push({
        id: String(current.id),
        name: current.name || null,
        authorizationToken: current.authorizationToken,
      });
    }
  } catch {
    // unreadable companyData: nothing to add
  }
  return list;
};

// Adds or updates one company (keeps a known name or branch list when the new entry has none).
// allowedBranches is kept so the sales point can switch company offline.
export const rememberDeviceCompany = ({
  id,
  name,
  authorizationToken,
  allowedBranches,
}) => {
  if (!id || !authorizationToken) return;
  const list = readList();
  const index = list.findIndex((c) => String(c.id) === String(id));
  const entry = {
    id: String(id),
    name: name || list[index]?.name || null,
    authorizationToken,
    allowedBranches: allowedBranches || list[index]?.allowedBranches || [],
  };
  if (index >= 0) list[index] = entry;
  else list.push(entry);
  writeList(list);
};

// After the server checked them: only the companies that still trust this browser
// (branch lists already stored are kept).
export const replaceDeviceCompanies = (list) => {
  const known = readList();
  writeList(
    (list || []).map((c) => ({
      ...c,
      allowedBranches:
        c.allowedBranches ||
        known.find((k) => String(k.id) === String(c.id))?.allowedBranches ||
        [],
    }))
  );
};

// The offline sales-point token of a staff member, per company (staff IDs repeat across companies)
export const offlineTokenKey = (companyId, staffId) =>
  `token_${companyId}_${staffId}`;

// What the login request sends, so the server uses the token of the account's company.
export const deviceTokensOf = (list) =>
  (list || []).map((c) => ({ companyId: c.id, token: c.authorizationToken }));
