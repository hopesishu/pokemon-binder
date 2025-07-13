export function displayFormattedNumber(number) {
    if (number == null || isNaN(number)) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}