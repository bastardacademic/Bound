import { NextApiRequest,NextApiResponse } from 'next';
export default function handler(req,res){
  res.json({ sessions: [] });
}
