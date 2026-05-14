import Swal from 'sweetalert2'

type ConfirmOptions = {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: "warning" | "question" | "info" | "error" | "success";
  showConfirmButton?: boolean;
  timer?: number
};
// CONFIRM withh dialog hidden (for forms)
export async function showAlertWithDialogHidden(
  closeDialog: () => void,
  reopenDialog: () => void,
  alertFn: () => Promise<void>,
) {
  closeDialog()

  await new Promise((resolve) => setTimeout(resolve, 100))

  await alertFn()

  reopenDialog()
}


// CONFIRM
export async function confirmDanger({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmText = "Yes, delete it",
  cancelText = "Cancel",
  icon = "warning",
}: ConfirmOptions = {}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
  });
  return result.isConfirmed;
}

// ALERT
export async function alertError({
  title = "Error!",
  text = "An error occurred.",
  confirmText = "OK",
  icon = "error",
}: ConfirmOptions = {}) {
  await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: false,
    confirmButtonText: confirmText,
    confirmButtonColor: "#dc2626",
  });
}

export async function alertSuccess({
  title = "Success!",
  text = "Operation completed successfully.",
  confirmText = "OK",
  icon = "success",
  showConfirmButton = true,
  timer
}: ConfirmOptions = {}) {
  await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: false,
    confirmButtonText: confirmText,
    confirmButtonColor: "#22c55e",
    showConfirmButton,

    ...(timer ? { timer } : {})
  });
}