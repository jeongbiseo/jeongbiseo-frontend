import type { RecommendationPolicy } from "@/constants/recommendationData";

export const updatePolicyFavorite = (
    policies: RecommendationPolicy[],
    policyId: number,
    isFavorite: boolean
) =>
    policies.map((policy) =>
        policy.id === policyId ? { ...policy, isFavorite } : policy
    );

export const reconcilePolicyFavorites = (
    policies: RecommendationPolicy[],
    favoriteIds: ReadonlySet<number>
) =>
    policies.map((policy) => ({
        ...policy,
        isFavorite: favoriteIds.has(policy.id),
    }));

export const reconcileReceivedPolicies = (
    policies: RecommendationPolicy[],
    receivedIds: ReadonlySet<number>
) =>
    policies.map((policy) => ({
        ...policy,
        isReceived: receivedIds.has(policy.id),
    }));

export const updateFavoriteCollection = (
    policies: RecommendationPolicy[],
    target: RecommendationPolicy,
    isFavorite: boolean
) => {
    if (!isFavorite) {
        return policies.filter((policy) => policy.id !== target.id);
    }

    if (policies.some((policy) => policy.id === target.id)) {
        return updatePolicyFavorite(policies, target.id, true);
    }

    return [{ ...target, isFavorite: true }, ...policies];
};

export const mergeUniquePolicies = (
    previous: RecommendationPolicy[],
    incoming: RecommendationPolicy[]
) => {
    const policiesById = new Map(previous.map((policy) => [policy.id, policy]));
    incoming.forEach((policy) => policiesById.set(policy.id, policy));
    return [...policiesById.values()];
};
