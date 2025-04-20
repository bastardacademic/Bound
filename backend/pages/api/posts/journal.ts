import { NextApiRequest, NextApiResponse } from "next";
import handler from "./[type]";

export default function JournalHandler(req: NextApiRequest, res: NextApiResponse) {
    req.query.type = "journal";
    return handler(req, res);
}
