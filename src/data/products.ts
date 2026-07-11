export interface Product {
  id: string;
  category: 'electrical' | 'plumbing' | 'sanitary' | 'solar' | 'tools' | 'ro' | 'security' | 'appliances' | 'accessories';
  name: string;
  brand: string;
  rate: number;
  unit: string;
  specification?: string;
  isCustom?: boolean;
}

export const INITIAL_PRODUCTS: Product[] = [
  // --- ELECTRICAL ---
  {
    id: 'elec-1',
    category: 'electrical',
    name: '1.5 Sq.mm FR PVC Insulated Copper Wire',
    brand: 'Finolex',
    rate: 1450,
    unit: 'Coil (90m)',
    specification: 'Single Core, Flame Retardant'
  },
  {
    id: 'elec-2',
    category: 'electrical',
    name: '2.5 Sq.mm FR PVC Insulated Copper Wire',
    brand: 'Polycab',
    rate: 2350,
    unit: 'Coil (90m)',
    specification: 'Single Core, Heavy Duty'
  },
  {
    id: 'elec-3',
    category: 'electrical',
    name: '1.0 Sq.mm FR PVC Insulated Copper Wire',
    brand: 'Havells',
    rate: 1050,
    unit: 'Coil (90m)',
    specification: 'Single Core, Flame Retardant'
  },
  {
    id: 'elec-4',
    category: 'electrical',
    name: '16 Amp 1-Way Modular Switch',
    brand: 'Anchor Roma',
    rate: 45,
    unit: 'Piece',
    specification: 'Modular, White Polycarbonate'
  },
  {
    id: 'elec-5',
    category: 'electrical',
    name: '6 Amp 3-Pin Modular Socket',
    brand: 'Schneider',
    rate: 85,
    unit: 'Piece',
    specification: 'Modular, Child Safety Shutter'
  },
  {
    id: 'elec-6',
    category: 'electrical',
    name: '9 Watt Cool Day Light LED Bulb',
    brand: 'Philips',
    rate: 99,
    unit: 'Piece',
    specification: 'B22 Base, 900 Lumens'
  },
  {
    id: 'elec-7',
    category: 'electrical',
    name: '20 Watt LED Batten Tube Light',
    brand: 'Syska',
    rate: 220,
    unit: 'Piece',
    specification: 'Wall Mounted, Cool White'
  },
  {
    id: 'elec-8',
    category: 'electrical',
    name: '16 Amp Single Pole MCB (C-Curve)',
    brand: 'Legrand',
    rate: 180,
    unit: 'Piece',
    specification: '10kA Breaking Capacity'
  },
  {
    id: 'elec-9',
    category: 'electrical',
    name: '8 Way Double Door DB Board',
    brand: 'Hager',
    rate: 1650,
    unit: 'Piece',
    specification: 'Distribution Board, Metal Clad'
  },
  {
    id: 'elec-10',
    category: 'electrical',
    name: '25mm PVC Conduit Pipe (Medium)',
    brand: 'VIP',
    rate: 40,
    unit: 'Length (3m)',
    specification: 'FRLS, Grey Conduit'
  },

  // --- PLUMBING ---
  {
    id: 'plumb-1',
    category: 'plumbing',
    name: '1 Inch CPVC SDR-11 Pipe',
    brand: 'Astral',
    rate: 340,
    unit: 'Length (3m)',
    specification: 'Hot & Cold Water, Class 1'
  },
  {
    id: 'plumb-2',
    category: 'plumbing',
    name: '3/4 Inch CPVC SDR-11 Pipe',
    brand: 'Supreme',
    rate: 250,
    unit: 'Length (3m)',
    specification: 'Hot & Cold Water, Class 1'
  },
  {
    id: 'plumb-3',
    category: 'plumbing',
    name: '1/2 Inch Brass Bib Cock Tap',
    brand: 'Jaquar',
    rate: 850,
    unit: 'Piece',
    specification: 'Chrome Plated, Quarter Turn'
  },
  {
    id: 'plumb-4',
    category: 'plumbing',
    name: '1/2 Inch CPVC Ball Valve',
    brand: 'Ashirvad',
    rate: 110,
    unit: 'Piece',
    specification: 'Heavy Duty, Threaded Joint'
  },
  {
    id: 'plumb-5',
    category: 'plumbing',
    name: '1 Inch CPVC Elbow 90 Degree',
    brand: 'Astral',
    rate: 32,
    unit: 'Piece',
    specification: 'Lead-Free, High Pressure'
  },
  {
    id: 'plumb-6',
    category: 'plumbing',
    name: 'CPVC Solvent Cement Blue',
    brand: 'Weld-On',
    rate: 145,
    unit: 'Can (118ml)',
    specification: 'Medium Bodied, Fast Setting'
  },
  {
    id: 'plumb-7',
    category: 'plumbing',
    name: 'Stainless Steel Waste Coupling 4"',
    brand: 'Cera',
    rate: 175,
    unit: 'Piece',
    specification: 'SS 304, Anti-Clog'
  },
  {
    id: 'plumb-8',
    category: 'plumbing',
    name: '4 Inch PVC SWR Drainage Pipe',
    brand: 'Supreme',
    rate: 720,
    unit: 'Length (3m)',
    specification: 'Self-Fit, Ring Joint'
  },

  // --- SANITARY WARES ---
  {
    id: 'san-1',
    category: 'sanitary',
    name: 'Wall Hung Western Commode / Water Closet',
    brand: 'Cera',
    rate: 4850,
    unit: 'Piece',
    specification: 'Slow Falling Seat Cover, Wash Down'
  },
  {
    id: 'san-2',
    category: 'sanitary',
    name: 'Pedestal Wash Basin White',
    brand: 'Parryware',
    rate: 2450,
    unit: 'Set',
    specification: 'Vitreous China, Glossy Finish'
  },
  {
    id: 'san-3',
    category: 'sanitary',
    name: 'Dual Flush PVC Cistern Tank',
    brand: 'Hindware',
    rate: 1150,
    unit: 'Piece',
    specification: 'Slim Design, Water Saving'
  },
  {
    id: 'san-4',
    category: 'sanitary',
    name: 'Multi-Flow Overhead Shower with Arm',
    brand: 'Jaquar',
    rate: 1350,
    unit: 'Piece',
    specification: 'Self-Cleaning Nozzles, Chrome'
  },
  {
    id: 'san-5',
    category: 'sanitary',
    name: 'Stainless Steel Health Faucet Set',
    brand: 'Ruhe',
    rate: 550,
    unit: 'Piece',
    specification: '1.2m SS Flexible Tube, Wall Hook'
  },
  {
    id: 'san-6',
    category: 'sanitary',
    name: 'Bathroom Mirror with LED Light (24"x18")',
    brand: 'Varmora',
    rate: 1850,
    unit: 'Piece',
    specification: 'Touch Control, Anti-Fog Coating'
  },

  // --- SOLAR PANELS ---
  {
    id: 'solar-1',
    category: 'solar',
    name: '540W Mono PERC Half-Cut Solar Panel',
    brand: 'Loom Solar',
    rate: 14500,
    unit: 'Piece',
    specification: 'Super High Efficiency, 24V'
  },
  {
    id: 'solar-2',
    category: 'solar',
    name: '335W Polycrystalline Solar Panel',
    brand: 'Tata Power Solar',
    rate: 8900,
    unit: 'Piece',
    specification: 'High Performance, 12V/24V Compatibility'
  },
  {
    id: 'solar-3',
    category: 'solar',
    name: '3kW On-Grid Solar Inverter (Single Phase)',
    brand: 'Growatt',
    rate: 32000,
    unit: 'Piece',
    specification: 'WiFi Dongle Included, MPPT Tracker'
  },
  {
    id: 'solar-4',
    category: 'solar',
    name: '150Ah Tall Tubular Solar Battery',
    brand: 'Luminous',
    rate: 13800,
    unit: 'Piece',
    specification: 'Rated C10, Low Maintenance, Recyclable'
  },
  {
    id: 'solar-5',
    category: 'solar',
    name: '4 Sq.mm Copper Solar Cable Red & Black',
    brand: 'Polycab',
    rate: 65,
    unit: 'Meter',
    specification: 'UV-Protected, XLPE Insulation'
  },
  {
    id: 'solar-6',
    category: 'solar',
    name: 'MC4 Branch Connectors (Pair)',
    brand: 'KBE',
    rate: 120,
    unit: 'Pair',
    specification: 'IP67 Waterproof, Double Lock'
  },

  // --- TOOLS ---
  {
    id: 'tool-1',
    category: 'tools',
    name: 'Digital Multimeter with Backlight (Trms)',
    brand: 'Fluke',
    rate: 4200,
    unit: 'Piece',
    specification: 'CAT III 600V, Resistance, Diode'
  },
  {
    id: 'tool-2',
    category: 'tools',
    name: '13mm Impact Drill Machine 550W',
    brand: 'Bosch',
    rate: 2650,
    unit: 'Piece',
    specification: 'Variable Speed, Reversible Assist'
  },
  {
    id: 'tool-3',
    category: 'tools',
    name: '8-Piece Double Open End Spanner Set',
    brand: 'Taparia',
    rate: 450,
    unit: 'Set',
    specification: 'Chrome Vanadium Steel, 6mm to 22mm'
  },
  {
    id: 'tool-4',
    category: 'tools',
    name: '8 Inch Heavy Duty Combination Pliers',
    brand: 'Taparia',
    rate: 220,
    unit: 'Piece',
    specification: 'Insulated Sleeves, High Leverage'
  },
  {
    id: 'tool-5',
    category: 'tools',
    name: 'Screw Driver Set with Neon Tester',
    brand: 'Stanley',
    rate: 380,
    unit: 'Set',
    specification: 'Magnetic Tips, 6 Interchangeable Blades'
  },
  {
    id: 'tool-6',
    category: 'tools',
    name: 'Digital Clamp Meter AC/DC',
    brand: 'Meco',
    rate: 1450,
    unit: 'Piece',
    specification: 'Data Hold, Audible Continuity'
  },

  // --- RO SYSTEMS (WATER PURIFIERS) ---
  {
    id: 'ro-1',
    category: 'ro',
    name: 'Active Copper RO + UV Water Purifier',
    brand: 'Kent Grand',
    rate: 16500,
    unit: 'Piece',
    specification: '8L Storage, Mineral RO Technology'
  },
  {
    id: 'ro-2',
    category: 'ro',
    name: 'RO Booster Pump 100 GPD',
    brand: 'Kemflo',
    rate: 1850,
    unit: 'Piece',
    specification: '24V DC, High Pressure, Low Noise'
  },
  {
    id: 'ro-3',
    category: 'ro',
    name: 'RO Membrane 75 GPD Filter',
    brand: 'Vontron',
    rate: 950,
    unit: 'Piece',
    specification: 'Polyamide Thin-Film Composite'
  },
  {
    id: 'ro-4',
    category: 'ro',
    name: 'Inline Sediment Filter Cartridge 10"',
    brand: 'Aqua Fresh',
    rate: 180,
    unit: 'Piece',
    specification: '5 Micron PP Fiber Filter'
  },
  {
    id: 'ro-5',
    category: 'ro',
    name: 'Activated Carbon Block Inline Filter',
    brand: 'CSM',
    rate: 220,
    unit: 'Piece',
    specification: 'Coconut Shell Carbon, Taste Improver'
  },
  {
    id: 'ro-6',
    category: 'ro',
    name: 'Solenoid Valve 24V DC for RO',
    brand: 'SLX',
    rate: 140,
    unit: 'Piece',
    specification: 'Quick Connect, Food Grade PP'
  },

  // --- SECURITY SYSTEMS ---
  {
    id: 'sec-1',
    category: 'security',
    name: '2MP Full HD Dome IP Camera with IR',
    brand: 'Hikvision',
    rate: 1850,
    unit: 'Piece',
    specification: '30m Night Vision, PoE, IP67'
  },
  {
    id: 'sec-2',
    category: 'security',
    name: '2MP Outdoor Bullet Camera (ColorVu)',
    brand: 'CP Plus',
    rate: 1450,
    unit: 'Piece',
    specification: '24/7 Full-Color Imaging, Metal Body'
  },
  {
    id: 'sec-3',
    category: 'security',
    name: '8-Channel HD-TVI Digital Video Recorder (DVR)',
    brand: 'Hikvision',
    rate: 4200,
    unit: 'Piece',
    specification: 'H.265+ Compression, Smart Search'
  },
  {
    id: 'sec-4',
    category: 'security',
    name: '7-Inch Video Door Phone Kit',
    brand: 'Godrej',
    rate: 6800,
    unit: 'Set',
    specification: 'Hands-free indoor monitor, PIN-hole outdoor camera'
  },
  {
    id: 'sec-5',
    category: 'security',
    name: 'Biometric Fingerprint Attendance Device',
    brand: 'Essl',
    rate: 5400,
    unit: 'Piece',
    specification: 'RFID Card, WiFi, Battery Backup'
  },
  {
    id: 'sec-6',
    category: 'security',
    name: 'PIR Motion Sensor Switch 360°',
    brand: 'Mx',
    rate: 380,
    unit: 'Piece',
    specification: 'Ceiling Mount, Max 1200W Load'
  },

  // --- HOME APPLIANCES ---
  {
    id: 'app-1',
    category: 'appliances',
    name: '1200mm High Speed Ceiling Fan (5 Star)',
    brand: 'Crompton Hill Briz',
    rate: 1850,
    unit: 'Piece',
    specification: '100% Copper Motor, Double Ball Bearing'
  },
  {
    id: 'app-2',
    category: 'appliances',
    name: '15 Litre Storage Water Heater / Geyser',
    brand: 'Bajaj Majesty',
    rate: 6200,
    unit: 'Piece',
    specification: 'Glasslined Inner Tank, 2kW'
  },
  {
    id: 'app-3',
    category: 'appliances',
    name: '3-Jar 750W Mixer Grinder',
    brand: 'Prestige',
    rate: 2950,
    unit: 'Set',
    specification: 'Stainless Steel Jars, Overload Protector'
  },
  {
    id: 'app-4',
    category: 'appliances',
    name: '2000W Induction Cooktop with Touch Menu',
    brand: 'Pigeon',
    rate: 2150,
    unit: 'Piece',
    specification: 'Micro-Crystal Plate, Auto Shut-Off'
  },
  {
    id: 'app-5',
    category: 'appliances',
    name: '10-Inch Exhaust Fan with Auto Shutter',
    brand: 'Havells Ventil Air',
    rate: 1250,
    unit: 'Piece',
    specification: 'Metal Body, Quiet Operation'
  },

  // --- ACCESSORIES ---
  {
    id: 'acc-1',
    category: 'accessories',
    name: 'PVC Insulation Tape Black (1.8cm x 7m)',
    brand: 'Steelgrip',
    rate: 12,
    unit: 'Piece',
    specification: 'Self-Adhesive, Fire Resistant'
  },
  {
    id: 'acc-2',
    category: 'accessories',
    name: 'PTFE Teflon Tape for Thread Sealing',
    brand: 'Sealco',
    rate: 15,
    unit: 'Piece',
    specification: '12mm Width x 10m Length'
  },
  {
    id: 'acc-3',
    category: 'accessories',
    name: 'Self-Drilling Metal Screws (1.5 Inch)',
    brand: 'Star',
    rate: 180,
    unit: 'Box (100 Pcs)',
    specification: 'Carbon Steel, Zinc Plated'
  },
  {
    id: 'acc-4',
    category: 'accessories',
    name: 'Nylon Wall Plugs / Rawlplugs (6mm)',
    brand: 'Fischer',
    rate: 110,
    unit: 'Box (100 Pcs)',
    specification: 'High Quality Polyamide'
  },
  {
    id: 'acc-5',
    category: 'accessories',
    name: 'Nylon Cable Ties Black (8 Inch)',
    brand: 'Tidy',
    rate: 120,
    unit: 'Packet (100 Pcs)',
    specification: 'UV-Stabilized, Heavy Duty'
  },
  {
    id: 'acc-6',
    category: 'accessories',
    name: 'Gi Metal Saddle Pipe Clamps (25mm)',
    brand: 'Apex',
    rate: 2.50,
    unit: 'Piece',
    specification: 'Zinc Plated Steel'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: 'LayoutGrid' },
  { id: 'electrical', label: 'Electrical', icon: 'Zap' },
  { id: 'plumbing', label: 'Plumbing', icon: 'Droplets' },
  { id: 'sanitary', label: 'Sanitary Wares', icon: 'Bath' },
  { id: 'solar', label: 'Solar Panels', icon: 'Sun' },
  { id: 'tools', label: 'Tools', icon: 'Wrench' },
  { id: 'ro', label: 'RO Systems', icon: 'Filter' },
  { id: 'security', label: 'Security System', icon: 'ShieldAlert' },
  { id: 'appliances', label: 'Home Appliances', icon: 'Tv' },
  { id: 'accessories', label: 'Accessories', icon: 'Paperclip' }
] as const;
