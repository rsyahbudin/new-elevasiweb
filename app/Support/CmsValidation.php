<?php

namespace App\Support;

class CmsValidation
{
    /**
     * Pesan error upload gambar — jelas dan spesifik per field.
     *
     * @return array<string, string>
     */
    public static function imageUpload(int $minWidth, int $minHeight, int $maxMb): array
    {
        return [
            'image' => 'File harus berupa foto (JPG, PNG, atau WebP).',
            'uploaded' => 'Upload gagal. Coba pilih file lain atau periksa koneksi internet Anda.',
            'dimensions' => "Foto terlalu kecil. Minimal lebar {$minWidth} piksel dan tinggi {$minHeight} piksel — lihat petunjuk ukuran di bawah field.",
            'max' => "File terlalu besar. Maksimal {$maxMb} MB.",
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function required(string $what = 'Field ini'): array
    {
        return [
            'required' => "{$what} wajib diisi.",
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function whatsappNumber(): array
    {
        return array_merge(self::required('Nomor WhatsApp'), [
            'regex' => 'Format nomor belum benar. Gunakan angka saja, contoh: 6281234567890 (tanpa + atau spasi).',
        ]);
    }

    /**
     * @return array<string, string>
     */
    public static function gaMeasurementId(): array
    {
        return [
            'regex' => 'Format ID Analytics belum benar. Contoh yang benar: G-XXXXXXXXXX.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function googleSearchConsoleVerification(): array
    {
        return [
            'regex' => 'Kode verifikasi belum benar. Salin hanya bagian content="..." dari meta tag Google (tanpa tanda kutip).',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function email(): array
    {
        return [
            'email' => 'Alamat email belum benar. Contoh: hello@elevasi.id',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function url(): array
    {
        return [
            'url' => 'Link belum benar. Pastikan diawali https://',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function uniqueSlug(): array
    {
        return [
            'unique' => 'Slug ini sudah dipakai proyek lain. Gunakan nama atau slug yang berbeda.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function uniqueCategorySlug(): array
    {
        return [
            'unique' => 'Slug kategori ini sudah dipakai. Gunakan nama yang berbeda.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function yearCompleted(): array
    {
        return array_merge(self::required('Tahun selesai'), [
            'numeric' => 'Tahun harus berupa angka, contoh: 2024.',
            'min' => 'Tahun terlalu lama. Minimal tahun 2000.',
            'max' => 'Tahun tidak masuk akal. Periksa kembali tahun selesai proyek.',
        ]);
    }
}
