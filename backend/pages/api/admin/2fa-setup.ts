import { NextApiRequest,NextApiResponse } from 'next';
import speakeasy from 'speakeasy';
export default function handler(req,res){
  const secret = speakeasy.generateSecret();
  res.json({ otpauth_url: secret.otpauth_url });
}
