<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $project = Project::where('slug', 'rumah-cempaka')->first();

        Testimonial::updateOrCreate(
            ['client_name' => 'Private residence client'],
            [
                'project_id' => $project?->id,
                'quote' => [
                    'id' => 'Mereka menangani semuanya — desain, perizinan, konstruksi. Kami pindah dua minggu lebih cepat dari jadwal.',
                    'en' => 'They handled everything — design, permits, construction. We moved in two weeks ahead of schedule.',
                ],
                'is_visible' => true,
            ],
        );
    }
}
