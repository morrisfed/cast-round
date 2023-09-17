import React from "react";
import { Link } from "react-router-dom";
import { Motion } from "interfaces/motion";

export interface MotionItemProps {
  motion: Motion;
}

const MotionItem: React.FC<MotionItemProps> = ({ motion }) => {
  return (
    <Link to={`${motion.id}`}>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-row gap-4">
            <div className="truncate">
              <h2 className="card-title">{motion.title}</h2>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MotionItem;
