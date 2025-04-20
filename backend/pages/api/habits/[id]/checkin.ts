import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest,res: NextApiResponse){
  const session = await getSession({ req });
  if(!session) return res.status(401).json({ error:'Auth required' });
  const habitId = parseInt(req.query.id as string,10);
  if(req.method==='POST'){
    // create check-in for today
    const today = new Date();
    const checkin = await prisma.checkIn.create({ data:{ habitId, date: today } });
    return res.status(201).json({ checkin });
  }
  res.setHeader('Allow',['POST']);res.status(405).end();
}
