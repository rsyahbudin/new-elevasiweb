<?php echo '<'.'?xml version="1.0" encoding="UTF-8"?>'; ?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
<?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $urls; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $url): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <url>
        <loc><?php echo e($base.$url['loc']); ?></loc>
        <lastmod><?php echo e($url['lastmod']); ?></lastmod>
        <changefreq><?php echo e($url['changefreq']); ?></changefreq>
        <priority><?php echo e($url['priority']); ?></priority>
<?php
    $path = $url['loc'];
    $isEn = str_starts_with($path, '/en');
    $idPath = $isEn ? (preg_replace('#^/en(/|$)#', '/', $path) ?: '/') : $path;
    $enPath = $isEn ? $path : ($path === '/' ? '/en' : '/en'.$path);
?>
        <xhtml:link rel="alternate" hreflang="id" href="<?php echo e($base.$idPath); ?>" />
        <xhtml:link rel="alternate" hreflang="en" href="<?php echo e($base.$enPath); ?>" />
        <xhtml:link rel="alternate" hreflang="x-default" href="<?php echo e($base.$idPath); ?>" />
    </url>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
</urlset>
<?php /**PATH /Users/raflysyahbudin/Herd/elevasi/resources/views/sitemap.blade.php ENDPATH**/ ?>