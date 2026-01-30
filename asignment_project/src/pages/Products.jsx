import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    quantityStock: '',
    mrp: '',
    sellingPrice: '',
    brandName: '',
    productImage: null,
    exchangeEligibility: 'YES',
    published: false,
    imageCount: 1
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail');
    if (!storedEmail) {
      navigate('/');
    } else {
      setEmail(storedEmail);
    }

    // Load products from localStorage
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          productImage: reader.result,
          imageCount: 1
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id ? { ...formData, id: editingProduct.id } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setEditingProduct(null);
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...formData,
        published: false
      };

      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }

    // Reset form
    setFormData({
      productName: '',
      productType: '',
      quantityStock: '',
      mrp: '',
      sellingPrice: '',
      brandName: '',
      productImage: null,
      exchangeEligibility: 'YES',
      published: false,
      imageCount: 1
    });

    setShowModal(false);

    // Show success notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleTogglePublish = (id) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, published: !product.published } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      productName: '',
      productType: '',
      quantityStock: '',
      mrp: '',
      sellingPrice: '',
      brandName: '',
      productImage: null,
      exchangeEligibility: 'YES',
      published: false,
      imageCount: 1
    });
  };

  return (
    <div className="products-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span>Productr</span>
            <span className="logo-icon">🔗</span>
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>

        <nav className="sidebar-nav">
          <a href="/home" className="nav-item">
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </a>
          <a href="/products" className="nav-item active">
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="breadcrumb">
            <span className="breadcrumb-icon">🏠</span>
            <span>Products</span>
          </div>
          <div className="top-bar-right">
            <input
              type="text"
              placeholder="Search Services, Products"
              className="search-input"
            />
            <button className="add-product-navbar-btn" onClick={() => setShowModal(true)}>
              + Add Products
            </button>
            <div className="user-profile" onClick={handleLogout}>
              <div className="avatar">{email.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Products
          </button>
          <button
            className={`tab ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published
          </button>
          <button
            className={`tab ${activeTab === 'unpublished' ? 'active' : ''}`}
            onClick={() => setActiveTab('unpublished')}
          >
            Unpublished
          </button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {(() => {
            const filteredProducts = activeTab === 'all'
              ? products
              : products.filter(product =>
                  activeTab === 'published' ? product.published : !product.published
                );

            if (filteredProducts.length === 0) {
              return (
                <div className="empty-state">
                  <div className="empty-icon">
                    <div className="box-grid">
                      <div className="box"></div>
                      <div className="box"></div>
                      <div className="box add-box">+</div>
                    </div>
                  </div>
                  <h2>
                    {products.length === 0
                      ? 'Feels a little empty over here...'
                      : `No ${activeTab === 'published' ? 'Published' : 'Unpublished'} Products`}
                  </h2>
                  <p className="empty-text">
                    {products.length === 0
                      ? 'You can create products without connecting store'
                      : `Your ${activeTab === 'published' ? 'Published' : 'Unpublished'} Products will appear here`}
                  </p>
                  <p className="empty-subtext">
                    {products.length === 0
                      ? 'you can add products to store anytime'
                      : 'Create your first product to publish'}
                  </p>
                  <button className="add-products-btn" onClick={() => setShowModal(true)}>
                    Add your Products
                  </button>
                </div>
              );
            }

            return (
              <div className="products-grid-container">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card-detailed">
                    <div className="product-image-container">
                      {product.productImage ? (
                        <img src={product.productImage} alt={product.productName} className="product-image-large" />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                      <div className="image-dots">
                        {Array.from({ length: product.imageCount || 1 }).map((_, i) => (
                          <span key={i} className={`dot ${i === 0 ? 'active' : ''}`}></span>
                        ))}
                      </div>
                    </div>

                    <div className="product-info-detailed">
                      <h3 className="product-name-detailed">{product.productName}</h3>

                      <div className="product-info-row">
                        <span className="info-label">Product type -</span>
                        <span className="info-value">{product.productType}</span>
                      </div>

                      <div className="product-info-row">
                        <span className="info-label">Quantity Stock -</span>
                        <span className="info-value">{product.quantityStock}</span>
                      </div>

                      <div className="product-info-row">
                        <span className="info-label">MRP -</span>
                        <span className="info-value">₹ {product.mrp}</span>
                      </div>

                      <div className="product-info-row">
                        <span className="info-label">Selling Price -</span>
                        <span className="info-value">₹ {product.sellingPrice}</span>
                      </div>

                      <div className="product-info-row">
                        <span className="info-label">Brand Name -</span>
                        <span className="info-value">{product.brandName}</span>
                      </div>

                      <div className="product-info-row">
                        <span className="info-label">Total Number of images -</span>
                        <span className="info-value">{product.imageCount || 1}</span>
                      </div>

                      <div className="product-info-row">
                        <span className="info-label">Exchange Eligibility -</span>
                        <span className="info-value">{product.exchangeEligibility}</span>
                      </div>

                      <div className="product-actions">
                        <button
                          className={`action-btn ${product.published ? 'unpublish-btn' : 'publish-btn'}`}
                          onClick={() => handleTogglePublish(product.id)}
                        >
                          {product.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button className="action-btn edit-btn" onClick={() => handleEditProduct(product)}>
                          Edit
                        </button>
                        <button className="action-btn delete-icon-btn" onClick={() => handleDeleteProduct(product.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </main>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="CakeZone Walnut Brownie"
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select product type</option>
                  <option value="Food">Food</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity Stock</label>
                <input
                  type="number"
                  name="quantityStock"
                  value={formData.quantityStock}
                  onChange={handleInputChange}
                  placeholder="Total numbers of Stock available"
                  required
                />
              </div>

              <div className="form-group">
                <label>MRP</label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  placeholder="Total numbers of Stock available"
                  required
                />
              </div>

              <div className="form-group">
                <label>Selling Price</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  placeholder="Total numbers of Stock available"
                  required
                />
              </div>

              <div className="form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  placeholder="Total numbers of Stock available"
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload Product Images</label>
                <div className="upload-area">
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="productImage" className="upload-label">
                    <span className="upload-text">Enter Description</span>
                    <button type="button" className="browse-btn" onClick={() => document.getElementById('productImage').click()}>
                      Browse
                    </button>
                  </label>
                  {formData.productImage && (
                    <p className="file-name">Image uploaded ✓</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Exchange or return eligibility</label>
                <select
                  name="exchangeEligibility"
                  value={formData.exchangeEligibility}
                  onChange={handleInputChange}
                >
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>

              <button type="submit" className="submit-btn">
                {editingProduct ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showNotification && (
        <div className="notification success-notification">
          <span className="notification-icon">✓</span>
          <span>Product added Successfully</span>
          <button className="notification-close" onClick={() => setShowNotification(false)}>×</button>
        </div>
      )}
    </div>
  );
};

export default Products;
