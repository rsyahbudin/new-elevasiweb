<?php

namespace Database\Seeders;

use App\Enums\ProjectStatus;
use App\Models\Article;
use Database\Seeders\Concerns\SeedsPlaceholderImages;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    use SeedsPlaceholderImages;

    public function run(): void
    {
        $articles = $this->articles();

        foreach ($articles as $index => $data) {
            $slug = Str::slug($data['title_id']);

            $article = Article::updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => [
                        'id' => $data['title_id'],
                        'en' => $data['title_en'],
                    ],
                    'excerpt' => [
                        'id' => $data['excerpt_id'],
                        'en' => $data['excerpt_en'],
                    ],
                    'body' => [
                        'id' => $data['body_id'],
                        'en' => $data['body_en'],
                    ],
                    'status' => ProjectStatus::Published,
                    'published_at' => now()->subWeeks(count($articles) - $index),
                    'sort_order' => $index,
                ],
            );

            $this->attachPlaceholderImage(
                $article,
                'cover',
                $data['title_en'],
                1600,
                1200,
                $data['rgb'],
            );
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function articles(): array
    {
        return [
            [
                'title_id' => '5 Material yang Tahan Cuaca Tropis',
                'title_en' => '5 Materials That Survive Tropical Weather',
                'excerpt_id' => 'Memilih material bukan soal estetika saja — di iklim Indonesia, durability dan perawatan jadi pertimbangan utama sebelum desain diputuskan.',
                'excerpt_en' => 'Choosing materials is not just about aesthetics — in Indonesia\'s climate, durability and maintenance should come before the final design call.',
                'body_id' => "Kayu jati dan ulin masih jadi pilihan kuat untuk furnitur dan panel interior, asalkan finishing dan sirkulasi udara diperhitungkan sejak awal. Batu alam lokal seperti andesit atau travertine cocok untuk area basah jika sistem waterproofing dan kemiringan lantai benar.\n\nUntuk fasad, cat dengan UV protection atau finishing mineral sering lebih praktis dibanding material yang menyerap panas berlebih. Keramik format besar (60×120 atau lebih) mempermudah perawatan dinding dapur dan kamar mandi.\n\nTim Elevasi biasanya memetakan material per zona — area basah, area terbuka, dan area tidur — supaya investasi perbaikan jangka panjang bisa diprediksi sejak tahap desain.",
                'body_en' => "Teak and ironwood remain strong choices for furniture and interior panels, provided finishing and airflow are considered from the start. Local stone such as andesite or travertine works well in wet areas when waterproofing and floor falls are correct.\n\nFor facades, UV-protected paint or mineral finishes are often more practical than materials that absorb excessive heat. Large-format tiles (60×120 or bigger) simplify maintenance in kitchens and bathrooms.\n\nElevasi's team usually maps materials by zone — wet areas, open areas, and sleeping areas — so long-term maintenance costs can be predicted during the design stage.",
                'rgb' => [92, 132, 108],
            ],
            [
                'title_id' => 'Memahami RAB Renovasi Rumah',
                'title_en' => 'Understanding a Home Renovation BOQ',
                'excerpt_id' => 'RAB bukan sekadar daftar harga — ini peta keputusan: apa yang wajib, apa yang bisa ditunda, dan di mana risiko biaya tersembunyi.',
                'excerpt_en' => 'A BOQ is not just a price list — it is a decision map: what is essential, what can wait, and where hidden costs tend to appear.',
                'body_id' => "Renovasi rumah lama biasanya terbagi ke pekerjaan struktur, MEP (listrik & plumbing), arsitektur interior, dan finishing. Masing-masing punya toleransi risiko berbeda — struktur dan waterproofing jarang boleh dikompromikan.\n\nRAB yang baik memisahkan pekerjaan per ruangan atau per fase, sehingga owner bisa menjalankan konstruksi bertahap tanpa membongkar seluruh rumah sekaligus. Contoh: fase 1 atap & waterproofing, fase 2 layout interior, fase 3 furnitur custom.\n\nSaat membandingkan penawaran kontraktor, pastikan scope-nya setara: apakah include pekerjaan proteksi, waste removal, dan revisi desain? Perbedaan kecil di scope bisa mengubah total biaya hingga 15–25%.",
                'body_en' => "Renovating an older house usually splits into structural work, MEP (electrical and plumbing), interior architecture, and finishing. Each carries different risk — structure and waterproofing should rarely be compromised.\n\nA good BOQ separates work by room or by phase, so owners can run construction in stages without gutting the entire house at once. Example: phase 1 roof and waterproofing, phase 2 interior layout, phase 3 custom furniture.\n\nWhen comparing contractor proposals, make sure the scope is equivalent: does it include protection work, waste removal, and design revisions? Small scope differences can shift total cost by 15–25%.",
                'rgb' => [196, 188, 176],
            ],
            [
                'title_id' => 'Tips Desain Ruang Tamu Kecil',
                'title_en' => 'Design Tips for Small Living Rooms',
                'excerpt_id' => 'Ruang tamu kecil bisa terasa lapang dengan proporsi furnitur yang tepat, satu focal point, dan cahaya dari lebih dari satu arah.',
                'excerpt_en' => 'A small living room can feel generous with the right furniture scale, one clear focal point, and light from more than one direction.',
                'body_id' => "Mulai dari clearance: jarak lega di sekitar sofa dan jalur sirkulasi utama. Sofa dengan kaki terlihat (raised leg) membantu ruang terasa lebih ringan dibanding model block penuh.\n\nCermin strategis — bukan di semua dinding — bisa memantulkan cahaya tanpa membuat ruangan terasa kacau. Satu statement piece (lampu, karya seni, atau panel kayu) cukup sebagai focal point; terlalu banyak aksen justru mempersempit persepsi ruang.\n\nWarna dinding netral dengan satu aksen hijau atau terracotta selaras dengan karakter material alami, dan lebih mudah disesuaikan saat furnitur custom diproduksi belakangan.",
                'body_en' => "Start with clearance: comfortable space around the sofa and a clear main circulation path. A sofa with visible legs feels lighter than a fully block-style unit.\n\nStrategic mirrors — not on every wall — can bounce light without making the room feel chaotic. One statement piece (a lamp, artwork, or timber panel) is enough as a focal point; too many accents shrink the perceived space.\n\nNeutral wall colours with one green or terracotta accent align with natural materials and stay flexible when custom furniture is produced later.",
                'rgb' => [228, 224, 214],
            ],
            [
                'title_id' => 'Kapan Waktu Tepat Renovasi?',
                'title_en' => 'When Is the Right Time to Renovate?',
                'excerpt_id' => 'Renovasi paling mulus dilakukan saat kebutuhan ruang sudah jelas, anggaran realistis tersedia, dan timeline disesuaikan dengan musim hujan.',
                'excerpt_en' => 'Renovations run smoothest when spatial needs are clear, budget is realistic, and the timeline accounts for the rainy season.',
                'body_id' => "Tanda rumah perlu renovasi serius: bocor berulang, layout yang sudah tidak cocok dengan jumlah penghuni, atau biaya perbaikan kecil yang sudah melebihi investasi perbaikan struktural.\n\nDi Jakarta dan sekitarnya, banyak owner memulai persiapan desain 2–3 bulan sebelum musim kering agar pekerjaan struktur dan atap selesai sebelum hujan deras. Survey lokasi awal membantu mengidentifikasi kondisi existing — plumbing, kemiringan lantai, dan beban struktur.\n\nTidak perlu menunggu semua detail sempurna sebelum konsultasi. Cukup siapkan tipe proyek, lokasi, timeline kasar, dan kisaran budget — tim kami bisa membantu memetakan langkah berikutnya via WhatsApp.",
                'body_en' => "Signs a house needs a serious renovation: recurring leaks, a layout that no longer fits the household, or small repair costs that now exceed a structural fix.\n\nIn Jakarta and surrounding areas, many owners start design preparation 2–3 months before the dry season so structural and roof work finishes before heavy rain. An early site survey helps identify existing conditions — plumbing, floor falls, and structural load.\n\nYou do not need every detail perfect before consulting. Prepare the project type, location, rough timeline, and budget range — our team can help map the next steps on WhatsApp.",
                'rgb' => [118, 108, 96],
            ],
        ];
    }
}
