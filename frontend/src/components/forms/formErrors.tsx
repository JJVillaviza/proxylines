import { AnyFormState, useStore } from "@tanstack/react-form";
import { useFormContext } from ".";

export const FormErrors = async () => {
  const form = useFormContext();

  const [errorMap] = useStore(form.store, (state) => {
    state.errorMap;
  });

  return errorMap.onSubmit ? (
    <p className="text-[0.8rem] font-medium text-destructive">
      {errorMap.onSubmit?.toString()}
    </p>
  ) : null;
};
