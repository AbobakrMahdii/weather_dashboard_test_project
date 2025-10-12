/**
 * SearchBar Loading Shimmer
 */

export const SearchBarShimmer = () => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-pulse">
      <div className="flex gap-2">
        {/* Search input shimmer */}
        <div className="flex-1 h-12 bg-accent/50 rounded-lg" />

        {/* Location button shimmer */}
        <div className="w-12 h-12 bg-accent/50 rounded-lg" />

        {/* Search button shimmer */}
        <div className="w-20 h-12 bg-accent/50 rounded-lg" />
      </div>
    </div>
  );
};
