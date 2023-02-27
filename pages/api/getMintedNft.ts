import { NextApiRequest, NextApiResponse } from "next";
const TOKET_URL = "https://toket-public-gateway-3cpfdsl0.uc.gateway.dev/v0/easyMint";
import rateLimit from "../../utils/rate-limit";

const limiter = rateLimit({
    uniqueTokenPerInterval: 500, // 500 unique tokens per interval
    interval: 60000, // 1 minute
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query

    try {
        // // Check if the user has exceeded maximum number of requests per minute
        // await limiter.check(res, 5, "CACHE_TOKEN").catch((e) => {
        //     // 5 requests per minute
        //     return res.status(422).json({
        //         message:
        //             "You have exceeded the maximum number of requests. Please try again in a minute.",
        //         description: "The user has exceeded the maximum number of requests",
        //     });
        // });

        const response = await fetch(`${TOKET_URL}/${id}`, {
            method: "GET",
            headers: {
                "x-public-key": process.env.TOKET_PUBLIC_KEY,
                "x-api-key": process.env.TOKET_API_KEY,
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();
        return res.status(200).json(json);
    } catch (error) {
        return res
            .status(500)
            .json({ message: error.message, type: "Internal server error" });
    }
}
