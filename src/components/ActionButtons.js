import React from "react";
import {
  HiHeart,
  HiOutlineHeart,
  HiPlay,
  HiOutlineBookmark,
  HiBookmark,
  HiEye,
  HiOutlineEye,
  HiOutlinePlus,
} from "react-icons/hi2";
import ShareButtons from "./ShareButtons";

const ActionButtons = ({
  user,
  trailer,
  mediaData,
  mediaStatus,
  onListModalOpen,
  onReviewModalOpen,
  watchProviders,
  currentUrl,
  shareTitle,
  updateMediaState,
}) => {
  if (!user) {
    return null;
  }

  const buttonClass =
    "flex items-center justify-center h-11 w-11 rounded-lg transition-colors duration-200";
  const iconClass = "h-6 w-6";

  return (
    <div className="inline-flex flex-wrap items-center justify-center md:justify-start gap-2 bg-black/30 backdrop-blur-sm p-2 rounded-xl border border-white/10">
      {trailer && (
        <a
          href={`https://www.youtube.com/watch?v=${trailer.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} text-white hover:bg-white/10 hover:text-red-500`}
          title="Assistir ao Trailer"
        >
          <HiPlay className={iconClass} />
        </a>
      )}

      <button
        onClick={() =>
          updateMediaState(mediaData, { favorited: !mediaStatus.favorited })
        }
        className={`${buttonClass} ${
          mediaStatus.favorited ? "text-red-400" : "text-white"
        } hover:bg-white/10 hover:text-red-400`}
        title="Favorito"
      >
        {mediaStatus.favorited ? (
          <HiHeart className={iconClass} />
        ) : (
          <HiOutlineHeart className={iconClass} />
        )}
      </button>

      <button
        onClick={() =>
          updateMediaState(mediaData, { inWatchlist: !mediaStatus.inWatchlist })
        }
        className={`${buttonClass} ${
          mediaStatus.inWatchlist ? "text-blue-400" : "text-white"
        } hover:bg-white/10 hover:text-blue-400`}
        title="Adicionar à Minha Lista"
      >
        {mediaStatus.inWatchlist ? (
          <HiBookmark className={iconClass} />
        ) : (
          <HiOutlineBookmark className={iconClass} />
        )}
      </button>

      <button
        onClick={() =>
          updateMediaState(mediaData, { watched: !mediaStatus.watched })
        }
        className={`${buttonClass} ${
          mediaStatus.watched ? "text-green-400" : "text-white"
        } hover:bg-white/10 hover:text-green-400`}
        title="Marcar como Visto"
      >
        {mediaStatus.watched ? (
          <HiEye className={iconClass} />
        ) : (
          <HiOutlineEye className={iconClass} />
        )}
      </button>

      <button
        onClick={onListModalOpen}
        className={`${buttonClass} text-white hover:bg-white/10 hover:text-brand-primary`}
        title="Adicionar a uma lista personalizada"
      >
        <HiOutlinePlus className={iconClass} />
      </button>

      <div
        className={`relative ${buttonClass} text-white hover:bg-white/10 hover:text-brand-primary`}
      >
        <ShareButtons url={currentUrl} title={shareTitle} />
      </div>
    </div>
  );
};

export default ActionButtons;
