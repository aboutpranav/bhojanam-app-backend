const express = require("express");
const app = express();

const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect");

// const fs = require("fs");

const Food = require("./models/food.model");
const User = require("./models/user.model");
const Address = require("./models/address.model");
const Order = require("./models/order.model");

app.use(express.json());

initializeDatabase();

// const jsonData = fs.readFileSync("foodItems.json", "utf-8");

// const foodItemsData = JSON.parse(jsonData);

function seedData() {
  try {
    for (const foodItemData of foodItemsData) {
      const newFoodItem = new Food({
        name: foodItemData.name,
        image: foodItemData.image,
        price: foodItemData.price,
        rating: foodItemData.rating,
        description: foodItemData.description,
        category: foodItemData.category,
      });

      newFoodItem.save();
    }
  } catch (error) {
    console.log("Error seeding the data", error);
  }
}

// seedData();

// -->> API routes for Food Items

// get all food items from the database

async function readAllFoodItems() {
  try {
    const allFoodItems = await Food.find();

    return allFoodItems;
  } catch (error) {
    console.log(error);
  }
}

app.get("/foodItems", async (req, res) => {
  try {
    const foodItems = await readAllFoodItems();

    if (foodItems.length != 0) {
      res.json(foodItems);
    } else {
      res.status(404).json({ error: "No food items found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food items." });
  }
});

// create a new food item

async function createFoodItem(newFoodItem) {
  try {
    const foodItem = new Food(newFoodItem);

    const saveFoodItem = await foodItem.save();

    return saveFoodItem;
  } catch (error) {
    throw error;
  }
}

app.post("/foodItems", async (req, res) => {
  try {
    const savedFoodItem = await createFoodItem(req.body);

    res.status(201).json({
      message: "Food Item added successfully.",
      foodItem: savedFoodItem,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add food item." });
  }
});

// delete a food item

async function deleteFoodItem(foodItemId) {
  try {
    const deletedFoodItem = await Food.findByIdAndDelete(foodItemId);

    return deletedFoodItem;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/foodItems/:foodItemId", async (req, res) => {
  try {
    const deletedFoodItem = await deleteFoodItem(req.params.foodItemId);

    if (deletedFoodItem) {
      res.status(200).json({ message: "Food Item deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete food item." });
  }
});

// update data of a food item

async function updateFoodItem(foodItemId, dataToUpdate) {
  try {
    const updatedFoodItem = await Food.findByIdAndUpdate(
      foodItemId,
      dataToUpdate,
      { new: true }
    );

    return updatedFoodItem;
  } catch (error) {
    console.log("Error in updating Food Item data", error);
  }
}

app.post("/foodItems/:foodItemId", async (req, res) => {
  try {
    const updatedFoodItem = await updateFoodItem(
      req.params.foodItemId,
      req.body
    );

    if (updatedFoodItem) {
      res.status(200).json({
        message: "Food Item updated successfully.",
        updatedFoodItem: updatedFoodItem,
      });
    } else {
      res.status(404).json({ error: "Food Item not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to updated Food Item." });
  }
});

// -->> API routes for address

// get all saved addresses from the database

async function readAllAddresses() {
  try {
    const allAddresses = await Address.find();

    return allAddresses;
  } catch (error) {
    console.log(error);
  }
}

app.get("/addresses", async (req, res) => {
  try {
    const addresses = await readAllAddresses();

    if (addresses.length != 0) {
      res.json(addresses);
    } else {
      res.status(404).json({ error: "No addresses found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch addresses." });
  }
});

// create a new address

async function createAddress(newAddress) {
  try {
    const address = new Address(newAddress);

    const saveAddress = await address.save();

    return saveAddress;
  } catch (error) {
    throw error;
  }
}

app.post("/addresses", async (req, res) => {
  try {
    const savedAddress = await createAddress(req.body);

    res.status(201).json({
      message: "Address added successfully.",
      address: savedAddress,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add address." });
  }
});

// delete a address

async function deleteAddress(addressId) {
  try {
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    return deletedAddress;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/addresses/:addressId", async (req, res) => {
  try {
    const deletedAddress = await deleteAddress(req.params.addressId);

    if (deletedAddress) {
      res.status(200).json({ message: "Address deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete address." });
  }
});

// update address

async function updateAddress(addressId, dataToUpdate) {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      dataToUpdate,
      { new: true }
    );

    return updatedAddress;
  } catch (error) {
    console.log("Error in updating Address data", error);
  }
}

app.post("/addresses/:addressId", async (req, res) => {
  try {
    const updatedAddress = await updateAddress(req.params.addressId, req.body);

    if (updatedAddress) {
      res.status(200).json({
        message: "Address updated successfully.",
        updatedAddress: updatedAddress,
      });
    } else {
      res.status(404).json({ error: "Address not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to updated address." });
  }
});

// -->> API routes for Orders

// Create a new order

async function createOrder(newOrderData) {
  try {
    // Count total orders to generate a new order number
    const count = await Order.countDocuments();
    const orderNumber = `ORD${String(count + 1).padStart(6, "0")}`;

    const order = new Order({ ...newOrderData, orderNumber });
    const savedOrder = await order.save();
    return savedOrder;
  } catch (error) {
    throw error;
  }
}

app.post("/orders", async (req, res) => {
  try {
    const savedOrder = await createOrder(req.body);
    res.status(201).json({
      message: "Order placed successfully.",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to place order." });
  }
});

// Get all orders
async function getAllOrders() {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    console.log("Error fetching orders:", error);
    throw error;
  }
}

app.get("/orders", async (req, res) => {
  try {
    const orders = await getAllOrders();
    if (orders.length > 0) {
      res.json(orders);
    } else {
      res.status(404).json({ error: "No orders found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// Get order by ID
async function getOrderById(orderId) {
  try {
    const order = await Order.findById(orderId);
    return order;
  } catch (error) {
    console.log("Error fetching order:", error);
    throw error;
  }
}

app.get("/orders/:orderId", async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order." });
  }
});

// Update order status
async function updateOrderStatus(orderId, statusUpdate) {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, statusUpdate, {
      new: true,
    });
    return updatedOrder;
  } catch (error) {
    console.log("Error updating order status:", error);
    throw error;
  }
}

app.patch("/orders/:orderId", async (req, res) => {
  try {
    const updatedOrder = await updateOrderStatus(req.params.orderId, req.body);
    if (updatedOrder) {
      res.status(200).json({
        message: "Order updated successfully.",
        order: updatedOrder,
      });
    } else {
      res.status(404).json({ error: "Order not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update order." });
  }
});

// Get orders by customer email (for order history)
async function getOrdersByEmail(email) {
  try {
    const decodedEmail = decodeURIComponent(email);

    console.log("Searching for orders with email:", decodedEmail); // Debug log

    const orders = await Order.find({
      "customerInfo.email": decodedEmail,
    }).sort({ createdAt: -1 });

    console.log("Found orders:", orders.length); // Debug log

    return orders;
  } catch (error) {
    console.log("Error fetching customer orders:", error);
    throw error;
  }
}

app.get("/orders/customer/:email", async (req, res) => {
  try {
    const orders = await getOrdersByEmail(req.params.email);
    if (orders.length > 0) {
      res.json(orders);
    } else {
      res.status(404).json({ error: "No orders found for this customer." });
    }
  } catch (error) {
    console.error("Error in /orders/customer/:email route:", error);
    res.status(500).json({ error: "Failed to fetch customer orders." });
  }
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
