export function assertBadRequestWithMessage(response, message: string) {
  assertStatusCode(response, 400);
  assertBody(response, { message: message });
}

export function assertStatusCode(response, statusCode: number) {
  expect(response.statusCode).toBe(statusCode);
}

export function assertBody(response, body: unknown) {
  expect(response.body).toEqual(body);
}

export const Messages = {
  SERVER_ERROR: 'Server Error',
};
