'use client';

/*
  Cash reconciliation. `side` is 'manager' (prepare and submit) or 'finance' (admins with
  Finance_Management: check and approve). The server has a route set for each.
*/
const API = process.env.NEXT_PUBLIC_API_URL;
const token = () => sessionStorage.getItem('token');

const request = async (method, path, body) => {
  try {
    const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
    const response = await fetch(`${API}/cash-declarations${path}`, {
      method,
      headers: {
        ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${token()}`,
      },
      ...(body ? { body: isForm ? body : JSON.stringify(body) } : {}),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) return { data: payload.data, message: payload.message };
    return {
      error: payload?.message || 'Something went wrong, please try again',
      status: response.status,
    };
  } catch {
    return {
      error: 'Network error, please check your connection and try again',
    };
  }
};

// { from, to, branchIds } ('YYYY-MM-DD') -> { rows, summary, branches, canPrepare }
export const listDeclarations = (side, { from, to, branchIds = [] }) =>
  request('POST', `/${side}/list`, {
    from,
    to,
    ...(branchIds.length ? { branchIds } : {}),
  });

// manager: opens (and the first time starts) a branch's day.
// finance: opens it, or a read-only preview ({ preview: true }) if the branch has not started it.
export const openDeclarationDay = (side, branchId, day) =>
  request('POST', `/${side}/day`, { branchId, day });

// finance: asks the branch's managers to declare a day (started or not)
export const requestDeclaration = (branchId, day, text) =>
  request('POST', '/finance/day/request', { branchId, day, text });

export const getDeclaration = (side, id) => request('GET', `/${side}/${id}`);

// manager: { revision, deductions, banked, note }
export const saveDeclaration = (id, body) =>
  request('PUT', `/manager/${id}`, body);

export const uploadDeclarationDocument = (id, file, kind) => {
  const form = new FormData();
  form.append('file', file);
  form.append('kind', kind);
  return request('POST', `/manager/${id}/documents`, form);
};

export const deleteDeclarationDocument = (id, docId) =>
  request('DELETE', `/manager/${id}/documents/${docId}`);

export const submitDeclaration = (id, revision) =>
  request('POST', `/manager/${id}/submit`, { revision });

// finance: decision 'approve' | 'request_changes'
export const reviewDeclaration = (id, { decision, note, revision }) =>
  request('POST', `/finance/${id}/review`, { decision, note, revision });

// a message in the thread: text, tags [{ kind, ref }], people @-mentioned (ids),
// an optional file and what it is
export const postDeclarationMessage = (
  side,
  id,
  { text, tags, mentions, file, kind }
) => {
  const form = new FormData();
  form.append('text', text || '');
  form.append('tags', JSON.stringify(tags || []));
  form.append('mentions', JSON.stringify(mentions || []));
  if (file) {
    form.append('file', file);
    if (kind) form.append('kind', kind);
  }
  return request('POST', `/${side}/${id}/messages`, form);
};

// opens a document in a new tab (files are never public links, so it is fetched with the token)
export const openDeclarationDocument = async (side, id, docId) => {
  const tab = window.open('', '_blank');
  try {
    const response = await fetch(
      `${API}/cash-declarations/${side}/${id}/documents/${docId}`,
      {
        headers: { Authorization: `Bearer ${token()}` },
      }
    );
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      tab?.close();
      return { error: payload?.message || 'Could not open the file' };
    }
    const url = URL.createObjectURL(await response.blob());
    if (tab) tab.location.href = url;
    else window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
    return { data: true };
  } catch {
    tab?.close();
    return { error: 'Network error, could not open the file' };
  }
};
