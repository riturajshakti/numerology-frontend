declare global {
  interface Number {
    readonly digit: number;
    readonly sum: number;
  }
}

export {}; // Ensure this file is treated as a module
