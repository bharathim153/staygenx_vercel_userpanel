'use client';
import Image, { ImageLoaderProps, ImageProps } from 'next/image';
import { handleImageError } from './placeHolder';

// Custom Image Loader
const imageLoader = ({ src, width, quality = 80 }: ImageLoaderProps) =>
  `${src}?_w=${width}&&_q=${quality}`;

// Type Definition for Props
interface ImageComponentProps extends Omit<ImageProps, 'src' | 'loader'> {
  src?: string;
  altSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

// Image Component
const ImageComponent: React.FC<ImageComponentProps> = ({
  src = '',
  alt = 'image',
  className = '',
  priority = false,
  width = 800,
  height = 800,
  fill = false,
  ...rest
}) => {
  const imageSrc =
    typeof src === 'string' && src.startsWith('uploads')
      ? process.env.NEXT_PUBLIC_IMAGE_URL + src
      : src;

  // console.log('imageSrc', src);

  return (
    <Image
      alt={alt}
      src={imageSrc}
      loader={imageLoader}
      priority={priority}
      className={className}
      onError={handleImageError}
      fill={fill || undefined}
      {...(!fill ? { width, height } : {})}
      {...rest}
    />
  );
};

export default ImageComponent;
