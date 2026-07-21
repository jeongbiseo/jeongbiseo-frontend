import type { SubsidyCategory } from "@/types/onboarding";

export type SubsidyDetailResult = {
    subsidyId: number;
    name: string;
    agency: string | null;
    eligibilityText: string | null;
    deadline: string | null;
    dDay: number | null;
    estimatedAmountMin: number | null;
    estimatedAmountMax: number | null;
    paymentType: string;
    category: SubsidyCategory | null;
    description: string | null;
    externalUrl: string | null;
    isFavorite: boolean;
};
