const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const hasJson = response.headers.get("content-type")?.includes("application/json");
  const data = hasJson ? await response.json() : null;

  if (!response.ok) throw new Error(data?.error || `Error HTTP ${response.status}`);
  return data;
}

function jsonOptions(method, body, token) {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  };
}

export const api = {
  listPosts: (token) => request("/api/posts", token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  login: (credentials) => request("/api/auth/login", jsonOptions("POST", credentials)),
  createPost: (contenido, imagen, privado, token) => {
    const body = new FormData();
    body.append("contenido", contenido);
    body.append("privado", String(privado));
    if (imagen) body.append("imagen", imagen);
    return request("/api/posts", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body });
  },
  updatePost: (id, contenido, { imagen, eliminarImagen, privado }, token) => {
    const body = new FormData();
    body.append("contenido", contenido);
    body.append("privado", String(privado));
    if (imagen) body.append("imagen", imagen);
    if (eliminarImagen) body.append("eliminarImagen", "true");
    return request(`/api/posts/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body });
  },
  deletePost: (id, token) => request(`/api/posts/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }),
  comment: (id, comment, token) => request(`/api/posts/${id}/comments`, jsonOptions("POST", comment, token)),
  deleteComment: (postId, commentId, token) => request(`/api/posts/${postId}/comments/${commentId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }),
  react: (id, reaction, token) => request(`/api/posts/${id}/reactions`, jsonOptions("POST", reaction, token)),
  loadImage: async (path, token) => {
    const response = await fetch(`${API_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error("No se pudo cargar la imagen");
    return response.blob();
  },
};
