import React, { useCallback, useMemo } from "react";

import { ModelResponseDefinition } from "interfaces/motion";
import MotionResponseDefinition from "./MotionResponseDefinition";

export interface MotionResponseDefinitionsProps {
  responseDefinitions: ModelResponseDefinition[];
  onResponseDefinitionsChanged: (
    responseDefinitions: ModelResponseDefinition[]
  ) => void;
}

const MotionResponseDefinitions: React.FC<MotionResponseDefinitionsProps> = ({
  responseDefinitions,
  onResponseDefinitionsChanged,
}) => {
  const responseDefinitionChangedHandler = useCallback(
    (responseDefinition: ModelResponseDefinition, index: number) => {
      const newResponseDefinitions = [...responseDefinitions];
      newResponseDefinitions[index] = responseDefinition;

      onResponseDefinitionsChanged(newResponseDefinitions);
    },
    [onResponseDefinitionsChanged, responseDefinitions]
  );

  const responseDefinitionElements = useMemo(() => {
    return responseDefinitions.map((responseDefinition, index) => (
      <MotionResponseDefinition
        key={index}
        responseDefinition={responseDefinition}
        onResponseDefinitionChanged={(rd) =>
          responseDefinitionChangedHandler(rd, index)
        }
      />
    ));
  }, [responseDefinitionChangedHandler, responseDefinitions]);

  return (
    <div className="card-bordered card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <h1>Configure responses</h1>
          <button
            className="btn-primary btn"
            onClick={(e) => {
              e.preventDefault();
              onResponseDefinitionsChanged([
                ...responseDefinitions,
                { sequence: 0, code: "AAA", label: "" },
              ]);
            }}
          >
            Add
          </button>
        </div>
        {responseDefinitionElements}
      </div>
      <div className="card-actions p-4"></div>
    </div>
  );
};

export default MotionResponseDefinitions;
