/**
 * CONTOH PENGGUNAAN useFormValidation
 * 
 * Composable ini menyediakan validation yang fleksibel untuk berbagai jenis form.
 * Mendukung berbagai tipe validasi: required, minLength, maxLength, pattern, email, custom
 */

// ============================================================================
// CONTOH 1: Validasi Sederhana - Form Pendaftaran
// ============================================================================

// <script setup>
// import { ref } from 'vue'
// import { useFormValidation } from '@/composables'
//
// const formData = ref({
//   name: '',
//   email: '',
//   password: '',
//   confirmPassword: ''
// })
//
// const { validateField, getFieldError, isFieldValid, isFormValid } = useFormValidation({
//   name: {
//     label: 'Nama Lengkap',
//     rules: [
//       { type: 'required' },
//       { type: 'minLength', value: 3 }
//     ]
//   },
//   email: {
//     label: 'Email',
//     rules: [
//       { type: 'required' },
//       { type: 'email' }
//     ]
//   },
//   password: {
//     label: 'Password',
//     rules: [
//       { type: 'required' },
//       { type: 'minLength', value: 8, message: 'Password minimal 8 karakter' }
//     ]
//   },
//   confirmPassword: {
//     label: 'Konfirmasi Password',
//     rules: [
//       { type: 'required' },
//       {
//         type: 'custom',
//         validate: (value) => {
//           return value === formData.value.password ? true : 'Password tidak cocok'
//         }
//       }
//     ]
//   }
// })
//
// const handleSubmit = async () => {
//   if (isFormValid.value) {
//     // Submit form
//     console.log('Form valid, submitting...', formData.value)
//   }
// }
// </script>
//
// <template>
//   <form @submit.prevent="handleSubmit">
//     <!-- Name Field -->
//     <div class="form-group">
//       <input
//         v-model="formData.name"
//         type="text"
//         placeholder="Nama Lengkap"
//         @blur="validateField('name', formData.name)"
//       />
//       <span v-if="!isFieldValid('name')" class="error">
//         {{ getFieldError('name') }}
//       </span>
//     </div>
//
//     <!-- Email Field -->
//     <div class="form-group">
//       <input
//         v-model="formData.email"
//         type="email"
//         placeholder="Email"
//         @blur="validateField('email', formData.email)"
//       />
//       <span v-if="!isFieldValid('email')" class="error">
//         {{ getFieldError('email') }}
//       </span>
//     </div>
//
//     <!-- Password Field -->
//     <div class="form-group">
//       <input
//         v-model="formData.password"
//         type="password"
//         placeholder="Password"
//         @blur="validateField('password', formData.password)"
//       />
//       <span v-if="!isFieldValid('password')" class="error">
//         {{ getFieldError('password') }}
//       </span>
//     </div>
//
//     <!-- Confirm Password Field -->
//     <div class="form-group">
//       <input
//         v-model="formData.confirmPassword"
//         type="password"
//         placeholder="Konfirmasi Password"
//         @blur="validateField('confirmPassword', formData.confirmPassword)"
//       />
//       <span v-if="!isFieldValid('confirmPassword')" class="error">
//         {{ getFieldError('confirmPassword') }}
//       </span>
//     </div>
//
//     <button type="submit" :disabled="!isFormValid">
//       Daftar
//     </button>
//   </form>
// </template>

// ============================================================================
// CONTOH 2: Validasi dengan Custom Rules - Form Field Config
// ============================================================================

// const fieldFormValidation = useFormValidation({
//   name: {
//     label: 'Label Baris',
//     rules: [
//       { type: 'required', message: 'Label harus diisi' },
//       { type: 'minLength', value: 1 },
//       {
//         type: 'custom',
//         validate: (value) => {
//           // Cek tidak ada duplicate name
//           if (existingFields.some(f => f.name === value)) {
//             return 'Nama sudah terdaftar'
//           }
//           return true
//         }
//       }
//     ]
//   },
//   code: {
//     label: 'Kode Baris',
//     rules: [
//       { type: 'required' },
//       {
//         type: 'pattern',
//         value: /^[a-z0-9_]+$/,
//         message: 'Kode hanya boleh huruf kecil, angka, dan underscore'
//       }
//     ]
//   },
//   type: {
//     label: 'Tipe Sumber Data',
//     rules: [
//       { type: 'required', message: 'Pilih tipe sumber data' }
//     ]
//   }
// })

// ============================================================================
// CONTOH 3: Validasi Async - Check Username Availability
// ============================================================================

// const { validateField } = useFormValidation({
//   username: {
//     label: 'Username',
//     rules: [
//       { type: 'required' },
//       { type: 'minLength', value: 3 },
//       {
//         type: 'custom-async',
//         validate: async (value) => {
//           // Check ke API apakah username available
//           const response = await fetch(`/api/check-username?u=${value}`)
//           const { available } = await response.json()
//           return available ? true : 'Username sudah terdaftar'
//         }
//       }
//     ]
//   }
// })

// ============================================================================
// CONTOH 4: Complex Form - Berbagai Tipe Input
// ============================================================================

// const { validateField, validateAll, getFieldError, isFieldValid, isFormValid, resetValidation } = useFormValidation({
//   businessName: {
//     label: 'Nama Bisnis',
//     rules: [
//       { type: 'required' },
//       { type: 'minLength', value: 3 },
//       { type: 'maxLength', value: 100 }
//     ]
//   },
//   businessType: {
//     label: 'Tipe Bisnis',
//     rules: [
//       { type: 'required' }
//     ]
//   },
//   phone: {
//     label: 'No. Telepon',
//     rules: [
//       { type: 'required' },
//       {
//         type: 'pattern',
//         value: /^(\+62|0)[0-9]{8,12}$/,
//         message: 'Nomor telepon tidak valid'
//       }
//     ]
//   },
//   taxId: {
//     label: 'NPWP',
//     rules: [
//       {
//         type: 'pattern',
//         value: /^[0-9]{15}$/,
//         message: 'NPWP harus 15 digit'
//       }
//     ]
//   }
// })
//
// const handleSubmit = async (formData) => {
//   const results = await validateAll(formData)
//   if (results.every(r => r.isValid)) {
//     // Submit
//   }
// }

// ============================================================================
// TIPE-TIPE VALIDASI YANG TERSEDIA
// ============================================================================

/*
1. 'required'
   - Cek value tidak kosong
   - Gunakan untuk: field wajib diisi
   - Contoh: { type: 'required', message: 'Harus diisi' }

2. 'minLength'
   - Cek panjang string minimal N karakter
   - Gunakan untuk: minimum input length
   - Contoh: { type: 'minLength', value: 3, message: 'Minimal 3 karakter' }

3. 'maxLength'
   - Cek panjang string maksimal N karakter
   - Gunakan untuk: batasan panjang input
   - Contoh: { type: 'maxLength', value: 100, message: 'Maksimal 100 karakter' }

4. 'pattern'
   - Cek value match regex pattern
   - Gunakan untuk: format khusus (phone, zip code, dll)
   - Contoh: { type: 'pattern', value: /^[0-9]+$/, message: 'Hanya angka' }

5. 'email'
   - Cek format email valid
   - Gunakan untuk: email field
   - Contoh: { type: 'email', message: 'Email tidak valid' }

6. 'custom'
   - Custom validation logic synchronous
   - Return true jika valid, false/error message jika tidak
   - Gunakan untuk: logika kompleks
   - Contoh: { type: 'custom', validate: (v) => v !== duplicateValue ? true : 'Duplikat' }

7. 'custom-async'
   - Custom validation logic async (bisa API call)
   - Return true jika valid, false/error message jika tidak
   - Gunakan untuk: check API (availability, dll)
   - Contoh: { type: 'custom-async', validate: async (v) => await checkAPI(v) }
*/

// ============================================================================
// AVAILABLE METHODS & PROPERTIES
// ============================================================================

/*
Method:
- validateField(fieldName, value): Promise<boolean>
  -> Validate satu field, return true/false

- validateAll(formData): Promise<FormValidationResult[]>
  -> Validate semua fields sekaligus, return array hasil validasi

- resetValidation()
  -> Reset semua field validation state

- resetFieldValidation(fieldName)
  -> Reset specific field validation state

- getFieldError(fieldName): string
  -> Get error message untuk field

Property:
- isFieldValid (computed): (fieldName) => boolean
  -> Check field valid (sudah validated dan no error)

- isFieldValidated (computed): (fieldName) => boolean
  -> Check field sudah di-validate (belum tentu valid)

- isFormValid (computed): boolean
  -> Check semua field valid

- fieldErrors (ref): Record<string, string>
  -> Error messages per field (reactive)

- fieldValidated (ref): Record<string, boolean>
  -> Validation state per field (reactive)
*/

export {}
