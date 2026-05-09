/**
 * EscPosEncoder
 * 
 * Pure ESC/POS command encoder with fluent API.
 * Converts text and formatting into Uint8Array for thermal printers.
 */

const ESC = 0x1B;
const GS = 0x1D;
const LF = 0x0A;

const PAPER_WIDTHS = { 58: 32, 80: 48 };

class EscPosEncoder {
    constructor(options = {}) {
        const { paperWidth = 58 } = options;
        this._buffer = [];
        this._lineWidth = PAPER_WIDTHS[paperWidth] || 32;
    }

    initialize() { this._buffer.push(ESC, 0x40); return this; }

    align(a) {
        const m = { left: 0, center: 1, right: 2 };
        this._buffer.push(ESC, 0x61, m[a] ?? 0);
        return this;
    }

    bold(on) { this._buffer.push(ESC, 0x45, on ? 1 : 0); return this; }
    underline(on) { this._buffer.push(ESC, 0x2D, on ? 1 : 0); return this; }

    textSize(w = 1, h = 1) {
        const ww = Math.max(1, Math.min(8, w)) - 1;
        const hh = Math.max(1, Math.min(8, h)) - 1;
        this._buffer.push(GS, 0x21, (ww << 4) | hh);
        return this;
    }

    font(f) { this._buffer.push(ESC, 0x4D, f === 'b' ? 1 : 0); return this; }
    invert(on) { this._buffer.push(GS, 0x42, on ? 1 : 0); return this; }

    text(content) {
        for (let i = 0; i < content.length; i++) {
            const c = content.charCodeAt(i);
            this._buffer.push(c <= 0xFF ? c : 0x3F);
        }
        return this;
    }

    line(content) { return this.text(content).newline(); }
    newline() { this._buffer.push(LF); return this; }
    feed(n = 1) { this._buffer.push(ESC, 0x64, n); return this; }
    emptyLine() { this._buffer.push(LF); return this; }

    separator(ch = '-') { return this.line(ch.repeat(this._lineWidth)); }
    doubleSeparator() { return this.separator('='); }

    textColumns(left, right, options = {}) {
        const { bold: boldRight = false } = options;
        const maxW = this._lineWidth;
        const gap = maxW - left.length - right.length;
        let ln;
        if (gap > 0) {
            ln = left + ' '.repeat(gap) + right;
        } else {
            const maxL = maxW - right.length - 1;
            ln = left.substring(0, maxL) + ' ' + right;
        }
        if (boldRight) {
            const lp = ln.substring(0, ln.length - right.length);
            this.text(lp);
            this.bold(true).text(right).bold(false);
            return this.newline();
        }
        return this.line(ln);
    }

    textThreeColumns(left, center, right) {
        const maxW = this._lineWidth;
        const lw = Math.max(4, left.length + 1);
        const rw = Math.max(right.length, 10);
        const cw = maxW - lw - rw;
        const lp = left.padEnd(lw);
        const cp = center.substring(0, cw).padEnd(cw);
        const rp = right.padStart(rw);
        return this.line(lp + cp + rp);
    }

    cut() { this.feed(3); this._buffer.push(GS, 0x56, 0x01); return this; }
    fullCut() { this.feed(3); this._buffer.push(GS, 0x56, 0x00); return this; }

    openCashDrawer() {
        this._buffer.push(ESC, 0x70, 0x00, 0x19, 0xFA);
        return this;
    }

    qrCode(content, size = 6) {
        const data = [];
        for (let i = 0; i < content.length; i++) {
            const c = content.charCodeAt(i);
            data.push(c <= 0xFF ? c : 0x3F);
        }
        const len = data.length + 3;
        const pL = len & 0xFF;
        const pH = (len >> 8) & 0xFF;
        this._buffer.push(GS, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00);
        this._buffer.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, size);
        this._buffer.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, 0x30);
        this._buffer.push(GS, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30, ...data);
        this._buffer.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30);
        return this;
    }

    encode() { return new Uint8Array(this._buffer); }
    getLineWidth() { return this._lineWidth; }
    reset() { this._buffer = []; return this; }
}

export default EscPosEncoder;
