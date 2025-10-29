import { BadRequestException } from '@nestjs/common';
import { SM2Result, SMInput } from '../types/sm2';

export function sm2(input: SMInput, quality: number): SM2Result {
  let { easeFactor, repetitions, interval } = input;

  if (quality < 0 || quality > 5) {
    throw new BadRequestException('quality must be between 0 and 5');
  }

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else {
      interval = Math.max(1, Math.round(interval * easeFactor));
    }
  }

  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + interval);

  return { easeFactor, repetitions, interval, nextDueDate };
}
