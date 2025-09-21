import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi2";

const UserCard = ({ user }) => {
  return (
    <Link to={`/profile/${user.id}`} className="block">
      <div className="flex items-center bg-brand-dark p-4 rounded-lg shadow-md hover:bg-brand-light-dark transition-colors duration-200">
        <HiOutlineUserCircle className="h-12 w-12 text-brand-text-secondary flex-shrink-0 mr-4" />
        <div>
          <p className="font-bold text-white text-lg truncate">
            {user.displayName || "Usuário StreamBase"}
          </p>
          <p className="text-sm text-brand-text-secondary truncate">
            {user.bio ? user.bio.substring(0, 50) + "..." : "Sem biografia."}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
