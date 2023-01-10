export const isMobile = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--device') ===
    'mobile'
