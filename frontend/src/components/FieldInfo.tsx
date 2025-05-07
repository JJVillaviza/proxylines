import { AnyFieldApi } from "@tanstack/react-form";

export const FieldInfo = ({ field }: { field: AnyFieldApi }) => {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-[0.8rem] font-medium text-destructive">
          {field.state.meta.errors.map((error) => error.message).join(",")}
        </p>
      ) : null}
    </>
  );
};
