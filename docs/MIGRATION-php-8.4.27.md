# Migrasi ke PHP 8.4.27 (CVE-2026-109618 / CVE-2026-109619)

CVE ini ada di binary PHP, bukan di kode aplikasi. Yang menutupnya adalah **menjalankan aplikasi di
PHP ≥ 8.4.27**; perubahan di repo ini memastikan aplikasi siap dan menolak jalan di versi rentan.

## 1. Prasyarat

- PHP **8.4.27** atau lebih baru di seri 8.4 (lokal Windows: `C:\laragon\bin\php\php-8.4.27-Win32-vs17-x64`).
- Ekstensi yang sama dengan sebelumnya (lihat `composer.json` dan `.github/workflows/ci.yml`).

## 2. Lokal (Laragon)

1. Laragon → *Menu → PHP → Version* → pilih versi patched.
2. `php -v` harus menampilkan 8.4.x dengan x ≥ 27.
3. `composer install` → `php artisan migrate` → `php artisan test`.

## 3. Produksi

1. Install/aktifkan PHP 8.4.27 di server (panel hosting: pilih versi PHP; VPS Debian/Ubuntu: `apt install php8.4-fpm php8.4-cli` dari repo yang sudah membawa 8.4.27).
2. Cek **dua-duanya**, karena CLI dan FPM bisa beda versi:
   - CLI: `php -v`
   - FPM/web: buat sementara `public/v.php` berisi `<?php echo PHP_VERSION;`, buka di browser, lalu **hapus filenya**.
3. Restart PHP-FPM / web server.
4. `composer install --no-dev --optimize-autoloader` → `php artisan migrate --force` → `php artisan optimize`.

## 4. Perubahan yang butuh tindakan saat deploy

Tidak ada — cukup langkah di atas.

## 5. Verifikasi

- CI di PR hijau (step *Assert patched PHP* menampilkan versi PHP runner).
- `php -v` di server ≥ 8.4.27.
- Smoke test manual: login, halaman utama, satu alur tulis data.

## 6. Rollback

Kode di PR ini tetap kompatibel dengan PHP 8.4 lama, jadi rollback = deploy commit sebelumnya.
**Jangan** rollback versi PHP-nya: versi < 8.4.27 rentan.
