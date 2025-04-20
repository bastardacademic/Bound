import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest,res: NextApiResponse){
  const session = await getSession({ req });
  if(!session) return res.status(401).json({ error: 'Auth required' });
  const userId = session.user.id;
  if(req.method==='GET'){
    const habits = await prisma.habit.findMany({ where:{ userId }, include:{ checkins:true } });
    return res.json(habits);
  }
  if(req.method==='POST'){
    const { name } = req.body;
    const habit = await prisma.habit.create({ data:{ name, userId } });
    return res.status(201).json(habit);
  }
  res.setHeader('Allow',['GET','POST']);res.status(405).end();
}
