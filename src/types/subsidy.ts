import type { SubsidyCategory } from "@/types/onboarding";
import type { PaymentType } from "@/types/estimated";

export type AiExplanation = {
    amountValue: number | null;
    monthlyAmount: number | null;
    durationMonths: number | null;
    conditionExpression: string | null;
    evidence: string | null;
};

export type SubsidyDetailResult = {
    subsidyId: number;
    name: string;
    agency: string | null;
    eligibilityText: string | null;
    deadline: string | null;
    dDay: number | null;
    estimatedAmountMin: number | null;
    estimatedAmountMax: number | null;
    paymentType: PaymentType;
    category: SubsidyCategory | null;
    description: string | null;
    externalUrl: string | null;
    isFavorite: boolean;
    aiExplanation: AiExplanation | null;
};
