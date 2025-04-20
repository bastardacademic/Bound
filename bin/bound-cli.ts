#!/usr/bin/env ts-node
import { Command } from 'commander';
import fetch from 'node-fetch';
import fs from 'fs';

const program = new Command();
program.version('1.0.0');
program
  .command('post <type>')
  .description('Create a new post of given type (journal, media, status, poll)')
  .option('-d, --data <json>', 'JSON payload')
  .action(async (type, options) => {
    const payload = JSON.parse(options.data || '{}');
    const res = await fetch(http://localhost:3000/api/posts/, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log('Status:', res.status);
    console.log(await res.json());
  });

program
  .command('admin users')
  .description('List or manage users')
  .option('--suspend <id>', 'Suspend user by ID')
  .option('--unsuspend <id>', 'Unsuspend user by ID')
  .action(async (options) => {
    const url = 'http://localhost:3000/api/admin/users';
    const method = options.suspend || options.unsuspend ? 'POST' : 'GET';
    const body = options.suspend ? { userId: +options.suspend, suspend: true }
               : options.unsuspend ? { userId: +options.unsuspend, suspend: false }
               : undefined;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
    console.log(await res.json());
  });

program
  .command('admin flags')
  .description('List or act on flagged posts')
  .option('--approve <id>', 'Approve flagged post')
  .option('--remove <id>', 'Remove flagged post')
  .action(async (options) => {
    const url = 'http://localhost:3000/api/admin/flags';
    const method = options.approve || options.remove ? 'POST' : 'GET';
    const body = options.approve ? { postId: +options.approve, action: 'approve' }
               : options.remove ? { postId: +options.remove, action: 'remove' }
               : undefined;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
    console.log(await res.json());
  });

program.parse(process.argv);
