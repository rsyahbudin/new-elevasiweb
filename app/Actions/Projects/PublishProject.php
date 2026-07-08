<?php

namespace App\Actions\Projects;

use App\Enums\ProjectStatus;
use App\Models\Project;

class PublishProject
{
    public function handle(Project $project): Project
    {
        $project->status = ProjectStatus::Published;
        $project->published_at ??= now();
        $project->save();

        return $project;
    }
}
