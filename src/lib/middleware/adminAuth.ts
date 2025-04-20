import { NextApiRequest, NextApiResponse } from 'next';

export function requireAdmin(handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (!session || session.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return handler(req, res);
  };
}
