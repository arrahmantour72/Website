import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  updateContactTitle,
  updateContactDescription,
  updateContactDetails,
  updateMapEmbed,
  addFormField,
  updateFormField,
  removeFormField,
} from '@/store/slices/contactSlice';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditorField } from '@/components/cms/EditorField';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

export const ContactEditor = () => {
  const dispatch = useDispatch();
  const contact = useSelector((state: RootState) => state.contact);
  const { toast } = useToast();

  const handleAddFormField = () => {
    dispatch(addFormField({
      id: Date.now().toString(),
      label: 'New Field',
      type: 'text',
    }));
  };

  const handleSave = () => {
    toast({
      title: 'Changes Saved',
      description: 'Contact page has been updated successfully.',
    });
  };

  return (
    <CMSLayout title="Edit Contact Page" onSave={handleSave}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Contact Information</h2>
            
            <div className="space-y-4">
              <EditorField
                label="Title"
                type="text"
                value={contact.title}
                onChange={(value) => dispatch(updateContactTitle(value))}
                placeholder="Contact Us"
              />

              <EditorField
                label="Description"
                type="textarea"
                value={contact.description}
                onChange={(value) => dispatch(updateContactDescription(value))}
                placeholder="Description"
              />

              <div className="border-t border-border pt-4 mt-4">
                <h3 className="text-lg font-medium mb-3 text-foreground">Contact Details</h3>
                
                <EditorField
                  label="Phone"
                  type="text"
                  value={contact.contactDetails.phone}
                  onChange={(phone) => dispatch(updateContactDetails({ ...contact.contactDetails, phone }))}
                  placeholder="+1 (555) 123-4567"
                />

                <EditorField
                  label="Email"
                  type="text"
                  value={contact.contactDetails.email}
                  onChange={(email) => dispatch(updateContactDetails({ ...contact.contactDetails, email }))}
                  placeholder="info@example.com"
                />

                <EditorField
                  label="WhatsApp Link"
                  type="text"
                  value={contact.contactDetails.whatsapp}
                  onChange={(whatsapp) => dispatch(updateContactDetails({ ...contact.contactDetails, whatsapp }))}
                  placeholder="https://wa.me/15551234567"
                />
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <EditorField
                  label="Map Embed Code"
                  type="textarea"
                  value={contact.mapEmbed}
                  onChange={(value) => dispatch(updateMapEmbed(value))}
                  placeholder="<iframe src='...'></iframe>"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Form Fields</h2>
              <Button
                onClick={handleAddFormField}
                size="sm"
                className="gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>

            <div className="space-y-4">
              {contact.formFields.map((field) => (
                <Card key={field.id} className="p-4 space-y-3 bg-muted">
                  <EditorField
                    label="Field Label"
                    type="text"
                    value={field.label}
                    onChange={(label) => dispatch(updateFormField({ ...field, label }))}
                    placeholder="Name"
                  />

                  <EditorField
                    label="Field Type"
                    type="select"
                    value={field.type}
                    onChange={(type) => dispatch(updateFormField({ ...field, type: type as 'text' | 'email' | 'textarea' }))}
                    options={[
                      { value: 'text', label: 'Text' },
                      { value: 'email', label: 'Email' },
                      { value: 'textarea', label: 'Textarea' },
                    ]}
                  />

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => dispatch(removeFormField(field.id))}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Field
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Preview Panel */}
        <div>
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Preview</h2>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold">{contact.title || 'Title'}</h3>
              <p className="text-muted-foreground">{contact.description || 'Description'}</p>
              
              <div className="space-y-2 text-sm">
                <p><strong>Phone:</strong> {contact.contactDetails.phone}</p>
                <p><strong>Email:</strong> {contact.contactDetails.email}</p>
                <p><strong>WhatsApp:</strong> Available</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="font-semibold mb-2">Form Preview:</p>
                {contact.formFields.map((field) => (
                  <div key={field.id} className="mb-3">
                    <label className="text-sm font-medium">{field.label}</label>
                    <div className="mt-1 p-2 bg-background border border-border rounded">
                      {field.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </CMSLayout>
  );
};
