import { NextApiRequest, NextApiResponse } from "next";
import handler from "./[type]";

export default function StatusHandler(req: NextApiRequest, res: NextApiResponse) {
    req.query.type = "status";
    return handler(req, res);
}
