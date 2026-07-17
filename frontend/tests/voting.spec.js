import { test, expect } from '@playwright/test';

test.describe('Kiosk Voting Flow', () => {
  test('should allow a voter to login and cast a vote', async ({ page }) => {
    // Navigate to the voter login page (assuming kiosk booth ID 1)
    await page.goto('http://localhost:5173/vote/booth1');

    // Wait for login form
    const studentIdInput = page.locator('input[placeholder="Enter your Student ID"]');
    await studentIdInput.waitFor();
    await studentIdInput.fill('STU002');
    await page.getByRole('button', { name: /login/i }).click();

    // Check if redirected to ballot page
    await expect(page).toHaveURL(/.*\/ballot/);

    // Vote for a candidate
    // Assuming there is a button or div for candidates, just locating something clickable
    const firstCandidate = page.locator('.candidate-card').first();
    await firstCandidate.click();
    
    // Submit vote
    const submitBtn = page.getByRole('button', { name: /submit ballot/i });
    await submitBtn.click();

    // Check if receipt page shows up
    await expect(page).toHaveURL(/.*\/receipt/);
    await expect(page.locator('text=Thank you for voting')).toBeVisible();
  });
});
