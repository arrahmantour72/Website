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
  PackageSearch,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Package = Tables<'packages'>;

export const PackagesEditor = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { toast } = useToast();

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false }); // Show newest first
      setLoading(false);
      if (error)
        return toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      if (data) setPackages(data as Package[]);
    };
    fetchPackages();
  }, [toast]);

  // Add new package
  const handleAddPackage = () => {
    const newPkg: Package = {
      id: crypto.randomUUID(),
      title: 'New Tour Package',
      description: '',
      location: '',
      price: 0,
      duration: '',
      category: '', // Suggest 'Iran' or 'Iraq' based on user prefs
      featured: false,
      dates: '',
      image_url: '',
      itinerary: [],
      inclusions: [],
      exclusions: [],
      accommodations: [],
      key_locations: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPackages([newPkg, ...packages]);
    setSelectedPackage(newPkg);
  };

  // Update selected package locally
  const handleUpdatePackage = (updatedFields: Partial<Package>) => {
    if (!selectedPackage) return;
    const updatedPkg = {
      ...selectedPackage,
      ...updatedFields,
      updated_at: new Date().toISOString(),
    };
    setSelectedPackage(updatedPkg);
    setPackages(packages.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)));
  };

  // Remove package
  const handleRemovePackage = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Optimistically remove from UI
    setPackages(packages.filter((p) => p.id !== id));
    if (selectedPackage?.id === id) setSelectedPackage(null);

    // Try to delete from DB
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) {
      toast({
        title: 'Delete Error',
        description: `Failed to delete: ${error.message}`,
        variant: 'destructive',
      });
      // NOTE: Here you might want to re-fetch or add the package back to state
    } else {
      toast({ title: 'Deleted', description: 'Package removed.' });
    }
  };

  // Save all packages to Supabase
  const handleSave = async () => {
    try {
      setLoading(true);
      // We only upsert packages that have been modified
      const modifiedPackages = packages.filter((p) => {
        // Simple check: new items (random UUIDs) or modified items
        // A more robust way would be to track 'dirty' state
        return p.id.length === 36 || p.updated_at > p.created_at;
      });

      if (modifiedPackages.length === 0) {
        toast({ title: 'No changes', description: 'No updates to save.' });
        return;
      }

      for (const pkg of modifiedPackages) {
        const { error } = await supabase.from('packages').upsert(pkg);
        if (error) throw error;
      }
      toast({
        title: 'Saved',
        description: 'Packages updated successfully!',
      });
      // Refetch to get clean data from DB
      // fetchPackages(); // You can call this, but it's not strictly needed
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

  // Upload image
  const handleImageUpload = async (file: File) => {
    if (!selectedPackage) return;
    try {
      setLoading(true);
      const fileName = `${selectedPackage.id}-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('package-images')
        .upload(fileName, file);
      if (error) throw error;
      const url = supabase.storage
        .from('package-images')
        .getPublicUrl(fileName).data.publicUrl;
      handleUpdatePackage({ image_url: url });
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

  // --- ArrayField Handlers ---
  const handleArrayChange = (
    field: keyof Package,
    index: number,
    value: string,
  ) => {
    if (!selectedPackage) return;
    const arr = [...((selectedPackage[field] as string[]) || [])];
    arr[index] = value;
    handleUpdatePackage({ [field]: arr } as Partial<Package>);
  };
  const handleArrayAdd = (field: keyof Package) => {
    if (!selectedPackage) return;
    const arr = [...((selectedPackage[field] as string[]) || []), ''];
    handleUpdatePackage({ [field]: arr } as Partial<Package>);
  };
  const handleArrayRemove = (field: keyof Package, index: number) => {
    if (!selectedPackage) return;
    const arr = [...((selectedPackage[field] as string[]) || [])];
    arr.splice(index, 1);
    handleUpdatePackage({ [field]: arr } as Partial<Package>);
  };

  // --- Accommodation Handlers ---
  const handleAccommodationChange = (
    index: number,
    key: keyof Package['accommodations'][0],
    value: any,
  ) => {
    if (!selectedPackage) return;
    const accs = [...selectedPackage.accommodations];
    accs[index] = { ...accs[index], [key]: value };
    handleUpdatePackage({ accommodations: accs });
  };
  const addAccommodation = () => {
    if (!selectedPackage) return;
    handleUpdatePackage({
      accommodations: [
        ...selectedPackage.accommodations,
        {
          hotel_name: '',
          city: '',
          rating: 0,
          amenities: [],
          description: '',
        },
      ],
    });
  };
  const removeAccommodation = (index: number) => {
    if (!selectedPackage) return;
    const accs = [...selectedPackage.accommodations];
    accs.splice(index, 1);
    handleUpdatePackage({ accommodations: accs });
  };

  // --- Reusable Array Editor Component ---
  const renderArrayEditor = (
    field: 'itinerary' | 'inclusions' | 'exclusions' | 'key_locations',
    label: string,
    placeholder: string = 'Enter item...',
  ) => (
    <div className="space-y-2">
      <Label className="text-lg font-semibold">{label}</Label>
      <div className="space-y-2">
        {(selectedPackage?.[field] as string[] | undefined)?.map(
          (item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input
                type="text"
                value={item}
                placeholder={placeholder}
                onChange={(e) => handleArrayChange(field, idx, e.target.value)}
                className="flex-1"
              />
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleArrayRemove(field, idx)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ),
        )}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleArrayAdd(field)}
        className="mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add {field.replace('_', ' ').slice(0, -1)}
      </Button>
    </div>
  );

  return (
    <CMSLayout title="Edit Packages" onSave={handleSave} >
      <div className="flex flex-col lg:flex-row lg:gap-8 lg:h-[calc(100vh-160px)]">
        {/* --- Sidebar (List View) --- */}
        <div
          className={`
            ${selectedPackage ? 'hidden' : 'block'} 
            w-full 
            lg:block lg:w-1/3 lg:flex-shrink-0 
            space-y-6
          `}
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Tour Packages
            </h2>
            <Button
              onClick={handleAddPackage}
              className="gradient-primary text-white flex items-center w-full lg:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Package
            </Button>
          </div>

          {/* Package List */}
          <div className="flex flex-col gap-3">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors shadow-sm rounded-lg"
                onClick={() => setSelectedPackage(pkg)}
              >
                <div className="overflow-hidden pr-2">
                  <h3 className="text-lg font-semibold truncate">
                    {pkg.title || 'New Package'}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {pkg.duration || 'N/A'} •{' '}
                    {pkg.price ? `$${pkg.price}` : 'Free'} • {pkg.location}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={(e) => handleRemovePackage(e, pkg.id)}
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
            ${selectedPackage ? 'block' : 'hidden'} 
            w-full 
            lg:block lg:w-2/3 
            lg:h-full lg:overflow-y-auto
          `}
        >
          {selectedPackage ? (
            <Card className="shadow-lg rounded-lg relative">
              {/* Mobile Back Button */}
              <Button
                variant="ghost"
                onClick={() => setSelectedPackage(null)}
                className="lg:hidden mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to list
              </Button>

              {/* Desktop Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedPackage(null)}
                className="hidden lg:block absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>

              <CardHeader>
                <CardTitle className="text-2xl font-bold pr-12">
                  {selectedPackage.title || 'New Package'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="mb-4 w-full justify-start overflow-x-auto">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="accommodation">
                      Accommodation
                    </TabsTrigger>
                  </TabsList>

                  {/* --- GENERAL TAB --- */}
                  <TabsContent value="general" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={selectedPackage.title || ''}
                        onChange={(e) =>
                          handleUpdatePackage({ title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desc">Description</Label>
                      <Textarea
                        id="desc"
                        value={selectedPackage.description || ''}
                        onChange={(e) =>
                          handleUpdatePackage({ description: e.target.value })
                        }
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location (e.g., Iraq)</Label>
                        <Input
                          id="location"
                          value={selectedPackage.location || ''}
                          onChange={(e) =>
                            handleUpdatePackage({ location: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Category (e.g., Ziyarat)
                        </Label>
                        <Input
                          id="category"
                          value={selectedPackage.category || ''}
                          onChange={(e) =>
                            handleUpdatePackage({ category: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (e.g., 10 Days)</Label>
                        <Input
                          id="duration"
                          value={selectedPackage.duration || ''}
                          onChange={(e) =>
                            handleUpdatePackage({ duration: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={selectedPackage.price || 0}
                          onChange={(e) =>
                            handleUpdatePackage({
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dates">Available Dates (e.g., Oct 2025 - Jan 2026)</Label>
                      <Input
                        id="dates"
                        value={selectedPackage.dates || ''}
                        onChange={(e) =>
                          handleUpdatePackage({ dates: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox
                        id="featured"
                        checked={selectedPackage.featured || false}
                        onCheckedChange={(checked) =>
                          handleUpdatePackage({ featured: !!checked })
                        }
                      />
                      <Label htmlFor="featured">Mark as Featured Package</Label>
                    </div>

                    <div className="space-y-4 pt-2">
                      <Label className="text-lg font-semibold">
                        Featured Image
                      </Label>
                      {selectedPackage.image_url && (
                        <img
                          src={selectedPackage.image_url}
                          alt={selectedPackage.title || 'Package Image'}
                          className="w-full h-48 object-cover rounded-md border"
                        />
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                          id="image_url"
                          value={selectedPackage.image_url || ''}
                          onChange={(e) =>
                            handleUpdatePackage({ image_url: e.target.value })
                          }
                          placeholder="Enter image URL"
                        />
                      </div>
                      <div className="relative">
                        <label
                          htmlFor={`image-upload-${selectedPackage.id}`}
                          className="cursor-pointer"
                        >
                          <Button asChild variant="outline" className="w-full">
                            <span>
                              <Upload className="w-4 h-4 mr-2" /> Upload Image
                              File
                            </span>
                          </Button>
                          <input
                            type="file"
                            id={`image-upload-${selectedPackage.id}`}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              e.target.files &&
                              handleImageUpload(e.target.files[0])
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </TabsContent>

                  {/* --- DETAILS TAB --- */}
                  <TabsContent value="details" className="space-y-8 pt-4">
                    {renderArrayEditor(
                      'itinerary',
                      'Itinerary',
                      'e.g., Day 1: Arrive in Najaf',
                    )}
                    {renderArrayEditor(
                      'inclusions',
                      'Inclusions',
                      'e.g., Visa Processing',
                    )}
                    {renderArrayEditor(
                      'exclusions',
                      'Exclusions',
                      'e.g., Personal Expenses',
                    )}
                    {renderArrayEditor(
                      'key_locations',
                      'Key Locations',
                      'e.g., Imam Ali Shrine',
                    )}
                  </TabsContent>

                  {/* --- ACCOMMODATION TAB --- */}
                  <TabsContent value="accommodation" className="space-y-4 pt-4">
                    <Label className="text-lg font-semibold">
                      Accommodation Details
                    </Label>
                    {selectedPackage.accommodations.map((acc, idx) => (
                      <Card key={idx} className="p-4 relative bg-muted/30">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                          onClick={() => removeAccommodation(idx)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label>Hotel Name</Label>
                            <Input
                              value={acc.hotel_name}
                              placeholder="e.g., Qasr Al-Dur Hotel"
                              onChange={(e) =>
                                handleAccommodationChange(
                                  idx,
                                  'hotel_name',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label>City</Label>
                              <Input
                                value={acc.city}
                                placeholder="e.g., Najaf"
                                onChange={(e) =>
                                  handleAccommodationChange(
                                    idx,
                                    'city',
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Rating (out of 5)</Label>
                              <Input
                                type="number"
                                value={acc.rating || 0}
                                max={5}
                                min={0}
                                onChange={(e) =>
                                  handleAccommodationChange(
                                    idx,
                                    'rating',
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label>Description</Label>
                            <Textarea
                              value={acc.description || ''}
                              placeholder="e.g., 5-min walk from the shrine"
                              onChange={(e) =>
                                handleAccommodationChange(
                                  idx,
                                  'description',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Amenities (comma separated)</Label>
                            <Input
                              value={acc.amenities?.join(', ') || ''}
                              placeholder="e.g., WiFi, Breakfast, AC"
                              onChange={(e) =>
                                handleAccommodationChange(
                                  idx,
                                  'amenities',
                                  e.target.value
                                    .split(',')
                                    .map((s) => s.trim()),
                                )
                              }
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button onClick={addAccommodation}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Accommodation
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            /* --- Empty State --- */
            <Card className="hidden lg:flex items-center justify-center h-96 border-dashed border-2">
              <div className="text-center text-muted-foreground">
                <PackageSearch className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">
                  Select a package to edit
                </p>
                <p className="text-sm">
                  or
                  <Button
                    variant="link"
                    className="p-1 h-auto text-sm"
                    onClick={handleAddPackage}
                  >
                    Add a new package
                  </Button>
                  to get started.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            Loading...
          </div>
        </div>
      )}
    </CMSLayout>
  );
};