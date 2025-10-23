import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  updateAboutTitle, 
  updateAboutDescription, 
  updateAboutImage, 
  updateLearnMore 
} from '@/store/slices/aboutSlice';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { EditorField } from '@/components/cms/EditorField';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const AboutEditor = () => {
  const dispatch = useDispatch();
  const about = useSelector((state: RootState) => state.about);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Changes Saved',
      description: 'About page has been updated successfully.',
    });
  };

  return (
    <CMSLayout title="Edit About Page" onSave={handleSave}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">About Content</h2>
            
            <div className="space-y-4">
              <EditorField
                label="Title"
                type="text"
                value={about.title}
                onChange={(value) => dispatch(updateAboutTitle(value))}
                placeholder="Our Sacred Mission"
              />

              <EditorField
                label="Description"
                type="textarea"
                value={about.description}
                onChange={(value) => dispatch(updateAboutDescription(value))}
                placeholder="Tell your story..."
              />

              <EditorField
                label="Image URL"
                type="text"
                value={about.image}
                onChange={(value) => dispatch(updateAboutImage(value))}
                placeholder="https://example.com/image.jpg"
              />

              <div className="border-t border-border pt-4 mt-4">
                <h3 className="text-lg font-medium mb-3 text-foreground">Learn More CTA</h3>
                
                <EditorField
                  label="Button Text"
                  type="text"
                  value={about.learnMore.text}
                  onChange={(text) => dispatch(updateLearnMore({ ...about.learnMore, text }))}
                  placeholder="Learn More About Us"
                />

                <EditorField
                  label="Button Link"
                  type="text"
                  value={about.learnMore.link}
                  onChange={(link) => dispatch(updateLearnMore({ ...about.learnMore, link }))}
                  placeholder="/about"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Panel */}
        <div>
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Preview</h2>
            
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                {about.image ? (
                  <img src={about.image} alt={about.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span>Image preview</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-serif font-bold">{about.title || 'Title'}</h3>
              <p className="text-muted-foreground">{about.description || 'Description'}</p>
              
              <div className="inline-block px-6 py-2 bg-primary text-white rounded-full">
                {about.learnMore.text || 'CTA Button'}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </CMSLayout>
  );
};
