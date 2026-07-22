export interface RecommendationPolicy {
    id: number;
    organization: string;
    title: string;
    amount: number | null;
    amountLabel: string | null;
    deadlineDays: number | null;
    deadlineLabel: string;
    eligibilitySummary: string | null;
    confirmedMatchCount: number | null;
    unverifiedConditionCount: number | null;
    uncomputable: boolean;
    uncomputableReasons: string[];
    isFavorite: boolean;
    isRecommended: boolean;
    isReceived: boolean;
}

export const isUrgentRecommendationPolicy = (policy: RecommendationPolicy) =>
    policy.deadlineDays !== null &&
    policy.deadlineDays >= 0 &&
    policy.deadlineDays <= 7;
