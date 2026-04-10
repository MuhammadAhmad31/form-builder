# Store-Based Form Management

Panduan cepat untuk menggunakan form builder dan renderer dengan in-memory store.

## Quick Start

### 1. Build Form
```
1. Go to /builder
2. Drag fields dari left panel ke canvas
3. Configure field properties di right panel
4. Click "Submit Form" button
5. Form akan auto-save ke store dan redirect ke renderer
```

### 2. Render Form
```
1. Form Renderer akan load dan render form
2. User bisa fill the form
3. Data logged to console when submitted
```

## Implementation Details

### FormBuilder dengan Callback

**FormBuilderPage.vue**:
```typescript
import { useFormStore } from '@/composables/useFormStore'
import type { FormSchema } from '@/services/formService'

const { saveFormSchema } = useFormStore()

async function handleFormSubmit(schema: FormSchema) {
  const formId = saveFormSchema(schema) // Save to store
  // Auto-redirect ke renderer via watch
}
```

```vue
<FormBuilder :on-submit="handleFormSubmit" />
```

### FormRenderer dengan Store

**FormRendererPage.vue**:
```typescript
import { useFormStore } from '@/composables/useFormStore'

const { getFormSchema } = useFormStore()

function loadFormSchema(id: string) {
  const schema = getFormSchema(id) // Load dari store
  schema.value = schema
}
```

## Current Flow

```
FormBuilder
   ↓ (onSubmit callback)
FormBuilderPage
   ↓ (saveFormSchema to store)
useFormStore (in-memory)
   ↓ (query param navigation)
FormRendererPage
   ↓ (getFormSchema from store)
FormRenderer
   ↓ (render form + submit)
Console (logged)
```

## Migrasi ke Backend API

### Minimal Changes Needed

Hanya ubah handler functions di pages, components sudah support keduanya:

**FormBuilderPage.vue**:
```typescript
async function handleFormSubmit(schema: FormSchema) {
  // Replace saveFormSchema dengan API call
  const result = await formService.submitFormSchema(schema)
  submittedFormId.value = result.id
}
```

**FormRendererPage.vue**:
```typescript
function loadFormSchema(id: string) {
  // Replace getFormSchema dari store dengan API call
  const schema = await formService.getFormSchema(id)
  schema.value = schema
}
```

## Store API

```typescript
// Get store instance
const {
  saveFormSchema,      // Save schema, return ID
  getFormSchema,       // Get schema by ID
  updateFormSchema,    // Update existing schema
  deleteForm,          // Delete form
  getAllForms,         // Get all forms
  currentForm,         // Computed: current form
  allForms,            // Computed: all forms
} = useFormStore()
```

## Debugging

Check store state:
```typescript
const { state } = useFormStore()
console.log(state.forms)  // All stored forms
console.log(state.currentFormId)  // Current form ID
```

Browser DevTools:
1. Open Console
2. `useFormStore()` akan log semua actions
3. Check Application tab untuk inspect state

## File Structure

```
src/
├── composables/
│   └── useFormStore.ts          ← Store composable
├── components/organism/
│   ├── form-builder/
│   │   └── FormBuilder.vue      ← Props: onSubmit
│   └── form-renderer/
│       └── FormRenderer.vue     ← Render from schema
├── pages/
│   ├── FormBuilderPage.vue      ← Handle store save
│   └── FormRendererPage.vue     ← Load from store
└── services/
    └── formService.ts           ← API service (future)
```

## Next Steps

1. **Test**: Build form di `/builder`, render di `/renderer`
2. **Backend**: Setup API endpoints sesuai spec
3. **Integration**: Swap store calls dengan API calls
4. **Production**: Deploy dengan backend connectivity

Untuk detail lebih lengkap, lihat `FORM_SCHEMA_GUIDE.md`.
