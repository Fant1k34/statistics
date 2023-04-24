export const sklonatel = (n: number) => {
    console.log(n)
    if (n === 0 || n > 5) {
        return 'ступеней';
    }
    if (n === 1) {
        return 'ступень'
    }
    if ([2, 3, 4].includes(n)) {
        return 'ступени'
    }
    return 'ступени'
}