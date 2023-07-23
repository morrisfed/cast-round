import React from "react";
import { Link } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Motion } from "interfaces/motion";

export interface MotionItemProps {
  eventId: string | number;
  motion: Motion;
  showMotionDescription: boolean;
}

const MotionItem: React.FC<MotionItemProps> = ({
  eventId,
  motion,
  showMotionDescription,
}) => {
  return (
    <Link to={`${motion.id}`}>
      <div className="card-bordered card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-row gap-4">
            <div className="truncate">
              <h2 className="card-title">{motion.title}</h2>
              {showMotionDescription ? (
                <article className="prose">
                  <ReactMarkdown>{motion.description}</ReactMarkdown>
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MotionItem;
