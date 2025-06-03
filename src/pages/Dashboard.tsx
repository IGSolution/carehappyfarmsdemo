import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Product, OrderItem } from "@/types/database";
import { Plus, Package, TrendingUp, Edit, Trash2 } from "lucide-react";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    unit: "",
    category: "",
    stock_quantity: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("farmer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } else {
      setProducts(data || []);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("order_items")
      .select("*, product:products(*)")
      .eq("farmer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } else {
      setOrders(data || []);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      unit: "",
      category: "",
      stock_quantity: "",
      image_url:"",
    });
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const productData = {
        farmer_id: user.id,
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        unit: productForm.unit,
        category: productForm.category,
        stock_quantity: parseInt(productForm.stock_quantity) || 0,
        image_url: productForm.image_url,
        is_available: true,
      };

      let error;

      if (editingProduct) {
        // Update existing product
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        error = updateError;
      } else {
        // Insert new product
        const { error: insertError } = await supabase
          .from("products")
          .insert(productData);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: editingProduct
          ? "Product updated successfully"
          : "Product added successfully",
      });

      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      unit: product.unit,
      category: product.category,
      stock_quantity: (product.stock_quantity || 0).toString(),
      image_url: product.image_url,
    });
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleProductAvailability = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_available: !product.is_available })
        .eq("id", product.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${
          !product.is_available ? "enabled" : "disabled"
        } successfully`,
      });

      fetchProducts();
    } catch (error: any) {
      console.error("Error updating product availability:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const totalSales = orders.reduce(
    (sum, order) => sum + order.unit_price * order.quantity,
    0
  );
  const totalOrders = orders.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Farmer Dashboard
            </h1>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Product Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Products</CardTitle>
              <Button onClick={() => setShowAddProduct(!showAddProduct)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </CardHeader>

          {showAddProduct && (
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) =>
                        setProductForm({ ...productForm, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="grains">Grains</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="meat">Meat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      placeholder="kg, pieces, bags, etc."
                      value={productForm.unit}
                      onChange={(e) =>
                        setProductForm({ ...productForm, unit: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={productForm.stock_quantity}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stock_quantity: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading
                      ? editingProduct
                        ? "Updating..."
                        : "Adding..."
                      : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Products List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No products added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className={!product.is_available ? "opacity-60" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {product.category}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ₦{product.price}/{product.unit}
                      </p>
                      <p className="text-sm">
                        Stock: {product.stock_quantity || 0}
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                          id="image_url"
                          placeholder="https://example.com/image.jpg"
                          value={productForm.image_url}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              image_url: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant={
                            product.is_available ? "destructive" : "default"
                          }
                          onClick={() => toggleProductAvailability(product)}
                          className="w-full"
                        >
                          {product.is_available ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 10).map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{order.product?.name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {order.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ₦{(order.unit_price * order.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
