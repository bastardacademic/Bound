import { NextApiRequest, NextApiResponse } from "next";
import handler from "./[type]";

export default function MediaHandler(req: NextApiRequest, res: NextApiResponse) {
    req.query.type = "media";
    return handler(req, res);
}
