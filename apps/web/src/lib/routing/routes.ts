export const routes = {
  login: "/login",
  candidateHome: "/candidate",
  candidateAccessLost: "/candidate/access/lost",
  candidateUnauthorized: "/candidate/access/unauthorized",
  candidateSession: (sessionId: string) => `/candidate/sessions/${sessionId}`,
  candidateTask: (sessionId: string) => `/candidate/sessions/${sessionId}/task`,
  candidateComplete: (sessionId: string) => `/candidate/sessions/${sessionId}/complete`,
  candidateExpired: (sessionId: string) => `/candidate/sessions/${sessionId}/expired`,
};
