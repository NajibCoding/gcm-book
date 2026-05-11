<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice->invoice_number }} — GCM Book</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
        .wrapper { max-width: 600px; margin: 32px auto; }
        .header { background: #1e3a5f; color: white; padding: 32px 40px; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 6px 0 0; opacity: 0.75; font-size: 13px; }
        .body { background: white; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
        .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 13px; }
        .invoice-number { font-size: 18px; font-weight: 700; font-family: monospace; color: #2563eb; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
        .status-sent { background: #dbeafe; color: #1d4ed8; }
        .status-paid { background: #dcfce7; color: #16a34a; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { padding: 10px 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left; font-weight: 600; color: #475569; }
        td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        .total-section { background: #f8fafc; border-radius: 8px; padding: 16px 20px; margin-top: 16px; font-size: 14px; }
        .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .total-row.grand { font-size: 18px; font-weight: 700; border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 8px; }
        .due-date-box { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 14px 16px; margin: 20px 0; font-size: 13px; }
        .footer { background: #f1f5f9; padding: 24px 40px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; color: #94a3b8; border: 1px solid #e2e8f0; border-top: none; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <h1>📄 GCM Book — Invoice</h1>
        <p>Tagihan Layanan Anda</p>
    </div>

    <div class="body">
        <p>Halo, <strong>{{ $invoice->booking->customer_name ?? 'Pelanggan' }}</strong>!</p>
        <p>Berikut adalah invoice untuk layanan yang telah Anda gunakan di GCM Book.</p>

        <div class="invoice-meta">
            <div>
                <div class="invoice-number">{{ $invoice->invoice_number }}</div>
                <div style="color:#64748b; margin-top:4px;">Booking: <strong>{{ $invoice->booking->booking_code ?? '-' }}</strong></div>
            </div>
            <div class="text-right">
                <span class="status-badge status-sent">{{ ucfirst($invoice->status) }}</span>
                <div style="color:#64748b; font-size:12px; margin-top:6px;">
                    Dibuat: {{ \Carbon\Carbon::parse($invoice->created_at)->format('d M Y') }}
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Deskripsi</th>
                    <th style="text-align:right">Qty</th>
                    <th style="text-align:right">Harga</th>
                    <th style="text-align:right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($invoice->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td style="text-align:right">{{ $item->quantity }}</td>
                    <td style="text-align:right">Rp {{ number_format($item->unit_price, 0, ',', '.') }}</td>
                    <td style="text-align:right">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">
                <span style="color:#64748b">Subtotal</span>
                <span>Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</span>
            </div>
            @if ($invoice->discount_amount > 0)
            <div class="total-row" style="color:#16a34a">
                <span>Diskon</span>
                <span>- Rp {{ number_format($invoice->discount_amount, 0, ',', '.') }}</span>
            </div>
            @endif
            @if ($invoice->tax_amount > 0)
            <div class="total-row">
                <span style="color:#64748b">Pajak</span>
                <span>Rp {{ number_format($invoice->tax_amount, 0, ',', '.') }}</span>
            </div>
            @endif
            <div class="total-row grand">
                <span>Total</span>
                <span style="color:#2563eb">Rp {{ number_format($invoice->total_amount, 0, ',', '.') }}</span>
            </div>
        </div>

        <div class="due-date-box">
            ⏰ <strong>Jatuh Tempo:</strong>
            {{ \Carbon\Carbon::parse($invoice->due_date)->locale('id')->isoFormat('dddd, D MMMM YYYY') }}
        </div>

        <p style="font-size:14px; color:#64748b;">
            Silakan lakukan pembayaran sebelum tanggal jatuh tempo. Hubungi kami jika ada pertanyaan mengenai invoice ini.
        </p>
    </div>

    <div class="footer">
        <p><strong>GCM Book</strong> — Platform Booking & Invoicing Terpercaya</p>
        <p style="margin-top:4px;">Email ini dikirim otomatis, mohon tidak membalas email ini.</p>
    </div>
</div>
</body>
</html>
