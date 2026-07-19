import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import { regionNames, regions } from "@/constants/regions";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const employmentOptions = [
    "재직중",
    "구직중",
    "학생",
    "프리랜서",
    "자영업",
    "기타",
];
const categories = ["청년", "주거", "고용", "교육", "출산/육아", "창업"];
const policies = [
    {
        id: 1,
        title: "청년 월세 특별지원",
        organization: "국토교통부",
        categories: ["청년", "주거"],
    },
    {
        id: 2,
        title: "근로장려금",
        organization: "국세청",
        categories: ["고용"],
    },
    {
        id: 3,
        title: "청년내일저축계좌",
        organization: "보건복지부",
        categories: ["청년"],
    },
    {
        id: 4,
        title: "국민내일배움카드",
        organization: "고용노동부",
        categories: ["고용", "교육"],
    },
    {
        id: 5,
        title: "주거급여",
        organization: "국토교통부",
        categories: ["주거"],
    },
    {
        id: 6,
        title: "평생교육바우처",
        organization: "교육부",
        categories: ["교육"],
    },
    {
        id: 7,
        title: "첫만남이용권",
        organization: "보건복지부",
        categories: ["출산/육아"],
    },
    {
        id: 8,
        title: "부모급여",
        organization: "보건복지부",
        categories: ["출산/육아"],
    },
    {
        id: 9,
        title: "예비창업패키지",
        organization: "중소벤처기업부",
        categories: ["창업"],
    },
    {
        id: 10,
        title: "청년창업사관학교",
        organization: "중소벤처기업진흥공단",
        categories: ["청년", "창업"],
    },
];

const currentYear = new Date().getFullYear();
const years = Array.from(
    { length: 83 },
    (_, index) => currentYear - 14 - index
);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const days = Array.from({ length: 31 }, (_, index) => index + 1);

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [birthYear, setBirthYear] = useState(2000);
    const [birthMonth, setBirthMonth] = useState(3);
    const [birthDay, setBirthDay] = useState(14);
    const [city, setCity] = useState("서울특별시");
    const [district, setDistrict] = useState("강남구");
    const [employment, setEmployment] = useState("재직중");
    const [income, setIncome] = useState("200 ~ 300 만원");
    const [householdSize, setHouseholdSize] = useState(1);
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("청년");
    const [selectedPolicies, setSelectedPolicies] = useState<number[]>([1]);

    const age = useMemo(() => {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthYear;
        const birthdayPassed =
            today.getMonth() + 1 > birthMonth ||
            (today.getMonth() + 1 === birthMonth &&
                today.getDate() >= birthDay);

        if (!birthdayPassed) calculatedAge -= 1;
        return calculatedAge;
    }, [birthDay, birthMonth, birthYear]);

    const visiblePolicies = policies.filter((policy) => {
        const normalizedQuery = query.trim().toLowerCase();
        const matchesCategory = policy.categories.includes(selectedCategory);
        const matchesQuery =
            normalizedQuery.length === 0 ||
            policy.title.toLowerCase().includes(normalizedQuery) ||
            policy.organization.toLowerCase().includes(normalizedQuery);

        return matchesCategory && matchesQuery;
    });

    const handleBack = () => {
        if (step === 1) navigate(-1);
        else setStep((previous) => previous - 1);
    };

    const handleNext = () => {
        if (step < 3) setStep((previous) => previous + 1);
        else navigate("/");
    };

    const handleSkip = () => {
        if (step < 3) setStep((previous) => previous + 1);
        else navigate("/");
    };

    const togglePolicy = (id: number) => {
        setSelectedPolicies((previous) =>
            previous.includes(id)
                ? previous.filter((policyId) => policyId !== id)
                : [...previous, id]
        );
    };

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground text-text-strong flex min-h-svh w-full max-w-[390px] flex-col px-6 pt-[72px] pb-8">
                <Header showBack onBack={handleBack} />

                <div className="bg-line mt-3 h-[5px] overflow-hidden rounded-full">
                    <div
                        className="bg-primary h-full rounded-full transition-[width] duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
                <p className="mt-2 text-[12px] font-semibold text-[#888]">
                    {step}/3 단계
                </p>

                <div className="mt-5 flex-1">
                    {step === 1 && (
                        <StepOne
                            birthYear={birthYear}
                            birthMonth={birthMonth}
                            birthDay={birthDay}
                            age={age}
                            city={city}
                            district={district}
                            employment={employment}
                            onBirthYearChange={setBirthYear}
                            onBirthMonthChange={setBirthMonth}
                            onBirthDayChange={setBirthDay}
                            onCityChange={(nextCity) => {
                                setCity(nextCity);
                                setDistrict(regions[nextCity][0]);
                            }}
                            onDistrictChange={setDistrict}
                            onEmploymentChange={setEmployment}
                        />
                    )}
                    {step === 2 && (
                        <StepTwo
                            income={income}
                            householdSize={householdSize}
                            onIncomeChange={setIncome}
                            onHouseholdSizeChange={setHouseholdSize}
                        />
                    )}
                    {step === 3 && (
                        <StepThree
                            query={query}
                            selectedCategory={selectedCategory}
                            selectedPolicies={selectedPolicies}
                            visiblePolicies={visiblePolicies}
                            onQueryChange={setQuery}
                            onCategoryChange={setSelectedCategory}
                            onPolicyToggle={togglePolicy}
                        />
                    )}
                </div>

                <Button className="mt-7" onClick={handleNext}>
                    {step === 3 ? "완료" : "다음"}
                </Button>
                {step > 1 && (
                    <button
                        className="mx-auto mt-4 cursor-pointer text-[12px] text-[#9a9a9a] underline underline-offset-2"
                        type="button"
                        onClick={handleSkip}
                    >
                        건너뛰기
                    </button>
                )}
            </section>
        </main>
    );
};

type StepOneProps = {
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    age: number;
    city: string;
    district: string;
    employment: string;
    onBirthYearChange: (value: number) => void;
    onBirthMonthChange: (value: number) => void;
    onBirthDayChange: (value: number) => void;
    onCityChange: (value: string) => void;
    onDistrictChange: (value: string) => void;
    onEmploymentChange: (value: string) => void;
};

const StepOne = ({
    birthYear,
    birthMonth,
    birthDay,
    age,
    city,
    district,
    employment,
    onBirthYearChange,
    onBirthMonthChange,
    onBirthDayChange,
    onCityChange,
    onDistrictChange,
    onEmploymentChange,
}: StepOneProps) => (
    <>
        <StepHeading
            eyebrow="기본정보"
            title={
                <>
                    맞춤 추천을 위해
                    <br />몇 가지만 알려주세요
                </>
            }
            description="입력한 정보는 나중에 설정에서 언제든 수정할 수 있어요"
        />

        <FieldLabel>생년월일(필수)</FieldLabel>
        <div className="grid grid-cols-3 gap-3">
            <Select
                value={birthYear}
                onChange={(value) => onBirthYearChange(Number(value))}
            >
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}년
                    </option>
                ))}
            </Select>
            <Select
                value={birthMonth}
                onChange={(value) => onBirthMonthChange(Number(value))}
            >
                {months.map((month) => (
                    <option key={month} value={month}>
                        {month}월
                    </option>
                ))}
            </Select>
            <Select
                value={birthDay}
                onChange={(value) => onBirthDayChange(Number(value))}
            >
                {days.map((day) => (
                    <option key={day} value={day}>
                        {day}일
                    </option>
                ))}
            </Select>
        </div>
        <div className="bg-green-light text-green-dark mt-3 rounded-[10px] px-4 py-3 text-[13px] font-semibold">
            만 {age}세로 계산돼요
        </div>

        <FieldLabel>거주지(필수)</FieldLabel>
        <div className="grid grid-cols-2 gap-3">
            <Select value={city} onChange={onCityChange}>
                {regionNames.map((region) => (
                    <option key={region}>{region}</option>
                ))}
            </Select>
            <Select value={district} onChange={onDistrictChange}>
                {regions[city].map((districtName) => (
                    <option key={districtName}>{districtName}</option>
                ))}
            </Select>
        </div>

        <FieldLabel>고용상태(필수)</FieldLabel>
        <div className="grid grid-cols-2 gap-3">
            {employmentOptions.map((option) => (
                <button
                    className={`relative h-[46px] cursor-pointer rounded-[10px] border text-[14px] font-semibold ${employment === option ? "border-primary bg-green-light text-green-dark" : "border-[#d8d8d8] bg-white"}`}
                    type="button"
                    key={option}
                    onClick={() => onEmploymentChange(option)}
                >
                    {option}
                    {employment === option && (
                        <span className="text-primary absolute top-1.5 right-2">
                            ✓
                        </span>
                    )}
                </button>
            ))}
        </div>
        <div className="bg-warning-light text-warning mt-4 rounded-[10px] px-4 py-3 text-center text-[12px] leading-[1.45] font-semibold">
            현재 고용상태는 지원금 추천 조건에만 활용되며
            <br />
            저장 후 언제든 수정할 수 있어요
        </div>
    </>
);

type StepTwoProps = {
    income: string;
    householdSize: number;
    onIncomeChange: (value: string) => void;
    onHouseholdSizeChange: (value: number) => void;
};

const StepTwo = ({
    income,
    householdSize,
    onIncomeChange,
    onHouseholdSizeChange,
}: StepTwoProps) => (
    <>
        <StepHeading
            eyebrow="추가정보"
            title={
                <>
                    조금 더 정확하게
                    <br />
                    추천해 드릴게요
                </>
            }
            description="선택 항목이에요. 건너 뛰어도 괜찮아요"
        />

        <FieldLabel>월 소득구간</FieldLabel>
        <Select value={income} onChange={onIncomeChange}>
            <option>소득 없음</option>
            <option>100만원 미만</option>
            <option>100 ~ 200 만원</option>
            <option>200 ~ 300 만원</option>
            <option>300 ~ 400 만원</option>
            <option>400만원 이상</option>
        </Select>

        <FieldLabel>가구원 수</FieldLabel>
        <div className="flex h-[52px] items-center justify-between rounded-[10px] border border-[#d8d8d8] bg-white px-4">
            <CounterButton
                label="가구원 수 줄이기"
                onClick={() =>
                    onHouseholdSizeChange(Math.max(1, householdSize - 1))
                }
            >
                −
            </CounterButton>
            <span className="text-[15px] font-bold">{householdSize}명</span>
            <CounterButton
                label="가구원 수 늘리기"
                onClick={() =>
                    onHouseholdSizeChange(Math.min(10, householdSize + 1))
                }
            >
                ＋
            </CounterButton>
        </div>
    </>
);

type StepThreeProps = {
    query: string;
    selectedCategory: string;
    selectedPolicies: number[];
    visiblePolicies: typeof policies;
    onQueryChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onPolicyToggle: (id: number) => void;
};

const StepThree = ({
    query,
    selectedCategory,
    selectedPolicies,
    visiblePolicies,
    onQueryChange,
    onCategoryChange,
    onPolicyToggle,
}: StepThreeProps) => (
    <>
        <StepHeading
            eyebrow="추가정보"
            title={
                <>
                    이미 받고 있는
                    <br />
                    지원금이 있나요?
                </>
            }
            description="선택한 항목은 제외하고 추천해 드릴 수 있어요"
        />

        <div className="relative mt-6">
            <svg
                className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#777]"
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
            <input
                className="focus:border-primary h-[50px] w-full rounded-[10px] border border-[#d8d8d8] bg-white pr-4 pl-11 text-[13px] outline-none placeholder:text-[#9a9a9a]"
                value={query}
                placeholder="지원금명 또는 기관명으로 검색해보세요"
                onChange={(event) => onQueryChange(event.target.value)}
            />
        </div>

        <div className="mt-3 flex w-full items-center justify-between pb-1">
            {categories.map((category) => (
                <button
                    className="bg-third shrink-0 cursor-pointer rounded-full px-2 py-[5px] text-[12px] leading-[15px] font-bold whitespace-nowrap text-white min-[390px]:px-[10px] min-[390px]:py-[6px] min-[390px]:text-[13px] min-[390px]:leading-[16px]"
                    type="button"
                    key={category}
                    aria-pressed={selectedCategory === category}
                    onClick={() => onCategoryChange(category)}
                >
                    {category}
                </button>
            ))}
        </div>

        <FieldLabel>현재 수령 중인 지원금</FieldLabel>
        <div className="flex flex-col gap-2.5">
            {visiblePolicies.map((policy) => {
                const selected = selectedPolicies.includes(policy.id);
                return (
                    <button
                        className={`flex min-h-[66px] cursor-pointer items-center gap-4 rounded-[10px] border px-4 text-left ${selected ? "border-primary bg-green-light" : "border-[#d8d8d8] bg-white"}`}
                        type="button"
                        key={policy.id}
                        onClick={() => onPolicyToggle(policy.id)}
                    >
                        <span
                            className={`flex size-7 shrink-0 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-white" : "border-[#c8c8c8]"}`}
                        >
                            {selected && "✓"}
                        </span>
                        <span>
                            <strong className="block text-[14px]">
                                {policy.title}
                            </strong>
                            <span className="mt-1 block text-[11px] text-[#8a8a8a]">
                                {policy.organization}
                            </span>
                        </span>
                    </button>
                );
            })}
            {visiblePolicies.length === 0 && (
                <p className="py-8 text-center text-[13px] text-[#999]">
                    검색 결과가 없어요
                </p>
            )}
        </div>
    </>
);

const StepHeading = ({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: React.ReactNode;
    description: string;
}) => (
    <header>
        <p className="text-primary text-[13px] font-bold">{eyebrow}</p>
        <h1 className="mt-2 text-[24px] leading-[1.25] font-bold">{title}</h1>
        <p className="mt-2 text-[12px] text-[#929292]">{description}</p>
    </header>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mt-7 mb-2.5 text-[13px] font-bold">{children}</h2>
);

const Select = ({
    value,
    onChange,
    children,
}: {
    value: string | number;
    onChange: (value: string) => void;
    children: React.ReactNode;
}) => (
    <select
        className="focus:border-primary h-[48px] w-full cursor-pointer rounded-[10px] border border-[#d8d8d8] bg-white px-3 text-[13px] font-semibold outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
        className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-[#bdbdbd] text-[20px] leading-none"
        type="button"
        aria-label={label}
        onClick={onClick}
    >
        {children}
    </button>
);

export default Onboarding;
