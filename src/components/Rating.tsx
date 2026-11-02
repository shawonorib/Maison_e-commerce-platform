import { Star } from 'lucide-react';

type RatingProps = {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
};

export function Rating({ rating, count, size = 'sm' }: RatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              className={`${starSize} ${
                filled ? 'fill-accent-400 text-accent-400' : half ? 'fill-accent-400/50 text-accent-400/50' : 'fill-ink-200 text-ink-200'
              }`}
            />
          );
        })}
      </div>
      <span className={`${textSize} font-medium text-ink-600`}>{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className={`${textSize} text-ink-400`}>({count})</span>
      )}
    </div>
  );
}
