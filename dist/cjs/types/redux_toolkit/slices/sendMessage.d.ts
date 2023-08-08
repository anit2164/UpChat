export declare const sendMessageHandler: (data: any) => (dispatch: any) => Promise<void>;
declare const _default: import("redux").Reducer<{
    isLoading: boolean;
    error: string;
    message: string;
    data: null;
}, import("redux").AnyAction>;
export default _default;
export declare const sendMessageAction: import("@reduxjs/toolkit").CaseReducerActions<{
    sendMessageInfo(state: import("immer/dist/internal").WritableDraft<{
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    }>): void;
    sendMessageSuccess(state: import("immer/dist/internal").WritableDraft<{
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    sendMessageFailed(state: import("immer/dist/internal").WritableDraft<{
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    }>, action: {
        payload: any;
        type: string;
    }): void;
}, "sendMessage">;
