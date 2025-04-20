import { NextApiRequest, NextApiResponse } from "next";
import handler from "./[type]";

export default function PollHandler(req: NextApiRequest, res: NextApiResponse) {
    req.query.type = "poll";
    return handler(req, res);
}
