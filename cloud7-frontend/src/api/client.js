export const API = '/api';

export async function signup(payload) {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || 'Failed to create account');
  }
}


export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.text();
}

export async function fetchStorageUsage(userId) {
  const res = await fetch(`${API}/users/${userId}/storage`);
  if (!res.ok) throw new Error('Failed to fetch storage');
  return res.json();
}

export async function fetchFileInfo(fileId) {
  const res = await fetch(`${API}/files/${fileId}/info`);

  if (!res.ok) throw new Error('Failed to fetch file info');
  return res.json();
}

export async function fetchFolderInfo(folderId) {
  const res = await fetch(`${API}/folders/${folderId}/info`, );

  if (!res.ok) throw new Error('Failed to fetch folder info');
  return res.json();
}




export async function uploadFile(file, folderId, userId) {
  const form = new FormData();
  form.append('file', file);
  if (folderId !== null) {
    form.append('folderId', folderId);
  }
  form.append('userId', userId);

  const res = await fetch(`${API}/files/upload`, {
    method: 'POST',
    body: form
  });

  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function createFolder(name, parentId, userId) {
  const res = await fetch(`${API}/folders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      parentId,
      userId
    })
  });

  if (!res.ok) throw new Error('Create folder failed');
  return res.json();
}

export async function fetchFolders(userId, parentId = null) {
  const params = new URLSearchParams({ userId });

  if (parentId !== null) {
    params.append('parentId', parentId);
  }

  const res = await fetch(`${API}/folders?${params.toString()}`);

  if (!res.ok) {
    throw new Error('Failed to fetch folders');
  }

  return res.json();
}

export async function fetchFiles(userId, folderId = null) {
  const params = new URLSearchParams({ userId });
  if (folderId !== null) params.append('folderId', folderId);

  const res = await fetch(`${API}/files?${params}`);
  if (!res.ok) throw new Error('Failed to fetch files');
  return res.json();
}


export function getFilePreviewUrl(fileId) {
  return `${API}/files/${fileId}/preview`;
}

export async function deleteFile(id) {
  return fetch(`${API}/files/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteFolder(id) {
  return fetch(`${API}/folders/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchTrash(userId) {
  const [files, folders] = await Promise.all([
    fetch(`${API}/files/trash?userId=${userId}`).then(r => r.json()),
    fetch(`${API}/folders/trash?userId=${userId}`).then(r => r.json())
  ]);
  return { files, folders };
}

export async function restoreFile(id) {
  return fetch(`${API}/files/${id}/restore`, {
    method: 'POST',
  });
}

export async function restoreFolder(id) {
  return fetch(`${API}/folders/${id}/restore`, {
    method: 'POST',
  });
}
