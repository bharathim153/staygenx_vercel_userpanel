// placeHolder.ts
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  const target = e.currentTarget;
  console.log('eeee', target.srcset);
  target.srcset = '';
  target.src = '/images/errorImage.webp';
};

export const handleSVGError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  const target = e.currentTarget;
  target.srcset = '';
  target.src = '/images/errorImage.webp';
  target.width = 30;
  target.height = 30;
};
