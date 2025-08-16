# Facility Booking App

A mobile application built with **React Native** and **Expo Router** to manage facility bookings. Users can view available facilities, check availability, make bookings, and manage their bookings.

---

## Features

### Facility Management
- View a list of available facilities.
- Display facility details: name, description, capacity, status.
- Check daily availability of a facility using a **date picker**.
- Render available time slots and indicate if fully booked.

### Booking Management
- View user’s bookings (`/facilities/bookings/my`).
- Filter bookings by status (`booked` or `cancelled`).
- Sort bookings by creation date (`asc` or `desc`).
- Pagination support.
- Cancel a booking via API (`/facilities/bookings/{id}` DELETE).

### Booking a Facility
- Select a facility, date, start hour, and optional notes.
- Fetch **daily availability** to ensure only available time slots can be booked.

---


## Tech Stack

- **React Native CLI** / **Expo Router**
- **TypeScript**
- **React Query** (`@tanstack/react-query`)
- **Axios** for API requests
- **Date & Time Handling:** `@react-native-community/datetimepicker`, `dayjs`
- **Picker:** `@react-native-picker/picker`
- **State Management:** Zustand (`useAuthStore`)
- **UI:** react-native-paper"
- **Router:** expo-router(`useRouter`)
- etc.
---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/RiyanAldian/facility-booking.git
cd facility-booking
```

2. Install dependency
```bash
npm install
# or
yarn install
```

3. Start the development
```bash 
npm run start
# or
yarn start
```


## Acknowledgements

- [React Native](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/)
- [React Query](https://tanstack.com/query/latest)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
