<?php

namespace Database\Seeders;

use App\Enums\ProjectStatus;
use App\Models\Category;
use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');
        $projects = $this->projects();

        foreach ($projects as $index => $data) {
            Project::updateOrCreate(
                ['slug' => Str::slug($data['title'])],
                [
                    'title' => ['id' => $data['title'], 'en' => $data['title']],
                    'category_id' => $categories[$data['category']]->id,
                    'location_city' => $data['location'],
                    'year_completed' => $data['year'],
                    'scope_of_work' => $data['scope'],
                    'description' => $data['description'],
                    'cover_caption' => $data['cover_caption'],
                    'status' => ProjectStatus::Published,
                    'published_at' => now()->subMonths(count($projects) - $index),
                    'sort_order' => $index,
                    'show_on_home' => $index < 6,
                ],
            );
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function projects(): array
    {
        return [
            [
                'title' => 'Villa Arunika',
                'category' => 'residential',
                'location' => 'Serpong, Tangerang',
                'year' => 2025,
                'scope' => ['id' => 'Desain + Bangun', 'en' => 'Design + Build'],
                'cover_caption' => 'exterior, dusk',
                'description' => [
                    'id' => "Rumah tinggal keluarga seluas 420 m² yang disusun mengelilingi courtyard teduh di tengah bangunan. Massa bangunan mundur dari jalan untuk mempertahankan dua pohon eksisting, dan brief meminta rumah yang tetap sejuk tanpa AC menyala terus-menerus.\n\nElevasi mengerjakan arsitektur, struktur, dan interior fit-out dalam satu kontrak — 11 bulan dari sketsa pertama hingga serah terima.",
                    'en' => "A 420 m² family residence organised around a shaded inner courtyard. The massing steps back from the street to preserve two existing trees, and the brief called for a house that stays cool without constant air conditioning.\n\nElevasi delivered architecture, structure, and interior fit-out under a single contract — 11 months from first sketch to handover.",
                ],
            ],
            [
                'title' => 'Kopi Selatan HQ',
                'category' => 'commercial',
                'location' => 'Kemang, Jakarta',
                'year' => 2025,
                'scope' => ['id' => 'Desain + Fit-Out', 'en' => 'Design + Fit-Out'],
                'cover_caption' => 'facade, street view',
                'description' => [
                    'id' => "Roastery, kafe, dan kantor untuk merek kopi yang sedang berkembang, dikonversi dari ruko dua lantai. Lantai dasar terbuka penuh ke jalan; area produksi terlihat di balik kaca.\n\nFit-out ini memanfaatkan kembali rangka beton asli dan selesai dalam 14 minggu untuk memenuhi tanggal peluncuran merek.",
                    'en' => "A roastery, café, and office for a growing coffee brand, converted from a two-storey shophouse. The ground floor opens fully to the street; production is visible behind glass.\n\nThe fit-out reused the original concrete frame and completed in 14 weeks to meet the brand's launch date.",
                ],
            ],
            [
                'title' => 'Rumah Cempaka',
                'category' => 'renovation',
                'location' => 'Bintaro, Tangerang Selatan',
                'year' => 2024,
                'scope' => ['id' => 'Renovasi + Perluasan', 'en' => 'Renovation + Extension'],
                'cover_caption' => 'living room, morning light',
                'description' => [
                    'id' => "Rumah era 1990-an dikembalikan ke strukturnya dan diperluas dengan paviliun ruang keluarga berlangit-langit ganda. Skylight baru dan ventilasi silang mengubah ruangan tergelap dari denah aslinya.\n\nKeluarga tetap tinggal di rumah selama proses konstruksi bertahap — lokasi tidak pernah dikosongkan sepenuhnya.",
                    'en' => "A 1990s house stripped back to its structure and extended with a double-height living pavilion. New skylights and cross-ventilation transformed the darkest rooms of the original plan.\n\nThe family stayed in the house through a phased construction sequence — the site was never fully vacated.",
                ],
            ],
            [
                'title' => 'Studio Padma',
                'category' => 'interior',
                'location' => 'Bandung',
                'year' => 2024,
                'scope' => ['id' => 'Interior Fit-Out', 'en' => 'Interior Fit-Out'],
                'cover_caption' => 'workspace, detail',
                'description' => [
                    'id' => "Ruang kerja seluas 260 m² untuk studio desain, dibangun mengelilingi material library sentral dan meja kerja bersama yang panjang dari kayu jati lokal.\n\nSeluruh millwork diproduksi di bengkel Elevasi sendiri, menjaga toleransi tetap ketat dan jadwal tetap 9 minggu.",
                    'en' => "A 260 m² workspace for a design studio, built around a central material library and a long shared workbench in local teak.\n\nAll millwork was produced in Elevasi's own workshop, keeping tolerances tight and the schedule to 9 weeks.",
                ],
            ],
            [
                'title' => 'Griya Menteng',
                'category' => 'residential',
                'location' => 'Menteng, Jakarta',
                'year' => 2023,
                'scope' => ['id' => 'Desain + Bangun', 'en' => 'Design + Build'],
                'cover_caption' => 'courtyard, afternoon',
                'description' => [
                    'id' => "Infill perkotaan yang kompak di lahan 190 m², disusun secara vertikal mengelilingi light well yang membawa cahaya matahari ke setiap ruangan.\n\nTangga baja pracetak dan millwork off-site memampatkan jadwal on-site menjadi kurang dari 8 bulan.",
                    'en' => "A compact urban infill on a 190 m² lot, arranged vertically around a light well that brings daylight into every room.\n\nPrefabricated steel stairs and off-site millwork compressed the on-site schedule to under 8 months.",
                ],
            ],
            [
                'title' => 'Warung Tetangga',
                'category' => 'commercial',
                'location' => 'Kebayoran Baru, Jakarta',
                'year' => 2023,
                'scope' => ['id' => 'Desain + Bangun', 'en' => 'Design + Build'],
                'cover_caption' => 'dining area, evening',
                'description' => [
                    'id' => "Restoran lingkungan di garasi yang dikonversi, menampung 46 kursi dengan dapur terbuka dan teras belakang yang ditanami.\n\nDikerjakan design-build dalam 12 minggu termasuk MEP dapur dan seluruh furnitur custom.",
                    'en' => "A neighbourhood restaurant in a converted garage, seating 46 across an open kitchen line and a planted rear terrace.\n\nDelivered design-build in 12 weeks including kitchen MEP and all custom furniture.",
                ],
            ],
            [
                'title' => 'Rumah Tebet',
                'category' => 'renovation',
                'location' => 'Tebet, Jakarta',
                'year' => 2022,
                'scope' => ['id' => 'Renovasi', 'en' => 'Renovation'],
                'cover_caption' => 'facade, before-after',
                'description' => [
                    'id' => "Renovasi menyeluruh rumah deret seluas 210 m²: struktur atap baru, penataan ulang inti servis, dan perluasan belakang untuk keluarga multigenerasi.\n\nPekerjaan struktural disusun per ruangan sehingga lantai dasar tetap layak huni sepanjang proses.",
                    'en' => "A full renovation of a 210 m² row house: new roof structure, re-planned service core, and a rear extension for a multigenerational family.\n\nStructural work was sequenced room by room so the ground floor stayed livable throughout.",
                ],
            ],
            [
                'title' => 'Klinik Sehati',
                'category' => 'interior',
                'location' => 'Depok',
                'year' => 2022,
                'scope' => ['id' => 'Interior Fit-Out', 'en' => 'Interior Fit-Out'],
                'cover_caption' => 'reception, daylight',
                'description' => [
                    'id' => "Klinik layanan primer yang dirancang agar terasa seperti rumah, bukan institusi — kayu hangat, akustik lembut, wayfinding yang jelas.\n\nFit-out selesai dalam 10 minggu dengan finishing setara medis di seluruh ruang perawatan.",
                    'en' => "A primary-care clinic designed to feel domestic rather than institutional — warm timber, soft acoustics, clear wayfinding.\n\nFit-out completed over 10 weeks with medical-grade finishes in all treatment rooms.",
                ],
            ],
            [
                'title' => 'Villa Awan',
                'category' => 'residential',
                'location' => 'Puncak, Bogor',
                'year' => 2021,
                'scope' => ['id' => 'Desain + Bangun', 'en' => 'Design + Build'],
                'cover_caption' => 'terrace, mountain view',
                'description' => [
                    'id' => "Rumah akhir pekan di lahan berkontur, menjorok ke arah lembah dengan teras beratap menerus di sisi pemandangan.\n\nBatu dan kayu lokal diambil dalam radius 40 km dari lokasi; konstruksi berjalan 13 bulan.",
                    'en' => "A weekend house on a sloped site, cantilevered toward the valley with a continuous covered terrace on the view side.\n\nLocal stone and timber were sourced within 40 km of the site; construction ran 13 months.",
                ],
            ],
        ];
    }
}
