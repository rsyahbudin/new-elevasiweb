<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'residential', 'name' => ['id' => 'Residensial', 'en' => 'Residential']],
            ['slug' => 'commercial', 'name' => ['id' => 'Komersial', 'en' => 'Commercial']],
            ['slug' => 'interior', 'name' => ['id' => 'Interior', 'en' => 'Interior']],
            ['slug' => 'renovation', 'name' => ['id' => 'Renovasi', 'en' => 'Renovation']],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], ['name' => $category['name']]);
        }
    }
}
