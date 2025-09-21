import React from "react";

const DetailHeader = ({ details, actionButtons, mediaStats }) => {
  return (
    <div className="flex-1 text-center md:text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-lg">
        {details.title || details.name}
      </h1>
      <p className="text-lg text-gray-300 mt-2">{details.tagline}</p>

      <div className="mt-4 flex justify-center md:justify-start">
        <div className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2 bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10">
          <span className="text-sm font-semibold">
            {(details.release_date || details.first_air_date)?.substring(0, 4)}
          </span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-sm">
            {details.genres.map((g) => g.name).join(", ")}
          </span>
          {details.runtime > 0 && (
            <>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-sm">{`${details.runtime} min`}</span>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-col mt-6 items-start gap-4">
        {mediaStats}
        {actionButtons}
      </div>

      <div className="mt-6 bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10 max-w-2xl">
        <h2 className="text-xl font-bold text-white mb-2">Sinopse</h2>
        <p className="text-brand-text-secondary leading-relaxed text-sm">
          {details.overview || "Sinopse não disponível."}
        </p>
      </div>
    </div>
  );
};

export default DetailHeader;
