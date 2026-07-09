<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\ContentOverviewStats;
use App\Filament\Widgets\LatestInquiriesWidget;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $navigationLabel = 'Dasbor';

    protected static ?string $title = 'Dasbor';

    /**
     * @return array<class-string>
     */
    public function getWidgets(): array
    {
        return [
            ContentOverviewStats::class,
            LatestInquiriesWidget::class,
        ];
    }
}
