import Button from "@/components/common/Button";
import {
    isRouteErrorResponse,
    useNavigate,
    useRouteError,
} from "react-router-dom";

const ErrorPage = ({ notFound = false }: { notFound?: boolean }) => {
    const navigate = useNavigate();
    const routeError = useRouteError();
    const isNotFound =
        notFound ||
        (isRouteErrorResponse(routeError) && routeError.status === 404);

    return (
        <main className="bg-surface-dim flex min-h-svh justify-center">
            <section className="bg-ground px-page-inline flex min-h-svh w-full max-w-[390px] flex-col items-center justify-center text-center">
                <p className="text-primary text-label-strong">
                    {isNotFound ? "404" : "오류"}
                </p>
                <h1 className="text-heading-page mt-2">
                    {isNotFound
                        ? "페이지를 찾을 수 없어요"
                        : "문제가 발생했어요"}
                </h1>
                <p className="text-text-muted text-label-medium mt-3">
                    {isNotFound
                        ? "주소가 잘못되었거나 페이지가 이동되었어요."
                        : "잠시 후 다시 시도해주세요."}
                </p>
                <Button className="mt-6" onClick={() => navigate("/")}>
                    홈으로 이동
                </Button>
            </section>
        </main>
    );
};

export default ErrorPage;
