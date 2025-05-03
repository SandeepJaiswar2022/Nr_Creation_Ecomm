
export const normalizeError = (error) => {
    // Axios backend error with message
    if (error?.response?.data?.message) return error.response?.data?.message;

    // Axios network or client-side error
    if (error?.message) return error.message;

    // Fallback
    return "Something went wrong";
};