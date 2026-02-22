# Rare Donor Registry Eligibility Restriction

## Overview
Implemented blood group eligibility restriction for the Rare Donor Registry. Only donors with blood groups A-, B-, AB+, and AB- can join the program.

## Eligible Blood Groups
- A- (A negative)
- B- (B negative)
- AB+ (AB positive)
- AB- (AB negative)

## Implementation Details

### 1. Registration Page (`app/register/page.tsx`)
- Rare Donor Registry opt-in checkbox only appears for eligible blood groups
- Conditional rendering based on selected blood group
- Users with other blood groups (A+, B+, O+, O-) won't see the opt-in option

### 2. Registration API (`app/api/auth/register/route.ts`)
- Backend validation during registration
- Only creates RareDonorProfile if:
  - Feature flag is enabled
  - User opts in
  - Blood group is in eligible list
- Silently skips profile creation for ineligible blood groups

### 3. Rare Donor Profile API (`app/api/rare-donors/profile/route.ts`)
- Added eligibility check when creating/updating profiles
- Returns 403 error if donor tries to create profile with ineligible blood group
- Error message: "Only donors with blood groups A-, B-, AB+, and AB- are eligible for the Rare Donor Registry"

### 4. Rare Donor Card Component (`frontend/components/rare-donor-card.tsx`)
- Checks donor's blood group eligibility
- Shows ineligibility message for non-eligible blood groups
- Displays donor's current blood group in the message
- Prevents access to rare donor features for ineligible users

## User Experience

### For Eligible Donors (A-, B-, AB+, AB-)
1. During registration, they see the "Join the Rare Blood Registry" option
2. If they opt in, a rare donor profile is created
3. In their dashboard, they see the full Rare Donor Program card with all features
4. They can update privacy settings and upload medical proof

### For Ineligible Donors (A+, B+, O+, O-)
1. During registration, they don't see the rare donor registry option
2. No rare donor profile is created
3. In their dashboard:
   - If they somehow have a profile (legacy data), they see an ineligibility message
   - The message explains only A-, B-, AB+, AB- are eligible
   - Shows their current blood group
   - No access to rare donor features

## Security & Validation

### Frontend Validation
- Conditional rendering prevents UI clutter
- Clear messaging for ineligible users

### Backend Validation
- Registration API validates before creating profile
- Profile API validates on every POST request
- Prevents unauthorized profile creation via API calls

## No Breaking Changes
- Existing rare donor profiles remain functional
- Feature flag still controls overall feature availability
- Backward compatible with existing data
- Ineligible users with existing profiles see clear messaging

## Testing Scenarios

1. **Eligible donor registration**: Select A-, B-, AB+, or AB- → See opt-in checkbox → Can join
2. **Ineligible donor registration**: Select A+, B+, O+, or O- → No opt-in checkbox shown
3. **Profile access**: Ineligible donor with profile → See ineligibility message
4. **API protection**: Direct API call with ineligible blood group → 403 error
