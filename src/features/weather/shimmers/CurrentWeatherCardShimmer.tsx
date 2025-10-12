/**
 * CurrentWeatherCard Loading Shimmer
 */

export const CurrentWeatherCardShimmer = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-card rounded-2xl shadow-lg border border-border animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Main weather info */}
        <div className="space-y-4">
          {/* City name */}
          <div className="h-8 w-48 bg-accent/50 rounded-lg" />

          {/* Weather icon */}
          <div className="h-32 w-32 mx-auto bg-accent/50 rounded-full" />

          {/* Temperature */}
          <div className="h-16 w-32 mx-auto bg-accent/50 rounded-lg" />

          {/* Description */}
          <div className="h-6 w-40 mx-auto bg-accent/50 rounded-lg" />
        </div>

        {/* Right side - Details */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-accent/50 rounded-lg" />

          {/* Detail items */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-24 bg-accent/50 rounded" />
              <div className="h-4 w-16 bg-accent/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
