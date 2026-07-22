/** GET /regions 응답의 시·군·구 항목입니다. */
export interface Sigungu {
    code: string;
    name: string;
}

/**
 * GET /regions 응답입니다.
 * 시·도 목록 조회와 시·군·구 목록 조회가 같은 엔드포인트를 사용하므로
 * 조회 방식에 따라 사용하지 않는 필드는 null입니다.
 */
export interface RegionResult {
    sidoList: string[] | null;
    sido: string | null;
    sigunguList: Sigungu[] | null;
}
