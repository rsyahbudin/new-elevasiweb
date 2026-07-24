<?php

namespace Tests\Unit;

use App\Support\ArticleBodyRenderer;
use Tests\TestCase;

class ArticleBodyRendererTest extends TestCase
{
    public function test_it_renders_rich_text_marks(): void
    {
        $html = ArticleBodyRenderer::toHtml(ArticleBodyRenderer::doc([
            ArticleBodyRenderer::paragraph(
                ArticleBodyRenderer::bold('Bold'),
                ' ',
                ArticleBodyRenderer::italic('Italic'),
                ' ',
                ArticleBodyRenderer::underline('Underline'),
            ),
        ]));

        $this->assertStringContainsString('<strong>Bold</strong>', $html);
        $this->assertStringContainsString('<em>Italic</em>', $html);
        $this->assertStringContainsString('<u>Underline</u>', $html);
    }

    public function test_it_renders_lists_headings_and_blockquote(): void
    {
        $html = ArticleBodyRenderer::toHtml(ArticleBodyRenderer::doc([
            ArticleBodyRenderer::heading(2, 'Section'),
            ArticleBodyRenderer::bulletList(['One', 'Two']),
            ArticleBodyRenderer::orderedList(['First', 'Second']),
            ArticleBodyRenderer::blockquote('Quoted text'),
        ]));

        $this->assertStringContainsString('<h2>Section</h2>', $html);
        $this->assertStringContainsString('<ul>', $html);
        $this->assertStringContainsString('<ol>', $html);
        $this->assertStringContainsString('<blockquote>', $html);
    }

    public function test_it_converts_manual_numbered_text_into_ordered_list(): void
    {
        $html = ArticleBodyRenderer::toHtml(
            '1. ) First item. 2. ) Second item. 3. ) Third item.',
        );

        $this->assertStringContainsString('<ol>', $html);
        $this->assertStringContainsString('<li><p>First item.</p></li>', $html);
        $this->assertStringContainsString('<li><p>Second item.</p></li>', $html);
        $this->assertStringContainsString('<li><p>Third item.</p></li>', $html);
    }

    public function test_it_renders_stored_html_without_double_escaping(): void
    {
        $html = ArticleBodyRenderer::toHtml(
            '<p>Hello <strong>world</strong> and <em>italic</em></p>',
        );

        $this->assertSame(
            '<p>Hello <strong>world</strong> and <em>italic</em></p>',
            $html,
        );
    }

    public function test_it_normalizes_manual_numbered_paragraph_nodes(): void
    {
        $html = ArticleBodyRenderer::toHtml(ArticleBodyRenderer::doc([
            ArticleBodyRenderer::paragraph('1. ) Alpha. 2. ) Beta.'),
        ]));

        $this->assertStringContainsString('<ol>', $html);
        $this->assertStringContainsString('<li><p>Alpha.</p></li>', $html);
        $this->assertStringContainsString('<li><p>Beta.</p></li>', $html);
    }
}
