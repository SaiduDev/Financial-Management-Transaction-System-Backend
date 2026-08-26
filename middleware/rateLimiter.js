import rateLimit from "express-rate-limit";

export let loginRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    success: {
        success: false,
        message: " Too many attempt, please try again in 15 minutes"
    }
});