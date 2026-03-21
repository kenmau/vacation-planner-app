import { test, expect } from "@playwright/test";

test.describe("Top bar Trips button", () => {
  test.describe("Desktop viewport", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("Trips button is visible in header", async ({ page }) => {
      await page.goto("/");
      const tripsLink = page.locator("header").getByRole("link", { name: "Trips" });
      await expect(tripsLink).toBeVisible();
    });

    test("Trips button appears to the left of Pack button", async ({ page }) => {
      await page.goto("/");
      const tripsLink = page.locator("header").getByRole("link", { name: "Trips" });
      const packLink = page.locator("header").getByRole("link", { name: "Pack" });

      const tripsBBox = await tripsLink.boundingBox();
      const packBBox = await packLink.boundingBox();
      expect(tripsBBox).not.toBeNull();
      expect(packBBox).not.toBeNull();
      expect(tripsBBox!.x).toBeLessThan(packBBox!.x);
    });

    test("Trips button navigates to home page", async ({ page }) => {
      await page.goto("/packing");
      const tripsLink = page.locator("header").getByRole("link", { name: "Trips" });
      await tripsLink.click();
      await expect(page).toHaveURL("/");
    });

    test("Trips button is highlighted on home page", async ({ page }) => {
      await page.goto("/");
      const tripsLink = page.locator("header").getByRole("link", { name: "Trips" });
      await expect(tripsLink).toHaveClass(/font-medium/);
    });

    test("Trips button is not highlighted on packing page", async ({ page }) => {
      await page.goto("/packing");
      const tripsLink = page.locator("header").getByRole("link", { name: "Trips" });
      await expect(tripsLink).not.toHaveClass(/font-medium/);
    });
  });

  test.describe("Mobile viewport", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("Trips button is hidden on mobile", async ({ page }) => {
      await page.goto("/");
      const tripsLink = page.locator("header").getByRole("link", { name: "Trips" });
      await expect(tripsLink).toBeHidden();
    });
  });
});
