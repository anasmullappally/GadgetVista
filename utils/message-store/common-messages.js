export const fieldEmptyMessages = {
  name: "Please provide a first name.",
  email: "Please provide an email address.",
  password: "Please provide a password.",
  phoneNumber: "Please provide a phone number.",
  productName: "Please provide a Product name.",
  category: "Please provide a category",
  brand: "Please provide a brand",
  description: "Please provide a description",
  accessories: "Please provide a accessories",
  color: "Please provide a color",
  colorCode: "Please provide a  code",
  warrantyInfo: "Please provide a warranty Info",
  ram: "Please provide ram details",
  rom: "Please provide rom details",
  mrp: "Please provide mrp details",
  price: "Please provide price details",
  quantity: "Please provide quantity details",
  shippingCharge: "Please provide shippingCharge details",
};

export const fieldInvalidMessages = {
  dateOfBirth: "Invalid date format",
  name: "Invalid input for name.",
  email: "Invalid email format.",
  password: "Invalid input for password",
  phoneNumber: "Invalid phone number.",
  productName: "Invalid product name",
  category: "Invalid category",
  brand: "Invalid brand",
  description: "Invalid description",
  accessories: "Invalid accessories",
  color: "Invalid color",
  colorCode: "Invalid color code",
  warrantyInfo: "Invalid warranty Info",
};

export const fieldRequiredMessages = {
  dateOfBirth: "Date of birth is required",
  name: "first name is required.",
  email: "email is required.",
  password: "Password is required.",
  phoneNumber: "Phone number is required.",
  productName: "Product Name is required",
  category: "Category is required",
  brand: "Brand is required",
  description: "Description is required",
  accessories: "Accessories is required",
  color: "Color is required",
  colorCode: "Color code is required",
  warrantyInfo: "Warranty Info is required",
  ram: "Ram is required",
  rom: "Rom is required",
  mrp: "MRP is required",
  price: "Price is required",
  quantity: "Quantity is required",
  shippingCharge: "Shipping Charge is required",
  variant: "variant is required",
  colors: "Colors is required",
  releaseDate: "Date is required."
};

export const fieldPatternMessages = {
  name:
    "Invalid first name format. Please use only letters, hyphens, or apostrophes.",
  email: "email is required.",
  password:
    "Password should be 6-30 characters and contain letters, numbers, and special characters.",
  phoneNumber: "Invalid phone number format. Please enter a 10-digit number.",
  category: "Category must be laptop or mobile",
  ram: "Ram must be a positive number",
  rom: "ROM must be a positive number",
  mrp: "MRP must be a positive number",
  price: "Price must be a positive number",
  shippingCharge: "Shipping Charge must be a positive number",
  quantity: "Quantity must be a positive number",
  releaseDate: "Date must be in ISO date format (YYYY-MM-DD).",
};

export const fieldMaxMessages = {
  dateOfBirth: "Date of birth cannot be in the future.",
};

export const fieldBaseMessages = {
  ram: "Ram must be Number",
  rom: "ROM must be Number",
  mrp: "MRP must be Number",
  price: "Price must be Number",
  quantity: "Quantity must be Number",
  shippingCharge: "Shipping Charge must be Number",
  releaseDate: "Date must be a valid date.",
}

export const fieldMinMessages = {
  ram: "Ram can not be less than 2",
  rom: "ROM can not be less than 2",
  mrp: "MRP can not be less than 2",
  price: "Price can not be less than 2",
  quantity: "Quantity can not be less than 2",
  colors: "Minimum One color is required",
  variant: "Minimum One variant is required",
}

export const fieldMaxMessage = {
  shippingCharge: "Shipping charge must be less than or equal to 100",
  releaseDate: "Date must be in the future."
}
