import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  updateHeroHeadline, 
  updateHeroSubheading,
  updateHeroMedia,
  addCtaButton,
  removeCtaButton,
} from '@/store/slices/homeSlice';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { EditorField } from '@/components/cms/EditorField';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export const HomeEditor = () => {
  const dispatch = useDispatch();
  const hero = useSelector((state: RootState) => state.home.hero);

  const handleSave = () => {
    toast.success('Changes saved successfully!');
  };

  const handleAddCta = () => {
    const newCta = {
      id: Date.now().toString(),
      text: 'New Button',
      link: '/page',
    };
    dispatch(addCtaButton(newCta));
  };

  return (
    <CMSLayout title="Edit Home Page" onSave={handleSave}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Hero Section */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            
            <div className="space-y-4">
              <EditorField
                label="Hero Headline"
                value={hero.headline}
                onChange={(value) => dispatch(updateHeroHeadline(value))}
                placeholder="Enter headline"
              />
              
              <EditorField
                label="Hero Subheading"
                type="textarea"
                value={hero.subheading}
                onChange={(value) => dispatch(updateHeroSubheading(value))}
                placeholder="Discover Spiritual Ziyarat Tours to Iran & Iraq"
              />
            </div>
          </Card>

          {/* Background Media */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Background Image/Video</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {hero.backgroundMedia ? (
                  <img 
                    src={hero.backgroundMedia} 
                    alt="Hero background" 
                    className="max-h-40 mx-auto rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-12 h-12" />
                    <p className="text-sm">Upload background media</p>
                  </div>
                )}
              </div>
              
              <Button className="w-full gradient-primary text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload/Change Media
              </Button>
              
              <EditorField
                label="Media Type"
                type="select"
                value={hero.mediaType}
                onChange={(value) => dispatch(updateHeroMedia({ 
                  media: hero.backgroundMedia, 
                  type: value as 'image' | 'video' 
                }))}
                options={[
                  { value: 'image', label: 'Image' },
                  { value: 'video', label: 'Video' },
                ]}
              />
            </div>
          </Card>

          {/* CTA Buttons */}
          <Card className="p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">CTA Buttons</h2>
              <Button
                onClick={handleAddCta}
                size="sm"
                className="gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {hero.ctaButtons.map((cta) => (
                <div 
                  key={cta.id} 
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input 
                      value={cta.text}
                      placeholder="Button text"
                      className="bg-background"
                    />
                    <Input 
                      value={cta.link}
                      placeholder="/page"
                      className="bg-background"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dispatch(removeCtaButton(cta.id))}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Card className="p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Hero Section Preview</h2>
            
            <div className="bg-muted rounded-lg p-6 space-y-3">
              <div className="bg-card p-4 rounded">
                <h3 className="font-serif text-2xl mb-2">{hero.headline}</h3>
                <p className="text-muted-foreground text-sm">{hero.subheading}</p>
              </div>
              
              <div className="flex gap-2">
                {hero.ctaButtons.map((cta) => (
                  <div 
                    key={cta.id}
                    className="px-4 py-2 gradient-primary text-white text-sm rounded-full"
                  >
                    {cta.text}
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
