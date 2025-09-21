import { useState, useCallback } from "react";

export const useMinimumLoading = (minimumDuration = 3000, timeoutDuration = 5000) => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = useCallback(async (loadingFunction) => {
        setIsLoading(true);
        const startTime = Date.now();

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), timeoutDuration)
        );

        try {
            // Race between loading function and timeout
            await Promise.race([loadingFunction(), timeoutPromise]);
        } catch (error) {
            setIsLoading(false); // Stop loading on failure
            throw error; // Pass error to caller
        }

        // Enforce minimum loading duration
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumDuration - elapsedTime);
        if (remainingTime > 0) {
            await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }

        setIsLoading(false);
    }, [minimumDuration, timeoutDuration]);

    return { isLoading, startLoading };
};
