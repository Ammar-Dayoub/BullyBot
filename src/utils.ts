// Delays execution of script
export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
