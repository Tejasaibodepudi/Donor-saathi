# Age Verification Implementation

## Overview
Implemented age verification to ensure donors are at least 18 years old during registration. The system validates age based on date of birth both on frontend and backend.

## Minimum Age Requirement
- Donors must be at least 18 years old to register
- Age is calculated from date of birth
- Validation occurs on both frontend and backend

## Implementation Details

### 1. Registration Page (`app/register/page.tsx`)

#### Date of Birth Field
- Added date input field in donor registration form
- Field is required for all donor registrations
- Max date is set to today (prevents future dates)
- Positioned between Gender and Address fields

#### Age Calculation Function
```javascript
const calculateAge = (dob: string): number => {
  if (!dob) return 0
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
```

#### Frontend Validation
- Real-time age validation as user enters date of birth
- Shows error message if age < 18: "You must be at least 18 years old to donate blood"
- Prevents form submission if age requirement not met
- Error message displayed in red below the date field

#### Form Submission Validation
- Checks age before submitting registration
- Shows toast error if under 18
- Prevents API call if validation fails

### 2. Registration API (`app/api/auth/register/route.ts`)

#### Backend Validation
- Validates date of birth is provided for donors
- Calculates age using same algorithm as frontend
- Returns 400 error if age < 18
- Error message: "You must be at least 18 years old to register as a donor"

#### Validation Flow
1. Check if dateOfBirth is provided (required field)
2. Calculate age from date of birth
3. Reject registration if age < 18
4. Proceed with registration if age >= 18

### 3. Translations

Added translations for date of birth field and age restriction message in all supported languages:

#### English
- dateOfBirth: "Date of Birth"
- ageRestriction: "You must be at least 18 years old to donate blood"

#### Telugu (తెలుగు)
- dateOfBirth: "పుట్టిన తేదీ"
- ageRestriction: "రక్తదానం చేయడానికి మీరు కనీసం 18 సంవత్సరాల వయస్సు ఉండాలి"

#### Hindi (हिंदी)
- dateOfBirth: "जन्म तिथि"
- ageRestriction: "रक्तदान करने के लिए आपकी उम्र कम से कम 18 वर्ष होनी चाहिए"

#### Tamil (தமிழ்)
- dateOfBirth: "பிறந்த தேதி"
- ageRestriction: "இரத்த தானம் செய்ய நீங்கள் குறைந்தது 18 வயது இருக்க வேண்டும்"

#### Kannada (ಕನ್ನಡ)
- dateOfBirth: "ಹುಟ್ಟಿದ ದಿನಾಂಕ"
- ageRestriction: "ರಕ್ತದಾನ ಮಾಡಲು ನೀವು ಕನಿಷ್ಠ 18 ವರ್ಷ ವಯಸ್ಸಿನವರಾಗಿರಬೇಕು"

## User Experience

### For Users 18+ Years Old
1. Enter date of birth in registration form
2. No error message shown
3. Can successfully submit registration
4. Account created successfully

### For Users Under 18 Years Old
1. Enter date of birth in registration form
2. Red error message appears immediately below field
3. Cannot submit form (validation prevents submission)
4. If somehow bypassed, backend returns error
5. Toast notification shows: "You must be at least 18 years old to register as a donor"

## Security & Validation

### Frontend Validation
- Immediate feedback to users
- Prevents unnecessary API calls
- Clear error messaging
- Date picker prevents future dates

### Backend Validation
- Server-side validation ensures security
- Cannot be bypassed by manipulating frontend
- Consistent age calculation algorithm
- Returns appropriate HTTP status codes

### Age Calculation Accuracy
- Accounts for leap years
- Considers month and day of birth
- Handles edge cases (birthday today, etc.)
- Consistent between frontend and backend

## Testing Scenarios

1. **Valid age (18+)**: Enter DOB making user 18 or older → Registration succeeds
2. **Invalid age (<18)**: Enter DOB making user under 18 → Error shown, registration blocked
3. **Edge case (exactly 18)**: Enter DOB exactly 18 years ago → Registration succeeds
4. **Missing DOB**: Try to submit without DOB → Required field validation triggers
5. **Future date**: Date picker prevents selecting future dates
6. **Backend bypass attempt**: Direct API call with age <18 → 400 error returned

## No Breaking Changes
- Only affects new donor registrations
- Existing donors unaffected
- Other user types (blood banks, hospitals, institutions) not affected
- Backward compatible with existing data
