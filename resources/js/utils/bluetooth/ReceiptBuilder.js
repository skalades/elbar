/**
 * ReceiptBuilder
 * 
 * Builds Elbar Car Wash receipt using EscPosEncoder.
 * Formats header, order info, items, total, and footer
 * into a Uint8Array ready for the thermal printer.
 */
import EscPosEncoder from './EscPosEncoder';

/**
 * Format number to Rupiah string (compact, no symbol for receipt)
 * @param {number} amount 
 * @returns {string}
 */
function formatRp(amount) {
    return 'Rp ' + Number(amount).toLocaleString('id-ID');
}

/**
 * Format date to Indonesian locale string
 * @param {string|Date} date 
 * @returns {string}
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString('id-ID', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Build a complete receipt for an Elbar order
 * 
 * @param {object} orderData - Order data from the server
 * @param {string} orderData.order_number
 * @param {object} orderData.vehicle
 * @param {string} orderData.vehicle.plate_number
 * @param {Array} orderData.items - Array of order items
 * @param {number} orderData.total
 * @param {string} orderData.payment_method
 * @param {string} orderData.created_at
 * @param {number} [orderData.jumlah_bayar] - Amount paid (for cash)
 * @param {number} [orderData.kembalian] - Change (for cash)
 * @param {string} [orderData.voucher_code] - Applied voucher
 * @param {number} [orderData.discount] - Discount amount
 * @param {object} options
 * @param {string} [options.storeName] - Store name
 * @param {string} [options.storeAddress] - Store address
 * @param {string} [options.storePhone] - Store phone
 * @param {string} [options.cashierName] - Cashier name
 * @param {number} [options.paperWidth] - Paper width (58 or 80)
 * @returns {Uint8Array}
 */
export function buildElbarReceipt(orderData, options = {}) {
    const {
        storeName = 'ELBAR CAR WASH',
        storeAddress = 'Jl. Contoh No. 123, Kota',
        storePhone = '08123456789',
        cashierName = '-',
        paperWidth = 58,
    } = options;

    const enc = new EscPosEncoder({ paperWidth });

    // ── Initialize ───────────────────────────────────────────
    enc.initialize();

    // ── Header ───────────────────────────────────────────────
    enc.align('center');
    enc.bold(true).textSize(2, 2);
    enc.line(storeName);
    enc.textSize(1, 1).bold(false);
    enc.line(storeAddress);
    enc.line('Telp: ' + storePhone);
    enc.separator();

    // ── Order Info ────────────────────────────────────────────
    enc.align('left');
    enc.textColumns('No:', orderData.order_number || '-');
    enc.textColumns('Plat:', orderData.vehicle?.plate_number || '-');
    enc.textColumns('Waktu:', formatDate(orderData.created_at));
    enc.textColumns('Kasir:', cashierName);
    enc.separator();

    // ── Items ────────────────────────────────────────────────
    if (orderData.items && orderData.items.length > 0) {
        for (const item of orderData.items) {
            const name = item.service?.name || item.name || 'Layanan';
            const price = Number(item.price || 0);
            enc.bold(true).line(name);
            enc.bold(false);
            enc.textColumns('  1 x ' + formatRp(price), formatRp(price));
        }
    }

    enc.separator();

    // ── Discount (if any) ────────────────────────────────────
    if (orderData.discount && orderData.discount > 0) {
        if (orderData.voucher_code) {
            enc.textColumns('Voucher:', orderData.voucher_code);
        }
        enc.textColumns('Diskon:', '-' + formatRp(orderData.discount));
        enc.separator();
    }

    // ── Total ────────────────────────────────────────────────
    enc.bold(true).textSize(1, 2);
    enc.textColumns('TOTAL:', formatRp(orderData.total || 0));
    enc.textSize(1, 1).bold(false);

    enc.textColumns('Metode:', (orderData.payment_method || '-').toUpperCase());

    // Cash payment details
    if (orderData.payment_method === 'tunai') {
        if (orderData.jumlah_bayar) {
            enc.textColumns('Bayar:', formatRp(orderData.jumlah_bayar));
        }
        if (orderData.kembalian && orderData.kembalian > 0) {
            enc.textColumns('Kembali:', formatRp(orderData.kembalian));
        }
    }

    enc.separator();

    // ── Footer ───────────────────────────────────────────────
    enc.align('center');
    enc.emptyLine();
    enc.line('Terima Kasih');
    enc.line('Silakan tunggu di ruang tunggu.');
    enc.emptyLine();

    // ── Cut ──────────────────────────────────────────────────
    enc.cut();

    return enc.encode();
}

export default { buildElbarReceipt };
