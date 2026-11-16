import test from 'node:test';
import assert from 'node:assert/strict';

import {
  RESTAURANT_MENU,
  filterMenuByCategory,
  calculateSelectionTotal,
  validateReservationForm,
  buildRestaurantWhatsApp,
} from './restaurante/js/logic.js';

import {
  PIZZERIA_MENU,
  filterPizzeriaMenu,
  updateCartItem,
  calculatePizzeriaTotal,
  buildPizzeriaWhatsAppUrl,
} from './pizzeria/js/logic.js';

import {
  DENTAL_TREATMENTS,
  validateDentalAppointment,
  buildDentalWhatsAppUrl,
} from './odontologia/js/logic.js';

import {
  BARBER_SERVICES,
  BARBER_TEAM,
  filterBarberServices,
  validateBarberBooking,
  buildBarberWhatsAppUrl,
} from './barberia/js/logic.js';

import {
  COFFEE_ORIGINS,
  CAFE_MENU,
  filterCafeMenu,
  calculateCafeTotal,
  buildCafeWhatsAppUrl,
} from './cafeteria/js/logic.js';

import {
  BAKERY_CATALOG,
  filterBakeryCatalog,
  validateCustomCakeOrder,
  buildBakeryWhatsAppUrl,
} from './pasteleria/js/logic.js';

import {
  MEDICAL_SPECIALTIES,
  validateMedicalAppointment,
  buildMedicalWhatsAppUrl,
} from './consultorio/js/logic.js';

import {
  LEGAL_PRACTICE_AREAS,
  validateLegalConsultForm,
  buildLegalWhatsAppUrl,
} from './juridico/js/logic.js';

import {
  BEAUTY_SERVICES,
  filterBeautyServices,
  validateBeautyBooking,
  buildBeautyWhatsAppUrl,
} from './belleza/js/logic.js';

import {
  PROPERTIES_CATALOG,
  filterProperties,
  buildPropertyWhatsAppUrl,
} from './inmobiliaria/js/logic.js';

import {
  AUTO_SERVICES,
  filterAutoServices,
  validateAutoTurn,
  buildAutoWhatsAppUrl,
} from './automotriz/js/logic.js';

import {
  HOTEL_ROOMS,
  validateHotelStay,
  buildHotelWhatsAppUrl,
} from './hotel/js/logic.js';

import {
  STORE_PRODUCTS,
  filterStoreProducts,
  updateStoreCart,
  calculateStoreTotal,
  buildStoreWhatsAppUrl,
} from './tienda/js/logic.js';

import {
  GYM_PROGRAMS,
  GYM_PLANS,
  filterGymPrograms,
  validateGymTrialForm,
  buildGymWhatsAppUrl,
} from './gimnasio/js/logic.js';

import {
  ACADEMY_COURSES,
  filterAcademyCourses,
  validateEnrollmentForm,
  buildAcademyWhatsAppUrl,
} from './academia/js/logic.js';

import {
  EVENT_FORMATS,
  filterEventFormats,
  validateEventQuote,
  buildEventWhatsAppUrl,
} from './eventos/js/logic.js';

test('Restaurante: filtra el menú, calcula totales y construye enlace de WhatsApp', () => {
  assert.equal(filterMenuByCategory(RESTAURANT_MENU, 'Todos').length, RESTAURANT_MENU.length);
  const entradas = filterMenuByCategory(RESTAURANT_MENU, 'Entradas');
  assert.ok(entradas.length >= 2);
  assert.ok(entradas.every((item) => item.category === 'Entradas'));

  const total = calculateSelectionTotal([
    { price: 9.5, qty: 2 },
    { price: 6.5, qty: 1 },
  ]);
  assert.equal(total, 25.5);

  const invalid = validateReservationForm({ name: 'A', guests: '0', date: '', time: '', phone: '123' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.guests);

  const valid = validateReservationForm({
    name: 'Andrés León',
    guests: '4',
    date: '2026-12-01',
    time: '19:30',
    phone: '+593 99 123 4567',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildRestaurantWhatsApp(valid.clean, [{ name: 'Tiradito de Trucha', price: 9.5, qty: 2 }]);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('KALLPA'));
});

test('Pizzería: filtra menú, actualiza carrito (+/-) y genera total y WhatsApp', () => {
  const pizzas = filterPizzeriaMenu(PIZZERIA_MENU, 'Pizzas');
  assert.ok(pizzas.length >= 2);
  assert.ok(pizzas.every((item) => item.category === 'Pizzas'));

  let cart = [];
  const sample = pizzas[0];
  cart = updateCartItem(cart, sample, 1);
  cart = updateCartItem(cart, sample, 1);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].qty, 2);
  assert.equal(calculatePizzeriaTotal(cart), sample.price * 2);

  cart = updateCartItem(cart, sample, -2);
  assert.equal(cart.length, 0);
  assert.equal(calculatePizzeriaTotal(cart), 0);

  const waUrl = buildPizzeriaWhatsAppUrl([{ id: sample.id, name: sample.name, price: 11.0, qty: 1 }], 'Lucía', 'Yanuncay');
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('FORNO BRAVO'));
});

test('Odontología: contiene 4 especialidades y valida solicitud de cita en 24h', () => {
  assert.equal(Object.keys(DENTAL_TREATMENTS).length, 4);

  const invalid = validateDentalAppointment({ name: '', phone: '12', specialty: '', date: '', time: '' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.specialty);

  const valid = validateDentalAppointment({
    name: 'Carla Mendoza',
    phone: '+593 98 765 4321',
    specialty: 'Ortodoncia',
    date: '2026-12-03',
    time: '15:00',
    notes: 'Valoración inicial',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildDentalWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('ALBA DENTAL'));
});

test('Barbería: filtra servicios, incluye equipo ficticio y valida reservas', () => {
  assert.equal(BARBER_TEAM.length, 3);
  const cortes = filterBarberServices(BARBER_SERVICES, 'Cortes');
  assert.ok(cortes.length >= 2);
  assert.ok(cortes.every((s) => s.category === 'Cortes'));
  assert.equal(filterBarberServices(BARBER_SERVICES, 'Todos').length, BARBER_SERVICES.length);

  const invalid = validateBarberBooking({ name: 'J', phone: '123', service: '', barber: '', date: '', time: '' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.service);

  const valid = validateBarberBooking({
    name: 'Mateo Jaramillo',
    phone: '+593 99 555 0123',
    service: 'Ritual Completo Tres Filos ($21.00 USD)',
    barber: 'Matías Ordóñez',
    date: '2026-12-05',
    time: '17:30',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildBarberWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('TRES FILOS'));
});

test('Cafetería: orígenes ecuatorianos, filtrado de carta, bandeja y WhatsApp', () => {
  assert.equal(Object.keys(COFFEE_ORIGINS).length, 3);
  const metodos = filterCafeMenu(CAFE_MENU, 'Métodos');
  assert.ok(metodos.length >= 2);
  assert.ok(metodos.every((item) => item.category === 'Métodos'));
  assert.equal(calculateCafeTotal([{ price: 3.25, qty: 2 }, { price: 4.0, qty: 1 }]), 10.5);

  const waUrl = buildCafeWhatsAppUrl([{ name: 'Flat White de Altura', price: 3.25, qty: 2 }], 'azuay');
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('ORIGEN CUENCA'));
});

test('Pastelería: filtra vitrina y valida cotización de torta personalizada', () => {
  const pasteles = filterBakeryCatalog(BAKERY_CATALOG, 'Pasteles enteros');
  assert.ok(pasteles.length >= 2);
  assert.equal(validateCustomCakeOrder({ name: '', phone: '1', flavor: '', portions: '', date: '' }).valid, false);

  const valid = validateCustomCakeOrder({
    name: 'Valeria Paredes',
    phone: '+593 98 444 1234',
    flavor: 'Cacao & Frutos Rojos',
    portions: '20 porciones',
    date: '2026-12-18',
    notes: 'Sin nueces',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildBakeryWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('TRIGAL DORADO'));
});

test('Consultorio médico: 4 especialidades y validación de cita médica 24h', () => {
  assert.equal(Object.keys(MEDICAL_SPECIALTIES).length, 4);
  assert.equal(validateMedicalAppointment({ name: 'A', phone: '', specialty: '', date: '', time: '' }).valid, false);

  const valid = validateMedicalAppointment({
    name: 'Esteban Cordero',
    phone: '+593 99 222 8899',
    specialty: 'Cardiología Preventiva',
    date: '2026-12-10',
    time: '16:30',
    reason: 'Chequeo preventivo',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildMedicalWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('CENTRO MÉDICO TOMEBAMBA'));
});

test('Estudio jurídico: áreas de práctica y consulta confidencial validada', () => {
  assert.equal(Object.keys(LEGAL_PRACTICE_AREAS).length, 4);
  assert.equal(validateLegalConsultForm({ name: 'X', phone: '1', area: '', modality: '', summary: 'corto' }).valid, false);

  const valid = validateLegalConsultForm({
    name: 'Inversiones Azuay SAS',
    phone: '+593 98 333 7766',
    area: 'Derecho Societario y Corporativo',
    modality: 'Presencial en Cuenca',
    summary: 'Revisión de pacto de socios y estatuto social.',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildLegalWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('VALDIVIESO'));
});

test('Salón de belleza: filtra tratamientos y valida reserva estética', () => {
  const capilar = filterBeautyServices(BEAUTY_SERVICES, 'Capilar');
  assert.ok(capilar.length >= 2);
  assert.equal(validateBeautyBooking({ name: '', phone: '', service: '', date: '', time: '' }).valid, false);

  const valid = validateBeautyBooking({
    name: 'Sofía Vintimilla',
    phone: '+593 99 101 2020',
    service: 'Limpieza Facial & Hidratación Profunda',
    date: '2026-12-14',
    time: '11:00',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildBeautyWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('ATELIER ROSA'));
});

test('Inmobiliaria: filtra propiedades por operación, tipo, sector y habitaciones', () => {
  const ventasVergel = filterProperties(PROPERTIES_CATALOG, {
    operation: 'Venta',
    type: 'Casa',
    sector: 'El Vergel',
    minRooms: 3,
  });
  assert.equal(ventasVergel.length, 1);
  assert.equal(ventasVergel[0].id, 'AH-101');

  const alquileres = filterProperties(PROPERTIES_CATALOG, { operation: 'Alquiler' });
  assert.ok(alquileres.every((p) => p.operation === 'Alquiler'));

  const waUrl = buildPropertyWhatsAppUrl(ventasVergel[0]);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('ANDES HOGAR'));
});

test('Taller automotriz: filtra servicios técnicos y valida turno vehicular', () => {
  const diag = filterAutoServices(AUTO_SERVICES, 'Diagnóstico');
  assert.equal(diag.length, 2);
  assert.equal(validateAutoTurn({ name: 'L', phone: '12', vehicle: 'AB', service: '', date: '', time: '' }).valid, false);

  const valid = validateAutoTurn({
    name: 'Diego Morales',
    phone: '+593 98 909 1122',
    vehicle: 'Mazda CX-5 2021',
    service: 'Escaneo Electrónico Computarizado OBD-II',
    date: '2026-12-11',
    time: '09:30',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildAutoWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('TORQUE ANDINO'));
});

test('Hotel boutique: valida que fecha de salida sea posterior a ingreso y arma WhatsApp', () => {
  assert.equal(HOTEL_ROOMS.length, 3);
  const badDates = validateHotelStay({
    name: 'Elena Ríos',
    phone: '+593 99 888 4433',
    room: 'Suite Balcón del Río',
    guests: '2',
    checkIn: '2026-12-20',
    checkOut: '2026-12-19',
  });
  assert.equal(badDates.valid, false);
  assert.ok(badDates.errors.checkOut);

  const valid = validateHotelStay({
    name: 'Elena Ríos',
    phone: '+593 99 888 4433',
    room: 'Suite Balcón del Río',
    guests: '2',
    checkIn: '2026-12-20',
    checkOut: '2026-12-23',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildHotelWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('CASA DEL BARRANCO'));
});

test('Tienda & comercio: búsqueda por texto, categoría, carrito (+/-) y subtotal USD', () => {
  const searched = filterStoreProducts(STORE_PRODUCTS, 'Textiles', 'lana');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'manta-lana');

  let cart = [];
  cart = updateStoreCart(cart, STORE_PRODUCTS[0], 2);
  cart = updateStoreCart(cart, STORE_PRODUCTS[0], -1);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].qty, 1);
  assert.equal(calculateStoreTotal(cart), STORE_PRODUCTS[0].price);

  const waUrl = buildStoreWhatsAppUrl(cart);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('MERCADO SERRANO'));
});

test('Gimnasio: programas por disciplina, planes en USD y pase de prueba', () => {
  assert.equal(GYM_PLANS.length, 3);
  assert.equal(filterGymPrograms(GYM_PROGRAMS, 'Fuerza').length, 1);
  assert.equal(validateGymTrialForm({ name: '', phone: '', plan: '', timeSlot: '' }).valid, false);

  const valid = validateGymTrialForm({
    name: 'Pablo Serrano',
    phone: '+593 99 777 6655',
    plan: 'Plan Trimestral ($99.00 USD)',
    timeSlot: '18:00',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildGymWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('PULSO 360'));
});

test('Academia: filtra cursos por área y modalidad, y valida inscripción', () => {
  const online = filterAcademyCourses(ACADEMY_COURSES, 'Todos', 'En línea');
  assert.equal(online.length, 2);
  assert.equal(validateEnrollmentForm({ name: 'K', phone: '', course: '', modality: '' }).valid, false);

  const valid = validateEnrollmentForm({
    name: 'Camila Aguirre',
    phone: '+593 98 654 3210',
    course: 'Inglés Comunicativo B1–B2',
    modality: 'Presencial Cuenca',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildAcademyWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('INSTITUTO PAIDEIA'));
});

test('Eventos: filtra formatos y valida aforo mínimo y fecha para cotización', () => {
  assert.equal(filterEventFormats(EVENT_FORMATS, 'Bodas').length, 1);
  const lowGuests = validateEventQuote({
    name: 'Fernanda Vélez',
    phone: '+593 99 321 0987',
    eventType: 'Bodas',
    guests: '5',
    date: '2026-12-28',
  });
  assert.equal(lowGuests.valid, false);
  assert.ok(lowGuests.errors.guests);

  const valid = validateEventQuote({
    name: 'Fernanda Vélez',
    phone: '+593 99 321 0987',
    eventType: 'Bodas en Hacienda o Quinta Andina',
    guests: '120',
    date: '2026-12-28',
    notes: 'Ceremonia al aire libre',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildEventWhatsAppUrl(valid.clean);
  assert.match(waUrl, /^https:\/\/wa\.me\/593979290747\?text=/);
  assert.ok(decodeURIComponent(waUrl).includes('VERBENA & ESTILO'));
});

