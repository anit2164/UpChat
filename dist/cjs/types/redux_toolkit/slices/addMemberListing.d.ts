export declare const addMemberListingHandler: () => (dispatch: any) => Promise<void>;
declare const _default: import("redux").Reducer<{
    isLoading: boolean;
    error: string;
    message: string;
    data: null;
}, import("redux").AnyAction>;
export default _default;
export declare const addMemberAction: import("@reduxjs/toolkit").CaseReducerActions<{
    addMemberListingInfo(state: import("immer/dist/internal").WritableDraft<{
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    }>): void;
    addMemberListingInfoSuccess(state: import("immer/dist/internal").WritableDraft<{
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    addMemberListingInfoFailed(state: import("immer/dist/internal").WritableDraft<{
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    }>, action: {
        payload: any;
        type: string;
    }): void;
}, "addMemberListing">;
