import { ValidationError } from '../../src/core/validationError';

export async function assertValidationErrorWithMessage(
  task: () => unknown,
  message: string
) {
  await expect(task()).rejects.toThrowError(message);
  await expect(task()).rejects.toThrowError(ValidationError);
}

export function getTodayString() {
  return getDateString(new Date());
}

export function getDateString(date: Date) {
  const dateString = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  return dateString;
}
