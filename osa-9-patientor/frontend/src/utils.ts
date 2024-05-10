export function assertNever(neverThing: never) {
    throw new Error('unexpected case: ' + neverThing);
}
