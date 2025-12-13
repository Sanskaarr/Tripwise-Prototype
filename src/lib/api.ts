export interface TravelOption {
  id: string;
  type: "train" | "flight" | "bus";
  name: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  class: string;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  image: string;
}

export interface LocalGuideData {
  attractions: { name: string; description: string; image: string }[];
  food: { name: string; description: string; type: string }[];
  tips: string[];
  emergency: { name: string; number: string }[];
}

const mockTravelOptions: TravelOption[] = [
  {
    id: "1",
    type: "train",
    name: "Rajdhani Express",
    departure: "06:00 AM",
    arrival: "02:00 PM",
    duration: "8h",
    price: 1850,
    class: "3A",
  },
  {
    id: "2",
    type: "train",
    name: "Shatabdi Express",
    departure: "07:30 AM",
    arrival: "01:30 PM",
    duration: "6h",
    price: 1200,
    class: "CC",
  },
  {
    id: "3",
    type: "flight",
    name: "IndiGo 6E-204",
    departure: "09:00 AM",
    arrival: "11:00 AM",
    duration: "2h",
    price: 4500,
    class: "Economy",
  },
  {
    id: "4",
    type: "flight",
    name: "Air India AI-302",
    departure: "02:00 PM",
    arrival: "04:00 PM",
    duration: "2h",
    price: 5200,
    class: "Economy",
  },
  {
    id: "5",
    type: "bus",
    name: "VRL Travels",
    departure: "08:00 PM",
    arrival: "06:00 AM",
    duration: "10h",
    price: 800,
    class: "Sleeper",
  },
  {
    id: "6",
    type: "bus",
    name: "SRS Travels",
    departure: "09:30 PM",
    arrival: "07:00 AM",
    duration: "9.5h",
    price: 950,
    class: "AC Sleeper",
  },
];

const mockHotels: Hotel[] = [
  {
    id: "h1",
    name: "Taj Palace",
    rating: 5,
    pricePerNight: 8500,
    amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  {
    id: "h2",
    name: "Holiday Inn",
    rating: 4,
    pricePerNight: 4500,
    amenities: ["WiFi", "Gym", "Restaurant"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
  },
  {
    id: "h3",
    name: "OYO Rooms",
    rating: 3,
    pricePerNight: 1500,
    amenities: ["WiFi", "AC"],
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400",
  },
];

const mockLocalGuide: Record<string, LocalGuideData> = {
  default: {
    attractions: [
      {
        name: "City Center",
        description: "The heart of the city with shopping and entertainment",
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400",
      },
      {
        name: "Historic Fort",
        description: "A magnificent structure showcasing rich heritage",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400",
      },
      {
        name: "Local Market",
        description: "Experience authentic local culture and handicrafts",
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400",
      },
    ],
    food: [
      { name: "Street Food Corner", description: "Famous for local delicacies", type: "Street Food" },
      { name: "Traditional Restaurant", description: "Authentic regional cuisine", type: "Fine Dining" },
      { name: "Cafe Culture", description: "Modern cafes with local twist", type: "Cafe" },
    ],
    tips: [
      "Carry cash as some local vendors don't accept cards",
      "Best time to visit monuments is early morning",
      "Try bargaining at local markets",
      "Keep emergency numbers saved on your phone",
      "Respect local customs and dress modestly at religious sites",
    ],
    emergency: [
      { name: "Police", number: "100" },
      { name: "Ambulance", number: "102" },
      { name: "Fire", number: "101" },
      { name: "Tourist Helpline", number: "1363" },
    ],
  },
};

export async function planTrip(data: {
  from: string;
  to: string;
  date: string;
  mode: string;
  budget?: number;
}): Promise<{ travelOptions: TravelOption[]; hotels: Hotel[] }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  let options = mockTravelOptions;
  if (data.mode && data.mode !== "all") {
    options = options.filter((o) => o.type === data.mode);
  }
  if (data.budget) {
    options = options.filter((o) => o.price <= data.budget!);
  }
  
  return {
    travelOptions: options,
    hotels: mockHotels,
  };
}

export async function confirmBooking(data: {
  travelOptionId: string;
  hotelId?: string;
}): Promise<{ bookingId: string; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const travel = mockTravelOptions.find((o) => o.id === data.travelOptionId);
  const hotel = data.hotelId ? mockHotels.find((h) => h.id === data.hotelId) : null;
  
  const total = (travel?.price || 0) + (hotel?.pricePerNight || 0) * 2;
  
  return {
    bookingId: `TW${Date.now().toString(36).toUpperCase()}`,
    total,
  };
}

export async function getLocalGuide(city: string): Promise<LocalGuideData> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockLocalGuide[city.toLowerCase()] || mockLocalGuide.default;
}

export { mockTravelOptions, mockHotels };
