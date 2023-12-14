export const errorDebug = (error:any, identityCode:any) => {
	let err = new Error();
	const message = `
        Identity Code  📢 :: ${identityCode}
        StackTrace 🚀 :: ${err.stack}
    `;
	const errorResult = {
		statusCode: error.statusCode,
		responseBody: error.message,
		stackTrace: message,
	};

	return errorResult;
}
