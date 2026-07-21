export interface RecommendationPolicy {
    id: number;
    organization: string;
    title: string;
    amount: number | null;
    amountLabel: string | null;
    deadlineDays: number | null;
    deadlineLabel: string;
    isFavorite: boolean;
    isRecommended: boolean;
    isReceived: boolean;
}

export const isUrgentRecommendationPolicy = (policy: RecommendationPolicy) =>
    policy.deadlineDays !== null &&
    policy.deadlineDays >= 0 &&
    policy.deadlineDays <= 7;
