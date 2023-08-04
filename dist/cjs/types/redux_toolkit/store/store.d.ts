declare const store: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<{
    allChannelListing: {
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    };
    sendMessage: {
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    };
    addMemberListing: {
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    };
}, import("redux").AnyAction, [import("@reduxjs/toolkit").ThunkMiddleware<{
    allChannelListing: {
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    };
    sendMessage: {
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    };
    addMemberListing: {
        isLoading: boolean;
        error: string;
        message: string;
        data: null;
    };
}, import("redux").AnyAction, undefined>]>;
export default store;
