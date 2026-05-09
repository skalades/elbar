export const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
};

export const parseRupiah = (rupiahString) => {
    if (!rupiahString) return 0;
    const cleanString = rupiahString.replace(/[^0-9]/g, '');
    return parseInt(cleanString, 10) || 0;
};
