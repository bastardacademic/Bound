// utils/consent.ts

type ConsentType = "media-tag" | "post-share" | "group-invite";

export interface ConsentEntry {
  id: string;
  type: ConsentType;
  targetId: string;
  label: string;
  approvedAt: string;
  revoked?: boolean;
}

let mockLedger: Record<string, ConsentEntry[]> = {
  user123: [
    {
      id: "c1",
      type: "media-tag",
      targetId: "m456",
      label: "Tagged in media: \"Bondage Shoot #2\"",
      approvedAt: "2025-04-10T14:33:00Z"
    },
    {
      id: "c2",
      type: "post-share",
      targetId: "p789",
      label: "Shared journal entry: \"Confessions of a Switch\"",
      approvedAt: "2025-04-11T08:12:00Z"
    },
    {
      id: "c3",
      type: "group-invite",
      targetId: "g999",
      label: "Joined Group: \"Queer Domme Circle\"",
      approvedAt: "2025-04-12T18:55:00Z"
    }
  ]
};

export function getConsentLedger(userId: string): ConsentEntry[] {
  return mockLedger[userId] || [];
}

export function revokeConsent(userId: string, consentId: string): boolean {
  const ledger = mockLedger[userId];
  if (!ledger) return false;
  const entry = ledger.find(e => e.id === consentId);
  if (!entry || entry.revoked) return false;
  entry.revoked = true;
  return true;
}
