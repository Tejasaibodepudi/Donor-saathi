# Donor Metrics Implementation

## Overview
Implemented donor reliability metrics based on trust score, visible only to blood banks (not hospitals).

## Features Implemented

### 1. Donor Metrics Calculation (`frontend/lib/donor-metrics.ts`)
Calculates three key metrics based on donor trust score (0-100):

- **Response Probability**: Likelihood donor will respond (30-98%)
  - 0-30 trust: 30-50% probability
  - 31-60 trust: 50-75% probability
  - 61-85 trust: 75-90% probability
  - 86-100 trust: 90-98% probability

- **Fulfillment Confidence**: Reliability level
  - 80+ trust: Very High
  - 60-79 trust: High
  - 40-59 trust: Medium
  - 0-39 trust: Low

- **Expected ETA**: Response time estimate
  - 80+ trust & 85%+ probability: Within 1-2 hours
  - 60+ trust & 70%+ probability: Within 2-4 hours
  - 40+ trust & 55%+ probability: Within 4-8 hours
  - 20+ trust: Same day
  - <20 trust: 1-2 days

### 2. Donor Metrics Badge Component (`frontend/components/donor-metrics-badge.tsx`)
Two display variants:

- **Compact**: Shows response probability badge with tooltip containing all metrics
- **Detailed**: Shows all three metrics with icons in expanded format

### 3. Blood Bank Appointments Page Integration
- Updated `app/blood-bank/appointments/page.tsx` to show donor metrics
- Updated `frontend/components/appointment-card.tsx` to support metrics display
- Updated `app/api/appointments/route.ts` to include donor trust score in API response
- Metrics shown for all appointment statuses: booked, checked_in, completed

### 4. Hospital Access Restriction
- Hospital search page (`app/hospital/search/page.tsx`) does NOT show donor details
- Hospitals can only see blood bank inventory, not individual donor information
- Donor metrics are exclusive to blood banks

## Usage

### For Blood Banks
When viewing appointments, blood banks will see:
- Donor name with response probability badge (hover for full metrics)
- All three metrics: Response Probability, Fulfillment Confidence, Expected ETA
- Trust score displayed in tooltip

### For Hospitals
- Can only search and view blood bank inventory
- No access to donor information or metrics
- Focus on blood unit availability only

## Technical Details

### API Changes
- `GET /api/appointments`: Now includes `donorTrustScore` field in response

### Component Props
- `AppointmentCard`: Added `showMetrics` prop (boolean)
- `DonorMetricsBadge`: Accepts `trustScore` and `variant` props

### Trust Score Mapping
The system uses the existing `trustScore` field (0-100) from the donor model to calculate all metrics dynamically.

## No Breaking Changes
- All existing functionality preserved
- Metrics are additive features
- Backward compatible with existing components
