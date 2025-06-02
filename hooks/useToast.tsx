import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast as useToastLib,
} from "@/components/ui/toast";
import { InterfaceToastProps } from "@gluestack-ui/toast/lib/types";

const useToast = () => {
  const toast = useToastLib();

  const show = (
    {
      title,
      description,
      action = "muted",
    }: {
      title?: string;
      description?: string;
      action?: "error" | "warning" | "success" | "info" | "muted";
    },
    options?: Omit<InterfaceToastProps, "id" | "render">
  ) => {
    const newId = Math.random();

    return toast.show({
      ...options,
      id: `${newId}`,
      render: ({ id }) => {
        return (
          <Toast nativeID={id} action={action} variant="solid">
            {Boolean(title) && <ToastTitle>{title}</ToastTitle>}
            {Boolean(description) && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </Toast>
        );
      },
    });
  };

  return { show };
};

export default useToast;
