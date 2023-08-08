export declare const allChannelListingHandler: () => (dispatch: any) => Promise<void>;
declare const _default: import("redux").Reducer<{
    isLoading: boolean;
    error: string;
    message: string;
    data: null;
}, import("redux").AnyAction>;
export default _default;
export declare const allChannelAction: import("@reduxjs/toolkit").CaseReducerActions<{
    allChannelListingInfo(state: import("immer/dist/internal").WritableDraft<{
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    }>): void;
    allChannelListingInfoSuccess(state: import("immer/dist/internal").WritableDraft<{
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    allChannelListingInfoFailed(state: import("immer/dist/internal").WritableDraft<{
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    }>, action: {
        payload: any;
        type: string;
    }): void;
}, "allChannelListing">;
