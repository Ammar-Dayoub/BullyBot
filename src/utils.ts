// Delays execution of script
export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomFromArray(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
}
