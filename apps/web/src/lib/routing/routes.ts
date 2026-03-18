export const routes = {
  login: "/login",
  candidateSession: (sessionId: string) => `/candidate/sessions/${sessionId}`,
  candidateTask: (sessionId: string) => `/candidate/sessions/${sessionId}/task`,
  candidateComplete: (sessionId: string) => `/candidate/sessions/${sessionId}/complete`,
};
