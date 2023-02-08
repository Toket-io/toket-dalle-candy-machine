import { NextApiRequest, NextApiResponse } from "next";
const QSTASH = `https://qstash.upstash.io/v1/publish/`;
const DALL_E = "https://api.openai.com/v1/images/generations";
const VERCEL_URL = "https://dalle-2.vercel.app";
import rateLimit from "../../utils/rate-limit";

const limiter = rateLimit({
  uniqueTokenPerInterval: 500, // 500 unique tokens per interval
  interval: 60000, // 1 minute
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.query;
  console.log("*AC received api call: ", prompt);

  try {
    // Check if the user has exceeded maximum number of requests per minute
    await limiter.check(res, 5, "CACHE_TOKEN").catch((e) => {
      // 5 requests per minute
      return res.status(429).json({
        message:
          "You have exceeded the maximum number of requests. Please try again in a minute.",
        description: "The user has exceeded the maximum number of requests",
      });
    });

    const responseDalle = await fetch(DALL_E, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "512x512",
      }),
    });
    const json = await responseDalle.json();
    console.log("*AC json response: ", json);

    return res.status(202).json(json);



  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, type: "Internal server error" });
  }
}
