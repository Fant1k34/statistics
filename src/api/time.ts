export const toTimeString = (totalSeconds: number) => {
    const totalMs = totalSeconds * 1000
    return new Date(totalMs).toISOString().slice(11, 19)
}
