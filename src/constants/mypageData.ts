export type ReceivedBenefit = {
    id: number;
    title: string;
    organization: string;
    categories: string[];
};

export type MyPageProfile = {
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    city: string;
    district: string;
    employment: string;
    income: string;
    householdSize: number;
};

export const benefitCategories = [
    "청년",
    "주거",
    "고용",
    "교육",
    "출산/육아",
    "창업",
];

export const availableBenefits: ReceivedBenefit[] = [
    {
        id: 101,
        title: "근로장려금",
        organization: "국세청",
        categories: ["고용"],
    },
    {
        id: 102,
        title: "청년내일저축계좌",
        organization: "보건복지부",
        categories: ["청년"],
    },
    {
        id: 103,
        title: "국민내일배움카드",
        organization: "고용노동부",
        categories: ["고용", "교육"],
    },
    {
        id: 104,
        title: "고용촉진장려금",
        organization: "고용노동부",
        categories: ["고용"],
    },
    {
        id: 105,
        title: "청년 월세 특별지원",
        organization: "국토교통부",
        categories: ["청년", "주거"],
    },
    {
        id: 106,
        title: "첫만남이용권",
        organization: "보건복지부",
        categories: ["출산/육아"],
    },
    {
        id: 107,
        title: "예비창업패키지",
        organization: "중소벤처기업부",
        categories: ["창업"],
    },
];

export const defaultReceivedBenefits: ReceivedBenefit[] = [
    {
        id: 201,
        title: "청년 내일채움공제",
        organization: "고용노동부",
        categories: ["청년", "고용"],
    },
    {
        id: 202,
        title: "국민취업지원제도",
        organization: "고용노동부",
        categories: ["고용"],
    },
    {
        id: 203,
        title: "청년 월세 지원",
        organization: "국토교통부",
        categories: ["청년", "주거"],
    },
];

const FAVORITE_STORAGE_KEY = "jeongbiseo:favorite-policy-ids";
const RECEIVED_STORAGE_KEY = "jeongbiseo:received-benefits";
const PROFILE_STORAGE_KEY = "jeongbiseo:mypage-profile";
const DEFAULT_FAVORITE_IDS = [1, 2, 4];
const DEFAULT_PROFILE: MyPageProfile = {
    birthYear: 2000,
    birthMonth: 3,
    birthDay: 14,
    city: "서울특별시",
    district: "강남구",
    employment: "재직중",
    income: "200 ~ 300만원",
    householdSize: 1,
};

const readStorage = <T>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;

    try {
        const storedValue = window.localStorage.getItem(key);
        return storedValue ? (JSON.parse(storedValue) as T) : fallback;
    } catch {
        return fallback;
    }
};

export const getFavoritePolicyIds = () =>
    readStorage<number[]>(FAVORITE_STORAGE_KEY, DEFAULT_FAVORITE_IDS);

export const saveFavoritePolicyIds = (ids: number[]) => {
    window.localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(ids));
};

export const getReceivedBenefits = () =>
    readStorage<ReceivedBenefit[]>(
        RECEIVED_STORAGE_KEY,
        defaultReceivedBenefits
    );

export const saveReceivedBenefits = (benefits: ReceivedBenefit[]) => {
    window.localStorage.setItem(RECEIVED_STORAGE_KEY, JSON.stringify(benefits));
};

export const getMyPageProfile = () =>
    readStorage<MyPageProfile>(PROFILE_STORAGE_KEY, DEFAULT_PROFILE);

export const saveMyPageProfile = (profile: MyPageProfile) => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

export const clearMyPageDummyData = () => {
    window.localStorage.removeItem(FAVORITE_STORAGE_KEY);
    window.localStorage.removeItem(RECEIVED_STORAGE_KEY);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
};
