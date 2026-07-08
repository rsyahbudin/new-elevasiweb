<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use BackedEnum;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class ManageSiteSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static ?string $navigationLabel = 'Site Settings';

    protected static ?int $navigationSort = 5;

    protected string $view = 'filament.pages.manage-site-settings';

    /**
     * @var array<string, mixed>
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'hero' => SiteSetting::get('hero', self::heroDefaults()),
            'services' => SiteSetting::get('services', self::servicesDefaults()),
            'tentang' => SiteSetting::get('tentang', self::tentangDefaults()),
            'contact' => SiteSetting::get('contact', self::contactDefaults()),
            'brand' => SiteSetting::get('brand', ['accent' => '#1F7A46']),
        ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Settings')
                    ->tabs([
                        Tab::make('Hero')
                            ->schema([
                                TextInput::make('hero.location')->label('Location line'),
                                TextInput::make('hero.established')->label('Established line'),
                                TextInput::make('hero.headline_line1.id')->label('Headline line 1 (ID)')->required(),
                                TextInput::make('hero.headline_line1.en')->label('Headline line 1 (EN)'),
                                TextInput::make('hero.headline_accent.id')->label('Headline accent word (ID)')->required(),
                                TextInput::make('hero.headline_accent.en')->label('Headline accent word (EN)'),
                                TextInput::make('hero.headline_word.id')->label('Headline last word (ID)')->required(),
                                TextInput::make('hero.headline_word.en')->label('Headline last word (EN)'),
                                Textarea::make('hero.lede.id')->label('Lede (ID)')->required()->rows(3),
                                Textarea::make('hero.lede.en')->label('Lede (EN)')->rows(3),
                                Textarea::make('hero.marquee_text.id')->label('Marquee text (ID)')->rows(2),
                                Textarea::make('hero.marquee_text.en')->label('Marquee text (EN)')->rows(2),
                                TextInput::make('hero.badge_label.id')->label('Hero badge label (ID)'),
                                TextInput::make('hero.badge_label.en')->label('Hero badge label (EN)'),
                                FileUpload::make('hero.cover_image')
                                    ->label('Hero cover image')
                                    ->image()
                                    ->disk('public')
                                    ->directory('site-settings/hero')
                                    ->visibility('public')
                                    ->imageEditor(),
                                TextInput::make('hero.cover_caption')->label('Cover photo caption'),
                            ]),

                        Tab::make('Services')
                            ->schema([
                                Repeater::make('services')
                                    ->schema([
                                        TextInput::make('number')->label('No.')->required(),
                                        TextInput::make('name.id')->label('Name (ID)')->required(),
                                        TextInput::make('name.en')->label('Name (EN)'),
                                        Textarea::make('description.id')->label('Short description (ID)')->rows(2)->required(),
                                        Textarea::make('description.en')->label('Short description (EN)')->rows(2),
                                        Textarea::make('detail.id')->label('Layanan page detail (ID)')->rows(3)->required(),
                                        Textarea::make('detail.en')->label('Layanan page detail (EN)')->rows(3),
                                    ])
                                    ->columns(2)
                                    ->reorderable()
                                    ->addActionLabel('Add service'),
                            ]),

                        Tab::make('Tentang')
                            ->schema([
                                TextInput::make('tentang.title.id')->label('Title (ID)')->required(),
                                TextInput::make('tentang.title.en')->label('Title (EN)'),
                                Repeater::make('tentang.body')
                                    ->label('Body paragraphs')
                                    ->schema([
                                        Textarea::make('id')->label('Paragraph (ID)')->rows(3)->required(),
                                        Textarea::make('en')->label('Paragraph (EN)')->rows(3),
                                    ])
                                    ->columns(2)
                                    ->addActionLabel('Add paragraph'),
                                Repeater::make('tentang.values')
                                    ->label('Values')
                                    ->schema([
                                        TextInput::make('title.id')->label('Title (ID)')->required(),
                                        TextInput::make('title.en')->label('Title (EN)'),
                                        Textarea::make('description.id')->label('Description (ID)')->rows(2)->required(),
                                        Textarea::make('description.en')->label('Description (EN)')->rows(2),
                                    ])
                                    ->columns(2)
                                    ->addActionLabel('Add value'),
                            ]),

                        Tab::make('Contact')
                            ->schema([
                                TextInput::make('contact.whatsapp_number')
                                    ->label('WhatsApp number (e.g. 6281234567890)')
                                    ->required(),
                                Textarea::make('contact.whatsapp_message.id')->label('WhatsApp prefilled message (ID)')->rows(2),
                                Textarea::make('contact.whatsapp_message.en')->label('WhatsApp prefilled message (EN)')->rows(2),
                                TextInput::make('contact.email')->label('Email')->email()->required(),
                                Textarea::make('contact.address.id')->label('Address (ID)')->rows(2),
                                Textarea::make('contact.address.en')->label('Address (EN)')->rows(2),
                                TextInput::make('contact.instagram_url')->label('Instagram URL')->url(),
                                TextInput::make('contact.linkedin_url')->label('LinkedIn URL')->url(),
                            ]),

                        Tab::make('Brand')
                            ->schema([
                                ColorPicker::make('brand.accent')->label('Accent color'),
                            ]),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach (['hero', 'services', 'tentang', 'contact', 'brand'] as $key) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $data[$key] ?? []]);
        }

        Notification::make()
            ->title('Settings saved')
            ->success()
            ->send();
    }

    public static function heroDefaults(): array
    {
        return [
            'location' => 'Jakarta, Indonesia',
            'established' => 'Est. 2019',
            'headline_line1' => ['id' => 'Ruang dibangun', 'en' => 'Spaces built'],
            'headline_accent' => ['id' => 'dengan', 'en' => 'with'],
            'headline_word' => ['id' => 'niat', 'en' => 'intent'],
            'lede' => [
                'id' => 'Elevasi adalah kontraktor design-build yang mengerjakan arsitektur residensial dan komersial — dari sketsa pertama hingga serah terima, dalam satu atap.',
                'en' => 'Elevasi is a design-build contractor delivering residential and commercial architecture — from first sketch to final handover, under one roof.',
            ],
            'marquee_text' => [
                'id' => 'Residensial ✦ Komersial ✦ Interior ✦ Renovasi',
                'en' => 'Residential ✦ Commercial ✦ Interior ✦ Renovation',
            ],
            'badge_label' => [
                'id' => 'Proyek signature Elevasi',
                'en' => 'Elevasi signature project',
            ],
            'cover_image' => null,
            'cover_caption' => 'hero photo — flagship project, exterior at dusk',
        ];
    }

    public static function servicesDefaults(): array
    {
        return [
            ['number' => '01', 'name' => ['id' => 'Desain & Perencanaan', 'en' => 'Design & Planning'], 'description' => ['id' => 'Arsitektur, perizinan, dan rekayasa terkoordinasi sebagai satu paket — tanpa serah terima antar konsultan.', 'en' => 'Architecture, permits, and engineering coordinated as one package — no handoffs between consultants.'], 'detail' => ['id' => 'Arsitektur, perizinan, dan rekayasa terkoordinasi sebagai satu paket — tanpa serah terima antar konsultan.', 'en' => 'Architecture, permits, and engineering coordinated as one package — no handoffs between consultants.']],
            ['number' => '02', 'name' => ['id' => 'Konstruksi', 'en' => 'Construction'], 'description' => ['id' => 'Tim konstruksi internal untuk struktur, MEP, dan finishing, dikelola sesuai jadwal tetap.', 'en' => 'In-house build teams for structural, MEP, and finishing work, managed against a fixed schedule.'], 'detail' => ['id' => 'Tim konstruksi internal untuk struktur, MEP, dan finishing, dikelola sesuai jadwal tetap.', 'en' => 'In-house build teams for structural, MEP, and finishing work, managed against a fixed schedule.']],
            ['number' => '03', 'name' => ['id' => 'Interior Fit-Out', 'en' => 'Interior Fit-Out'], 'description' => ['id' => 'Furnitur custom dari bengkel kami sendiri, furnitur, pencahayaan, dan styling hingga siap huni.', 'en' => 'Custom millwork from our own workshop, furniture, lighting, and styling to handover condition.'], 'detail' => ['id' => 'Furnitur custom dari bengkel kami sendiri, furnitur, pencahayaan, dan styling hingga siap huni.', 'en' => 'Custom millwork from our own workshop, furniture, lighting, and styling to handover condition.']],
            ['number' => '04', 'name' => ['id' => 'Renovasi', 'en' => 'Renovation'], 'description' => ['id' => 'Renovasi bertahap untuk rumah dan ruko yang masih dihuni/beroperasi, disusun agar aktivitas tetap berjalan.', 'en' => 'Phased renovation of occupied homes and shophouses, sequenced so life and business continue.'], 'detail' => ['id' => 'Renovasi bertahap untuk rumah dan ruko yang masih dihuni/beroperasi, disusun agar aktivitas tetap berjalan.', 'en' => 'Phased renovation of occupied homes and shophouses, sequenced so life and business continue.']],
        ];
    }

    public static function tentangDefaults(): array
    {
        return [
            'title' => ['id' => 'Tentang Elevasi', 'en' => 'About Elevasi'],
            'body' => [
                ['id' => 'Elevasi Design & Build adalah studio design-build yang berbasis di Jakarta, mengerjakan arsitektur residensial dan komersial sejak 2019.', 'en' => 'Elevasi Design & Build is a Jakarta-based design-build studio delivering residential and commercial architecture since 2019.'],
            ],
            'values' => [
                ['title' => ['id' => 'Satu atap', 'en' => 'One roof'], 'description' => ['id' => 'Desain, perizinan, dan konstruksi ditangani oleh satu tim yang sama.', 'en' => 'Design, permits, and construction handled by one and the same team.']],
            ],
        ];
    }

    public static function contactDefaults(): array
    {
        return [
            'whatsapp_number' => '6281234567890',
            'whatsapp_message' => ['id' => 'Halo Elevasi, saya ingin bertanya tentang proyek.', 'en' => 'Hi Elevasi, I would like to ask about a project.'],
            'email' => 'hello@elevasi.id',
            'address' => ['id' => 'Jakarta Selatan, Indonesia', 'en' => 'South Jakarta, Indonesia'],
            'instagram_url' => 'https://instagram.com/elevasi.id',
            'linkedin_url' => 'https://linkedin.com/company/elevasi',
        ];
    }
}
