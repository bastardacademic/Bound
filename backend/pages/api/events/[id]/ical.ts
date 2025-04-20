import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { format as formatDate } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventId = parseInt(req.query.id as string, 10);
  const ev = await prisma.event.findUnique({ where: { id: eventId } });
  if (!ev) return res.status(404).end();
  const dtStart = formatDate(ev.startsAt, 'yyyyMMdd\'T\'HHmmss');
  const dtEnd = formatDate(ev.endsAt, 'yyyyMMdd\'T\'HHmmss');
  const ics = BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:event-@bound.app
SUMMARY:
DTSTART:
DTEND:
END:VEVENT
END:VCALENDAR;
  res.setHeader('Content-Type', 'text/calendar');
  res.send(ics);
}
