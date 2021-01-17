export const assertNever = (typeDescription: string, value: never): never => {
  throw new Error(
    `Unhandled ${typeDescription}: ${value}`
  );
};
