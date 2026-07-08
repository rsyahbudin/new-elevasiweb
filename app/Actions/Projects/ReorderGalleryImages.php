<?php

namespace App\Actions\Projects;

use App\Models\Project;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ReorderGalleryImages
{
    /**
     * @param  array<int, int>  $orderedMediaIds  Gallery media IDs in their new display order.
     */
    public function handle(Project $project, array $orderedMediaIds): void
    {
        $galleryIds = $project->getMedia('gallery')->pluck('id')->all();

        $validIds = array_values(array_intersect($orderedMediaIds, $galleryIds));

        Media::setNewOrder($validIds);
    }
}
