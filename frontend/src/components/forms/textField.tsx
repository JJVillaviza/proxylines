import { useFieldContext } from ".";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FieldErrors } from "./fieldErrors";

type TextFieldProps = {
  type?: React.HTMLInputTypeAttribute;
  label: string;
};

export const TextField = ({ type, label }: TextFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-1">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        type={type}
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      <FieldErrors meta={field.state.meta} />
    </div>
  );
};
