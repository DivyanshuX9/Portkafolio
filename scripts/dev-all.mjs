import { spawn } from "node:child_process";

const processes = [];

function start(command, args, label) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code, signal) => {
    const index = processes.indexOf(child);
    if (index !== -1) {
      processes.splice(index, 1);
    }

    if (code !== 0 && code !== null) {
      console.error(`${label} exited with code ${code}`);
      shutdown(code);
      return;
    }

    if (signal) {
      shutdown(0);
    }
  });

  processes.push(child);
  return child;
}

function shutdown(code = 0) {
  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }

  if (process.exitCode === undefined) {
    process.exitCode = code;
  }
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

start("npm", ["run", "dev"], "frontend");
start("python", ["-m", "uvicorn", "backend.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"], "backend");