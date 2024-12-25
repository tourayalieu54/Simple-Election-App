import { useState } from "react";

const initialProducts = [
    {
        id: 1,
        name: "Apple iPhone 14 Pro",
        description: "High-end smartphone with advanced camera and display.",
        price: 999,
        category: "Electronics",
        imageUrl: "https://images.pexels.com/photos/16004744/pexels-photo-16004744/free-photo-of-apple-iphone-14-pro-max-mobile-phone.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
        id: 2,
        name: "Samsung Galaxy S23",
        description: "Feature-packed Android phone with premium build quality.",
        price: 899,
        category: "Electronics",
        imageUrl: "https://images.pexels.com/photos/15493878/pexels-photo-15493878/free-photo-of-hands-on-samsung-galaxy-s23-ultra-5g-green-color-mention-zana_qaradaghy-on-instagram-while-use-this-photo-follow-on-instagram-zana_qaradaghy.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
        id: 3,
        name: "Data Structure and Algorithms",
        description: "Comprehensive guide for mastering data structures.",
        price: 17.99,
        category: "Books",
        imageUrl: "https://rukminim2.flixcart.com/image/750/900/xif0q/regionalbooks/m/s/c/data-structures-algorithms-in-java-old-used-book-original-imagvn2nptaxrnrh.jpeg?q=20&crop=false",
    },
    {
        id: 4,
        name: "Data Engineering",
        description: "Detailed book on data engineering principles and techniques.",
        price: 19.99,
        category: "Books",
        imageUrl: "https://imgs.search.brave.com/ws5w2mDdnTF4MrssCCqCHjRaXPCkN8uBnT-ituFz6Mc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzYxa3E5MEtHOFBM/LmpwZw",
    },
    {
        id: 5,
        name: "Nike Air Max 270",
        description: "Stylish and comfortable sports footwear.",
        price: 150,
        category: "Clothing",
        imageUrl: "https://imgs.search.brave.com/bR_cSLa1-LcR-dBS0nEUJJ5qsaqKxiilcswNhGYIkmo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFRalVFbDlFNEwu/anBn",
    },
    {
        id: 6,
        name: "African Haftan",
        description: "Elegant and traditional African clothing.",
        price: 180,
        category: "Clothing",
        imageUrl: "https://imgs.search.brave.com/lY-ury2qnn63zqh7STUkcv1baFLzLt6bvKfTzM58Nm4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2U3LzAw/L2M2L2U3MDBjNjU0/MTViYTVmZDgwMTMw/MDFlZTQ2ZjQ5ODI1/LmpwZw",
    },
    {
        id: 7,
        name: "Sony WH-1000XM5",
        description: "Noise-cancelling wireless headphones.",
        price: 399,
        category: "Accessories",
        imageUrl: "https://imgs.search.brave.com/6OzI98ydHotIVTTt7E5AnZsuBEoFc07SMm8ju0JW65o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzUxWjBsR2NJeDhM/LmpwZw",
    },
    {
        id: 8,
        name: "Apple AirPods Pro",
        description: "Compact and high-quality wireless earbuds.",
        price: 249,
        category: "Accessories",
        imageUrl: "https://imgs.search.brave.com/rusyyVGjd08Sinl1EFnVZJgg-z4Dt40TH615oNGK6zM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YXBwbGUuY29tL3Yv/YWlycG9kcy00L2Iv/aW1hZ2VzL292ZXJ2/aWV3L3N0b3JpZXMv/ZGVzaWduX2FpcnBv/ZHNfb3V0c2lkZV9f/ZGU1MDBuZWF1a2dp/X2xhcmdlLmpwZw",
    },
    {
        id: 9,
        name: "KitchenAid Stand Mixer",
        description: "Versatile stand mixer for baking and cooking.",
        price: 499,
        category: "Home Appliances",
        imageUrl: "https://images.pexels.com/photos/1450903/pexels-photo-1450903.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
        id: 10,
        name: "Dyson V11 Vacuum Cleaner",
        description: "High-performance cordless vacuum cleaner.",
        price: 599,
        category: "Home Appliances",
        imageUrl: "https://images.pexels.com/photos/6196694/pexels-photo-6196694.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
];

export default function Products() {
    const [searchTerm, setSearchTerm] = useState("");
    const [maxPrice, setMaxPrice] = useState(1000);
    const [minPrice, setMinPrice] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState(["All"]);

    const categories = ["All", ...new Set(initialProducts.map(product => product.category))];

    const handleCategoryChange = (category) => {
        if (category === "All") {
            setSelectedCategories(["All"]);
        } else {
            setSelectedCategories((prev) =>
                prev.includes(category) ? prev.filter(c => c !== category) : [...prev.filter(c => c !== "All"), category]
            );
        }
    };

    const filteredProducts = initialProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const withinPriceRange = product.price >= minPrice && product.price <= maxPrice;
        const matchesCategory =
            selectedCategories.includes("All") || selectedCategories.includes(product.category);
        return matchesSearch && withinPriceRange && matchesCategory;
    });

    return (
        <div className="container my-4">
            <h1 className="mb-4">Welcome to Niatota Selling Platform</h1>
            <h2>Here are the products we offer</h2>
            <hr className="bg-primary" style={{ height: "4px", border: "none" }} />
            <h4 className="mb-3">Consider utilizing the search and sliders based on your product of interest and price constraints</h4>
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <input
                        type="text"
                        placeholder="Search by name or description"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label><b>Minimum Price: ${minPrice}</b></label>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={minPrice}
                        onChange={e => setMinPrice(Number(e.target.value))}
                        className="form-range"
                    />
                </div>
                <div className="col-md-4">
                    <label><b>Maximum Price: ${maxPrice}</b></label>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={maxPrice}
                        onChange={e => setMaxPrice(Number(e.target.value))}
                        className="form-range"
                    />
                </div>
            </div>
            <div className="mb-3">
                <label><b>Filter by Category:</b></label>
                <div className="d-flex flex-wrap">
                    {categories.map(category => (
                        <div key={category} className="form-check me-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            <label className="form-check-label" htmlFor={category}>
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="row">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
                            <div className="card h-100">
                                <img src={product.imageUrl} className="card-img-top" alt={product.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">{product.description}</p>
                                    <p className="card-text">Category: {product.category}</p>
                                    <p className="card-text">Price: ${product.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <h2>No products found.</h2>
                        <h3>Be carefull not to abuse the sliders and searching</h3>
                        <h4>For example:</h4>
                        <ul>
                            <li>Making the minimum price to be 0, would obviously return no result</li>
                            <li>Wrong spellings might lead to zero match, and therefore zero product listings</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
