// src/store/slices/contactSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ContactState {
  title: string;
  description: string;
  contactDetails: {
    phone: string;
    email: string;
  };
  address: string; // <-- NEW
  mapEmbed: string; // Google Maps iframe embed
  formFields: FormField[];
  faq: FaqItem[]; // <-- NEW
}

const initialState: ContactState = {
  title: 'Contact Us',
  description: 'We are here to help you plan your next spiritual journey. Reach out to us via phone, email, or by filling out the form below.',
  contactDetails: {
    phone: '+91 98198 37579',
    email: 'maulanaatahaider@gmail.com',
  },
  address: `Habib Bldg, Shop No.50, 
  Mahfile Khurasan Hazrat Abbas (a.s.) Street
Pala Gali, Samuel Street, Dongri
Mumbai, Maharashtra - 400009`,
  mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.806880073426!2d72.8314732!3d18.9582191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce3baffccff1%3A0x948270337ff553c9!2sMEHFIL-E-SHAH-E-KHURASAN!5e0!3m2!1sen!2sin!4v1718123456789!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
  formFields: [
    { id: 'name', label: 'Full Name', type: 'text' },
    { id: 'email', label: 'Email Address', type: 'email' },
    { id: 'phone', label: 'Phone Number', type: 'tel' },
    { id: 'subject', label: 'Subject', type: 'text' },
    { id: 'message', label: 'Message', type: 'textarea' },
  ],
  faq: [
    {
      id: 'faq-1',
      question: 'What documents are required for the visa?',
      answer: 'You will typically need a valid passport (6 months minimum validity), passport-sized photographs, and a completed visa application form. We will guide you through the entire process and provide a detailed checklist upon booking.'
    },
    {
      id: 'faq-2',
      question: 'Are meals included in the packages?',
      answer: 'Yes, all our Ziyarat packages include full board: breakfast, lunch, and dinner. The meals are typically from a set menu, offering a variety of local and continental dishes.'
    },
    {
      id: 'faq-3',
      question: 'How much walking is involved in the tours?',
      answer: 'A moderate amount of walking is expected, especially when visiting the shrines and historical sites. For specific packages like the Arbaeen Walk, a significant amount of walking is the main component. Please check the "Package Details" for more information.'
    },
    {
      id: 'faq-4',
      question: 'What is your cancellation policy?',
      answer: 'Our cancellation policy varies depending on the package and how close to the departure date you cancel. We provide a full copy of our terms and conditions, including the cancellation policy, with every booking confirmation.'
    }
  ]
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    updateContactTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    updateContactDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
   updateContactDetails: (state, action: PayloadAction<Partial<FormField>>) => {
  state.formFields = { ...state.formFields, ...action.payload };
},

    updateMapEmbed: (state, action: PayloadAction<string>) => {
      state.mapEmbed = action.payload;
    },
    addFormField: (state, action: PayloadAction<FormField>) => {
      state.formFields.push(action.payload);
    },
    updateFormField: (state, action: PayloadAction<FormField>) => {
      const index = state.formFields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.formFields[index] = action.payload;
      }
    },
    removeFormField: (state, action: PayloadAction<string>) => {
      state.formFields = state.formFields.filter(field => field.id !== action.payload);
    },
  },
});

export const {
  updateContactTitle,
  updateContactDescription,
  updateContactDetails,
  updateMapEmbed,
  addFormField,
  updateFormField,
  removeFormField,
} = contactSlice.actions;

export default contactSlice.reducer;
