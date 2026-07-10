/**
 * Image defaults tuned for performance: async decode, lazy by default, optional srcset.
 */
export default function OptimizedImage({
    src,
    srcSet,
    sizes,
    alt = '',
    loading = 'lazy',
    fetchPriority,
    className,
    ...rest
}) {
    if (!src) {
        return null;
    }

    return (
        <img
            src={src}
            srcSet={srcSet || undefined}
            sizes={srcSet && sizes ? sizes : undefined}
            alt={alt}
            loading={loading}
            fetchpriority={fetchPriority}
            decoding="async"
            className={className}
            {...rest}
        />
    );
}
