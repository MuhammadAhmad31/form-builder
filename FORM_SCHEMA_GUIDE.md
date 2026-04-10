# Form Builder & Form Renderer Guide

Panduan lengkap untuk menggunakan Form Builder dan Form Renderer dengan sistem schema JSON.

## Arsitektur

Sistem ini mengikuti alur:

```
Form Builder → onSubmit Callback → Store (useFormStore) → Form Renderer
                                      ↓
                              (Nanti ke Backend API)
```

**Fase Development**: Menggunakan in-memory store (composable `useFormStore`)
**Fase Production**: Ganti dengan backend API calls

## 1. Form Builder (`/builder`)

Form Builder memungkinkan Anda membuat form secara visual dengan interface drag-and-drop.

### Fitur Utama

- **Visual Canvas**: Drag-and-drop interface untuk menyusun form fields
- **Field Types**: Text, Textarea, Number, Select
- **Field Configuration**: Label placement, placeholder, help text, spacing, dll
- **Responsive Layout**: 12-column grid system
- **Schema Export**: Export form ke JSON schema
- **API Integration**: Kirim schema ke backend

### Penggunaan

1. Akses `/builder`
2. Drag field dari panel kiri ke canvas
3. Ubah properti field di panel kanan
4. Gunakan action buttons di bawah untuk:
   - **Copy Schema**: Copy schema ke clipboard
   - **Download Schema**: Download schema sebagai file JSON
   - **Submit Form**: Kirim schema ke callback function (di-handle oleh parent page)

### Props

```typescript
interface Props {
  onSubmit?: (schema: FormSchema) => void | Promise<void>
}
```

**onSubmit**: Callback function yang akan dipanggil saat user klik "Submit Form". Parent component bisa menggunakan ini untuk:
- Simpan ke store
- Kirim ke API
- Update parent state
- dll

Jika `onSubmit` tidak diberikan, akan fallback ke direct API call (untuk backward compatibility).

### Form Field Properties

Setiap field memiliki properties berikut:

```typescript
interface FormField {
  id: string                      // Unique identifier
  type: FieldType                 // 'text' | 'textarea' | 'number' | 'select'
  label: string                   // Field label
  labelPlacement: LabelPlacement  // 'top' | 'bottom' | 'left' | 'right'
  name: string                    // Form field name (untuk submission)
  placeholder: string             // Placeholder text
  value?: string                  // Default value
  helpText: string                // Help text di bawah field
  required: boolean               // Is field required
  readOnly: boolean               // Is field read-only
  clearable: boolean              // Can be cleared (untuk select)
  spacing: FieldSpacing          // Padding atas, kanan, bawah, kiri
  options?: FieldOption[]        // Untuk select type
}
```

### Export Schema Format

Ketika Anda export form, format schema adalah:

```json
{
  "fields": [
    {
      "id": "field-1",
      "type": "text",
      "label": "Full Name",
      "labelPlacement": "top",
      "name": "full_name",
      "placeholder": "Enter your name",
      "value": "",
      "helpText": "Your full legal name",
      "required": true,
      "readOnly": false,
      "clearable": false,
      "spacing": {
        "top": 0,
        "right": 0,
        "bottom": 16,
        "left": 0
      },
      "options": []
    },
    {
      "id": "field-2",
      "type": "select",
      "label": "Category",
      "labelPlacement": "top",
      "name": "category",
      "placeholder": "Select category",
      "helpText": "Choose the best fit",
      "required": false,
      "readOnly": false,
      "clearable": true,
      "spacing": {
        "top": 0,
        "right": 0,
        "bottom": 16,
        "left": 0
      },
      "options": [
        { "label": "Option 1", "value": "opt1" },
        { "label": "Option 2", "value": "opt2" }
      ]
    }
  ]
}
```

## 2. Form Renderer (`/renderer`)

Form Renderer mengambil schema JSON dan merender form yang dapat diisi dan disubmit.

### Penggunaan

#### Basic Usage

```vue
<script setup lang="ts">
import { FormRenderer } from '@/components/organism/form-renderer'
import type { FormSchema } from '@/services/formService'

const schema: FormSchema = {
  fields: [
    {
      id: 'field-1',
      type: 'text',
      label: 'Name',
      labelPlacement: 'top',
      name: 'name',
      placeholder: 'Enter name',
      helpText: '',
      required: true,
      readOnly: false,
      clearable: false,
      spacing: { top: 0, right: 0, bottom: 16, left: 0 },
    },
  ],
}

function handleSubmit(data: Record<string, any>) {
  console.log('Form data:', data)
  // Send to your API
}
</script>

<template>
  <FormRenderer :schema="schema" @submit="handleSubmit" />
</template>
```

#### With API Integration

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FormRenderer } from '@/components/organism/form-renderer'
import { formService } from '@/services/formService'
import type { FormSchema } from '@/services/formService'

const formId = ref('form-123')
const schema = ref<FormSchema | null>(null)

async function loadForm() {
  try {
    schema.value = await formService.getFormSchema(formId.value)
  } catch (error) {
    console.error('Failed to load form:', error)
  }
}

loadForm()
</script>

<template>
  <FormRenderer v-if="schema" :schema="schema" :form-id="formId" />
</template>
```

### Props

```typescript
interface Props {
  schema: FormSchema           // Form schema JSON
  formId?: string             // Form ID (used for API submission)
  onSubmit?: (data: Record<string, any>) => void  // Custom submit handler
}
```

### Features

- **Validation**: Required field validation
- **Error Display**: Menampilkan error message untuk invalid fields
- **Field Types**: Support text, number, textarea, select
- **Label Placement**: Top, bottom, left, right positioning
- **Help Text**: Menampilkan help text untuk setiap field
- **Reset**: Reset form ke nilai default
- **API Submission**: Otomatis submit ke API jika formId diberikan

## 3. Form Store (`src/composables/useFormStore.ts`)

Composable untuk in-memory state management form. Digunakan untuk menyimpan form schema saat development sebelum ada backend API.

### Usage

```typescript
import { useFormStore } from '@/composables/useFormStore'
import type { FormSchema } from '@/services/formService'

const { 
  saveFormSchema, 
  getFormSchema, 
  updateFormSchema,
  deleteForm,
  getAllForms,
  currentForm,
  allForms,
  formsCount 
} = useFormStore()

// Save form
const formId = saveFormSchema(schema)

// Get form
const form = getFormSchema(formId)

// Update form
updateFormSchema(formId, newSchema)

// Delete form
deleteForm(formId)

// Get all forms
const forms = getAllForms()
```

### Methods

#### `saveFormSchema(schema: FormSchema): string`
Simpan form schema ke store dan return form ID.

#### `getFormSchema(id: string): FormSchema | null`
Ambil form schema dari store berdasarkan ID.

#### `updateFormSchema(id: string, schema: FormSchema): boolean`
Update form schema yang sudah ada.

#### `deleteForm(id: string): boolean`
Hapus form dari store.

#### `getAllForms(): StoredForm[]`
Get semua forms yang tersimpan.

#### `getCurrentForm(): StoredForm | null`
Get current form yang sedang di-edit.

#### `setCurrentForm(id: string): boolean`
Set current form.

#### `clearAllForms(): void`
Clear semua forms dari store.

### State

```typescript
interface StoredForm {
  id: string                  // Unique form ID
  schema: FormSchema         // Form schema
  createdAt: string         // ISO timestamp
  updatedAt: string         // ISO timestamp
}
```

### Computed Properties

- `currentFormId: ComputedRef<string | null>` - ID dari current form
- `currentForm: ComputedRef<StoredForm | null>` - Current form object
- `allForms: ComputedRef<StoredForm[]>` - Semua forms
- `formsCount: ComputedRef<number>` - Jumlah forms

## 4. Form Service (`src/services/formService.ts`)

Service untuk API calls dan utilities. Jika sudah ada backend API, gunakan methods di bawah untuk replace store-based approach.

### Methods

#### `submitFormSchema(schema: FormSchema)`

Kirim form schema ke backend untuk disimpan.

```typescript
const result = await formService.submitFormSchema(schema)
// Returns: { id: string, message: string }
```

#### `getFormSchema(formId: string)`

Ambil form schema dari backend.

```typescript
const schema = await formService.getFormSchema('form-123')
```

#### `submitFormData(formId: string, data: Record<string, any>)`

Kirim form submission data (data yang sudah diisi user).

```typescript
await formService.submitFormData('form-123', {
  full_name: 'John Doe',
  email: 'john@example.com'
})
```

#### `exportSchemaAsJSON(schema: FormSchema)`

Convert schema ke JSON string.

```typescript
const json = formService.exportSchemaAsJSON(schema)
// Returns: JSON string
```

#### `downloadSchemaAsFile(schema: FormSchema, filename: string)`

Download schema sebagai file JSON.

```typescript
formService.downloadSchemaAsFile(schema, 'my-form.json')
```

## 4. Backend API Specification

Form Builder & Renderer mengharapkan backend API dengan endpoints berikut:

### POST `/api/forms`

Simpan form schema.

**Request:**
```json
{
  "fields": [...]
}
```

**Response:**
```json
{
  "id": "form-123",
  "message": "Form created successfully"
}
```

### GET `/api/forms/:id`

Ambil form schema.

**Response:**
```json
{
  "fields": [...]
}
```

### POST `/api/forms/:id/submissions`

Simpan form submission data.

**Request:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "id": "submission-123",
  "message": "Submission received"
}
```

## 5. Workflow dengan Store

### Step 1: Build Form
1. User akses `/builder`
2. Buat form dengan drag-and-drop fields
3. Klik "Submit Form"
4. FormBuilder panggil `onSubmit` callback (di FormBuilderPage)
5. FormBuilderPage save ke store menggunakan `useFormStore.saveFormSchema()`
6. Store return form ID
7. Auto-redirect ke `/renderer?id={formId}`

### Step 2: Render & Submit Form
1. FormRendererPage load dari query parameter (form ID)
2. Ambil schema dari store menggunakan `useFormStore.getFormSchema(id)`
3. Render form menggunakan FormRenderer component
4. User isi form dan klik Submit
5. FormRenderer kirim data ke `onSubmit` callback
6. Data di-log ke console (bisa disave ke store atau API)

### Integration dengan Backend

Untuk integrate dengan backend API nanti, cukup ubah di page components:

**Di FormBuilderPage.vue** - ubah `handleFormSubmit`:
```typescript
async function handleFormSubmit(schema: FormSchema) {
  const result = await formService.submitFormSchema(schema)
  submittedFormId.value = result.id
}
```

**Di FormRendererPage.vue** - ubah `loadFormSchema`:
```typescript
function loadFormSchema(id: string) {
  const loadedSchema = await formService.getFormSchema(id)
  schema.value = loadedSchema
}
```

Sisanya akan berjalan otomatis karena component sudah designed untuk support keduanya (store + API).

## 6. Environment Setup

### Configure API Base URL

Create `.env` file atau update `.env.local` (hanya diperlukan jika pakai API):

```
VITE_API_URL=http://localhost:3000/api
```

Jika tidak diset, akan default ke `http://localhost:3000/api`.

## 7. Complete Example Flow

### Development Flow (dengan Store)

**Step 1: Build Form**
1. Buka `/builder`
2. Buat form dengan drag-and-drop fields
3. Atur properti setiap field
4. Klik "Submit Form"
5. Form saved ke store dengan auto-generated ID
6. Auto-redirect ke renderer page dengan form ID

**Step 2: Render Form**
1. Form Renderer load schema dari store
2. Render form fields
3. User isi form dan submit
4. Form data logged ke console

**Step 3: Migration ke Backend**
- Swap store calls dengan API calls (lihat integrasi backend section di atas)
- Tidak perlu ubah component logic, hanya page-level calls

## 8. Customization

### Custom Submit Handler

Jika tidak ingin menggunakan API submission, gunakan custom `onSubmit` handler:

```vue
<FormRenderer :schema="schema" @submit="customHandler" />
```

### Custom Styling

Form Renderer menggunakan Tailwind CSS. Modifikasi `FormRenderer.vue` untuk custom styling.

### Additional Field Types

Untuk menambah field types:

1. Update `FieldType` di `src/services/formService.ts`
2. Tambah rendering logic di `FormRenderer.vue`
3. Tambah builder UI di `FormBuilder.vue`

## 9. Error Handling

### Network Errors

Jika API call gagal, user akan melihat alert dengan pesan error. Check browser console untuk detail.

### Validation Errors

Field dengan required=true akan divalidasi sebelum submit. Jika ada error, akan ditampilkan di bawah field.

### Timeout

API calls memiliki default timeout. Jika timeout, akan throw error yang ditangani di try-catch block.

## 10. Tips & Best Practices

- **Always set form ID**: Untuk integration dengan API
- **Use meaningful field names**: Field names digunakan di submission data
- **Test dengan FormRenderer**: Sebelum production, test form di renderer
- **Handle validation**: Implement server-side validation juga
- **Monitor submissions**: Setup backend logging untuk monitor form submissions
- **Use help text**: Jelaskan field ke user dengan help text

## 11. Troubleshooting

### Form tidak di-render

- Pastikan schema format sudah benar
- Check console untuk error message
- Verify API endpoint jika menggunakan dynamic loading

### API submission gagal

- Check network tab di browser dev tools
- Verify CORS configuration di backend
- Check `VITE_API_URL` environment variable

### Styling issue

- Check Tailwind CSS setup
- Verify component imports
- Inspect element untuk check class names

## File Structure

```
src/
├── components/
│   └── organism/
│       ├── form-builder/
│       │   ├── FormBuilder.vue
│       │   └── index.ts
│       └── form-renderer/
│           ├── FormRenderer.vue
│           └── index.ts
├── pages/
│   ├── FormBuilderPage.vue
│   └── FormRendererPage.vue
├── services/
│   └── formService.ts
├── router/
│   └── index.ts
└── ...
```

---

**Last Updated**: April 2026
