# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [Unreleased] - 2026-10-22

Perbaikan keamanan **CVE-2026-109618** & **CVE-2026-109619** (bug di runtime PHP). Versi yang sudah
di-patch: 8.2.35 / 8.3.36 / 8.4.27 / 8.5.12. Aplikasi ini sekarang wajib jalan di **PHP ≥ 8.4.27**.

### Security
- Repo ini tidak punya Dockerfile yang dipakai deploy, jadi versi PHP ditentukan server. Lihat `docs/MIGRATION-php-8.4.27.md` untuk upgrade PHP di host.

### CI
- `.github/workflows/ci.yml`: PHP 8.4 + step yang menolak runner dengan PHP < 8.4.27, cek migrasi naik → turun → naik (`migrate` lalu `migrate:refresh`) di database CI, lalu seluruh test suite.

### Added
- `.github/workflows/ci.yml` (sebelumnya tidak ada CI): build frontend (`tsc` + Vite), migrasi naik-turun-naik di MySQL 8, PHPUnit.

### Fixed
- `tests/Feature/ExampleTest.php` gagal (`no such table: promos`) karena tidak memakai `RefreshDatabase`; sekarang memakainya seperti test lain.
