/**
 * ForecastCard Loading Shimmer
 */

export const ForecastCardShimmer = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-card rounded-2xl shadow-lg border border-border">
      <div className="h-6 w-32 mb-6 bg-accent/50 rounded-lg animate-pulse" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 bg-accent/30 rounded-xl space-y-3 animate-pulse border border-border"
          >
            {/* Date */}
            <div className="h-4 w-20 mx-auto bg-accent/50 rounded" />

            {/* Weather icon */}
            <div className="h-16 w-16 mx-auto bg-accent/50 rounded-full" />

            {/* Temperature */}
            <div className="h-6 w-16 mx-auto bg-accent/50 rounded" />

            {/* Condition */}
            <div className="h-3 w-24 mx-auto bg-accent/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
