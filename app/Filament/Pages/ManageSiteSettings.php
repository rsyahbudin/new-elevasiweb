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

    protected static ?string $navigationLabel = 'Pengaturan Situs';

    protected static string|\UnitEnum|null $navigationGroup = 'Pengaturan';

    protected static ?int $navigationSort = 1;

    protected string $view = 'filament.pages.manage-site-settings';

    /**
     * @var array<string, mixed>
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'hero' => array_replace_recursive(self::heroDefaults(), SiteSetting::get('hero', self::heroDefaults()) ?? []),
            'services' => array_replace_recursive(self::servicesDefaults(), SiteSetting::get('services', self::servicesDefaults()) ?? []),
            'tentang' => array_replace_recursive(self::tentangDefaults(), SiteSetting::get('tentang', self::tentangDefaults()) ?? []),
            'contact' => array_replace_recursive(self::contactDefaults(), SiteSetting::get('contact', self::contactDefaults()) ?? []),
            'navigation' => array_replace_recursive(self::navigationDefaults(), SiteSetting::get('navigation', self::navigationDefaults()) ?? []),
            'footer' => array_replace_recursive(self::footerDefaults(), SiteSetting::get('footer', self::footerDefaults()) ?? []),
            'home' => array_replace_recursive(self::homeDefaults(), SiteSetting::get('home', self::homeDefaults()) ?? []),
            'projects' => array_replace_recursive(self::projectsDefaults(), SiteSetting::get('projects', self::projectsDefaults()) ?? []),
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
                                Section::make('Identitas hero')
                                    ->columns(2)
                                    ->schema([
                                        TextInput::make('hero.location')->label('Lokasi'),
                                        TextInput::make('hero.established')->label('Tahun berdiri'),
                                        TextInput::make('hero.page_title.id')->label('Judul SEO (ID)'),
                                        TextInput::make('hero.page_title.en')->label('Judul SEO (EN)'),
                                        Textarea::make('hero.meta_description.id')
                                            ->label('Meta description (ID)')
                                            ->rows(2)
                                            ->helperText('Ringkasan untuk Google (±150–160 karakter).'),
                                        Textarea::make('hero.meta_description.en')
                                            ->label('Meta description (EN)')
                                            ->rows(2),
                                        TextInput::make('hero.eyebrow.id')->label('Label kecil atas (ID)'),
                                        TextInput::make('hero.eyebrow.en')->label('Label kecil atas (EN)'),
                                    ]),
                                Section::make('Headline')
                                    ->description('Tiga potongan teks yang membentuk headline besar di beranda.')
                                    ->columns(2)
                                    ->schema([
                                        TextInput::make('hero.headline_line1.id')->label('Baris 1 (ID)')->required(),
                                        TextInput::make('hero.headline_line1.en')->label('Baris 1 (EN)'),
                                        TextInput::make('hero.headline_accent.id')->label('Kata aksen (ID)')->required(),
                                        TextInput::make('hero.headline_accent.en')->label('Kata aksen (EN)'),
                                        TextInput::make('hero.headline_word.id')->label('Kata terakhir (ID)')->required(),
                                        TextInput::make('hero.headline_word.en')->label('Kata terakhir (EN)'),
                                        Textarea::make('hero.lede.id')->label('Paragraf singkat (ID)')->required()->rows(3),
                                        Textarea::make('hero.lede.en')->label('Paragraf singkat (EN)')->rows(3),
                                    ]),
                                Section::make('CTA & dekorasi')
                                    ->columns(2)
                                    ->schema([
                                        TextInput::make('hero.view_work.id')->label('Teks link Lihat karya (ID)'),
                                        TextInput::make('hero.view_work.en')->label('Teks link Lihat karya (EN)'),
                                        Textarea::make('hero.marquee_text.id')->label('Teks berjalan (ID)')->rows(2),
                                        Textarea::make('hero.marquee_text.en')->label('Teks berjalan (EN)')->rows(2),
                                        TextInput::make('hero.badge_label.id')->label('Badge foto (ID)'),
                                        TextInput::make('hero.badge_label.en')->label('Badge foto (EN)'),
                                        FileUpload::make('hero.cover_image')
                                            ->label('Foto cover hero')
                                            ->image()
                                            ->disk('public')
                                            ->directory('site-settings/hero')
                                            ->visibility('public')
                                            ->imageEditor()
                                            ->rules(['dimensions:min_width=2400,min_height=1400'])
                                            ->maxSize(8 * 1024)
                                            ->helperText('Disarankan 2880×1600 px (sekitar 16:9). Minimal 2400×1400 px, max 8 MB. Dipakai full-bleed di beranda (~62–76vh).')
                                            ->columnSpanFull(),
                                        TextInput::make('hero.cover_caption.id')
                                            ->label('Caption foto cover (ID)')
                                            ->helperText('Teks cadangan / alt text jika gambar belum ter-load.'),
                                        TextInput::make('hero.cover_caption.en')
                                            ->label('Caption foto cover (EN)'),
                                    ]),
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
                                        Textarea::make('detail.id')->label('Expanded detail (ID)')->rows(3)->required(),
                                        Textarea::make('detail.en')->label('Expanded detail (EN)')->rows(3),
                                        TextInput::make('category_slug')
                                            ->label('Related category slug')
                                            ->placeholder('residential, commercial, interior, renovation'),
                                    ])
                                    ->columns(2)
                                    ->reorderable()
                                    ->addActionLabel('Add service'),
                            ]),

                        Tab::make('Tentang')
                            ->schema([
                                TextInput::make('tentang.title.id')->label('Title (ID)')->required(),
                                TextInput::make('tentang.title.en')->label('Title (EN)'),
                                TextInput::make('tentang.section_eyebrow.id')->label('Section eyebrow (ID)'),
                                TextInput::make('tentang.section_eyebrow.en')->label('Section eyebrow (EN)'),
                                TextInput::make('tentang.section_process_label.id')->label('Process section label (ID)'),
                                TextInput::make('tentang.section_process_label.en')->label('Process section label (EN)'),
                                TextInput::make('tentang.section_values_label.id')->label('Values section label (ID)'),
                                TextInput::make('tentang.section_values_label.en')->label('Values section label (EN)'),
                                TextInput::make('tentang.manifesto.id')->label('Manifesto line (ID)'),
                                TextInput::make('tentang.manifesto.en')->label('Manifesto line (EN)'),
                                Textarea::make('tentang.process_intro.id')->label('Process intro (ID)')->rows(2),
                                Textarea::make('tentang.process_intro.en')->label('Process intro (EN)')->rows(2),
                                Repeater::make('tentang.body')
                                    ->label('Body paragraphs')
                                    ->schema([
                                        Textarea::make('id')->label('Paragraph (ID)')->rows(3)->required(),
                                        Textarea::make('en')->label('Paragraph (EN)')->rows(3),
                                    ])
                                    ->columns(2)
                                    ->addActionLabel('Add paragraph'),
                                Repeater::make('tentang.stats')
                                    ->label('Stats')
                                    ->schema([
                                        TextInput::make('value')->label('Value')->placeholder('30+'),
                                        TextInput::make('label.id')->label('Label (ID)'),
                                        TextInput::make('label.en')->label('Label (EN)'),
                                    ])
                                    ->columns(2)
                                    ->default(self::tentangStatsDefaults())
                                    ->addActionLabel('Add stat'),
                                Repeater::make('tentang.process')
                                    ->label('Process steps')
                                    ->schema([
                                        TextInput::make('step')->label('Step number'),
                                        TextInput::make('title.id')->label('Title (ID)'),
                                        TextInput::make('title.en')->label('Title (EN)'),
                                        Textarea::make('description.id')->label('Description (ID)')->rows(2),
                                        Textarea::make('description.en')->label('Description (EN)')->rows(2),
                                    ])
                                    ->columns(2)
                                    ->default(self::tentangProcessDefaults())
                                    ->addActionLabel('Add step'),
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
                                Section::make('Kontak bisnis')
                                    ->description('Data penting — nomor WhatsApp, alamat, Instagram.')
                                    ->columns(2)
                                    ->schema([
                                        TextInput::make('contact.whatsapp_number')
                                            ->label('Nomor WhatsApp')
                                            ->helperText('Format internasional tanpa +, contoh: 6281234567890')
                                            ->required(),
                                        TextInput::make('contact.instagram_url')->label('URL Instagram')->url(),
                                        TextInput::make('contact.email')->label('Email')->email(),
                                        Textarea::make('contact.address.id')->label('Alamat (ID)')->rows(2),
                                        Textarea::make('contact.address.en')->label('Alamat (EN)')->rows(2),
                                        Textarea::make('contact.service_area.id')->label('Area layanan (ID)')->rows(2),
                                        Textarea::make('contact.service_area.en')->label('Area layanan (EN)')->rows(2),
                                        Textarea::make('contact.response_time.id')->label('Catatan waktu respons (ID)')->rows(2),
                                        Textarea::make('contact.response_time.en')->label('Catatan waktu respons (EN)')->rows(2),
                                    ]),
                                Section::make('Halaman kontak')
                                    ->columns(2)
                                    ->collapsed()
                                    ->schema([
                                        TextInput::make('contact.page_title.id')->label('Judul SEO (ID)'),
                                        TextInput::make('contact.page_title.en')->label('Judul SEO (EN)'),
                                        TextInput::make('contact.page_eyebrow.id')->label('Label kecil (ID)'),
                                        TextInput::make('contact.page_eyebrow.en')->label('Label kecil (EN)'),
                                        TextInput::make('contact.page_heading.id')->label('Heading (ID)'),
                                        TextInput::make('contact.page_heading.en')->label('Heading (EN)'),
                                        Textarea::make('contact.page_subheading.id')->label('Subheading (ID)')->rows(2),
                                        Textarea::make('contact.page_subheading.en')->label('Subheading (EN)')->rows(2),
                                        TextInput::make('contact.page_cta_label.id')->label('Teks tombol CTA (ID)'),
                                        TextInput::make('contact.page_cta_label.en')->label('Teks tombol CTA (EN)'),
                                        FileUpload::make('contact.page_image')
                                            ->label('Foto halaman kontak')
                                            ->image()
                                            ->disk('public')
                                            ->directory('site-settings/contact')
                                            ->visibility('public')
                                            ->imageEditor()
                                            ->rules(['dimensions:min_width=1800,min_height=900'])
                                            ->maxSize(6 * 1024)
                                            ->helperText('Disarankan 2400×1080 px (sekitar 21:9 wide). Minimal 1800×900 px, max 6 MB.')
                                            ->columnSpanFull(),
                                    ]),
                                Section::make('Dialog WhatsApp')
                                    ->description('Teks yang muncul di form sebelum user diarahkan ke WhatsApp.')
                                    ->columns(2)
                                    ->collapsed()
                                    ->schema([
                                        TextInput::make('contact.inquiry_dialog_title.id')->label('Judul dialog (ID)'),
                                        TextInput::make('contact.inquiry_dialog_title.en')->label('Judul dialog (EN)'),
                                        Textarea::make('contact.inquiry_dialog_description.id')->label('Deskripsi (ID)')->rows(2),
                                        Textarea::make('contact.inquiry_dialog_description.en')->label('Deskripsi (EN)')->rows(2),
                                        TextInput::make('contact.inquiry_dialog_name_label.id')->label('Label nama (ID)'),
                                        TextInput::make('contact.inquiry_dialog_name_label.en')->label('Label nama (EN)'),
                                        TextInput::make('contact.inquiry_dialog_contact_label.id')->label('Label kontak (ID)'),
                                        TextInput::make('contact.inquiry_dialog_contact_label.en')->label('Label kontak (EN)'),
                                        TextInput::make('contact.inquiry_dialog_contact_placeholder.id')->label('Placeholder kontak (ID)'),
                                        TextInput::make('contact.inquiry_dialog_contact_placeholder.en')->label('Placeholder kontak (EN)'),
                                        TextInput::make('contact.inquiry_dialog_message_label.id')->label('Label pesan (ID)'),
                                        TextInput::make('contact.inquiry_dialog_message_label.en')->label('Label pesan (EN)'),
                                        Textarea::make('contact.inquiry_dialog_message_placeholder.id')->label('Placeholder pesan (ID)')->rows(2),
                                        Textarea::make('contact.inquiry_dialog_message_placeholder.en')->label('Placeholder pesan (EN)')->rows(2),
                                        TextInput::make('contact.inquiry_dialog_submit_label.id')->label('Tombol kirim (ID)'),
                                        TextInput::make('contact.inquiry_dialog_submit_label.en')->label('Tombol kirim (EN)'),
                                        TextInput::make('contact.inquiry_dialog_submitting_label.id')->label('Teks loading (ID)'),
                                        TextInput::make('contact.inquiry_dialog_submitting_label.en')->label('Teks loading (EN)'),
                                        TextInput::make('contact.inquiry_dialog_cancel_label.id')->label('Tombol batal (ID)'),
                                        TextInput::make('contact.inquiry_dialog_cancel_label.en')->label('Tombol batal (EN)'),
                                        Textarea::make('contact.whatsapp_message.id')
                                            ->label('Pesan WA lama (ID)')
                                            ->helperText('Cadangan lama — tidak dipakai setelah dialog aktif.')
                                            ->rows(2),
                                        Textarea::make('contact.whatsapp_message.en')
                                            ->label('Pesan WA lama (EN)')
                                            ->rows(2),
                                    ]),
                                Section::make('Konten halaman kontak')
                                    ->collapsed()
                                    ->schema([
                                        TextInput::make('contact.section_response_time_label.id')->label('Label waktu respons (ID)'),
                                        TextInput::make('contact.section_response_time_label.en')->label('Label waktu respons (EN)'),
                                        TextInput::make('contact.section_service_area_label.id')->label('Label area layanan (ID)'),
                                        TextInput::make('contact.section_service_area_label.en')->label('Label area layanan (EN)'),
                                        TextInput::make('contact.section_prepare_label.id')->label('Label checklist (ID)'),
                                        TextInput::make('contact.section_prepare_label.en')->label('Label checklist (EN)'),
                                        Repeater::make('contact.prepare_items')
                                            ->label('Checklist sebelum menghubungi')
                                            ->schema([
                                                TextInput::make('title.id')->label('Judul (ID)'),
                                                TextInput::make('title.en')->label('Judul (EN)'),
                                                Textarea::make('description.id')->label('Deskripsi (ID)')->rows(2),
                                                Textarea::make('description.en')->label('Deskripsi (EN)')->rows(2),
                                            ])
                                            ->columns(2)
                                            ->default(self::contactPrepareDefaults())
                                            ->addActionLabel('Tambah item')
                                            ->columnSpanFull(),
                                        TextInput::make('contact.section_process_label.id')->label('Label proses (ID)'),
                                        TextInput::make('contact.section_process_label.en')->label('Label proses (EN)'),
                                        Repeater::make('contact.process_steps')
                                            ->label('Langkah proses')
                                            ->schema([
                                                TextInput::make('step')->label('No.'),
                                                TextInput::make('title.id')->label('Judul (ID)'),
                                                TextInput::make('title.en')->label('Judul (EN)'),
                                                Textarea::make('description.id')->label('Deskripsi (ID)')->rows(2),
                                                Textarea::make('description.en')->label('Deskripsi (EN)')->rows(2),
                                            ])
                                            ->columns(2)
                                            ->default(self::tentangProcessDefaults())
                                            ->addActionLabel('Tambah langkah')
                                            ->columnSpanFull(),
                                        TextInput::make('contact.section_recent_work_label.id')->label('Label karya terbaru (ID)'),
                                        TextInput::make('contact.section_recent_work_label.en')->label('Label karya terbaru (EN)'),
                                        TextInput::make('contact.section_follow_instagram_label.id')->label('Label follow Instagram (ID)'),
                                        TextInput::make('contact.section_follow_instagram_label.en')->label('Label follow Instagram (EN)'),
                                        TextInput::make('contact.section_address_label.id')->label('Label alamat (ID)'),
                                        TextInput::make('contact.section_address_label.en')->label('Label alamat (EN)'),
                                        TextInput::make('contact.section_instagram_label.id')->label('Label Instagram (ID)'),
                                        TextInput::make('contact.section_instagram_label.en')->label('Label Instagram (EN)'),
                                    ])
                                    ->columns(2),
                            ]),

                        Tab::make('Home Page')
                            ->schema([
                                TextInput::make('home.work_heading.id')->label('Featured work heading (ID)'),
                                TextInput::make('home.work_heading.en')->label('Featured work heading (EN)'),
                                TextInput::make('home.work_heading_accent.id')->label('Featured work accent (ID)'),
                                TextInput::make('home.work_heading_accent.en')->label('Featured work accent (EN)'),
                                TextInput::make('home.work_range.id')->label('Year range (ID)'),
                                TextInput::make('home.work_range.en')->label('Year range (EN)'),
                                TextInput::make('home.work_all_projects.id')->label('All projects button (ID)'),
                                TextInput::make('home.work_all_projects.en')->label('All projects button (EN)'),
                                TextInput::make('home.services_eyebrow.id')->label('Services eyebrow (ID)'),
                                TextInput::make('home.services_eyebrow.en')->label('Services eyebrow (EN)'),
                                TextInput::make('home.services_view_projects.id')->label('View related projects link (ID)'),
                                TextInput::make('home.services_view_projects.en')->label('View related projects link (EN)'),
                                TextInput::make('home.testimonial_eyebrow.id')->label('Testimonial eyebrow (ID)'),
                                TextInput::make('home.testimonial_eyebrow.en')->label('Testimonial eyebrow (EN)'),
                            ]),

                        Tab::make('Projects Page')
                            ->schema([
                                TextInput::make('projects.index_page_title.id')->label('Index page title / SEO (ID)'),
                                TextInput::make('projects.index_page_title.en')->label('Index page title / SEO (EN)'),
                                Textarea::make('projects.index_meta_description.id')->label('Index meta description (ID)')->rows(2),
                                Textarea::make('projects.index_meta_description.en')->label('Index meta description (EN)')->rows(2),
                                TextInput::make('projects.index_heading.id')->label('Index heading (ID)'),
                                TextInput::make('projects.index_heading.en')->label('Index heading (EN)'),
                                TextInput::make('projects.index_heading_accent.id')->label('Index heading accent (ID)'),
                                TextInput::make('projects.index_heading_accent.en')->label('Index heading accent (EN)'),
                                TextInput::make('projects.index_all_filter.id')->label('All filter label (ID)'),
                                TextInput::make('projects.index_all_filter.en')->label('All filter label (EN)'),
                                TextInput::make('projects.index_empty.id')->label('Empty state message (ID)'),
                                TextInput::make('projects.index_empty.en')->label('Empty state message (EN)'),
                                TextInput::make('projects.detail_all_projects.id')->label('Back link label (ID)'),
                                TextInput::make('projects.detail_all_projects.en')->label('Back link label (EN)'),
                                TextInput::make('projects.detail_category.id')->label('Category label (ID)'),
                                TextInput::make('projects.detail_category.en')->label('Category label (EN)'),
                                TextInput::make('projects.detail_client.id')->label('Client label (ID)'),
                                TextInput::make('projects.detail_client.en')->label('Client label (EN)'),
                                TextInput::make('projects.detail_location.id')->label('Location label (ID)'),
                                TextInput::make('projects.detail_location.en')->label('Location label (EN)'),
                                TextInput::make('projects.detail_year_completed.id')->label('Year completed label (ID)'),
                                TextInput::make('projects.detail_year_completed.en')->label('Year completed label (EN)'),
                                TextInput::make('projects.detail_scope.id')->label('Scope label (ID)'),
                                TextInput::make('projects.detail_scope.en')->label('Scope label (EN)'),
                                TextInput::make('projects.detail_area.id')->label('Area label (ID)'),
                                TextInput::make('projects.detail_area.en')->label('Area label (EN)'),
                                TextInput::make('projects.detail_about_project.id')->label('About project label (ID)'),
                                TextInput::make('projects.detail_about_project.en')->label('About project label (EN)'),
                                TextInput::make('projects.detail_next_project.id')->label('Next project label (ID)'),
                                TextInput::make('projects.detail_next_project.en')->label('Next project label (EN)'),
                            ]),

                        Tab::make('Navigation')
                            ->schema([
                                TextInput::make('navigation.work.id')->label('Work link (ID)'),
                                TextInput::make('navigation.work.en')->label('Work link (EN)'),
                                TextInput::make('navigation.studio.id')->label('Studio link (ID)'),
                                TextInput::make('navigation.studio.en')->label('Studio link (EN)'),
                                TextInput::make('navigation.contact.id')->label('Contact link (ID)'),
                                TextInput::make('navigation.contact.en')->label('Contact link (EN)'),
                                TextInput::make('navigation.cta.id')->label('Nav CTA button (ID)'),
                                TextInput::make('navigation.cta.en')->label('Nav CTA button (EN)'),
                            ]),

                        Tab::make('Footer')
                            ->schema([
                                Section::make('Teks CTA footer')
                                    ->columns(2)
                                    ->schema([
                                        TextInput::make('footer.eyebrow.id')->label('Label kecil (ID)'),
                                        TextInput::make('footer.eyebrow.en')->label('Label kecil (EN)'),
                                        TextInput::make('footer.title_line1.id')->label('Judul baris 1 (ID)'),
                                        TextInput::make('footer.title_line1.en')->label('Judul baris 1 (EN)'),
                                        TextInput::make('footer.title_line2.id')->label('Judul baris 2 / italic (ID)'),
                                        TextInput::make('footer.title_line2.en')->label('Judul baris 2 / italic (EN)'),
                                        TextInput::make('footer.whatsapp.id')->label('Teks tombol WhatsApp (ID)'),
                                        TextInput::make('footer.whatsapp.en')->label('Teks tombol WhatsApp (EN)'),
                                    ]),
                                Section::make('Gambar latar CTA')
                                    ->description('Opsional. Jika diisi, blok CTA footer memakai foto sebagai background dengan overlay gelap.')
                                    ->schema([
                                        FileUpload::make('footer.cta_image')
                                            ->label('Foto background CTA')
                                            ->image()
                                            ->disk('public')
                                            ->directory('site-settings/footer')
                                            ->visibility('public')
                                            ->imageEditor()
                                            ->rules(['dimensions:min_width=1800,min_height=1000'])
                                            ->maxSize(6 * 1024)
                                            ->helperText('Disarankan 2400×1200 px (2:1). Minimal 1800×1000 px, max 6 MB. Pilih foto kontras sedang — teks putih harus tetap terbaca.'),
                                    ]),
                                Section::make('Bar bawah footer')
                                    ->columns(2)
                                    ->schema([
                                        TextInput::make('footer.copyright.id')->label('Copyright (ID)'),
                                        TextInput::make('footer.copyright.en')->label('Copyright (EN)'),
                                        TextInput::make('footer.instagram_label.id')->label('Label Instagram (ID)'),
                                        TextInput::make('footer.instagram_label.en')->label('Label Instagram (EN)'),
                                        TextInput::make('footer.whatsapp_label.id')->label('Label WhatsApp (ID)'),
                                        TextInput::make('footer.whatsapp_label.en')->label('Label WhatsApp (EN)'),
                                    ]),
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

        foreach (['hero', 'services', 'tentang', 'contact', 'navigation', 'footer', 'home', 'projects', 'brand'] as $key) {
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
            'eyebrow' => ['id' => 'Kontraktor design-build', 'en' => 'Design-build contractor'],
            'view_work' => ['id' => 'Lihat karya pilihan', 'en' => 'View selected work'],
            'page_title' => [
                'id' => 'Kontraktor Design & Build Jakarta',
                'en' => 'Design & Build Contractor Jakarta',
            ],
            'meta_description' => [
                'id' => 'Elevasi Design & Build — kontraktor profesional di Jakarta untuk desain 3D, RAB, konstruksi, interior, dan furniture. Satu tim dari konsep hingga serah terima.',
                'en' => 'Elevasi Design & Build — Jakarta design-build contractor for 3D design, BOQ, construction, interior, and furniture. One team from concept to handover.',
            ],
            'headline_line1' => ['id' => 'Dari niat', 'en' => 'From intent'],
            'headline_accent' => ['id' => 'ke', 'en' => 'to'],
            'headline_word' => ['id' => 'ruang', 'en' => 'space'],
            'lede' => [
                'id' => 'Kontraktor design-build di Jakarta — dari visualisasi 3D dan RAB, hingga konstruksi, interior, dan furniture, ditangani satu tim yang sama.',
                'en' => 'A Jakarta design-build contractor — from 3D visualization and BOQ through construction, interior, and furniture, handled by one team.',
            ],
            'marquee_text' => [
                'id' => 'Hunian ✦ Komersial ✦ Interior ✦ Renovasi',
                'en' => 'Residential ✦ Commercial ✦ Interior ✦ Renovation',
            ],
            'badge_label' => ['id' => '', 'en' => ''],
            'cover_image' => null,
            'cover_caption' => [
                'id' => 'Foto proyek unggulan Elevasi',
                'en' => 'Elevasi featured project photo',
            ],
        ];
    }

    public static function servicesDefaults(): array
    {
        return [
            ['number' => '01', 'name' => ['id' => 'Kontraktor', 'en' => 'Contractor'], 'description' => ['id' => 'Konstruksi dari struktur hingga finishing — dikelola dengan RAB, jadwal, dan laporan progress.', 'en' => 'Construction from structure to finishing — managed with BOQ, schedule, and progress reports.'], 'detail' => ['id' => 'Kami mengeksekusi pekerjaan konstruksi secara langsung: struktur, MEP, hardscape, dan finishing. Setiap tahap dilacak dengan RAB detail, jadwal kerja, dan dokumentasi lapangan mingguan.', 'en' => 'We execute construction directly: structure, MEP, hardscape, and finishing. Every phase is tracked with detailed BOQ, work schedule, and weekly site documentation.'], 'category_slug' => null],
            ['number' => '02', 'name' => ['id' => 'Desain 3D', 'en' => '3D Design'], 'description' => ['id' => 'Visualisasi 3D, gambar kerja, dan perencanaan teknis sebelum eksekusi dimulai.', 'en' => '3D visualization, working drawings, and technical planning before execution begins.'], 'detail' => ['id' => 'Studi awal, visualisasi 3D, dan gambar kerja disusun agar Anda melihat hasil akhir sebelum dibangun. Termasuk koordinasi perizinan dan penyusunan RAB transparan.', 'en' => 'Early studies, 3D visualization, and working drawings so you see the final result before building begins. Includes permit coordination and transparent BOQ preparation.'], 'category_slug' => null],
            ['number' => '03', 'name' => ['id' => 'Interior', 'en' => 'Interior'], 'description' => ['id' => 'Fit-out interior untuk rumah, kantor, dan cafe — dari konsep hingga siap operasional.', 'en' => 'Interior fit-out for homes, offices, and cafes — from concept to operational readiness.'], 'detail' => ['id' => 'Perencanaan tata ruang, material, pencahayaan, dan detail interior disesuaikan fungsi ruang. Kami menangani eksekusi fit-out hingga ruang siap digunakan.', 'en' => 'Space planning, materials, lighting, and interior details tailored to how the space functions. We handle fit-out execution until the space is ready to use.'], 'category_slug' => 'interior'],
            ['number' => '04', 'name' => ['id' => 'Furniture', 'en' => 'Furniture'], 'description' => ['id' => 'Furniture custom dari workshop kami — kitchen set, built-in, dan piece khusus.', 'en' => 'Custom furniture from our workshop — kitchen sets, built-ins, and bespoke pieces.'], 'detail' => ['id' => 'Bengkel furniture internal kami memproduksi kitchen set, wardrobe, built-in, dan furniture custom sesuai desain proyek. Kualitas material dan finishing dikontrol langsung.', 'en' => 'Our in-house furniture workshop produces kitchen sets, wardrobes, built-ins, and custom furniture aligned with the project design. Material quality and finishing are controlled directly.'], 'category_slug' => 'interior'],
        ];
    }

    public static function tentangDefaults(): array
    {
        return [
            'title' => ['id' => 'Studio', 'en' => 'Studio'],
            'section_eyebrow' => ['id' => 'Elevasi Design & Build', 'en' => 'Elevasi Design & Build'],
            'section_process_label' => ['id' => 'Cara kami bekerja', 'en' => 'How we work'],
            'section_values_label' => ['id' => 'Prinsip kami', 'en' => 'What guides us'],
            'manifesto' => [
                'id' => 'Kami membangun ruang dengan niat — ketika desain dan konstruksi berjalan dalam satu tim, hasilnya terasa utuh dari awal hingga akhir.',
                'en' => 'We build spaces with intent — when design and construction run as one team, the result feels whole from start to finish.',
            ],
            'process_intro' => [
                'id' => 'Setiap proyek punya alur yang jelas — tanpa bolak-balik antar vendor. Anda tahu apa yang sedang dikerjakan, berapa biayanya, dan kapan selesai.',
                'en' => 'Every project follows a clear flow — no back-and-forth between vendors. You know what is being built, what it costs, and when it finishes.',
            ],
            'body' => [
                ['id' => 'Elevasi adalah kontraktor design-build berbasis Jakarta. Kami menangani proyek hunian dan komersial — dari rumah tinggal, kantor, hingga ruang usaha dan landscape — dengan tim yang sama dari awal hingga serah terima.', 'en' => 'Elevasi is a Jakarta-based design-build contractor. We handle residential and commercial projects — from homes and offices to commercial spaces and landscape — with the same team from start to handover.'],
                ['id' => 'Bukan sekadar gambar cantik di layar. Kami menyusun visualisasi 3D, gambar kerja, dan RAB yang transparan, lalu mengeksekusinya di lapangan — termasuk interior fit-out dan furniture custom dari workshop kami sendiri.', 'en' => 'Not just beautiful images on screen. We prepare 3D visualization, working drawings, and a transparent BOQ, then execute on site — including interior fit-out and custom furniture from our own workshop.'],
            ],
            'stats' => self::tentangStatsDefaults(),
            'process' => self::tentangProcessDefaults(),
            'values' => [
                ['title' => ['id' => 'Jelas', 'en' => 'Clear'], 'description' => ['id' => 'Satu alur, satu penanggung jawab — Anda selalu tahu tahap, biaya, dan keputusan yang sedang diambil.', 'en' => 'One flow, one accountable team — you always know the stage, the cost, and the decisions being made.']],
                ['title' => ['id' => 'Kokoh', 'en' => 'Built right'], 'description' => ['id' => 'Struktur, material, dan finishing dikerjakan dengan standar kontraktor — bukan hanya tampilan permukaan.', 'en' => 'Structure, materials, and finishing built to contractor standards — not just surface finish.']],
                ['title' => ['id' => 'Mengangkat', 'en' => 'Raised'], 'description' => ['id' => 'Detail interior dan finishing yang membuat ruang terasa disengaja — rapi, hidup, dan siap dipakai.', 'en' => 'Interior details and finishing that make a space feel intentional — refined, lived-in, and ready to use.']],
            ],
        ];
    }

    public static function tentangStatsDefaults(): array
    {
        return [
            ['value' => '30+', 'label' => ['id' => 'Proyek selesai', 'en' => 'Projects delivered']],
            ['value' => '2019', 'label' => ['id' => 'Tahun berdiri', 'en' => 'Established']],
            ['value' => '4', 'label' => ['id' => 'Layanan inti', 'en' => 'Core services']],
            ['value' => '12', 'label' => ['id' => 'Tim inti', 'en' => 'Core team']],
        ];
    }

    public static function tentangProcessDefaults(): array
    {
        return [
            ['step' => '01', 'title' => ['id' => 'Konsultasi & survey', 'en' => 'Consultation & survey'], 'description' => ['id' => 'Kami mulai dari kebutuhan riil di lapangan — fungsi ruang, lokasi, budget, dan ekspektasi Anda.', 'en' => 'We start from real needs on site — how the space functions, location, budget, and your expectations.']],
            ['step' => '02', 'title' => ['id' => 'Desain 3D & RAB', 'en' => '3D design & BOQ'], 'description' => ['id' => 'Visualisasi 3D, gambar kerja, dan RAB transparan disusun sebelum konstruksi dimulai — Anda tahu apa yang dibangun dan berapa investasinya.', 'en' => '3D visualization, working drawings, and a transparent BOQ prepared before construction begins — you know what will be built and what it costs.']],
            ['step' => '03', 'title' => ['id' => 'Konstruksi', 'en' => 'Construction'], 'description' => ['id' => 'Eksekusi struktur, MEP, hardscape, dan finishing oleh tim internal dengan jadwal tetap dan laporan progress mingguan.', 'en' => 'Structure, MEP, hardscape, and finishing executed by our in-house team on a fixed schedule with weekly progress reports.']],
            ['step' => '04', 'title' => ['id' => 'Interior, furniture & serah terima', 'en' => 'Interior, furniture & handover'], 'description' => ['id' => 'Fit-out interior, furniture custom, detail akhir, inspeksi, dan serah terima — ruang siap digunakan.', 'en' => 'Interior fit-out, custom furniture, final details, inspection, and handover — the space ready to use.']],
        ];
    }

    public static function contactDefaults(): array
    {
        return [
            'page_title' => ['id' => 'Mulai proyek', 'en' => 'Start a project'],
            'page_eyebrow' => ['id' => 'Mulai proyek', 'en' => 'Start a project'],
            'page_heading' => ['id' => 'Ceritakan ruang yang ingin Anda bangun', 'en' => 'Tell us about the space you want to build'],
            'page_subheading' => [
                'id' => 'Isi formulir singkat, lalu lanjut ke WhatsApp — tim kami siap mendiskusikan proyek Anda.',
                'en' => 'Fill in a short form, then continue on WhatsApp — our team is ready to discuss your project.',
            ],
            'page_cta_label' => ['id' => 'Mulai chat', 'en' => 'Start chat'],
            'section_response_time_label' => ['id' => 'Waktu respons', 'en' => 'Response time'],
            'section_service_area_label' => ['id' => 'Area layanan', 'en' => 'Service area'],
            'section_prepare_label' => ['id' => 'Sebelum menghubungi kami', 'en' => 'Before you reach out'],
            'section_process_label' => ['id' => 'Setelah chat pertama', 'en' => 'After the first chat'],
            'section_recent_work_label' => ['id' => 'Karya terbaru', 'en' => 'Recent work'],
            'section_follow_instagram_label' => ['id' => 'Ikuti di Instagram', 'en' => 'Follow on Instagram'],
            'section_address_label' => ['id' => 'Alamat', 'en' => 'Address'],
            'section_instagram_label' => ['id' => 'Instagram', 'en' => 'Instagram'],
            'whatsapp_number' => '6281234567890',
            'whatsapp_message' => ['id' => 'Halo Elevasi, saya ingin bertanya tentang proyek.', 'en' => 'Hi Elevasi, I would like to ask about a project.'],
            'inquiry_dialog_title' => ['id' => 'Mulai percakapan', 'en' => 'Start a conversation'],
            'inquiry_dialog_description' => [
                'id' => 'Ceritakan sedikit tentang proyek Anda. Setelah ini Anda akan diarahkan ke WhatsApp dengan pesan yang sudah terisi.',
                'en' => 'Tell us a little about your project. You will then be redirected to WhatsApp with your message ready to send.',
            ],
            'inquiry_dialog_name_label' => ['id' => 'Nama', 'en' => 'Name'],
            'inquiry_dialog_contact_label' => ['id' => 'Nomor WhatsApp', 'en' => 'WhatsApp number'],
            'inquiry_dialog_contact_placeholder' => ['id' => '08xxxxxxxxxx', 'en' => '08xxxxxxxxxx'],
            'inquiry_dialog_message_label' => ['id' => 'Pesan', 'en' => 'Message'],
            'inquiry_dialog_message_placeholder' => [
                'id' => 'Contoh: Saya ingin renovasi rumah 2 lantai di Jakarta Selatan, target mulai bulan depan.',
                'en' => 'Example: I want to renovate a two-storey home in South Jakarta, aiming to start next month.',
            ],
            'inquiry_dialog_submit_label' => ['id' => 'Lanjut ke WhatsApp', 'en' => 'Continue to WhatsApp'],
            'inquiry_dialog_submitting_label' => ['id' => 'Menyimpan...', 'en' => 'Saving...'],
            'inquiry_dialog_cancel_label' => ['id' => 'Batal', 'en' => 'Cancel'],
            'page_image' => null,
            'service_area' => [
                'id' => 'Jabodetabek — Jakarta, Bogor, Depok, Tangerang, Bekasi',
                'en' => 'Greater Jakarta — Jakarta, Bogor, Depok, Tangerang, Bekasi',
            ],
            'response_time' => [
                'id' => 'Kami membalas dalam 1×24 jam kerja via WhatsApp.',
                'en' => 'We reply within one business day on WhatsApp.',
            ],
            'prepare_items' => self::contactPrepareDefaults(),
            'process_steps' => self::contactProcessDefaults(),
            'email' => 'hello@elevasi.id',
            'address' => ['id' => 'Jakarta Selatan, Indonesia', 'en' => 'South Jakarta, Indonesia'],
            'instagram_url' => 'https://instagram.com/elevasi.id',
        ];
    }

    public static function contactProcessDefaults(): array
    {
        return [
            ['step' => '01', 'title' => ['id' => 'Kami balas & klarifikasi', 'en' => 'We reply & clarify'], 'description' => ['id' => 'Tim kami membalas di WhatsApp, menanyakan detail penting, dan memastikan scope awal proyek Anda.', 'en' => 'Our team replies on WhatsApp, asks the key details, and confirms the initial scope of your project.']],
            ['step' => '02', 'title' => ['id' => 'Survey atau kickoff', 'en' => 'Survey or kickoff'], 'description' => ['id' => 'Jika cocok, kami jadwalkan survey lokasi atau pertemuan singkat untuk memahami kondisi lapangan.', 'en' => 'If it is a fit, we schedule a site survey or brief meeting to understand the site conditions.']],
            ['step' => '03', 'title' => ['id' => 'Usulan & RAB awal', 'en' => 'Proposal & early BOQ'], 'description' => ['id' => 'Anda menerima arah desain dan kisaran biaya sebelum keputusan lanjut ke tahap desain penuh.', 'en' => 'You receive a design direction and cost range before deciding to proceed into full design.']],
        ];
    }

    public static function contactPrepareDefaults(): array
    {
        return [
            ['title' => ['id' => 'Tipe proyek', 'en' => 'Project type'], 'description' => ['id' => 'Hunian, kantor, komersial, interior, atau landscape.', 'en' => 'Residential, office, commercial, interior, or landscape.']],
            ['title' => ['id' => 'Lokasi', 'en' => 'Location'], 'description' => ['id' => 'Alamat atau area proyek Anda.', 'en' => 'Your project address or area.']],
            ['title' => ['id' => 'Timeline', 'en' => 'Timeline'], 'description' => ['id' => 'Kapan ingin mulai dan target selesai.', 'en' => 'When you want to start and your target completion.']],
            ['title' => ['id' => 'Budget kasar', 'en' => 'Rough budget'], 'description' => ['id' => 'Kisaran investasi yang Anda pertimbangkan.', 'en' => 'The investment range you have in mind.']],
        ];
    }

    public static function navigationDefaults(): array
    {
        return [
            'work' => ['id' => 'Karya', 'en' => 'Work'],
            'studio' => ['id' => 'Studio', 'en' => 'Studio'],
            'contact' => ['id' => 'Kontak', 'en' => 'Contact'],
            'cta' => ['id' => 'Mulai proyek', 'en' => 'Start a project'],
        ];
    }

    public static function footerDefaults(): array
    {
        return [
            'eyebrow' => ['id' => 'Hubungi kami', 'en' => 'Get in touch'],
            'title_line1' => ['id' => 'Punya proyek', 'en' => 'Ready to build'],
            'title_line2' => ['id' => 'yang ingin diwujudkan?', 'en' => 'the space you have in mind?'],
            'whatsapp' => ['id' => 'Hubungi via WhatsApp', 'en' => 'WhatsApp us'],
            'copyright' => ['id' => '© 2026 Elevasi Design & Build', 'en' => '© 2026 Elevasi Design & Build'],
            'instagram_label' => ['id' => 'Instagram', 'en' => 'Instagram'],
            'whatsapp_label' => ['id' => 'WhatsApp', 'en' => 'WhatsApp'],
            'cta_image' => null,
        ];
    }

    public static function homeDefaults(): array
    {
        return [
            'work_heading' => ['id' => 'Karya', 'en' => 'Selected'],
            'work_heading_accent' => ['id' => 'pilihan', 'en' => 'projects'],
            'work_range' => ['id' => '2021 — 2026', 'en' => '2021 — 2026'],
            'work_all_projects' => ['id' => 'Semua proyek', 'en' => 'All projects'],
            'services_eyebrow' => ['id' => 'Yang kami kerjakan', 'en' => 'What we do'],
            'services_view_projects' => ['id' => 'Lihat proyek terkait', 'en' => 'View related projects'],
            'testimonial_eyebrow' => ['id' => 'Dari klien', 'en' => 'From clients'],
        ];
    }

    public static function projectsDefaults(): array
    {
        return [
            'index_page_title' => ['id' => 'Semua Proyek', 'en' => 'All Projects'],
            'index_meta_description' => [
                'id' => 'Portofolio proyek Elevasi Design & Build — hunian, komersial, interior, dan renovasi di Jakarta dan sekitarnya.',
                'en' => 'Elevasi Design & Build project portfolio — residential, commercial, interior, and renovation across Jakarta and beyond.',
            ],
            'index_heading' => ['id' => 'Semua', 'en' => 'All'],
            'index_heading_accent' => ['id' => 'proyek', 'en' => 'projects'],
            'index_all_filter' => ['id' => 'Semua', 'en' => 'All'],
            'index_empty' => ['id' => 'Belum ada proyek di kategori ini.', 'en' => 'No projects in this category yet.'],
            'detail_all_projects' => ['id' => 'Semua proyek', 'en' => 'All projects'],
            'detail_category' => ['id' => 'Kategori', 'en' => 'Category'],
            'detail_client' => ['id' => 'Klien', 'en' => 'Client'],
            'detail_location' => ['id' => 'Lokasi', 'en' => 'Location'],
            'detail_year_completed' => ['id' => 'Tahun selesai', 'en' => 'Year completed'],
            'detail_scope' => ['id' => 'Lingkup pekerjaan', 'en' => 'Scope'],
            'detail_area' => ['id' => 'Luas area', 'en' => 'Area'],
            'detail_about_project' => ['id' => 'Tentang proyek', 'en' => 'About the project'],
            'detail_next_project' => ['id' => 'Proyek selanjutnya', 'en' => 'Next project'],
            'detail_cta_label' => ['id' => 'Diskusikan proyek serupa', 'en' => 'Discuss a similar project'],
            'detail_cta_note' => [
                'id' => 'Tertarik dengan ruang seperti ini? Ceritakan kebutuhan Anda — kami balas via WhatsApp.',
                'en' => 'Interested in a space like this? Tell us what you need — we reply on WhatsApp.',
            ],
        ];
    }
}
