import { useEffect, useState } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Trash2,
  Upload,
  X,
  ArrowLeft,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Use the correct type from your schema
type Destination = Tables<'destinations'>;

export const GalleryEditor = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const { toast } = useToast();

  // --- Data Fetching ---
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        // Order by 'createdAt' (camelCase) as in your schema
        .order('createdat', { ascending: false });
      setLoading(false);
      if (error)
        return toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      if (data) setDestinations(data as Destination[]);
    };
    fetchDestinations();
  }, [toast]);

  // --- CRUD Functions ---

  const handleAddDestination = () => {
    const newDest: Destination = {
      _id: crypto.randomUUID(),
      title: 'New Destination',
      description: '',
      imagebase64: '', // This field will store the URL
      categories: '',
      services: [],
      type:'',
      featured: false,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };
    setDestinations([newDest, ...destinations]);
    setSelectedDestination(newDest);
  };

  const handleUpdate = (updatedFields: Partial<Destination>) => {
    if (!selectedDestination) return;
    const updatedDest = {
      ...selectedDestination,
      ...updatedFields,
      updatedat: new Date().toISOString(),
    };
    setSelectedDestination(updatedDest);
    setDestinations(
      destinations.map((d) => (d._id === updatedDest._id ? updatedDest : d)),
    );
  };

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Optimistically remove from UI
    setDestinations(destinations.filter((d) => d._id !== id));
    if (selectedDestination?._id === id) setSelectedDestination(null);

    // Try to delete from DB
    const { error } = await supabase.from('destinations').delete().eq('_id', id);
    if (error) {
      toast({
        title: 'Delete Error',
        description: `Failed to delete: ${error.message}`,
        variant: 'destructive',
      });
      // NOTE: Consider re-fetching or adding the item back if delete fails
    } else {
      toast({ title: 'Deleted', description: 'Destination removed.' });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Upsert all items (or just dirty ones)
      for (const dest of destinations) {
        const { error } = await supabase.from('destinations').update(dest);
        if (error) throw error;
      }
      toast({
        title: 'Saved',
        description: 'Destinations updated successfully!',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Image Upload ---
  const handleImageUpload = async (file: File) => {
    if (!selectedDestination) return;
    try {
      setLoading(true);
      const fileName = `${selectedDestination._id}-${Date.now()}-${file.name}`;
      
      // Assumes you have a bucket named 'destination-images'
      const { error } = await supabase.storage
        .from('destination-images')
        .upload(fileName, file);
      if (error) throw error;
      
      const url = supabase.storage
        .from('destination-images')
        .getPublicUrl(fileName).data.publicUrl;
      
      // Update the 'imagebase64' field with the new URL
      handleUpdate({ imagebase64: url });
      
      toast({ title: 'Uploaded', description: 'Image uploaded successfully!' });
    } catch (err: any) {
      toast({
        title: 'Upload Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // --- ArrayField Handlers (for Services) ---
  const handleArrayChange = (
    field: 'services',
    index: number,
    value: string,
  ) => {
    if (!selectedDestination) return;
    const arr = [...((selectedDestination[field] as string[]) || [])];
    arr[index] = value;
    handleUpdate({ [field]: arr } as Partial<Destination>);
  };
  const handleArrayAdd = (field: 'services') => {
    if (!selectedDestination) return;
    const arr = [...((selectedDestination[field] as string[]) || []), ''];
    handleUpdate({ [field]: arr } as Partial<Destination>);
  };
  const handleArrayRemove = (field: 'services', index: number) => {
    if (!selectedDestination) return;
    const arr = [...((selectedDestination[field] as string[]) || [])];
    arr.splice(index, 1);
    handleUpdate({ [field]: arr } as Partial<Destination>);
  };

  return (
    <CMSLayout title="Edit Destinations" onSave={handleSave} loading={loading}>
      <div className="flex flex-col lg:flex-row lg:gap-8 lg:h-[calc(100vh-160px)]">
        {/* --- Sidebar (List View) --- */}
        <div
          className={`
            ${selectedDestination ? 'hidden' : 'block'} 
            w-full 
            lg:block lg:w-1/3 lg:flex-shrink-0 
            space-y-6
          `}
        >
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Destinations
            </h2>
            <Button
              onClick={handleAddDestination}
              className="gradient-primary text-white flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Button>
          </div>

          {/* Destination List */}
          <div className="flex flex-col gap-3">
            {destinations.map((dest) => (
              <Card
                key={dest._id}
                className="flex items-center gap-4 p-3 cursor-pointer hover:bg-muted/50 transition-colors shadow-sm rounded-lg"
                onClick={() => setSelectedDestination(dest)}
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-md bg-muted overflow-hidden">
                  {dest.imagebase64 ? (
                    <img
                      src={dest.imagebase64}
                      alt={dest.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden flex-1">
                  <h3 className="text-lg font-semibold truncate">
                    {dest.title || 'New Destination'}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {dest.categories || 'No category'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={(e) => handleRemove(e, dest._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* --- Main Content (Editor View) --- */}
        <div
          className={`
            ${selectedDestination ? 'block' : 'hidden'} 
            w-full 
            lg:block lg:w-2/3 
            lg:h-full lg:overflow-y-auto
          `}
        >
          {selectedDestination ? (
            <Card className="shadow-lg rounded-lg relative">
              <Button
                variant="ghost"
                onClick={() => setSelectedDestination(null)}
                className="lg:hidden mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to list
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDestination(null)}
                className="hidden lg:block absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>

              <CardHeader>
                <CardTitle className="text-2xl font-bold pr-12">
                  {selectedDestination.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                  </TabsList>

                  {/* --- GENERAL TAB --- */}
                  <TabsContent value="general" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={selectedDestination.title || ''}
                        onChange={(e) =>
                          handleUpdate({ title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desc">Description</Label>
                      <Textarea
                        id="desc"
                        value={selectedDestination.description || ''}
                        onChange={(e) =>
                          handleUpdate({ description: e.target.value })
                        }
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categories">
                        Categories (e.g., Iran, Ziyarat, Historical)
                      </Label>
                      <Input
                        id="categories"
                        value={selectedDestination.categories || ''}
                        onChange={(e) =>
                          handleUpdate({ categories: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox
                        id="featured"
                        checked={selectedDestination.featured || false}
                        onCheckedChange={(checked) =>
                          handleUpdate({ featured: !!checked })
                        }
                      />
                      <Label htmlFor="featured">Featured Destination</Label>
                    </div>

                    <div className="space-y-4 pt-2">
                      <Label className="text-lg font-semibold">
                        Featured Image
                      </Label>
                      {selectedDestination.imagebase64 && (
                        <img
                          src={selectedDestination.imagebase64}
                          alt={selectedDestination.title || 'Image'}
                          className="w-full h-48 object-cover rounded-md border"
                        />
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="image_url">
                          Image URL (from `imagebase64` field)
                        </Label>
                        <Input
                          id="image_url"
                          value={selectedDestination.imagebase64 || ''}
                          onChange={(e) =>
                            handleUpdate({ imagebase64: e.target.value })
                          }
                          placeholder="Enter image URL"
                        />
                      </div>
                      <label
                        htmlFor={`image-upload-${selectedDestination._id}`}
                        className="cursor-pointer"
                      >
                        <Button asChild variant="outline" className="w-full">
                          <span>
                            <Upload className="w-4 h-4 mr-2" /> Upload New Image
                          </span>
                        </Button>
                        <input
                          type="file"
                          id={`image-upload-${selectedDestination._id}`}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files &&
                            handleImageUpload(e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                  </TabsContent>

                  {/* --- SERVICES TAB --- */}
                  <TabsContent value="services" className="space-y-4 pt-4">
                    <Label className="text-lg font-semibold">Services</Label>
                    <div className="space-y-2">
                      {(selectedDestination.services || []).map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            type="text"
                            value={item}
                            placeholder="e.g., Visa Assistance"
                            onChange={(e) =>
                              handleArrayChange('services', idx, e.target.value)
                            }
                            className="flex-1"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleArrayRemove('services', idx)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleArrayAdd('services')}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            /* --- Empty State --- */
            <Card className="hidden lg:flex items-center justify-center h-96 border-dashed border-2">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">
                  Select a destination to edit
                </p>
                <p className="text-sm">
                  or
                  <Button
                    variant="link"
                    className="p-1 h-auto text-sm"
                    onClick={handleAddDestination}
                  >
                    Add a new destination
                  </Button>
                  to get started.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </CMSLayout>
  );
};