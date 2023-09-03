import React from "react";

import { ModelResponseDefinition } from "interfaces/motion";

export interface MotionResponseDefinitionProps {
  responseDefinition: ModelResponseDefinition;
  onResponseDefinitionChanged: (
    responseDefinition: ModelResponseDefinition
  ) => void;
}

const MotionResponseDefinition: React.FC<MotionResponseDefinitionProps> = ({
  responseDefinition,
  onResponseDefinitionChanged,
}) => {
  return (
    <div className="card-bordered card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="grid grid-cols-2 gap-2">
          <label className="label">
            <span className="label-text">Sequence</span>
          </label>
          <input
            type="number"
            value={responseDefinition.sequence}
            onChange={(e) =>
              onResponseDefinitionChanged({
                ...responseDefinition,
                sequence: Number(e.target.value),
              })
            }
          />

          <label className="label">
            <span className="label-text">Code</span>
          </label>
          <input
            type="text"
            value={responseDefinition.code}
            onChange={(e) =>
              onResponseDefinitionChanged({
                ...responseDefinition,
                code: e.target.value,
              })
            }
          />

          <label className="label">
            <span className="label-text">Label</span>
          </label>
          <input
            type="text"
            value={responseDefinition.label}
            onChange={(e) =>
              onResponseDefinitionChanged({
                ...responseDefinition,
                label: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MotionResponseDefinition;
