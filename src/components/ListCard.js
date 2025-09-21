import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineFilm } from "react-icons/hi2";

const ListCard = ({ list, userId }) => {
  return (
    <Link to={`/list/${userId}/${list.id}`} className="block">
      <div className="bg-brand-light-dark p-6 rounded-lg shadow-lg hover:shadow-brand-primary/20 transition-shadow h-full">
        <div className="flex items-center mb-2">
          <HiOutlineFilm className="h-6 w-6 text-brand-primary mr-3" />
          <h3 className="text-xl font-bold text-white truncate">{list.name}</h3>
        </div>
        <p className="text-brand-text-secondary text-sm mb-4 h-10 overflow-hidden">
          {list.description || "Nenhuma descrição."}
        </p>
        <div className="text-xs text-gray-500">
          {list.items?.length || 0} item(s)
        </div>
      </div>
    </Link>
  );
};

export default ListCard;
