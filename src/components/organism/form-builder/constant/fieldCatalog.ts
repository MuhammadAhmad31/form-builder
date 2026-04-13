import type { FieldType } from "../types";

export const fieldCatalog: Array<{
  type: FieldType;
  title: string;
  description: string;
}> = [
  {
    type: "text",
    title: "Text Input",
    description: "Single line input untuk nama, email, atau kode.",
  },
  {
    type: "textarea",
    title: "Textarea",
    description: "Area input multi baris untuk deskripsi panjang.",
  },
  {
    type: "number",
    title: "Number Input",
    description: "Input untuk angka.",
  },
  {
    type: "select",
    title: "Select Dropdown",
    description: "Pilih satu atau beberapa opsi dari daftar.",
  },
  {
    type: "checkbox",
    title: "Checkbox",
    description: "Pilih satu atau beberapa opsi dengan kotak centang.",
  },
  {
    type: "radio",
    title: "Radio Button",
    description: "Pilih satu opsi dari beberapa pilihan.",
  },
  {
    type: "date",
    title: "Date Picker",
    description: "Pilih tanggal dari kalender.",
  },
];
