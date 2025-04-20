#!/usr/bin/env ts-node
import { program } from 'commander';
program.version('1.0.0');
program.command('post <type>').action(type=>console.log(`Create post type ${type}`));
program.parse(process.argv);
