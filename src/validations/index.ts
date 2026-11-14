import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Tên hiển thị phải có ít nhất 2 ký tự"),
  bankName: z.string().optional(),
  accountNumber: z
    .string()
    .regex(/^[0-9]*$/, "Số tài khoản chỉ bao gồm chữ số")
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const invoiceItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Vui lòng nhập tên món"),
  price: z.number().gt(0, "Giá tiền phải lớn hơn 0"),
  assignedMemberIds: z
    .array(z.string())
    .min(1, "Cần ít nhất 1 người chia món này"),
});

export const invoiceSchema = z.object({
  title: z.string().min(2, "Tên hóa đơn phải có ít nhất 2 ký tự"),
  selectedMemberIds: z
    .array(z.string())
    .min(1, "Phải chọn ít nhất 1 người tham gia"),
  items: z.array(invoiceItemSchema).min(1, "Hóa đơn phải có ít nhất 1 món"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
