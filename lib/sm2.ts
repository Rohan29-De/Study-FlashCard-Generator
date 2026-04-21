/**
 * SM-2 Algorithm Implementation
 * q: Quality of recall (0-5)
 * 5: perfect response
 * 4: correct response after a hesitation
 * 3: correct response recalled with serious difficulty
 * 2: incorrect response; where the correct one seemed easy to recall
 * 1: incorrect response; the correct one remembered
 * 0: complete blackout.
 */
export function calculateSM2(
  q: number,
  prevRepetition: number,
  prevInterval: number,
  prevEfactor: number
) {
  let repetition: number;
  let interval: number;
  let efactor: number;

  if (q >= 3) {
    // Correct response
    if (prevRepetition === 0) {
      repetition = 1;
      interval = 1;
    } else if (prevRepetition === 1) {
      repetition = 2;
      interval = 6;
    } else {
      repetition = prevRepetition + 1;
      interval = Math.round(prevInterval * prevEfactor);
    }

    // Calculate new E-Factor
    efactor = prevEfactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  } else {
    // Incorrect response - stay due for review today
    repetition = 0;
    interval = 0;
    efactor = prevEfactor;
  }

  // Cap E-Factor at minimum 1.3
  if (efactor < 1.3) efactor = 1.3;

  // Calculate new due date (current time + interval days)
  const dueDate = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    repetition,
    interval,
    efactor,
    dueDate,
  };
}

export function getMasteryLevel(repetition: number): 'new' | 'shaky' | 'mastered' {
  if (repetition === 0) return 'new';
  if (repetition < 3) return 'shaky';
  return 'mastered';
}
