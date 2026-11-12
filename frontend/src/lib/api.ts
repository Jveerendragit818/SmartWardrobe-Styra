
import { getSupabase } from "./supabase";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const supabase = getSupabase();

  // Get the logged-in user's session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session?.access_token) {
    throw new Error("Please log in first.");
  }

  // Prepare request headers
  const headers = new Headers(options.headers);

  headers.set(
    "Authorization",
    `Bearer ${session.access_token}`
  );

  // Set JSON content type for normal requests
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Send request to FastAPI backend
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  // Handle JSON and empty responses
  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  // Handle API errors
  if (!response.ok) {
    throw new Error(
      typeof data?.detail === "string"
        ? data.detail
        : `Request failed: ${response.status}`
    );
  }

  return data as T;
}
