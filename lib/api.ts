const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const TOKEN_KEY = "acoopa_token";
const USER_KEY = "acoopa_user";


export type User = { id: string; name: string; email: string };
type AuthResponse = { token: string; user: User };

export type Feature = { title: string; description: string };

export type Project = {
  id: string;
  idea: string;
  heading: string;
  dark: boolean;
  accent: string;
  createdAt: string;
  brand: string | null;
  subheading: string | null;
  primaryCta: string | null;
  secondaryCta: string | null;
  siteJson: string | null;
  features: Feature[];
  sourceUrl?: string | null;
  reaMetadata?: {
    sourceUrl?: string;
    domain?: string;
    analyzedAt?: string;
    archetype?: string;
    detectedTaxonomy?: string[];
    extractedColors?: { primary: string; secondary: string; dark: boolean };
    workerLogs?: string[];
    claudeCodePrompt?: string;
    claudeMdContent?: string;
    tokens?: {
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
      textColor: string;
      fontHeading: string;
      fontBody: string;
      borderRadius: string;
    };
    designLogic?: {
      layoutRhythm: string;
      componentHierarchy: string[];
      copyTone: string;
      targetAudience: string;
      valuePropositions: string[];
    };
  } | null;
};

export class ApiError extends Error {
  status: number;
  constructor(status: number) {
    super(`Request failed: ${status}`);
    this.status = status;
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}

function saveAuth(a: AuthResponse) {
  try {
    localStorage.setItem(TOKEN_KEY, a.token);
    localStorage.setItem(USER_KEY, JSON.stringify(a.user));
  } catch {}
  return a;
}

async function request<T>(path: string, init?: RequestInit, auth = true): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
try {
  res = await fetch(`${BASE}${path}`, { ...init, headers });
} catch {
  throw new ApiError(0); // network failure: backend unreachable
}

  if (res.status === 401 && auth) {
    logout();
    window.location.href = "/login";
  }
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
}

export const signup = (name: string, email: string, password: string) =>
  request<AuthResponse>(
    "/api/auth/signup",
    { method: "POST", body: JSON.stringify({ name, email, password }) },
    false
  ).then(saveAuth);

export const login = (email: string, password: string) =>
  request<AuthResponse>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false
  ).then(saveAuth);

export const createProject = (idea: string) =>
  request<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ idea }),
  });

export const createProjectFromUrl = (url: string, instructions?: string) =>
  request<Project>("/api/rea/analyze", {
    method: "POST",
    body: JSON.stringify({ url, instructions }),
  });

export const listProjects = () => request<Project[]>("/api/projects");

export const getProject = (id: string) => request<Project>(`/api/projects/${id}`);
export const deleteProject = (id: string) =>
  request<{ success: boolean }>(`/api/projects/${id}`, { method: "DELETE" });
export const chatProject = (id: string, message: string) =>
  request<{ reply: string; project: Project }>(`/api/projects/${id}/chat`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
export const updateProject = (
  id: string,
  data: { heading: string; dark: boolean; accent: string }
) =>
  request<Project>(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  export const saveSite = (id: string, siteJson: string) =>
  request<Project>(`/api/projects/${id}/site`, {
    method: "PUT",
    body: JSON.stringify({ siteJson }),
  });

export type CodeFile = { path: string; content: string };

export const compileProject = (id: string) =>
  request<{ reply: string; files: CodeFile[]; project: Project }>(`/api/projects/${id}/compile`, {
    method: "POST",
  });
  export const generateSiteV2 = (idea: string) =>
  request<import("./siteTypes").SiteV2>("/api/v2/generate", {
    method: "POST",
    body: JSON.stringify({ idea }),
  });
  export const API_BASE = BASE;

export type ImageStatus = { prompt: string; url: string; ready: boolean; failed: boolean };

export const requestImages = (id: string, prompts: string[]) =>
  request<ImageStatus[]>(`/api/projects/${id}/images`, {
    method: "POST",
    body: JSON.stringify({ prompts }),
  });
  export async function uploadImage(id: string, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let res: Response;
  try {
    res = await fetch(`${BASE}/api/projects/${id}/upload`, { method: "POST", headers, body: form });
  } catch {
    throw new ApiError(0);
  }
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
}
export const createProjectV2 = (idea: string) =>
  request<Project>("/api/v2/projects", {
    method: "POST",
    body: JSON.stringify({ idea }),
  });

export const chatProjectV2 = (id: string, slug: string, message: string) =>
  request<Project>(`/api/v2/projects/${id}/chat`, {
    method: "POST",
    body: JSON.stringify({ slug, message }),
  });