import { NextApiRequest,NextApiResponse } from 'next';
import speakeasy from 'speakeasy';
export default function handler(req,res){
  const { token, secret } = req.body;
  const ok = speakeasy.totp.verify({ token, secret, window:1 });
  res.json({ verified: ok });
}
