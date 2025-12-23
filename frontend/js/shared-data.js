const LogiTrackShared = {
    // Mock data storage
    mockOrders: {},
    searchHistory: [],

    // Random data generators
    getRandomStatus() {
        const statuses = ['processing', 'in transit', 'out for delivery', 'delivered', 'pending', 'dispatched'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    },

    getRandomDate() {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 14); // Random date within next 14 days
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },

    getRandomAddress() {
        const streets = [
            'A-12 Sector 62', '123 MG Road', 'B-45 Connaught Place',
            '78 Park Street', '15 Civil Lines', 'D-8 Rajouri Garden',
            '234 Salt Lake', '56 Jubilee Hills', '90 Bandra West'
        ];
        const cities = [
            'New Delhi', 'Mumbai', 'Bangalore',
            'Chennai', 'Kolkata', 'Hyderabad',
            'Pune', 'Ahmedabad', 'Jaipur'
        ];
        const states = [
            'Delhi', 'Maharashtra', 'Karnataka',
            'Tamil Nadu', 'West Bengal', 'Telangana',
            'Maharashtra', 'Gujarat', 'Rajasthan'
        ];
        const pincodes = [
            '110001', '400001', '560001',
            '600001', '700001', '500001',
            '411001', '380001', '302001'
        ];

        const index = Math.floor(Math.random() * streets.length);
        return {
            street: streets[index],
            city: cities[index],
            state: states[index],
            pincode: pincodes[index],
            landmark: this.getRandomLandmark()
        };
    },

    getRandomLandmark() {
        const landmarks = [
            'Near Metro Station',
            'Opposite City Mall',
            'Behind Post Office',
            'Near Railway Station',
            'Next to Government Hospital',
            'Near Bus Stand',
            'Opposite Police Station',
            'Near Public Park',
            'Behind Main Market'
        ];
        return landmarks[Math.floor(Math.random() * landmarks.length)];
    },

    getRandomName() {
        const firstNames = [
            'Rahul', 'Priya', 'Amit', 'Neha',
            'Raj', 'Anjali', 'Vikram', 'Meera',
            'Arun', 'Pooja', 'Sanjay', 'Deepa'
        ];
        const lastNames = [
            'Sharma', 'Patel', 'Kumar', 'Singh',
            'Verma', 'Gupta', 'Reddy', 'Joshi',
            'Malhotra', 'Shah', 'Mehta', 'Kapoor'
        ];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    },

    getRandomPrice() {
        // Random price between ₹500 and ₹15000
        return Math.floor(Math.random() * 14500 + 500);
    },

    getRandomItems() {
        const items = [
            { name: 'Smartphone', priceRange: [15000, 45000] },
            { name: 'Laptop', priceRange: [35000, 85000] },
            { name: 'Headphones', priceRange: [1500, 8000] },
            { name: 'Smart Watch', priceRange: [3000, 12000] },
            { name: 'Tablet', priceRange: [12000, 35000] },
            { name: 'Power Bank', priceRange: [800, 2500] },
            { name: 'Bluetooth Speaker', priceRange: [1200, 5000] },
            { name: 'Camera', priceRange: [25000, 65000] },
            { name: 'Gaming Console', priceRange: [25000, 50000] },
            { name: 'Wireless Earbuds', priceRange: [2000, 8000] }
        ];

        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items
        const selectedItems = [];

        for (let i = 0; i < quantity; i++) {
            const item = items[Math.floor(Math.random() * items.length)];
            const price = Math.floor(Math.random() * (item.priceRange[1] - item.priceRange[0])) + item.priceRange[0];
            selectedItems.push({
                name: item.name,
                quantity: Math.floor(Math.random() * 2) + 1,
                price: price,
                discount: Math.floor(Math.random() * 20) + 5 // 5-25% discount
            });
        }
        return selectedItems;
    },

    getRandomPaymentMethod() {
        const methods = [
            'UPI', 'Credit Card', 'Debit Card',
            'Net Banking', 'Cash on Delivery',
            'EMI', 'Wallet'
        ];
        return methods[Math.floor(Math.random() * methods.length)];
    },

    calculateTotalAmount(items) {
        let total = 0;
        items.forEach(item => {
            const discountedPrice = item.price - (item.price * item.discount / 100);
            total += discountedPrice * item.quantity;
        });
        return Math.round(total);
    },

    // Main function to get shipment details
    getShipmentDetails(searchId, searchType) {
        // Generate tracking ID if order ID is provided, or vice versa
        const orderId = searchType === 'order' ? searchId : `ORD-${Math.random().toString(36).substr(2, 8)}`;
        const trackingId = searchType === 'tracking' ? searchId : `TRK-${Math.random().toString(36).substr(2, 8)}`;

        const status = this.getRandomStatus();
        const estimatedDelivery = this.getRandomDate();
        const items = this.getRandomItems();

        return {
            orderId: orderId,
            trackingId: trackingId,
            status: status,
            estimatedDelivery: estimatedDelivery,
            items: items,
            totalAmount: this.calculateTotalAmount(items),
            shippingAddress: this.getRandomAddress(),
            recipientName: this.getRandomName(),
            recipientPhone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`, // 10 digit Indian phone number
            orderDate: new Date(estimatedDelivery.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            lastUpdate: new Date(),
            carrier: ['BlueDart', 'DTDC', 'Delhivery', 'India Post', 'FedEx India'][Math.floor(Math.random() * 5)],
            shippingMethod: ['Standard', 'Express', 'Priority', 'Same Day'][Math.floor(Math.random() * 4)],
            paymentMethod: this.getRandomPaymentMethod(),
            shippingCost: Math.floor(Math.random() * 200) + 50, // ₹50-250 shipping cost
            gst: 18, // 18% GST
            orderNotes: 'Handle with care',
            expectedDeliveryTime: `${Math.floor(Math.random() * 11) + 1}:00 ${Math.random() < 0.5 ? 'AM' : 'PM'}`
        };
    },

    // Function to save to search history
    saveToGlobalSearchHistory(searchData) {
        const history = JSON.parse(localStorage.getItem('globalSearchHistory') || '[]');
        history.unshift({
            id: searchData.searchValue,
            trackingId: searchData.orderDetails.trackingId,
            status: searchData.orderDetails.status,
            searchDate: searchData.timestamp
        });

        // Keep only last 20 searches
        if (history.length > 20) {
            history.pop();
        }

        localStorage.setItem('globalSearchHistory', JSON.stringify(history));
    },

    // Function to get mock orders (can be empty as we're generating random data)
    getMockOrders() {
        return this.mockOrders;
    }
};
