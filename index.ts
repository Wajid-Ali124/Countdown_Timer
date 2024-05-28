#! /usr/bin/env node

import inquirer from "inquirer";

interface TimerInput {
  date: string;
  time: string;
}

const getTargetDate = (input: TimerInput): Date => {
  const [year, month, day] = input.date.split("-").map(Number);
  const [hours, minutes] = input.time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

const startCountdown = (targetDate: Date) => {
  const countdown = setInterval(() => {
    const now = new Date();
    const timeLeft = targetDate.getTime() - now.getTime();

    if (timeLeft <= 0) {
      clearInterval(countdown);
      console.log("Countdown complete!");
      return;
    }

    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

    console.log(`Time left: ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
  }, 1000);
};

const main = async () => {
  const answers = await inquirer.prompt<TimerInput>([
    {
      type: "input",
      name: "date",
      message: "Enter the target date (YYYY-MM-DD):",
      validate: (input) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
          return "Please enter a valid date in YYYY-MM-DD format";
        }
        const [year, month, day] = input.split("-").map(Number);
        const targetDate = new Date(year, month - 1, day);
        if (isNaN(targetDate.getTime())) {
          return "Invalid date. Please enter a valid date.";
        }
        const today = new Date();
        if (targetDate.getTime() <= today.getTime()) {
          return "Please enter a date in the future.";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "time",
      message: "Enter the target time (HH:MM, 24-hour format):",
      validate: (input) => {
        if (!/^\d{2}:\d{2}$/.test(input)) {
          return "Please enter a valid time in HH:MM format";
        }
        const [hours, minutes] = input.split(":").map(Number);
        if (hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
          return "Please enter a valid time in HH:MM format";
        }
        return true;
      },
    },
  ]);

  const targetDate = getTargetDate(answers);
  startCountdown(targetDate);
};

main();
