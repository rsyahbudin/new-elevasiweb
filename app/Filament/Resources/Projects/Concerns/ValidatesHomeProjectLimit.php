<?php

namespace App\Filament\Resources\Projects\Concerns;

use App\Models\Project;
use Filament\Notifications\Notification;

trait ValidatesHomeProjectLimit
{
    protected function ensureHomeProjectLimit(array $data): array
    {
        if (empty($data['show_on_home'])) {
            return $data;
        }

        $query = Project::query()->where('show_on_home', true);

        if ($this->record) {
            $query->whereKeyNot($this->record->getKey());
        }

        if ($query->count() >= 6) {
            Notification::make()
                ->title('Maksimal 6 proyek di beranda')
                ->body('Sudah ada 6 proyek dengan centang "Tampilkan di beranda". Hapus centang dari proyek lain terlebih dahulu.')
                ->danger()
                ->send();

            $this->halt();
        }

        return $data;
    }
}
