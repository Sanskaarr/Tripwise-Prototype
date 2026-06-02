import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // 1. Intercept Auth Login API
  await page.route('**/api/auth/login', async (route) => {
    const requestBody = route.request().postDataJSON();
    const identifier = requestBody?.identifier || '';

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          exists: false,
          isNewUser: true,
          token: 'mock-e2e-token-999',
          identifier
        }
      })
    });
  });

  // 2. Intercept Validate Session API
  await page.route('**/api/auth/validate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          success: true,
          isValid: true,
          isNewUser: true,
          identifier: 'e2e-user@example.com',
          token: 'mock-e2e-token-999'
        }
      })
    });
  });

  // 3. Intercept Create Profile API
  await page.route('**/api/profiles', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          profileId: 'mock-profile-id-e2e',
          status: 'DRAFT'
        }
      })
    });
  });

  // 4. Intercept Profile Update/Sync endpoints to return success
  await page.route('**/api/profiles/mock-profile-id-e2e/basicInfo', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          profileId: 'mock-profile-id-e2e',
          status: 'DRAFT'
        }
      })
    });
  });
});

test.describe('TripWise E2E Flows', () => {
  test('should display Landing page and navigate to Authentication', async ({ page }) => {
    await page.goto('/');

    // Check Landing page headings and elements
    await expect(page.getByText('with TripWise').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Journey', exact: true })).toBeVisible();

    // Click to navigate to auth page
    await page.getByRole('button', { name: 'Start Journey', exact: true }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('should trigger validation warnings on empty or incorrect login formats', async ({ page }) => {
    await page.goto('/auth');

    // Confirm Continue button is disabled when input is empty
    const continueBtn = page.getByRole('button', { name: 'Continue' });
    await expect(continueBtn).toBeDisabled();

    // Submit invalid input format (which enables the button)
    const inputField = page.locator('#identifier');
    await inputField.fill('invalid-phone-or-email');
    await continueBtn.click();
    await expect(page.locator('text=Please enter a valid phone number or email address')).toBeVisible();
  });

  test('should authenticate and allow completion of wizard step 1', async ({ page }) => {
    // Start at login
    await page.goto('/auth');
    const inputField = page.locator('#identifier');
    await inputField.fill('e2e-user@example.com');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify redirect to Plan welcome page
    await expect(page).toHaveURL(/\/plan$/);
    await expect(page.locator('h1')).toContainText("Let's craft your");

    // Click Begin Planning to start the steps
    await page.getByRole('button', { name: 'Begin Planning' }).click();
    await expect(page).toHaveURL(/\/plan\/step\/1$/);

    // Verify Step 1 elements
    await expect(page.locator('h2')).toContainText("Let's Start With The Basics");

    // Complete the form inputs
    const nameField = page.getByPlaceholder('Enter your full name');
    await nameField.fill('E2E Tester');

    const whatsappField = page.getByPlaceholder('+91 98765 43210');
    await whatsappField.fill('+919876543210');

    const emailField = page.getByPlaceholder('your@email.com');
    await emailField.fill('e2e-user@example.com');

    const cityField = page.getByPlaceholder('e.g., Mumbai, Delhi');
    await cityField.fill('Mumbai');

    // Click Continue Step to save and progress
    const nextBtn = page.getByRole('button', { name: 'Continue Step' });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Verify we transitioned to Step 2 (Dates page)
    await expect(page).toHaveURL(/\/plan\/step\/2$/);
  });
});
