import React from "react";
import { FaImdb } from "react-icons/fa";

const AggregatorRatings = ({ ratings }) => {
  if (!ratings || ratings.length === 0) {
    return null;
  }

  const getRatingComponent = (source, value) => {
    if (!value || value === "N/A") return null;

    let icon, colorClass, label;
    switch (source) {
      case "Internet Movie Database":
        icon = <FaImdb className="h-5 w-5 text-yellow-500" />;
        colorClass = "border-yellow-500";
        label = "IMDb";
        break;
      case "Rotten Tomatoes":
        let score = parseInt(value, 10);
        let rtColor =
          score >= 75
            ? "text-red-500"
            : score >= 60
            ? "text-yellow-500"
            : "text-green-600";
        icon = <span className={`font-bold text-lg ${rtColor}`}>🍅</span>;
        colorClass = "border-red-500";
        label = "Rotten Tomatoes";
        break;
      case "Metacritic":
        let metaScore = parseInt(value, 10);
        let metaColor =
          metaScore >= 61
            ? "bg-green-500"
            : metaScore >= 40
            ? "bg-yellow-500"
            : "bg-red-500";
        icon = (
          <span
            className={`text-white font-bold text-sm px-1 rounded ${metaColor}`}
          >
            {metaScore}
          </span>
        );
        colorClass = "border-gray-400";
        label = "Metacritic";
        break;
      default:
        return null;
    }

    return (
      <div
        className={`flex items-center justify-center w-full h-full gap-2 p-2 rounded-lg bg-brand-dark border ${colorClass}`}
        title={`${label}: ${value}`}
      >
        {icon}
        <span className="text-white font-semibold text-sm">
          {source === "Metacritic" ? value.split("/")[0] : value}
        </span>
      </div>
    );
  };

  return (
    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
      {ratings.map(
        (rating) =>
          getRatingComponent(rating.Source, rating.Value) && (
            <div key={rating.Source} className="w-36 h-12">
              {getRatingComponent(rating.Source, rating.Value)}
            </div>
          )
      )}
    </div>
  );
};

export default AggregatorRatings;
