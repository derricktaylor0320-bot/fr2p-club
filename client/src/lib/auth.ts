const MEMBER_ID_KEY = "fr2p_member_id";
const MEMBER_USERNAME_KEY = "fr2p_username";
const MEMBER_NAME_KEY = "fr2p_name";

const FALLBACK_ID = "fr2p-founder";

export function getLoggedInMemberId(): string {
  return localStorage.getItem(MEMBER_ID_KEY) || FALLBACK_ID;
}

export function getLoggedInUsername(): string {
  return localStorage.getItem(MEMBER_USERNAME_KEY) || "";
}

export function getLoggedInName(): string {
  return localStorage.getItem(MEMBER_NAME_KEY) || "";
}

export function setLoggedInMember(id: string, username: string, name: string): void {
  localStorage.setItem(MEMBER_ID_KEY, id);
  localStorage.setItem(MEMBER_USERNAME_KEY, username);
  localStorage.setItem(MEMBER_NAME_KEY, name);
}

export function logout(): void {
  localStorage.removeItem(MEMBER_ID_KEY);
  localStorage.removeItem(MEMBER_USERNAME_KEY);
  localStorage.removeItem(MEMBER_NAME_KEY);
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem(MEMBER_ID_KEY);
}
