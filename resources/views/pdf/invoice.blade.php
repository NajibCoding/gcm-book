<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 12px; color: #1e293b; background: white; }

        .page { padding: 32px 40px; }

        /* Header */
        .header { border-bottom: 3px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
        .company-name { font-size: 22px; font-weight: 700; color: #1e3a5f; }
        .company-sub { font-size: 11px; color: #64748b; margin-top: 3px; }
        .invoice-title { text-align: right; }
        .invoice-title h1 { font-size: 28px; font-weight: 900; color: #1e3a5f; text-transform: uppercase; letter-spacing: 2px; }
        .invoice-number { font-family: monospace; font-size: 13px; color: #2563eb; font-weight: 700; margin-top: 4px; }

        /* Meta */
        .meta-section { display: flex; justify-content: space-between; margin-bottom: 28px; gap: 40px; }
        .meta-block { flex: 1; }
        .meta-block h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; font-weight: 600; }
        .meta-block p { font-size: 12px; margin-bottom: 3px; }
        .meta-block strong { font-weight: 600; }

        /* Status badge */
        .status-badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-draft { background: #f1f5f9; color: #475569; }
        .status-sent { background: #dbeafe; color: #1d4ed8; }
        .status-paid { background: #dcfce7; color: #15803d; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }

        /* Table */
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead tr { background: #1e3a5f; color: white; }
        thead th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        thead th.right { text-align: right; }
        tbody tr { border-bottom: 1px solid #f1f5f9; }
        tbody tr:nth-child(even) { background: #f8fafc; }
        tbody td { padding: 10px 12px; font-size: 12px; }
        tbody td.right { text-align: right; }
        tfoot tr { border-top: 2px solid #e2e8f0; }
        tfoot td { padding: 8px 12px; font-size: 12px; }
        tfoot td.right { text-align: right; }
        .grand-total td { font-size: 15px; font-weight: 700; color: #1e3a5f; border-top: 3px double #1e3a5f; padding-top: 10px; }

        /* Payment info */
        .payment-note { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px 16px; margin-top: 24px; }
        .payment-note h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #1d4ed8; margin-bottom: 8px; }
        .payment-note p { font-size: 11px; color: #1e40af; line-height: 1.5; }

        /* Footer */
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-end; }
        .footer-brand { font-size: 10px; color: #94a3b8; }
        .footer-brand strong { color: #475569; }
        .signature-area { text-align: center; font-size: 10px; color: #64748b; }
        .signature-line { width: 120px; border-top: 1px solid #94a3b8; margin: 40px auto 4px; }
    </style>
</head>
<body>
<div class="page">
    <!-- Header -->
    <div class="header">
        <div>
            <div class="company-name">GCM Book</div>
            <div class="company-sub">Platform Booking & Invoicing Terpercaya</div>
        </div>
        <div class="invoice-title">
            <h1>Invoice</h1>
            <div class="invoice-number">{{ $invoice->invoice_number }}</div>
            <div style="margin-top:6px;">
                <span class="status-badge status-{{ $invoice->status }}">{{ ucfirst($invoice->status) }}</span>
            </div>
        </div>
    </div>

    <!-- Meta -->
    <div class="meta-section">
        <div class="meta-block">
            <h3>Tagihan Kepada</h3>
            <p><strong>{{ $invoice->booking->customer_name ?? '-' }}</strong></p>
            <p>{{ $invoice->booking->customer_email ?? '' }}</p>
            <p>{{ $invoice->booking->customer_phone ?? '' }}</p>
        </div>
        <div class="meta-block">
            <h3>Detail Layanan</h3>
            <p><strong>{{ $invoice->booking->service->name ?? '-' }}</strong></p>
            <p>Booking: <strong>{{ $invoice->booking->booking_code ?? '-' }}</strong></p>
            <p>Jadwal: {{ \Carbon\Carbon::parse($invoice->booking->scheduled_at)->format('d M Y, H:i') }} WIB</p>
        </div>
        <div class="meta-block">
            <h3>Informasi Invoice</h3>
            <p>Tanggal: <strong>{{ \Carbon\Carbon::parse($invoice->created_at)->format('d M Y') }}</strong></p>
            <p>Jatuh Tempo: <strong>{{ \Carbon\Carbon::parse($invoice->due_date)->format('d M Y') }}</strong></p>
        </div>
    </div>

    <!-- Items Table -->
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Deskripsi</th>
                <th class="right">Qty</th>
                <th class="right">Harga Satuan</th>
                <th class="right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($invoice->items as $i => $item)
            <tr>
                <td style="color:#94a3b8">{{ $i + 1 }}</td>
                <td>{{ $item->description }}</td>
                <td class="right">{{ $item->quantity }}</td>
                <td class="right">Rp {{ number_format($item->unit_price, 0, ',', '.') }}</td>
                <td class="right">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" class="right" style="color:#64748b">Subtotal</td>
                <td class="right">Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</td>
            </tr>
            @if ($invoice->discount_amount > 0)
            <tr>
                <td colspan="4" class="right" style="color:#16a34a">Diskon</td>
                <td class="right" style="color:#16a34a">- Rp {{ number_format($invoice->discount_amount, 0, ',', '.') }}</td>
            </tr>
            @endif
            @if ($invoice->tax_amount > 0)
            <tr>
                <td colspan="4" class="right" style="color:#64748b">Pajak</td>
                <td class="right">Rp {{ number_format($invoice->tax_amount, 0, ',', '.') }}</td>
            </tr>
            @endif
            <tr class="grand-total">
                <td colspan="4" class="right">Total</td>
                <td class="right">Rp {{ number_format($invoice->total_amount, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <!-- Payment Note -->
    @if ($invoice->status !== 'paid')
    <div class="payment-note">
        <h4>💳 Informasi Pembayaran</h4>
        <p>
            Harap selesaikan pembayaran sebelum <strong>{{ \Carbon\Carbon::parse($invoice->due_date)->locale('id')->isoFormat('D MMMM YYYY') }}</strong>.
            Hubungi kami untuk metode pembayaran atau pertanyaan terkait invoice ini.
        </p>
    </div>
    @else
    <div style="background:#dcfce7; border:1px solid #86efac; border-radius:8px; padding:12px 16px; margin-top:20px;">
        <p style="color:#15803d; font-size:12px; font-weight:600;">✅ Invoice ini telah LUNAS. Terima kasih atas kepercayaan Anda!</p>
    </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        <div class="footer-brand">
            <strong>GCM Book</strong><br>
            Platform Booking & Invoicing Terpercaya<br>
            Dokumen ini digenerate otomatis oleh sistem.
        </div>
        <div class="signature-area">
            <div class="signature-line"></div>
            <div>Admin GCM Book</div>
        </div>
    </div>
</div>
</body>
</html>
