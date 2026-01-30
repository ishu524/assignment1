import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('published');
  const [products, setProducts] = useState([]);
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

  return (
    <div className="home-container">
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
          <a href="/home" className="nav-item active">
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </a>
          <a href="/products" className="nav-item">
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="user-profile" onClick={handleLogout}>
            <div className="avatar">{email.charAt(0).toUpperCase()}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
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
            const filteredProducts = products.filter(product =>
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
                  <h2>{activeTab === 'published' ? 'No Published Products' : 'No Unpublished Products'}</h2>
                  <p className="empty-text">Your {activeTab === 'published' ? 'Published' : 'Unpublished'} Products will appear here</p>
                  <p className="empty-subtext">Create your first product to publish</p>
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
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
};

export default Home;
