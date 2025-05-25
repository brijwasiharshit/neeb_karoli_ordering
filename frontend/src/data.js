const FoodItem = require("./models/FoodItem"); // Import the model

const saveFoodItem = async () => {
  try {
    // Create a new food item
    const newFoodItem = new FoodItem({
      name: "Pizza",
      description: "Delicious cheesy pizza",
      price: 12.99,
      category: "Main Course",
    });

    // Save the document to the database
    const savedFoodItem = await newFoodItem.save();

    console.log("✅ Food Item Saved:", savedFoodItem);
  } catch (err) {
    console.error("❌ Error saving food item:", err);
  }
};

saveFoodItem(); // Call the function to save data
