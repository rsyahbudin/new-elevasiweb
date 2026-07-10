<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected $casts = [
        'value' => 'array',
    ];

    /**
     * Raw (untranslated) value for a settings key, cached until the model changes.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::rememberForever(
            "site_settings.{$key}",
            function () use ($key, $default) {
                $stored = static::where('key', $key)->value('value');

                if (! is_array($stored)) {
                    return $default;
                }

                if (! is_array($default)) {
                    return $stored;
                }

                return array_replace_recursive($default, $stored);
            },
        );
    }

    /**
     * Value for a settings key with the ID/EN fallback rule applied (US-6):
     * every {"id": ..., "en": ...} leaf resolves to the current locale,
     * falling back to "id" when the EN translation is empty.
     */
    public static function translated(string $key, ?string $locale = null, mixed $default = null): mixed
    {
        return static::resolveLocale(static::get($key, $default), $locale ?? App::getLocale());
    }

    /**
     * Merge stored settings with defaults, then apply locale resolution.
     *
     * @param  array<string, mixed>  $defaults
     */
    public static function translatedMerged(string $key, array $defaults, ?string $locale = null): mixed
    {
        $stored = static::get($key, $defaults);
        $merged = array_replace_recursive($defaults, is_array($stored) ? $stored : []);

        return static::resolveLocale($merged, $locale ?? App::getLocale());
    }

    protected static function resolveLocale(mixed $value, string $locale): mixed
    {
        if (! is_array($value)) {
            return $value;
        }

        if (array_key_exists('id', $value) && array_key_exists('en', $value) && count($value) === 2) {
            return (! empty($value[$locale]) ? $value[$locale] : null) ?? $value['en'] ?? $value['id'];
        }

        return array_map(fn ($item) => static::resolveLocale($item, $locale), $value);
    }

    protected static function booted(): void
    {
        static::saved(fn (self $setting) => Cache::forget("site_settings.{$setting->key}"));
        static::deleted(fn (self $setting) => Cache::forget("site_settings.{$setting->key}"));
    }
}
