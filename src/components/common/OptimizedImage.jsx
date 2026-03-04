import React, { useState } from 'react';


const OptimizedImage = ({ src, alt, className, width, height, priority = false }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Helper to optimize Unsplash URLs - simplified for performance
    const getOptimizedSrc = (url) => {
        if (!url) return '';
        if (url.includes('images.unsplash.com') && !url.includes('auto=format')) {
            return `${url}${url.includes('?') ? '&' : '?'}auto=format&q=75`;
        }
        return url;
    };

    const optimizedSrc = getOptimizedSrc(src);

    return (
        <div className={`relative overflow-hidden bg-gray-100 ${className}`} style={{ width, height }}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
            )}
            <img
                src={optimizedSrc}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                width={width}
                height={height}
            />
        </div>
    );
};

export default OptimizedImage;
