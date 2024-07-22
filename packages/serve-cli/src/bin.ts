#!/usr/bin/env node
import { DefaultLogger } from '@graphql-mesh/utils';
import { run } from './run.js';

// @inject-version globalThis.__VERSION__ here

const log = new DefaultLogger();

run({ log }).catch(err => {
  log.error(err);
  process.exit(1);
});
