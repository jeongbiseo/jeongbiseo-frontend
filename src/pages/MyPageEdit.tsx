import {
    BackButton,
    CheckIcon,
    MyPageLayout,
} from "@/components/mypage/MyPageUI";
import {
    availableBenefits,
    benefitCategories,
    getMyPageProfile,
    getReceivedBenefits,
    saveMyPageProfile,
    saveReceivedBenefits,
    type ReceivedBenefit,
} from "@/constants/mypageData";
import { regionNames, regions } from "@/constants/regions";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const employmentOptions = [
    "재직중",
    "구직중",
    "학생",
    "프리랜서",
    "자영업",
    "기타",
];
const incomeOptions = [
    "소득 없음",
    "100만원 미만",
    "100 ~ 200만원",
    "200 ~ 300만원",
    "300 ~ 400만원",
    "400만원 이상",
];
const currentYear = new Date().getFullYear();
const years = Array.from(
    { length: 83 },
    (_, index) => currentYear - 14 - index
);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const days = Array.from({ length: 31 }, (_, index) => index + 1);

const MyPageEdit = () => {
    const [searchParams] = useSearchParams();
    const receivedSectionRef = useRef<HTMLDivElement>(null);
    const [initialProfile] = useState(getMyPageProfile);
    const [birthYear, setBirthYear] = useState(initialProfile.birthYear);
    const [birthMonth, setBirthMonth] = useState(initialProfile.birthMonth);
    const [birthDay, setBirthDay] = useState(initialProfile.birthDay);
    const [city, setCity] = useState(initialProfile.city);
    const [district, setDistrict] = useState(initialProfile.district);
    const [employment, setEmployment] = useState(initialProfile.employment);
    const [income, setIncome] = useState(initialProfile.income);
    const [householdSize, setHouseholdSize] = useState(
        initialProfile.householdSize
    );
    const [receivedBenefits, setReceivedBenefits] =
        useState(getReceivedBenefits);
    const [addSheetOpen, setAddSheetOpen] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (searchParams.get("section") !== "received") return;

        const frame = window.requestAnimationFrame(() => {
            receivedSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
        return () => window.cancelAnimationFrame(frame);
    }, [searchParams]);

    const updateReceivedBenefits = (benefits: ReceivedBenefit[]) => {
        setReceivedBenefits(benefits);
        saveReceivedBenefits(benefits);
    };

    const handleSave = () => {
        saveMyPageProfile({
            birthYear,
            birthMonth,
            birthDay,
            city,
            district,
            employment,
            income,
            householdSize,
        });
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1800);
    };

    return (
        <>
            <MyPageLayout className="pt-[56px]">
                <BackButton />
                <header className="mt-0">
                    <p className="text-[16px] font-semibold">내 정보 수정</p>
                    <h1 className="mt-1 text-[20px] font-bold">
                        추천 기준 정보
                    </h1>
                    <p className="text-text-subtle mt-2 text-[13px] font-semibold">
                        아래 정보는 지원금 추천에 직접 사용됩니다.
                    </p>
                </header>

                <FieldLabel>생년월일</FieldLabel>
                <div className="grid grid-cols-3 gap-[13px]">
                    <Select value={birthYear} onChange={setBirthYear}>
                        {years.map((year) => (
                            <option value={year} key={year}>
                                {year}년
                            </option>
                        ))}
                    </Select>
                    <Select value={birthMonth} onChange={setBirthMonth}>
                        {months.map((month) => (
                            <option value={month} key={month}>
                                {month}월
                            </option>
                        ))}
                    </Select>
                    <Select value={birthDay} onChange={setBirthDay}>
                        {days.map((day) => (
                            <option value={day} key={day}>
                                {day}일
                            </option>
                        ))}
                    </Select>
                </div>

                <FieldLabel>거주지</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                    <Select
                        value={city}
                        onChange={(value) => {
                            const nextCity = String(value);
                            setCity(nextCity);
                            setDistrict(regions[nextCity][0]);
                        }}
                    >
                        {regionNames.map((region) => (
                            <option key={region}>{region}</option>
                        ))}
                    </Select>
                    <Select value={district} onChange={setDistrict}>
                        {regions[city].map((districtName) => (
                            <option key={districtName}>{districtName}</option>
                        ))}
                    </Select>
                </div>

                <FieldLabel>고용상태</FieldLabel>
                <Select value={employment} onChange={setEmployment}>
                    {employmentOptions.map((option) => (
                        <option key={option}>{option}</option>
                    ))}
                </Select>

                <FieldLabel>월 소득구간</FieldLabel>
                <Select value={income} onChange={setIncome}>
                    {incomeOptions.map((option) => (
                        <option key={option}>{option}</option>
                    ))}
                </Select>
                <p className="text-text-subtle mt-2 text-[12px] font-semibold">
                    중위소득 기준 지원금 매칭에 활용돼요
                </p>

                <FieldLabel>가구원 수</FieldLabel>
                <div className="border-line-strong flex h-[48px] items-center justify-between rounded-[10px] border bg-white px-7">
                    <CounterButton
                        label="가구원 수 줄이기"
                        onClick={() =>
                            setHouseholdSize((previous) =>
                                Math.max(1, previous - 1)
                            )
                        }
                    >
                        −
                    </CounterButton>
                    <strong className="text-text-muted text-[16px]">
                        {householdSize}명
                    </strong>
                    <CounterButton
                        label="가구원 수 늘리기"
                        onClick={() =>
                            setHouseholdSize((previous) =>
                                Math.min(10, previous + 1)
                            )
                        }
                    >
                        ＋
                    </CounterButton>
                </div>
                <p className="text-text-subtle mt-2 text-[12px] font-semibold">
                    가구원 수에 따라 주거 · 육아 지원금 범위가 달라져요
                </p>

                <div className="scroll-mt-6 pt-9" ref={receivedSectionRef}>
                    <h2 className="text-[20px] font-bold">
                        기존 수령중인 지원금
                    </h2>
                    <p className="text-text-subtle mt-2 text-[12px] font-semibold">
                        이미 받고 있는 지원금을 선택하면 중복 추천을
                        줄여드립니다
                    </p>

                    <div className="mt-4 flex flex-col gap-3">
                        {receivedBenefits.map((benefit) => (
                            <div
                                className="bg-success-light flex min-h-[54px] items-center justify-between rounded-[10px] px-6"
                                key={benefit.id}
                            >
                                <strong className="text-[14px]">
                                    {benefit.title}
                                </strong>
                                <button
                                    className="border-text-muted cursor-pointer rounded-full border px-3 py-1 text-[12px] font-bold"
                                    type="button"
                                    onClick={() =>
                                        updateReceivedBenefits(
                                            receivedBenefits.filter(
                                                ({ id }) => id !== benefit.id
                                            )
                                        )
                                    }
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        className="bg-primary mt-4 h-[42px] cursor-pointer rounded-[15px] px-5 text-[15px] font-bold text-white shadow-[3px_8px_10px_var(--color-green-shadow)]"
                        type="button"
                        onClick={() => setAddSheetOpen(true)}
                    >
                        기존 수령중인 지원금 추가
                    </button>
                </div>

                <button
                    className="bg-third mt-9 h-[39px] w-[341px] max-w-full cursor-pointer rounded-[15px] text-[16px] font-bold text-white"
                    type="button"
                    onClick={handleSave}
                >
                    저장
                </button>
                {saved && (
                    <p
                        className="text-success mt-3 text-center text-[13px] font-bold"
                        role="status"
                    >
                        수정한 정보를 저장했어요
                    </p>
                )}
            </MyPageLayout>

            <BenefitAddSheet
                open={addSheetOpen}
                receivedBenefits={receivedBenefits}
                onClose={() => setAddSheetOpen(false)}
                onSave={(benefits) => {
                    updateReceivedBenefits(benefits);
                    setAddSheetOpen(false);
                }}
            />
        </>
    );
};

const BenefitAddSheet = ({
    open,
    receivedBenefits,
    onClose,
    onSave,
}: {
    open: boolean;
    receivedBenefits: ReceivedBenefit[];
    onClose: () => void;
    onSave: (benefits: ReceivedBenefit[]) => void;
}) => {
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("청년");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const visibleBenefits = useMemo(() => {
        const receivedIds = new Set(receivedBenefits.map(({ id }) => id));
        const normalizedQuery = query.trim().toLowerCase();

        return availableBenefits.filter(
            (benefit) =>
                !receivedIds.has(benefit.id) &&
                benefit.categories.includes(selectedCategory) &&
                (normalizedQuery.length === 0 ||
                    benefit.title.toLowerCase().includes(normalizedQuery) ||
                    benefit.organization
                        .toLowerCase()
                        .includes(normalizedQuery))
        );
    }, [query, receivedBenefits, selectedCategory]);

    if (!open) return null;

    const handleSave = () => {
        const additions = availableBenefits.filter(({ id }) =>
            selectedIds.includes(id)
        );
        onSave([...receivedBenefits, ...additions]);
        setSelectedIds([]);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/25"
            role="presentation"
            onClick={onClose}
        >
            <section
                className="max-h-[82svh] w-full max-w-[390px] overflow-y-auto rounded-t-[28px] bg-white px-6 pt-4 pb-8"
                role="dialog"
                aria-modal="true"
                aria-labelledby="benefit-sheet-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="bg-disabled mx-auto h-1 w-[44px] rounded-full" />
                <h2
                    className="mt-5 text-[18px] font-bold"
                    id="benefit-sheet-title"
                >
                    기존 수령중인 지원금 추가
                </h2>

                <div className="relative mt-5">
                    <SearchIcon />
                    <input
                        className="border-line-strong placeholder:text-text-subtle focus:border-primary h-[50px] w-full rounded-[10px] border pr-4 pl-11 text-[13px] outline-none"
                        value={query}
                        placeholder="지원금명 또는 기관명으로 검색해보세요"
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>

                <div className="mt-4 flex justify-between gap-1.5">
                    {benefitCategories.map((category) => (
                        <button
                            className={`shrink-0 cursor-pointer rounded-full px-2.5 py-1.5 text-[12px] font-bold ${selectedCategory === category ? "bg-third text-white" : "bg-line text-text-body"}`}
                            type="button"
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    {visibleBenefits.map((benefit) => {
                        const selected = selectedIds.includes(benefit.id);
                        return (
                            <button
                                className={`flex min-h-[74px] cursor-pointer items-center gap-4 rounded-[10px] border px-5 text-left ${selected ? "border-primary bg-selection-light" : "border-line-strong bg-white"}`}
                                type="button"
                                key={benefit.id}
                                onClick={() =>
                                    setSelectedIds((previous) =>
                                        selected
                                            ? previous.filter(
                                                  (id) => id !== benefit.id
                                              )
                                            : [...previous, benefit.id]
                                    )
                                }
                            >
                                <span
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-white" : "border-line-strong"}`}
                                >
                                    {selected && <CheckIcon />}
                                </span>
                                <span>
                                    <strong className="block text-[14px]">
                                        {benefit.title}
                                    </strong>
                                    <span className="text-text-subtle mt-1 block text-[12px] font-semibold">
                                        {benefit.organization}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                    {visibleBenefits.length === 0 && (
                        <p className="text-text-subtle py-8 text-center text-[13px]">
                            추가할 수 있는 지원금이 없어요
                        </p>
                    )}
                </div>

                <button
                    className="bg-primary disabled:bg-disabled mt-6 h-[48px] w-full cursor-pointer rounded-[14px] text-[16px] font-bold text-white disabled:cursor-not-allowed"
                    type="button"
                    disabled={selectedIds.length === 0}
                    onClick={handleSave}
                >
                    {selectedIds.length > 0
                        ? `${selectedIds.length}개 추가하기`
                        : "추가할 지원금을 선택해주세요"}
                </button>
            </section>
        </div>
    );
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mt-6 mb-2 text-[13px] font-bold">{children}</h2>
);

const Select = <T extends string | number>({
    value,
    onChange,
    children,
}: {
    value: T;
    onChange: (value: T) => void;
    children: React.ReactNode;
}) => (
    <select
        className="border-line-strong focus:border-primary h-[48px] w-full cursor-pointer rounded-[10px] border bg-white px-3 text-[13px] font-semibold outline-none"
        value={value}
        onChange={(event) =>
            onChange(
                (typeof value === "number"
                    ? Number(event.target.value)
                    : event.target.value) as T
            )
        }
    >
        {children}
    </select>
);

const CounterButton = ({
    children,
    label,
    onClick,
}: {
    children: React.ReactNode;
    label: string;
    onClick: () => void;
}) => (
    <button
        className="border-line-strong flex size-8 cursor-pointer items-center justify-center rounded-full border text-[22px] leading-none"
        type="button"
        aria-label={label}
        onClick={onClick}
    >
        {children}
    </button>
);

const SearchIcon = () => (
    <svg
        className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
    >
        <circle
            cx="8.5"
            cy="8.5"
            r="5.5"
            stroke="currentColor"
            strokeWidth="1.5"
        />
        <path
            d="m13 13 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

export default MyPageEdit;
