const express = require("express");
const router = express.Router();
const foodItem = require("../models/foodItem");
const Category = require("../models/category");
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
router.get("/foodData", async (req, res) => {
  try {
   

    const foodItems = await foodItem.find({ isAvailable: true });
 
    const foodCategories = await Category.find();

    if (foodItems.length === 0) {
      return res.status(404).json({ error: "No food items found" });
    }

    res.status(200).json({
      foodItems,
      foodCategories,
    });
  
    console.log("✅ Food data fetched successfully!");
  } catch (error) {
    console.error("❌ Error fetching food data:", error);
    res.status(500).json({
      error: "Server error",
      ...(process.env.NODE_ENV === "development" && { details: error.message }),
    });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories || categories.length === 0) {
      return res.status(404).json({ error: "No categories found" });
    }

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});


router.post('/sendOrderNotification', async (req, res) => {
    try {
        const order = req.body;

        // Basic validation
        if (!order || !order.items || !Array.isArray(order.items) || !order.customer) {
            return res.status(400).json({ success: false, error: 'Invalid order data.' });
        }

        const { items, customer, total, orderId } = order;

        // Format order items
        const itemsText = items.map(item => {
            const name = item.name || 'Unnamed Item';
            const option = item.option || 'N/A';
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            const lineTotal = quantity * price;

            return `➤ ${name} (${option}) - ${quantity} × ₹${price} = ₹${lineTotal}`;
        }).join('\n');

        // Format WhatsApp message
        const messageBody =
            `📦 *New Order Received!* 📦\n\n` +
            `🆔 *Order ID:* ${orderId || 'N/A'}\n` +
            `👤 *Customer:* ${customer.name || 'N/A'}\n` +
            `📱 *Phone:* ${customer.phone || 'N/A'}\n` +
            `🏠 *Address:* ${customer.address || 'N/A'}\n\n` +
            `📝 *Order Items:*\n${itemsText}\n\n` +
            `💰 *Total Amount:* ₹${(total || 0).toFixed(2)}\n\n` +
            `Thank you for the order! 🙏`;

        // Send WhatsApp message
        const message = await client.messages.create({
            body: messageBody,
            from: 'whatsapp:+14155238886', // Twilio sandbox number
            to: 'whatsapp:+919411336893'   // Replace with actual destination number
        });

        res.status(200).json({ success: true, messageSid: message.sid });
    } catch (error) {
        console.error('WhatsApp notification failed:', error);
        res.status(500).json({ success: false, error: 'Failed to send WhatsApp message.' });
    }
});

module.exports = router;