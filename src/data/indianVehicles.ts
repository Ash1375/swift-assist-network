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
    logo: 'https://logos-download.com/wp-content/uploads/2016/06/Suzuki_logo_emblem_logotype.png',
    type: 'car',
    models: ['Alto 800', 'Alto K10', 'S-Presso', 'Wagon R', 'Swift', 'Dzire', 'Baleno', 'Ignis', 'Vitara Brezza', 'Ertiga', 'XL6', 'Ciaz', 'Grand Vitara', 'Jimny', 'Fronx', 'Invicto']
  },
  {
    id: 'hyundai',
    name: 'Hyundai',
    logo: 'https://logos-download.com/wp-content/uploads/2016/05/Hyundai_logo_symbol_emblem.png',
    type: 'car',
    models: ['Grand i10 NIOS', 'i20', 'i20 N Line', 'Aura', 'Venue', 'Venue N Line', 'Verna', 'Creta', 'Creta N Line', 'Alcazar', 'Tucson', 'Kona Electric', 'Ioniq 5', 'Exter']
  },
  {
    id: 'tata',
    name: 'Tata Motors',
    logo: 'https://logos-download.com/wp-content/uploads/2016/06/Tata_logo_emblem.png',
    type: 'both',
    models: ['Tiago', 'Tiago EV', 'Tigor', 'Tigor EV', 'Punch', 'Punch EV', 'Nexon', 'Nexon EV', 'Harrier', 'Safari', 'Hexa', 'Curvv', 'Curvv EV', 'Altroz', 'Altroz Racer']
  },
  {
    id: 'mahindra',
    name: 'Mahindra',
    logo: 'https://logos-download.com/wp-content/uploads/2016/05/Mahindra_logo_emblem.png',
    type: 'both',
    models: ['KUV100 NXT', 'XUV300', 'XUV3XO', 'Bolero', 'Bolero Neo', 'Bolero Neo Plus', 'Scorpio Classic', 'Scorpio-N', 'XUV700', 'XUV400', 'Thar', 'Thar Roxx', 'Marazzo', 'BE 6e', 'XEV 9e']
  },
  {
    id: 'honda-cars',
    name: 'Honda Cars',
    logo: 'https://logos-download.com/wp-content/uploads/2016/05/Honda_logo_logotype_emblem.png',
    type: 'car',
    models: ['Amaze', 'Jazz', 'WR-V', 'City', 'City Hybrid', 'City e:HEV']
  },
  {
    id: 'toyota',
    name: 'Toyota',
    logo: 'https://logos-download.com/wp-content/uploads/2016/02/Toyota_logo_PNG4.png',
    type: 'car',
    models: ['Glanza', 'Urban Cruiser Hyryder', 'Innova Crysta', 'Innova Hycross', 'Fortuner', 'Fortuner Legender', 'Hilux', 'Vellfire', 'Camry', 'Prius', 'Land Cruiser 300']
  },
  {
    id: 'kia',
    name: 'Kia',
    logo: 'https://logos-download.com/wp-content/uploads/2021/01/Kia_Logo_2021.png',
    type: 'car',
    models: ['Sonet', 'Seltos', 'Seltos X Line', 'Carens', 'EV6', 'EV9']
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    logo: 'https://logos-download.com/wp-content/uploads/2016/03/Volkswagen_logo_2019.png',
    type: 'car',
    models: ['Polo', 'Vento', 'Taigun', 'Virtus', 'Tiguan', 'Tiguan Allspace']
  },
  {
    id: 'skoda',
    name: 'Skoda',
    logo: 'https://logos-download.com/wp-content/uploads/2016/09/Skoda_logo_green_white_2011.png',
    type: 'car',
    models: ['Rapid', 'Kushaq', 'Kushaq Monte Carlo', 'Slavia', 'Slavia Monte Carlo', 'Kodiaq', 'Octavia', 'Superb']
  },
  {
    id: 'nissan',
    name: 'Nissan',
    logo: 'https://logos-download.com/wp-content/uploads/2016/03/Nissan_logo_logotype_emblem.png',
    type: 'car',
    models: ['Magnite', 'Kicks', 'X-Trail', 'GT-R']
  },
  {
    id: 'renault',
    name: 'Renault',
    logo: 'https://logos-download.com/wp-content/uploads/2016/03/Renault_logo_2015.png',
    type: 'car',
    models: ['Kwid', 'Triber', 'Kiger', 'Duster']
  },
  {
    id: 'mg',
    name: 'MG Motor',
    logo: 'https://logos-download.com/wp-content/uploads/2020/06/MG_Motor_Logo.png',
    type: 'car',
    models: ['Hector', 'Hector Plus', 'Hector Blackstorm', 'ZS EV', 'Gloster', 'Astor', 'Comet EV', 'Windsor EV']
  },
  {
    id: 'jeep',
    name: 'Jeep',
    logo: 'https://logos-download.com/wp-content/uploads/2016/05/Jeep_logo_emblem_2.png',
    type: 'car',
    models: ['Compass', 'Meridian', 'Wrangler', 'Grand Cherokee']
  },
  {
    id: 'citroen',
    name: 'Citroen',
    logo: 'https://logos-download.com/wp-content/uploads/2016/03/Citroen_logo_2016.png',
    type: 'car',
    models: ['C3', 'C3 Aircross', 'eC3']
  },
  {
    id: 'bmw',
    name: 'BMW',
    logo: 'https://logos-download.com/wp-content/uploads/2016/03/BMW_logo_2020.png',
    type: 'both',
    models: ['2 Series Gran Coupe', '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X4', 'X5', 'X6', 'X7', 'iX', 'iX1', 'i4', 'i7', 'Z4']
  },
  {
    id: 'mercedes',
    name: 'Mercedes-Benz',
    logo: 'https://logos-download.com/wp-content/uploads/2016/12/Mercedes_Benz_logo_PNG1.png',
    type: 'both',
    models: ['A-Class Limousine', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'EQB', 'EQE', 'EQS', 'AMG GT']
  },
  {
    id: 'audi',
    name: 'Audi',
    logo: 'https://logos-download.com/wp-content/uploads/2016/03/Audi_logo_PNG1.png',
    type: 'car',
    models: ['A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'e-tron GT', 'RS Q8', 'RS e-tron GT']
  },
  {
    id: 'volvo',
    name: 'Volvo',
    logo: 'https://logos-download.com/wp-content/uploads/2016/08/Volvo_logo_2014.png',
    type: 'car',
    models: ['XC40', 'XC40 Recharge', 'XC60', 'XC90', 'S90', 'C40 Recharge']
  },
  {
    id: 'force',
    name: 'Force Motors',
    logo: 'https://logos-download.com/wp-content/uploads/2020/06/Force_Motors_Logo.png',
    type: 'both',
    models: ['Gurkha', 'Trax', 'Traveller', 'Tempo', 'Urbania']
  },

  // Bike Brands
  {
    id: 'hero',
    name: 'Hero MotoCorp',
    logo: 'https://logos-download.com/wp-content/uploads/2020/06/Hero_MotoCorp_Logo.png',
    type: 'bike',
    models: ['HF Deluxe', 'HF 100', 'Splendor Plus', 'Splendor Plus XTEC', 'Passion Pro', 'Passion XTEC', 'Super Splendor', 'Glamour', 'Glamour XTEC', 'Xtreme 160R', 'Xtreme 125R', 'Xpulse 200', 'Xpulse 200T', 'Karizma XMR', 'Maestro Edge 125', 'Pleasure Plus', 'Destini 125', 'Vida V1']
  },
  {
    id: 'honda-bikes',
    name: 'Honda Motorcycles',
    logo: 'https://logos-download.com/wp-content/uploads/2016/05/Honda_logo_logotype_emblem.png',
    type: 'bike',
    models: ['Activa 6G', 'Activa 125', 'Activa 125H-Smart', 'Dio', 'Grazia', 'SP 125', 'Shine', 'Shine 100', 'Unicorn', 'Hornet 2.0', 'CB350RS', 'CBR150R', 'CBR250R', 'CB650R', 'CBR650R', 'Africa Twin', 'Gold Wing']
  },
  {
    id: 'bajaj',
    name: 'Bajaj',
    logo: 'https://logos-download.com/wp-content/uploads/2020/06/Bajaj_Logo.png',
    type: 'bike',
    models: ['Platina 100', 'Platina 110', 'CT 100', 'CT 110', 'Pulsar 125', 'Pulsar 150', 'Pulsar N150', 'Pulsar 220F', 'Pulsar NS200', 'Pulsar NS160', 'Pulsar RS200', 'Pulsar N250', 'Dominar 250', 'Dominar 400', 'Chetak Electric', 'Avenger Street 160', 'Freedom 125']
  },
  {
    id: 'tvs',
    name: 'TVS Motor',
    logo: 'https://logos-download.com/wp-content/uploads/2020/06/TVS_Motor_Logo.png',
    type: 'bike',
    models: ['Sport', 'Star City Plus', 'Radeon', 'Apache RTR 160', 'Apache RTR 160 4V', 'Apache RTR 200 4V', 'Apache RR 310', 'Ronin', 'Jupiter', 'Jupiter 125', 'Ntorq 125', 'Ntorq Race Edition', 'iQube Electric', 'iQube ST', 'XL100']
  },
  {
    id: 'royal-enfield',
    name: 'Royal Enfield',
    logo: 'https://logos-download.com/wp-content/uploads/2020/06/Royal_Enfield_Logo.png',
    type: 'bike',
    models: ['Bullet 350', 'Classic 350', 'Classic 350 Reborn', 'Hunter 350', 'Meteor 350', 'Thunderbird 350', 'Interceptor 650', 'Continental GT 650', 'Super Meteor 650', 'Shotgun 650', 'Himalayan', 'Himalayan 450', 'Scram 411', 'Guerrilla 450']
  },
  {
    id: 'ktm',
    name: 'KTM',
    logo: 'https://logos-download.com/wp-content/uploads/2016/12/KTM_logo_PNG3.png',
    type: 'bike',
    models: ['Duke 125', 'Duke 200', 'Duke 250', 'Duke 390', 'RC 125', 'RC 200', 'RC 390', 'Adventure 250', 'Adventure 390', '390 SMC R']
  },
  {
    id: 'yamaha',
    name: 'Yamaha',
    logo: 'https://logos-download.com/wp-content/uploads/2016/11/Yamaha_logo_PNG10.png',
    type: 'bike',
    models: ['Fascino 125', 'Fascino 125 Fi Hybrid', 'Ray ZR', 'Ray ZR Hybrid', 'Aerox 155', 'FZ-S', 'FZ-X', 'FZ25', 'FZS-FI', 'MT-15', 'MT-15 V2', 'R15 V4', 'R15M', 'YZF-R3', 'MT-03', 'MT-09', 'R1']
  },
  {
    id: 'suzuki-bikes',
    name: 'Suzuki Motorcycles',
    logo: 'https://logos-download.com/wp-content/uploads/2016/06/Suzuki_logo_emblem_logotype.png',
    type: 'bike',
    models: ['Access 125', 'Access 125 Special Edition', 'Burgman Street', 'Avenis', 'Gixxer 155', 'Gixxer SF 155', 'Gixxer SF 250', 'Intruder 155', 'V-Strom SX', 'Katana', 'GSX-R1000R', 'Hayabusa']
  },
  {
    id: 'kawasaki',
    name: 'Kawasaki',
    logo: 'https://logos-download.com/wp-content/uploads/2016/12/Kawasaki_logo_PNG1.png',
    type: 'bike',
    models: ['Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja 1000SX', 'Ninja ZX-10R', 'Ninja ZX-6R', 'Z250', 'Z650', 'Z900', 'Z1000', 'Versys 650', 'Versys 1000', 'W175', 'Vulcan S']
  },
  {
    id: 'benelli',
    name: 'Benelli',
    logo: 'https://logos-download.com/wp-content/uploads/2020/06/Benelli_Logo.png',
    type: 'bike',
    models: ['Imperiale 400', 'Leoncino 250', 'Leoncino 500', 'TRK 251', 'TRK 502', 'TRK 502X', 'TNT 300', 'TNT 600i', '502C', 'Tornado 252R']
  },
  {
    id: 'jawa',
    name: 'Jawa',
    logo: 'https://logos-download.com/wp-content/uploads/2020/06/Jawa_Logo.png',
    type: 'bike',
    models: ['Jawa 42', 'Jawa 42 FJ', 'Jawa Perak', 'Jawa 350', 'Jawa 300']
  },
  {
    id: 'yezdi',
    name: 'Yezdi',
    logo: 'https://logos-download.com/wp-content/uploads/2022/01/Yezdi_Logo.png',
    type: 'bike',
    models: ['Roadster', 'Scrambler', 'Adventure']
  },
  {
    id: 'ola',
    name: 'Ola Electric',
    logo: 'https://logos-download.com/wp-content/uploads/2021/08/Ola_Electric_Logo.png',
    type: 'bike',
    models: ['S1', 'S1 Pro', 'S1 Air', 'S1 X']
  },
  {
    id: 'ather',
    name: 'Ather Energy',
    logo: 'https://logos-download.com/wp-content/uploads/2020/06/Ather_Energy_Logo.png',
    type: 'bike',
    models: ['450X', '450 Plus', '450 Apex', 'Rizta']
  },
  {
    id: 'simple',
    name: 'Simple Energy',
    logo: 'https://logos-download.com/wp-content/uploads/2021/08/Simple_Energy_Logo.png',
    type: 'bike',
    models: ['Simple One', 'Simple Dot One']
  },
  {
    id: 'revolt',
    name: 'Revolt Motors',
    logo: 'https://logos-download.com/wp-content/uploads/2020/06/Revolt_Motors_Logo.png',
    type: 'bike',
    models: ['RV400', 'RV1', 'RV1+']
  },
  {
    id: 'ultraviolette',
    name: 'Ultraviolette',
    logo: 'https://logos-download.com/wp-content/uploads/2021/09/Ultraviolette_Logo.png',
    type: 'bike',
    models: ['F77', 'F77 Mach 2', 'F99']
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