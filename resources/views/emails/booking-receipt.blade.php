<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Booking — GCM Book</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
        .wrapper { max-width: 600px; margin: 32px auto; }
        .header { background: #1e3a5f; color: white; padding: 32px 40px; border-radius: 12px 12px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 8px 0 0; opacity: 0.75; font-size: 14px; }
        .body { background: white; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
        .queue-badge { background: #2563eb; color: white; text-align: center; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .queue-badge .number { font-size: 64px; font-weight: 900; line-height: 1; }
        .queue-badge .label { font-size: 14px; opacity: 0.85; margin-top: 4px; }
        .info-grid { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748b; }
        .info-value { font-weight: 600; }
        .booking-code { font-family: monospace; font-size: 18px; font-weight: 700; letter-spacing: 2px; color: #2563eb; text-align: center; background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 8px; padding: 16px; margin: 16px 0; }
        .footer { background: #f1f5f9; padding: 24px 40px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; color: #94a3b8; border: 1px solid #e2e8f0; border-top: none; }
        .note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #92400e; margin: 16px 0; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <h1>📋 GCM Book</h1>
        <p>Konfirmasi Booking Anda</p>
    </div>

    <div class="body">
        <p>Halo, <strong>{{ $booking->customer_name }}</strong>!</p>
        <p>Terima kasih telah melakukan booking di GCM Book. Berikut adalah detail booking Anda:</p>

        <div class="booking-code">{{ $booking->booking_code }}</div>

        <div class="queue-badge">
            <div class="label">NOMOR ANTRIAN ANDA</div>
            <div class="number">{{ str_pad($booking->queue_number, 3, '0', STR_PAD_LEFT) }}</div>
        </div>

        <div class="info-grid">
            <div class="info-row">
                <span class="info-label">Layanan</span>
                <span class="info-value">{{ $booking->service->name ?? '-' }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Jadwal</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($booking->scheduled_at)->locale('id')->isoFormat('dddd, D MMMM YYYY HH:mm') }} WIB</span>
            </div>
            <div class="info-row">
                <span class="info-label">Nama</span>
                <span class="info-value">{{ $booking->customer_name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Telepon</span>
                <span class="info-value">{{ $booking->customer_phone }}</span>
            </div>
            @if($booking->notes)
            <div class="info-row">
                <span class="info-label">Catatan</span>
                <span class="info-value">{{ $booking->notes }}</span>
            </div>
            @endif
        </div>

        <div class="note">
            ⚠️ Harap datang tepat waktu sesuai jadwal. Jika Anda tidak dapat hadir, segera hubungi kami.
        </div>

        <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
            Simpan email ini sebagai bukti booking. Anda dapat melacak status booking menggunakan kode:
            <strong>{{ $booking->booking_code }}</strong>
        </p>
    </div>

    <div class="footer">
        <p><strong>GCM Book</strong> — Platform Booking & Invoicing Terpercaya</p>
        <p style="margin-top: 4px;">Email ini dikirim otomatis, mohon tidak membalas email ini.</p>
    </div>
</div>
</body>
</html>
