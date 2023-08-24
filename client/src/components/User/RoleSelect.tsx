import { Role } from "interfaces/user";
import { LiteralC } from "io-ts";
import { useCallback, useMemo } from "react";

export interface RoleSelectProps {
  value: Role | undefined;
  allowNone?: boolean;
  onSelect: (role: Role) => void;
  onNone?: () => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({
  value,
  allowNone,
  onSelect,
  onNone,
}) => {
  const options = useMemo(() => {
    const roles: Role[] = Role.types.map(
      (role) => (role as LiteralC<string>).value as Role
    );
    const roleOptions = roles.map((role) => (
      <option key={role} value={role}>
        {role}
      </option>
    ));
    return allowNone || !value
      ? [<option key="undef" value={undefined}></option>, ...roleOptions]
      : roleOptions;
  }, [allowNone, value]);

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value as Role | undefined;
      if (newValue === undefined) {
        if (allowNone) {
          onNone?.();
        }
      } else {
        onSelect(newValue);
      }
    },
    [allowNone, onSelect, onNone]
  );

  return (
    <select value={value} onChange={onChangeHandler}>
      {options}
    </select>
  );
};

export default RoleSelect;
