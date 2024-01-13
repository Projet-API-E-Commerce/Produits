const verifyToken = async (token) => {
  try {
    const authResponse = await fetch("A CHANGER", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!authResponse.ok) {
      throw new Error("Invalid token");
    }

    const userData = await authResponse.json();

    if (userData.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return userData;
  } catch (error) {
    throw new Error("Invalid token or unauthorized");
  }
};

const checkOrder = async (userId, productId) => {
  try {
    const orderResponse = await fetch("A CHANGER", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId }),
    });

    if (!orderResponse.ok) {
      throw new Error("Product not found in user's orders");
    }

    const orderData = await orderResponse.json();

    if (!orderData || orderData.length === 0) {
      throw new Error("Product not found in user's orders");
    }

    return orderData;
  } catch (error) {
    throw new Error("Product not found in user's orders");
  }
};

module.exports = {
  verifyToken,
  checkOrder,
};
