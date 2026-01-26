import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Plus, Edit, Trash2, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress, Address } from '@/hooks/useAddresses';
import AddressForm from '@/components/address/AddressForm';
import { useToast } from '@/hooks/use-toast';

const Addresses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { data: addresses = [], isLoading, error } = useAddresses();
  const { mutateAsync: addAddress, isPending: isAddingAddress } = useAddAddress();
  const { mutateAsync: updateAddress, isPending: isUpdatingAddress } = useUpdateAddress();
  const { mutateAsync: deleteAddress, isPending: isDeletingAddress } = useDeleteAddress();

  if (!user) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <MapPin className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-display font-bold mb-4">Not Logged In</h1>
            <p className="text-muted-foreground mb-8">Please log in to manage your addresses</p>
            <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
              Log In
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const handleFormSubmit = async (formData: Partial<Address>) => {
    if (editingAddress) {
      await updateAddress({ id: editingAddress.id, ...formData });
      setEditingAddress(null);
    } else {
      await addAddress(formData as Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
    }
    setIsFormOpen(false);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id);
      toast({
        title: 'Deleted',
        description: 'Address has been deleted.',
      });
    }
  };

  return (
    <Layout>
      <div className="section-container py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-display font-bold">My Addresses</h1>
            <Button
              variant="hero"
              onClick={() => {
                setEditingAddress(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        </motion.div>

        {isLoading && (
          <div className="text-center text-muted-foreground py-12">
            Loading addresses...
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="text-destructive mb-4">Failed to load addresses</div>
            <p className="text-sm text-muted-foreground mb-4">
              Please make sure the database table is created
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        )}

        {!error && addresses.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-12 text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-lg font-semibold mb-2">No Addresses Yet</h2>
              <p className="text-muted-foreground mb-6">
                Add your first address to get started
              </p>
              <Button
                variant="hero"
                onClick={() => {
                  setEditingAddress(null);
                  setIsFormOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </Card>
          </motion.div>
        )}

        {addresses.length > 0 && (
          <div className="grid gap-4">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`p-6 ${address.is_default ? 'border-primary border-2' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{address.full_name}</h3>
                        <Badge variant={address.tag === 'home' ? 'default' : address.tag === 'office' ? 'secondary' : 'outline'}>
                          {address.custom_tag || address.tag}
                        </Badge>
                        {address.is_default && (
                          <Badge className="bg-green-500 text-white">
                            <Check className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {address.street_address}, {address.home_address}
                      </p>
                      <p className="text-muted-foreground text-sm mb-2">
                        {address.city}, {address.state} {address.pincode}
                      </p>
                      <p className="text-muted-foreground text-sm mb-2">
                        {address.country}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Phone: {address.phone}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(address)}
                        disabled={isUpdatingAddress}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(address.id)}
                        disabled={isDeletingAddress}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Address Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription>
              {editingAddress ? 'Update your address details' : 'Add a new delivery address'}
            </DialogDescription>
          </DialogHeader>
          <AddressForm
            initialData={editingAddress || undefined}
            userName={user?.user_metadata?.name || user?.email || ''}
            onSubmit={handleFormSubmit}
            isLoading={isAddingAddress || isUpdatingAddress}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Addresses;
