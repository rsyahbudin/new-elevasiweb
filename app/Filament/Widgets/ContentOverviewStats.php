<?php

namespace App\Filament\Widgets;

use App\Enums\ProjectStatus;
use App\Filament\Resources\Inquiries\InquiryResource;
use App\Filament\Resources\Projects\ProjectResource;
use App\Filament\Resources\Testimonials\TestimonialResource;
use App\Models\Inquiry;
use App\Models\Project;
use App\Models\Testimonial;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ContentOverviewStats extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected ?string $heading = 'Ringkasan konten';

    protected ?string $description = 'Status singkat konten yang tayang di situs publik.';

    protected int|string|array $columnSpan = 'full';

    /**
     * @return array<Stat>
     */
    protected function getStats(): array
    {
        $published = Project::published()->count();
        $onHome = Project::published()->where('show_on_home', true)->count();
        $unread = Inquiry::query()->whereNull('read_at')->count();
        $testimonials = Testimonial::visible()->count();
        $leadsWeek = Inquiry::query()->where('created_at', '>=', now()->subDays(7))->count();

        return [
            Stat::make('Proyek tayang', (string) $published)
                ->description($onHome.' di beranda (maks. 6)')
                ->descriptionIcon(Heroicon::OutlinedHome)
                ->color('success')
                ->url(ProjectResource::getUrl('index')),
            Stat::make('Inbox baru', (string) $unread)
                ->description($unread > 0 ? 'Perlu ditinjau' : 'Semua sudah dibaca')
                ->descriptionIcon(Heroicon::OutlinedInbox)
                ->color($unread > 0 ? 'warning' : 'gray')
                ->url(InquiryResource::getUrl('index')),
            Stat::make('Testimoni aktif', (string) $testimonials)
                ->description('Tampil di beranda')
                ->descriptionIcon(Heroicon::OutlinedChatBubbleLeftRight)
                ->color('primary')
                ->url(TestimonialResource::getUrl('index')),
            Stat::make('Lead 7 hari', (string) $leadsWeek)
                ->description('Form WhatsApp / kontak')
                ->descriptionIcon(Heroicon::OutlinedArrowTrendingUp)
                ->color($leadsWeek > 0 ? 'success' : 'gray')
                ->url(InquiryResource::getUrl('index')),
            Stat::make('Draft proyek', (string) Project::query()->where('status', ProjectStatus::Draft)->count())
                ->description('Belum dipublish')
                ->descriptionIcon(Heroicon::OutlinedDocument)
                ->color('gray')
                ->url(ProjectResource::getUrl('index')),
        ];
    }
}
