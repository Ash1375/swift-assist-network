export interface VehicleBrand {
  id: string;
  name: string;
  logo: string;
  type: 'car' | 'bike' | 'both';
  models: string[];
}

export const indianVehicleBrands: VehicleBrand[] = [
  // Car Brands
  {
    id: 'maruti-suzuki',
    name: 'Maruti Suzuki',
    logo: 'https://logos-world.net/wp-content/uploads/2021/03/Suzuki-Logo.png',
    type: 'car',
    models: ['Alto 800', 'Alto K10', 'S-Presso', 'Wagon R', 'Swift', 'Dzire', 'Baleno', 'Ignis', 'Vitara Brezza', 'Ertiga', 'XL6', 'Ciaz', 'Grand Vitara', 'Jimny']
  },
  {
    id: 'hyundai',
    name: 'Hyundai',
    logo: 'https://logos-world.net/wp-content/uploads/2021/03/Hyundai-Logo.png',
    type: 'car',
    models: ['Grand i10 NIOS', 'i20', 'Aura', 'Venue', 'Verna', 'Creta', 'Alcazar', 'Tucson', 'Kona Electric', 'Ioniq 5']
  },
  {
    id: 'tata',
    name: 'Tata Motors',
    logo: 'https://logos-world.net/wp-content/uploads/2021/04/Tata-Logo.png',
    type: 'both',
    models: ['Tiago', 'Tigor', 'Punch', 'Nexon', 'Nexon EV', 'Harrier', 'Safari', 'Hexa', 'Ace Gold', 'Super Ace', 'Ultra']
  },
  {
    id: 'mahindra',
    name: 'Mahindra',
    logo: 'https://logos-world.net/wp-content/uploads/2021/04/Mahindra-Logo.png',
    type: 'both',
    models: ['KUV100 NXT', 'XUV300', 'Bolero', 'Bolero Neo', 'Scorpio', 'Scorpio-N', 'XUV700', 'XUV400', 'Thar', 'Marazzo']
  },
  {
    id: 'honda-cars',
    name: 'Honda Cars',
    logo: 'https://logos-world.net/wp-content/uploads/2021/03/Honda-Logo.png',
    type: 'car',
    models: ['Amaze', 'Jazz', 'WR-V', 'City', 'City Hybrid']
  },
  {
    id: 'toyota',
    name: 'Toyota',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Toyota-Logo.png',
    type: 'car',
    models: ['Glanza', 'Urban Cruiser Hyryder', 'Innova Crysta', 'Fortuner', 'Hilux', 'Vellfire', 'Camry', 'Prius']
  },
  {
    id: 'kia',
    name: 'Kia',
    logo: 'https://logos-world.net/wp-content/uploads/2021/04/Kia-Logo.png',
    type: 'car',
    models: ['Sonet', 'Seltos', 'Carens', 'EV6']
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Volkswagen-Logo.png',
    type: 'car',
    models: ['Polo', 'Vento', 'Taigun', 'Virtus']
  },
  {
    id: 'skoda',
    name: 'Skoda',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Skoda-Logo.png',
    type: 'car',
    models: ['Rapid', 'Kushaq', 'Slavia', 'Kodiaq', 'Octavia', 'Superb']
  },
  {
    id: 'nissan',
    name: 'Nissan',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Nissan-Logo.png',
    type: 'car',
    models: ['Magnite', 'Kicks', 'X-Trail']
  },
  {
    id: 'renault',
    name: 'Renault',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Renault-Logo.png',
    type: 'car',
    models: ['Kwid', 'Triber', 'Kiger', 'Duster']
  },
  {
    id: 'mg',
    name: 'MG Motor',
    logo: 'https://www.carlogos.org/car-logos/mg-logo.png',
    type: 'car',
    models: ['Hector', 'Hector Plus', 'ZS EV', 'Gloster', 'Astor', 'Comet EV']
  },
  {
    id: 'jeep',
    name: 'Jeep',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Jeep-Logo.png',
    type: 'car',
    models: ['Compass', 'Meridian', 'Wrangler']
  },
  {
    id: 'force',
    name: 'Force Motors',
    logo: 'https://www.carlogos.org/car-logos/force-motors-logo.png',
    type: 'both',
    models: ['Gurkha', 'Trax', 'Traveller', 'Tempo']
  },

  // Bike Brands
  {
    id: 'hero',
    name: 'Hero MotoCorp',
    logo: 'https://logos-world.net/wp-content/uploads/2020/12/Hero-MotoCorp-Logo.png',
    type: 'bike',
    models: ['HF Deluxe', 'Splendor Plus', 'Passion Pro', 'Super Splendor', 'Glamour', 'Xtreme 160R', 'Xpulse 200', 'Maestro Edge', 'Pleasure Plus', 'Destini 125']
  },
  {
    id: 'honda-bikes',
    name: 'Honda Motorcycles',
    logo: 'https://logos-world.net/wp-content/uploads/2021/03/Honda-Logo.png',
    type: 'bike',
    models: ['Activa 6G', 'Activa 125', 'Dio', 'Grazia', 'SP 125', 'Shine', 'Unicorn', 'Hornet 2.0', 'CB350RS', 'CBR150R', 'Africa Twin']
  },
  {
    id: 'bajaj',
    name: 'Bajaj',
    logo: 'https://logos-world.net/wp-content/uploads/2020/11/Bajaj-Logo.png',
    type: 'bike',
    models: ['Platina', 'CT 110', 'Pulsar 125', 'Pulsar 150', 'Pulsar 220F', 'Pulsar NS200', 'Pulsar RS200', 'Dominar 250', 'Dominar 400', 'Chetak Electric', 'Avenger Street 160']
  },
  {
    id: 'tvs',
    name: 'TVS Motor',
    logo: 'https://logos-world.net/wp-content/uploads/2020/12/TVS-Logo.png',
    type: 'bike',
    models: ['Sport', 'Star City Plus', 'Radeon', 'Apache RTR 160', 'Apache RTR 200 4V', 'Apache RR 310', 'Jupiter', 'Ntorq 125', 'iQube Electric', 'XL100']
  },
  {
    id: 'royal-enfield',
    name: 'Royal Enfield',
    logo: 'https://logos-world.net/wp-content/uploads/2020/12/Royal-Enfield-Logo.png',
    type: 'bike',
    models: ['Bullet 350', 'Classic 350', 'Hunter 350', 'Meteor 350', 'Interceptor 650', 'Continental GT 650', 'Himalayan', 'Scram 411']
  },
  {
    id: 'ktm',
    name: 'KTM',
    logo: 'https://logos-world.net/wp-content/uploads/2020/11/KTM-Logo.png',
    type: 'bike',
    models: ['Duke 125', 'Duke 200', 'Duke 250', 'Duke 390', 'RC 125', 'RC 200', 'RC 390', 'Adventure 250', 'Adventure 390']
  },
  {
    id: 'yamaha',
    name: 'Yamaha',
    logo: 'https://logos-world.net/wp-content/uploads/2020/12/Yamaha-Logo.png',
    type: 'bike',
    models: ['Fascino 125', 'Ray ZR', 'Aerox 155', 'FZ-S', 'FZ25', 'FZS-FI', 'MT-15', 'R15 V4', 'YZF-R3', 'MT-03']
  },
  {
    id: 'suzuki-bikes',
    name: 'Suzuki Motorcycles',
    logo: 'https://logos-world.net/wp-content/uploads/2021/03/Suzuki-Logo.png',
    type: 'bike',
    models: ['Access 125', 'Burgman Street', 'Avenis', 'Gixxer 155', 'Gixxer SF 250', 'Intruder 155', 'V-Strom SX', 'Hayabusa']
  },
  {
    id: 'kawasaki',
    name: 'Kawasaki',
    logo: 'https://logos-world.net/wp-content/uploads/2020/11/Kawasaki-Logo.png',
    type: 'bike',
    models: ['Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja ZX-10R', 'Z650', 'Z900', 'Versys 650', 'W175']
  },
  {
    id: 'benelli',
    name: 'Benelli',
    logo: 'https://www.carlogos.org/bike-logos/benelli-logo.png',
    type: 'bike',
    models: ['Imperiale 400', 'Leoncino 500', 'TRK 502', 'TNT 600i', '502C']
  },
  {
    id: 'jawa',
    name: 'Jawa',
    logo: 'https://www.carlogos.org/bike-logos/jawa-logo.png',
    type: 'bike',
    models: ['Jawa 42', 'Jawa Perak', 'Jawa 350']
  },
  {
    id: 'yezdi',
    name: 'Yezdi',
    logo: 'https://www.carlogos.org/bike-logos/yezdi-logo.png',
    type: 'bike',
    models: ['Roadster', 'Scrambler', 'Adventure']
  },
  {
    id: 'ola',
    name: 'Ola Electric',
    logo: 'https://www.carlogos.org/car-logos/ola-electric-logo.png',
    type: 'bike',
    models: ['S1', 'S1 Pro', 'S1 Air']
  },
  {
    id: 'ather',
    name: 'Ather Energy',
    logo: 'https://www.carlogos.org/bike-logos/ather-logo.png',
    type: 'bike',
    models: ['450X', '450 Plus', '450 Apex']
  }
];

export const getCarBrands = () => indianVehicleBrands.filter(brand => brand.type === 'car' || brand.type === 'both');
export const getBikeBrands = () => indianVehicleBrands.filter(brand => brand.type === 'bike' || brand.type === 'both');
export const getCommercialBrands = () => indianVehicleBrands.filter(brand => 
  ['tata', 'mahindra', 'force', 'bajaj'].includes(brand.id)
);

export const getBrandModels = (brandId: string): string[] => {
  const brand = indianVehicleBrands.find(b => b.id === brandId);
  return brand ? brand.models : [];
};