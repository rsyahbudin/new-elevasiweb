<?php

namespace Database\Seeders;

use App\Enums\ProjectStatus;
use App\Models\GalleryItem;
use Database\Seeders\Concerns\SeedsPlaceholderImages;
use Illuminate\Database\Seeder;

class GalleryItemSeeder extends Seeder
{
    use SeedsPlaceholderImages;

    public function run(): void
    {
        $items = $this->items();

        foreach ($items as $index => $data) {
            $item = GalleryItem::updateOrCreate(
                ['id' => $data['id']],
                [
                    'title' => [
                        'id' => $data['title_id'],
                        'en' => $data['title_en'],
                    ],
                    'status' => ProjectStatus::Published,
                    'published_at' => now()->subDays(count($items) - $index),
                    'sort_order' => $index,
                ],
            );

            $this->attachPlaceholderImage(
                $item,
                'image',
                $data['title_en'],
                $data['width'],
                $data['height'],
                $data['rgb'],
            );
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function items(): array
    {
        return [
            [
                'id' => 'a1000001-0001-4000-8000-000000000001',
                'title_id' => 'Ruang tamu — cahaya alami',
                'title_en' => 'Living room — natural light',
                'width' => 1920,
                'height' => 960,
                'rgb' => [236, 232, 220],
            ],
            [
                'id' => 'a1000001-0001-4000-8000-000000000002',
                'title_id' => 'Detail kayu jati lokal',
                'title_en' => 'Local teak detail',
                'width' => 1600,
                'height' => 1200,
                'rgb' => [168, 128, 88],
            ],
            [
                'id' => 'a1000001-0001-4000-8000-000000000003',
                'title_id' => 'Dapur — permukaan batu',
                'title_en' => 'Kitchen — stone surface',
                'width' => 1600,
                'height' => 1200,
                'rgb' => [210, 206, 198],
            ],
            [
                'id' => 'a1000001-0001-4000-8000-000000000004',
                'title_id' => 'Kamar mandi — terrazzo',
                'title_en' => 'Bathroom — terrazzo',
                'width' => 1600,
                'height' => 1200,
                'rgb' => [188, 196, 192],
            ],
            [
                'id' => 'a1000001-0001-4000-8000-000000000005',
                'title_id' => 'Teras — tanaman & bayangan',
                'title_en' => 'Terrace — planting & shade',
                'width' => 1600,
                'height' => 1200,
                'rgb' => [72, 118, 92],
            ],
            [
                'id' => 'a1000001-0001-4000-8000-000000000006',
                'title_id' => 'Tangga — baja & kayu',
                'title_en' => 'Stair — steel & timber',
                'width' => 1600,
                'height' => 1200,
                'rgb' => [84, 84, 80],
            ],
            [
                'id' => 'a1000001-0001-4000-8000-000000000007',
                'title_id' => 'Palett material hangat',
                'title_en' => 'Warm material palette',
                'width' => 1600,
                'height' => 1200,
                'rgb' => [214, 178, 148],
            ],
            [
                'id' => 'a1000001-0001-4000-8000-000000000008',
                'title_id' => 'Sudut baca — furnitur custom',
                'title_en' => 'Reading nook — custom joinery',
                'width' => 1600,
                'height' => 1200,
                'rgb' => [148, 132, 116],
            ],
        ];
    }
}
