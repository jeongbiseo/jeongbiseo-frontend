export type TermConsentType = "SERVICE" | "PRIVACY" | "AGE_OVER_14";

export interface TermConsentItem {
    type: TermConsentType;
    label: string;
    agreed: boolean;
    agreedAt: string | null;
}

export interface TermConsentsResult {
    terms: TermConsentItem[];
    marketingConsent: boolean;
    marketingConsentUpdatedAt: string | null;
}

export interface MarketingConsentResult {
    agreed: boolean;
    updatedAt: string;
}
