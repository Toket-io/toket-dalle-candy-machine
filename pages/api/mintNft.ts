import { NextApiRequest, NextApiResponse } from "next";
const TOKET_URL = "https://toket-public-gateway-sf3wxt4.uc.gateway.dev/v0/easyMint";
import rateLimit from "../../utils/rate-limit";

const limiter = rateLimit({
  uniqueTokenPerInterval: 500, // 500 unique tokens per interval
  interval: 60000, // 1 minute
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt, imageUrl, wallet, name } = req.query;
  console.log("*AC received api call: ", prompt, imageUrl);

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

    const body = {
      "mintToAddress": "0x4D1f1711CD08D5d19f76Bd7BD170171671FB9945",
      "name": "Easy Mint Demo",
      "description": "This is a demo of Toket'\''s Easy mint API",
      "imageUrl": imageUrl,
      "attributes": [
        {
          "traitType": "Color",
          "value": "Red"
        },
        {
          "traitType": "Boost Level",
          "value": 5,
          "maxValue": 20,
          "displayType": "boost_number"
        }
      ]
    }

    const response = await fetch(TOKET_URL, {
      method: "POST",
      headers: {
        "x-public-key": process.env.TOKET_PUBLIC_KEY,
        "x-api-key": process.env.TOKET_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    console.log("*AC json response: ", json);

    return res.status(200).json(json);

  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, type: "Internal server error" });
  }
}
