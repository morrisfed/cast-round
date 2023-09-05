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

  const removeResponseDefinitionHandler = useCallback(
    (index: number) => {
      const newResponseDefinitions = [...responseDefinitions];
      newResponseDefinitions.splice(index, 1);

      onResponseDefinitionsChanged(newResponseDefinitions);
    },
    [onResponseDefinitionsChanged, responseDefinitions]
  );

  const templateSelectChangedHandler = useCallback(
    (value: string) => {
      if (value === "For Against Abstain") {
        onResponseDefinitionsChanged([
          { sequence: 0, code: "FOR", label: "Votes for" },
          { sequence: 1, code: "AGAINST", label: "Votes against" },
          { sequence: 2, code: "ABSTAIN", label: "Abstentions" },
        ]);
      }
    },
    [onResponseDefinitionsChanged]
  );

  const showTemplateSelect = useMemo(
    () => responseDefinitions.length === 0,
    [responseDefinitions.length]
  );

  const responseDefinitionElements = useMemo(() => {
    return responseDefinitions.map((responseDefinition, index) => (
      <MotionResponseDefinition
        key={index}
        responseDefinition={responseDefinition}
        onResponseDefinitionChanged={(rd) =>
          responseDefinitionChangedHandler(rd, index)
        }
        onRemoveResponseDefinition={() =>
          removeResponseDefinitionHandler(index)
        }
      />
    ));
  }, [
    removeResponseDefinitionHandler,
    responseDefinitionChangedHandler,
    responseDefinitions,
  ]);

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
      <div className="card-actions">
        {showTemplateSelect ? (
          <select
            className="select m-4"
            onChange={(e) => templateSelectChangedHandler(e.target.value)}
          >
            <option disabled selected>
              Apply template
            </option>
            <option>For Against Abstain</option>
          </select>
        ) : null}
      </div>
    </div>
  );
};

export default MotionResponseDefinitions;
