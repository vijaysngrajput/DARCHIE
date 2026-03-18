import { apiRequest } from "@/lib/api/http";
import type { DraftSaveRequest, DraftSaveResult, FinalizeResponseRequest, FinalizeResponseResult, ResponseSummary } from "@/lib/types";

export async function saveDraft(input: DraftSaveRequest): Promise<DraftSaveResult> {
  return apiRequest<DraftSaveResult>("/responses/draft", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchDraft(sessionId: string, taskId: string): Promise<DraftSaveResult> {
  return apiRequest<DraftSaveResult>(`/responses/draft/${sessionId}/${taskId}`);
}

export async function finalizeResponse(input: FinalizeResponseRequest): Promise<FinalizeResponseResult> {
  return apiRequest<FinalizeResponseResult>("/responses/finalize", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchResponseSummary(sessionId: string, taskId: string): Promise<ResponseSummary> {
  return apiRequest<ResponseSummary>(`/responses/summary/${sessionId}/${taskId}`);
}
