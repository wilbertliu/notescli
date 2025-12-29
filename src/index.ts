#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program.name("notescli").description("Create Apple Notes from Markdown (macOS).");

program
  .command("create")
  .description("Create a new note from Markdown input")
  .action(() => {
    process.stderr.write("Not implemented yet.\n");
    process.exitCode = 1;
  });

program.parse();
