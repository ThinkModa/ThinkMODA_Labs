# Typeform Integration Guide

## Overview
This guide explains how to properly integrate Typeform surveys into lessons to ensure automatic user data population and webhook functionality.

## Current Status
✅ **All 16 existing Typeform lessons are properly formatted and working**

## Required Format for Typeform URLs

### ✅ Correct Format
```
/embed https://form.typeform.com/to/FORM_ID
```

### ❌ Incorrect Formats
```
# Missing /embed prefix
https://form.typeform.com/to/FORM_ID

# Incorrect prefix
/https://form.typeform.com/to/FORM_ID

# With parameters (will be overridden)
/embed https://form.typeform.com/to/FORM_ID#param=value

# With placeholder values
/embed https://form.typeform.com/to/FORM_ID#user_id=xxxxx
```

## How It Works

### 1. Dynamic URL Generation
When a user views a lesson with a Typeform URL, the system automatically:
- Detects the Typeform URL
- Extracts the form ID using regex: `/form\.typeform\.com\/to\/([a-zA-Z0-9]+)/`
- Generates a dynamic URL with hidden fields:
  ```
  https://form.typeform.com/to/FORM_ID#user_id=USER_ID&lesson_id=LESSON_ID&course_id=COURSE_ID&first_name=FIRST_NAME&last_name=LAST_NAME&email=EMAIL&company_name=COMPANY_NAME&phone_number=PHONE_NUMBER
  ```

### 2. Webhook Processing
When users submit the form, Typeform sends the data to our webhook at:
```
POST /api/webhook/exercise-completion
```

The webhook extracts user data from the hidden fields and marks the lesson as completed.

## Adding New Typeform Lessons

### Step 1: Create the Typeform
1. Create your Typeform at [typeform.com](https://typeform.com)
2. Note the form ID from the URL (e.g., `AMeQc5ZN`)

### Step 2: Add to Lesson Content
In the lesson content, add the Typeform URL in the correct format:
```
/embed https://form.typeform.com/to/YOUR_FORM_ID
```

### Step 3: Configure Webhook (if needed)
If this is a new form, you may need to:
1. Go to your Typeform settings
2. Add a webhook pointing to: `https://your-domain.com/api/webhook/exercise-completion`
3. The webhook will automatically receive user data from hidden fields

## Current Typeform Forms

| Lesson | Form ID | Status |
|--------|---------|--------|
| The Visionary | pZp1eiDj | ✅ Working |
| The Mission | ZIevyTG8 | ✅ Working |
| The Plan | xHocdpeq | ✅ Working |
| The Baseline | TgYsSfUX | ✅ Working |
| The Assessment | NjzuCVgZ | ✅ Working |
| Mind Mapping Your Concept \| Pre-Course Survey | jaIrL2wj | ✅ Working |
| Mind Mapping Your Concept \| Course Activity & Worksheet | ZMoY83OC | ✅ Working |
| Mind Mapping Your Concept \| Post Course Survey | zJS8qHKm | ✅ Working |
| Value Proposition & Pledge \| Pre-Course Survey | wT9JfjRX | ✅ Working |
| Value Proposition & Pledge Statement \| Course Activity & Worksheet | Uhbg4Grc | ✅ Working |
| Value Proposition & Pledge \| Post Course Survey | PNQmUQeN | ✅ Working |
| Job to be Done \| Pre-Course Survey | VUkrWCpH | ✅ Working |
| Job to be Done \| Course Activity & Worksheet | Xf6Svbc2 | ✅ Working |
| Job to be Done \| Post Course Survey | I6mP2fcW | ✅ Working |
| Know Your Flow \| Pre-Course Survey | AMeQc5ZN | ✅ Working |
| Know Your Flow \| Post Course Survey | sdYlw3fj | ✅ Working |

## Troubleshooting

### Issue: Hidden fields show as empty strings
**Cause**: The Typeform URL format is incorrect
**Solution**: Ensure the URL starts with `/embed ` and has no parameters

### Issue: Webhook receives "xxxxx" values
**Cause**: The lesson content contains placeholder values
**Solution**: Use clean URLs without any parameters or placeholders

### Issue: Form ID not detected
**Cause**: The URL format doesn't match the expected pattern
**Solution**: Use the exact format: `/embed https://form.typeform.com/to/FORM_ID`

## Testing

To test a new Typeform integration:
1. Add the lesson with the correct URL format
2. View the lesson as a logged-in user
3. Check browser console for debugging messages:
   - `🔍 Checking Typeform detection`
   - `🔄 Generating dynamic Typeform URL`
   - `✅ Generated URL`
4. Submit the form and check the webhook logs

## Best Practices

1. **Always use the `/embed` prefix** - This ensures proper iframe embedding
2. **Keep URLs clean** - No parameters, placeholders, or extra data
3. **Test thoroughly** - Verify the form works with real user data
4. **Monitor webhooks** - Check that user data is being received correctly
5. **Use consistent naming** - Follow the existing lesson naming patterns

## Support

If you encounter issues with Typeform integration:
1. Check the browser console for debugging messages
2. Verify the URL format matches the requirements
3. Test with a known working form ID
4. Check webhook logs for data reception

