/**
 * Striped placeholder standing in for a real project photo. Swap for a real
 * <img> once photography is delivered — same aspect ratio / caption props.
 */
export default function Placeholder({ caption, parallax = 0, size = 'md', className = '', style, ...rest }) {
    const captionClass =
        size === 'sm' ? 'placeholder-caption placeholder-caption--sm'
        : size === 'xs' ? 'placeholder-caption placeholder-caption--xs'
        : 'placeholder-caption';

    return (
        <div className={`placeholder ${className}`} style={style} {...rest}>
            <div
                className="placeholder-fill"
                data-parallax={parallax || undefined}
            >
                <span className={captionClass}>[ {caption} ]</span>
            </div>
        </div>
    );
}
