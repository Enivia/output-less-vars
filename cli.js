#!/usr/bin/env node

const { Command } = require("commander");
const outputLessVars = require(".");

const program = new Command();

program
  .requiredOption("--less <char>", "source less file path")
  .option("--json <char>", "output json file path")
  .action((options) => outputLessVars(options));
program.parse();
