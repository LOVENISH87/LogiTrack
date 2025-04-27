// function getShipmentDetails(searchId, searchType) {
//     const mockOrders = getMockOrders();

//     let shipmentDetails;
//     if (searchType === 'tracking') {
//         const trackingInfo = mockOrders['tracking'][searchId];
//         if (trackingInfo) {
//             shipmentDetails = mockOrders['order'][trackingInfo.order_id];
//         }
//     } else {
//         shipmentDetails = mockOrders['order'][searchId];
//     }

//     // Generate a simulated one if not found
//     if (!shipmentDetails) {
//         const randomNames = [
//             "Aarav Sharma", "Vivaan Patel", "Aditya Rao", "Krishna Menon", "Aryan Desai", "Saanvi Mehta",
//             "Ishaan Kapoor", "Avni Joshi", "Riya Reddy", "Kabir Sinha", "Zoya Ali", "Rudra Bansal",
//             "Tanya Malhotra", "Atharv Gupta", "Kavya Shah", "Diya Nair", "Yash Mishra", "Meher Singh",
//             "Anaya Goyal", "Ayaan Chaudhary"
//         ];

//         const addresses = [
//             "42 Tech Street", "11 Green Avenue", "56 Rosewood Residency", "9 Sky Towers", "14 Sunrise Apartments",
//             "101 Urban Square", "305 Maple Residency", "71 Hilltop Road", "202 Oak Villas", "19 Horizon Enclave"
//         ];

//         const cities = ["Bangalore", "Delhi", "Mumbai", "Pune", "Hyderabad", "Chennai", "Ahmedabad", "Jaipur"];
//         const states = ["Karnataka", "Maharashtra", "Tamil Nadu", "Gujarat", "Rajasthan", "Punjab", "Uttar Pradesh"];

//         const products = [
//             { name: "Smart Watch", description: "Fitness tracker with heart rate monitor", price: 1799 },
//             { name: "Wireless Earbuds", description: "Bluetooth earbuds with charging case", price: 1599 },
//             { name: "LED Ring Light", description: "12-inch ring light for selfies and streaming", price: 1099 },
//             { name: "Webcam", description: "HD USB webcam with built-in mic", price: 1499 },
//             { name: "USB-C Hub", description: "5-in-1 USB-C hub with HDMI and USB 3.0", price: 1399 },
//             { name: "Phone Stand", description: "Adjustable phone stand for desk", price: 349 },
//             { name: "Bluetooth Speaker", description: "Portable wireless speaker", price: 899 },
//             { name: "Laptop Cooling Pad", description: "USB powered fan cooling pad", price: 799 },
//             { name: "Gaming Mouse", description: "RGB optical wired gaming mouse", price: 999 },
//             { name: "Graphic Tablet", description: "Digital drawing tablet for artists", price: 2599 }
//         ];

//         const statuses = ['processing', 'delivered', 'returned'];

//         const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
//         const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
//         const randomCity = cities[Math.floor(Math.random() * cities.length)];
//         const randomState = states[Math.floor(Math.random() * states.length)];
//         const randomPhone = '9' + Math.floor(100000000 + Math.random() * 900000000); // 9XXXXXXXXX
//         const product = products[Math.floor(Math.random() * products.length)];
//         const status = statuses[Math.floor(Math.random() * statuses.length)];

//         shipmentDetails = {
//             status: status,
//             total_amount: product.price,
//             order_date: new Date().toISOString().split('T')[0],
//             customer: {
//                 name: randomName,
//                 address: randomAddress,
//                 city: randomCity,
//                 state: randomState,
//                 postal_code: Math.floor(100000 + Math.random() * 899999).toString(),
//                 phone: randomPhone
//             },
//             shipments: [
//                 {
//                     number: 1,
//                     total_shipments: 1,
//                     amount: product.price,
//                     items_count: 1,
//                     status: status,
//                     tracking_id: searchId,
//                     product_name: product.name,
//                     product_description: product.description
//                 }
//             ]
//         };
//     }

//     return shipmentDetails;
// }


function getGlobalSearchHistory() {
    try {
        return JSON.parse(localStorage.getItem('globalSearchHistory') || '[]');
    } catch (error) {
        console.error('Error retrieving global search history:', error);
        return [];
    }
}

function saveToGlobalSearchHistory(historyEntry) {
    try {
        const searchHistory = getGlobalSearchHistory();
        const existingIndex = searchHistory.findIndex(item =>
            item.searchValue === historyEntry.searchValue &&
            item.searchType === historyEntry.searchType
        );
        if (existingIndex !== -1) searchHistory.splice(existingIndex, 1);
        searchHistory.unshift(historyEntry);
        if (searchHistory.length > 20) searchHistory.pop();
        localStorage.setItem('globalSearchHistory', JSON.stringify(searchHistory));
        return true;
    } catch (error) {
        console.error('Error saving to global search history:', error);
        return false;
    }
}

function getMockOrders() {
    return { order: {}, tracking: {} };
}

// YOUR UPDATED GETSHIPMENTDETAILS GOES HERE 👇
function getShipmentDetails(searchId, searchType) {
    const mockOrders = getMockOrders();
    let shipmentDetails;

    if (searchType === 'tracking') {
        const trackingInfo = mockOrders['tracking'][searchId];
        if (trackingInfo) {
            shipmentDetails = mockOrders['order'][trackingInfo.order_id];
        }
    } else {
        shipmentDetails = mockOrders['order'][searchId];
    }

    if (!shipmentDetails) {
        const randomNames = ["Aarav Sharma", "Saanvi Mehta", "Vivaan Patel"];
        const addresses = ["42 Tech Street", "56 Rosewood Residency", "305 Maple Residency"];
        const cities = ["Bangalore", "Delhi", "Mumbai"];
        const states = ["Karnataka", "Maharashtra", "Tamil Nadu"];
        const products = [
            { name: "Smart Watch", description: "Fitness tracker with heart rate monitor", price: 1799 },
            { name: "Wireless Earbuds", description: "Bluetooth earbuds with charging case", price: 1499 },
            { name: "USB-C Hub", description: "5-in-1 USB-C hub with HDMI", price: 1399 }
        ];
        const statuses = ['processing', 'delivered', 'returned'];

        const product = products[Math.floor(Math.random() * products.length)];
        shipmentDetails = {
            status: statuses[Math.floor(Math.random() * statuses.length)],
            total_amount: product.price,
            order_date: new Date().toISOString().split('T')[0],
            customer: {
                name: randomNames[Math.floor(Math.random() * randomNames.length)],
                address: addresses[Math.floor(Math.random() * addresses.length)],
                city: cities[Math.floor(Math.random() * cities.length)],
                state: states[Math.floor(Math.random() * states.length)],
                postal_code: Math.floor(100000 + Math.random() * 900000),
                phone: '9' + Math.floor(100000000 + Math.random() * 900000000)
            },
            shipments: [
                {
                    number: 1,
                    total_shipments: 1,
                    amount: product.price,
                    items_count: 1,
                    status: 'processing',
                    tracking_id: searchId,
                    product_name: product.name,
                    product_description: product.description,
                    origin: cities[Math.floor(Math.random() * cities.length)],
                    destination: cities[Math.floor(Math.random() * cities.length)],
                    estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    last_updated: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        };
    }

    return shipmentDetails;
}

// Export for global use
window.LogiTrackShared = {
    getGlobalSearchHistory,
    saveToGlobalSearchHistory,
    getMockOrders,
    getShipmentDetails
};

