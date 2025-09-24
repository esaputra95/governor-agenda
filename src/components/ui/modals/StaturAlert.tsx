// utils/statusPrompt.ts
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export type StatusValue = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export async function StatusAlert(
  current: StatusValue = "PENDING"
): Promise<{ status: StatusValue; reason: string } | null> {
  const { value: formData } = await Swal.fire({
    title: "Ubah Status",
    html: `
      <div style="text-align:left">
        <label style="display:block;margin:0 0 6px;">Status</label>
        <select id="sw-status" class="swal2-input" style="height:42px">
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <label style="display:block;margin:12px 0 6px;">Alasan / Catatan (opsional)</label>
        <textarea id="sw-reason" class="swal2-textarea" placeholder="Tulis catatan…"></textarea>
      </div>
    `,
    focusConfirm: false,
    didOpen: () => {
      // set default status = current
      const sel = document.getElementById(
        "sw-status"
      ) as HTMLSelectElement | null;
      if (sel) sel.value = current;
    },
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    confirmButtonColor: "#0284c7", // sky-600
    preConfirm: () => {
      const status = (document.getElementById("sw-status") as HTMLSelectElement)
        ?.value;
      const reason =
        (document.getElementById("sw-reason") as HTMLTextAreaElement)?.value ??
        "";

      // Validasi (contoh): kalau REJECTED/CANCELLED wajib isi alasan
      if ((status === "REJECTED" || status === "CANCELLED") && !reason.trim()) {
        Swal.showValidationMessage("Mohon isi alasan untuk status ini");
        return false;
      }
      return { status, reason } as { status: StatusValue; reason: string };
    },
  });

  return formData ?? null;
}
