import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

const translations = {
  en: {
    // Navbar
    home: 'Home',
    startJourney: 'Start Journey',
    planTrip: 'Plan Trip',
    localGuide: 'Local Guide',
    myDashboard: 'My Dashboard',
    availableLanguages: 'Available in',
    languages: 'languages',
    aiPowered: 'AI-Powered Travel Companion',
    
    // Home
    welcomeTitle: 'Welcome to TripWise',
    welcomeSubtitle: 'Your Next Adventure Awaits',
    welcomeDescription: 'Plan. Book. Explore.',
    getStarted: 'Start Your Journey',
    whyChooseTripwise: 'Why Choose TripWise?',
    smartPlanning: 'Smart Planning',
    smartPlanningDesc: 'AI-powered trip planning tailored to your preferences',
    instantBooking: 'Instant Booking',
    instantBookingDesc: 'Seamless booking for flights and accommodations',
    voiceControl: 'Voice Control',
    voiceControlDesc: 'Hands-free experience with voice commands',
    multiLanguage: 'Multi-Language',
    multiLanguageDesc: 'Travel support in your preferred language',
    
    // Identify User
    stepOf: 'STEP',
    of: 'OF',
    whatsYourName: "What's Your",
    name: 'Name',
    howCanWeReachYou: 'How Can We',
    reachYou: 'Reach You',
    tellUsYourName: 'Tell us your name to get started',
    enterPhoneOrEmail: 'Enter your phone or email',
    yourName: 'YOUR NAME',
    enterFullName: 'Enter your full name',
    continue: 'Continue',
    phoneOrEmail: 'PHONE OR EMAIL',
    enterPhoneEmail: 'Enter phone or email',
    back: 'Back',
    startPlanning: 'Start Planning',
    welcomeBack: 'Welcome back',
    letsplanFirstAdventure: "Let's plan your first adventure",
    
    // Plan Trip
    aiPlanning: 'AI PLANNING',
    planYourDreamTrip: 'Plan Your',
    dreamTrip: 'Dream Trip',
    whereYouWantToGo: 'Tell us where you want to go and we\'ll handle the rest',
    tripType: 'TRIP TYPE',
    solo: 'Solo',
    honeymoon: 'Honeymoon',
    family: 'Family',
    friends: 'Friends',
    numberOfTravelers: 'NUMBER OF TRAVELERS',
    howManyPeople: 'How many people?',
    from: 'FROM',
    yourCurrentLocation: 'Your current location',
    destination: 'DESTINATION',
    whereDoYouWantToGo: 'Where do you want to go?',
    travelDate: 'TRAVEL DATE',
    budget: 'BUDGET (Optional)',
    yourBudget: 'Your budget',
    travelMode: 'TRAVEL MODE',
    flight: 'Flight',
    train: 'Train',
    bus: 'Bus',
    findTravelOptions: 'Find Travel Options',
    planningYourJourney: 'Planning Your Journey...',
    
    // Booking
    travelOptions: 'TRAVEL OPTIONS',
    selectYourTravel: 'Select Your Travel',
    bestOptionsForYou: 'Best options for your journey',
    selectOption: 'Select Option',
    yourJourney: 'Your Journey',
    hotelRecommendations: 'HOTEL RECOMMENDATIONS',
    whereToStay: 'Where to Stay',
    bookHotel: 'Book Hotel',
    perNight: 'per night',
    proceedToPayment: 'Proceed to Payment',
    
    // Payment & Booking Details
    bookingSummary: 'BOOKING SUMMARY',
    reviewYourBooking: 'Review Your Booking',
    completeYourPayment: 'Complete your payment to confirm',
    bookingConfirmed: 'Booking Confirmed',
    bookingId: 'Booking ID',
    generatingDetails: 'Generating booking details...',
    travelDetails: 'Travel Details',
    hotelDetails: 'Hotel Details',
    contactInformation: 'Contact Information',
    aiTravelSuggestions: 'AI Travel Suggestions',
    destinationGallery: 'Destination Gallery',
    route: 'Route',
    date: 'Date',
    mode: 'Mode',
    travelers: 'Travelers',
    hotel: 'Hotel',
    location: 'Location',
    checkIn: 'Check-in',
    contact: 'Contact',
    nights: 'nights',
    paymentDetails: 'PAYMENT DETAILS',
    travelCost: 'Travel Cost',
    hotelCost: 'Hotel Cost',
    totalCost: 'Total Cost',
    total: 'Total',
    confirmBooking: 'Confirm Booking',
    processing: 'Processing...',
    redirectingToGuide: 'Redirecting to local guide...',
    download: 'Download',
    share: 'Share',
    viewAllBookings: 'View All Bookings',
    exploreLocalGuide: 'Explore Local Guide',
    
    // User Dashboard
    welcome: 'Welcome',
    newTrip: 'New Trip',
    logout: 'Logout',
    totalBookings: 'Total Bookings',
    upcomingTrips: 'Upcoming Trips',
    destinationsVisited: 'Destinations Visited',
    myBookings: 'My Bookings',
    noBookingsYet: 'No bookings yet',
    startPlanningTrip: 'Start planning your first trip!',
    planYourFirstTrip: 'Plan Your First Trip',
    completed: 'Completed',
    upcoming: 'Upcoming',
    totalPaid: 'Total Paid',
    
    // Local Guide
    localGuideTitle: 'LOCAL GUIDE',
    exploreDestination: 'Explore',
    comprehensiveGuide: 'Your comprehensive travel guide',
    overview: 'Overview',
    topAttractions: 'Top Attractions',
    localCuisine: 'Local Cuisine',
    transportation: 'Transportation',
    travelTips: 'Travel Tips',
    emergency: 'Emergency',
    weather: 'Weather',
    backToHome: 'Back to Home',
    planAnotherTrip: 'Plan Another Trip',
  },
  
  hi: {
    // Navbar
    home: 'होम',
    startJourney: 'यात्रा शुरू करें',
    planTrip: 'यात्रा योजना',
    localGuide: 'स्थानीय गाइड',
    availableLanguages: 'उपलब्ध भाषाएं',
    languages: 'भाषाएं',
    aiPowered: 'AI-संचालित यात्रा साथी',
    
    // Home
    welcomeTitle: 'TripWise में आपका स्वागत है',
    welcomeSubtitle: 'आपका अगला साहसिक कार्य इंतजार कर रहा है',
    welcomeDescription: 'योजना बनाएं। बुक करें। अन्वेषण करें।',
    getStarted: 'अपनी यात्रा शुरू करें',
    whyChooseTripwise: 'TripWise को क्यों चुनें?',
    smartPlanning: 'स्मार्ट योजना',
    smartPlanningDesc: 'आपकी प्राथमिकताओं के अनुसार AI-संचालित यात्रा योजना',
    instantBooking: 'तत्काल बुकिंग',
    instantBookingDesc: 'उड़ानों और आवास के लिए सहज बुकिंग',
    voiceControl: 'वॉयस कंट्रोल',
    voiceControlDesc: 'वॉयस कमांड के साथ हैंड्स-फ्री अनुभव',
    multiLanguage: 'बहु-भाषा',
    multiLanguageDesc: 'आपकी पसंदीदा भाषा में यात्रा सहायता',
    
    // Identify User
    stepOf: 'चरण',
    of: 'का',
    whatsYourName: 'आपका',
    name: 'नाम क्या है',
    howCanWeReachYou: 'हम आपसे कैसे',
    reachYou: 'संपर्क करें',
    tellUsYourName: 'शुरू करने के लिए हमें अपना नाम बताएं',
    enterPhoneOrEmail: 'अपना फोन या ईमेल दर्ज करें',
    yourName: 'आपका नाम',
    enterFullName: 'अपना पूरा नाम दर्ज करें',
    continue: 'जारी रखें',
    phoneOrEmail: 'फोन या ईमेल',
    enterPhoneEmail: 'फोन या ईमेल दर्ज करें',
    back: 'वापस',
    startPlanning: 'योजना शुरू करें',
    welcomeBack: 'वापस स्वागत है',
    letsplanFirstAdventure: 'चलिए अपना पहला साहसिक कार्य योजना बनाएं',
    
    // Plan Trip
    aiPlanning: 'AI योजना',
    planYourDreamTrip: 'अपनी',
    dreamTrip: 'सपनों की यात्रा की योजना बनाएं',
    whereYouWantToGo: 'हमें बताएं आप कहां जाना चाहते हैं',
    tripType: 'यात्रा का प्रकार',
    solo: 'अकेले',
    honeymoon: 'हनीमून',
    family: 'परिवार',
    friends: 'दोस्त',
    numberOfTravelers: 'यात्रियों की संख्या',
    howManyPeople: 'कितने लोग?',
    from: 'से',
    yourCurrentLocation: 'आपका वर्तमान स्थान',
    destination: 'गंतव्य',
    whereDoYouWantToGo: 'आप कहां जाना चाहते हैं?',
    travelDate: 'यात्रा की तारीख',
    budget: 'बजट (वैकल्पिक)',
    yourBudget: 'आपका बजट',
    travelMode: 'यात्रा का साधन',
    flight: 'विमान',
    train: 'ट्रेन',
    bus: 'बस',
    findTravelOptions: 'यात्रा विकल्प खोजें',
    planningYourJourney: 'आपकी यात्रा की योजना बना रहे हैं...',
    
    // Booking
    travelOptions: 'यात्रा विकल्प',
    selectYourTravel: 'अपनी यात्रा चुनें',
    bestOptionsForYou: 'आपकी यात्रा के लिए सर्वोत्तम विकल्प',
    selectOption: 'विकल्प चुनें',
    yourJourney: 'आपकी यात्रा',
    hotelRecommendations: 'होटल सिफारिशें',
    whereToStay: 'कहां रुकें',
    bookHotel: 'होटल बुक करें',
    perNight: 'प्रति रात',
    proceedToPayment: 'भुगतान के लिए आगे बढ़ें',
    
    // Payment
    bookingSummary: 'बुकिंग सारांश',
    reviewYourBooking: 'अपनी बुकिंग की समीक्षा करें',
    completeYourPayment: 'पुष्टि के लिए अपना भुगतान पूरा करें',
    travelDetails: 'यात्रा विवरण',
    route: 'मार्ग',
    date: 'तारीख',
    mode: 'साधन',
    travelers: 'यात्री',
    hotelDetails: 'होटल विवरण',
    hotel: 'होटल',
    nights: 'रातें',
    paymentDetails: 'भुगतान विवरण',
    travelCost: 'यात्रा लागत',
    hotelCost: 'होटल लागत',
    total: 'कुल',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    processing: 'प्रक्रिया में...',
    bookingConfirmed: 'बुकिंग की पुष्टि हो गई!',
    redirectingToGuide: 'स्थानीय गाइड पर रीडायरेक्ट कर रहे हैं...',
    
    // Local Guide
    localGuideTitle: 'स्थानीय गाइड',
    exploreDestination: 'अन्वेषण करें',
    comprehensiveGuide: 'आपकी व्यापक यात्रा गाइड',
    overview: 'अवलोकन',
    topAttractions: 'शीर्ष आकर्षण',
    localCuisine: 'स्थानीय व्यंजन',
    transportation: 'परिवहन',
    travelTips: 'यात्रा सुझाव',
    emergency: 'आपातकाल',
    weather: 'मौसम',
    backToHome: 'होम पर वापस',
    planAnotherTrip: 'एक और यात्रा की योजना बनाएं',
  },
  
  es: {
    // Navbar
    home: 'Inicio',
    startJourney: 'Comenzar Viaje',
    planTrip: 'Planear Viaje',
    localGuide: 'Guía Local',
    availableLanguages: 'Disponible en',
    languages: 'idiomas',
    aiPowered: 'Compañero de Viaje con IA',
    
    // Home
    welcomeTitle: 'Tu Próxima Aventura',
    welcomeSubtitle: 'Te Espera',
    welcomeDescription: 'Planificación inteligente de viajes con IA',
    getStarted: 'Comenzar',
    
    // Identify User
    stepOf: 'PASO',
    of: 'DE',
    whatsYourName: '¿Cuál es tu',
    name: 'Nombre',
    howCanWeReachYou: '¿Cómo podemos',
    reachYou: 'Contactarte',
    tellUsYourName: 'Dinos tu nombre para comenzar',
    enterPhoneOrEmail: 'Ingresa tu teléfono o correo',
    yourName: 'TU NOMBRE',
    enterFullName: 'Ingresa tu nombre completo',
    continue: 'Continuar',
    phoneOrEmail: 'TELÉFONO O CORREO',
    enterPhoneEmail: 'Ingresa teléfono o correo',
    back: 'Atrás',
    startPlanning: 'Comenzar a Planear',
    welcomeBack: 'Bienvenido de nuevo',
    letsplanFirstAdventure: 'Planeemos tu primera aventura',
    
    // Plan Trip
    aiPlanning: 'PLANIFICACIÓN IA',
    planYourDreamTrip: 'Planea tu',
    dreamTrip: 'Viaje Soñado',
    whereYouWantToGo: 'Dinos a dónde quieres ir',
    tripType: 'TIPO DE VIAJE',
    solo: 'Solo',
    honeymoon: 'Luna de Miel',
    family: 'Familia',
    friends: 'Amigos',
    numberOfTravelers: 'NÚMERO DE VIAJEROS',
    howManyPeople: '¿Cuántas personas?',
    from: 'DESDE',
    yourCurrentLocation: 'Tu ubicación actual',
    destination: 'DESTINO',
    whereDoYouWantToGo: '¿A dónde quieres ir?',
    travelDate: 'FECHA DE VIAJE',
    budget: 'PRESUPUESTO (Opcional)',
    yourBudget: 'Tu presupuesto',
    travelMode: 'MODO DE VIAJE',
    flight: 'Vuelo',
    train: 'Tren',
    bus: 'Autobús',
    findTravelOptions: 'Buscar Opciones de Viaje',
    planningYourJourney: 'Planeando tu Viaje...',
    
    // Add more translations for other pages...
  },
  
  // Add more languages (fr, de, zh, ja, ar, pt, ru)
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('tripwise_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('tripwise_language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}