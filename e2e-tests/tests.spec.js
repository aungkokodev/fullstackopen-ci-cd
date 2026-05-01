import { test, describe, expect, beforeEach } from '@playwright/test'

describe('Pokedex', () => {
  beforeEach(async ({ page }) => {
    await page.route(
      'https://pokeapi.co/api/v2/pokemon/?limit=50',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            results: [
              {
                name: 'ivysaur',
                url: 'https://pokeapi.co/api/v2/pokemon/2/',
              },
            ],
          }),
        })
      },
    )
    await page.route(
      'https://pokeapi.co/api/v2/pokemon/ivysaur',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            name: 'ivysaur',
            types: [
              {
                slot: 1,
                type: { name: 'grass' },
              },
            ],
            stats: [
              {
                base_stat: 45,
                stat: { name: 'hp' },
              },
            ],
            abilities: [
              {
                ability: { name: 'overgrow' },
                is_hidden: false,
              },
              {
                ability: { name: 'chlorophyll' },
                is_hidden: true,
              },
            ],
            sprites: {
              front_default: 'https://example.com/img.png',
            },
          }),
        })
      },
    )
    await page.goto('http://localhost:8080')
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByText('ivysaur')).toBeVisible()
    await expect(
      page.getByText(
        'Pokémon and Pokémon character names are trademarks of Nintendo.',
      ),
    ).toBeVisible()
  })

  test('users can navigate from homepage to a specific Pokémon detail page', async ({
    page,
  }) => {
    const locator = page.getByText(/ivysaur/i)
    await locator.click()
    await expect(page.getByText(/ivysaur/i)).toBeVisible()
    await expect(page.getByText(/overgrow/i)).toBeVisible()
    await expect(page.getByText(/chlorophyll/i)).toBeVisible()
  })
})
