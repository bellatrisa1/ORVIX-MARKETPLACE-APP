import { expect, test, type Page } from '@playwright/test';

async function addProduct(page: Page) {
  await page.goto('/');
  const card = page
    .locator('.product-card')
    .filter({
      has: page.getByRole('button', { name: 'В корзину', exact: true }),
    })
    .first();
  await expect(card).toBeVisible();
  const title = await card.locator('h3').innerText();
  await card.locator('h3 a').click();
  await expect(
    page.getByRole('heading', { name: title, exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Добавить в корзину', exact: true })
    .click();
  return title;
}

async function fillCheckout(page: Page) {
  await page.getByLabel('Имя', { exact: true }).fill('Демо Покупатель');
  await page.getByLabel('Email', { exact: true }).fill('buyer@example.com');
  await page.getByLabel('Телефон', { exact: true }).fill('+7 999 000 00 00');
  await page
    .getByLabel('Адрес', { exact: true })
    .fill('Демонстрационная улица, 1');
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await page.getByRole('radio', { name: /Пункт выдачи/ }).check();
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await expect(page.getByRole('radio', { name: /Наличными/ })).toBeDisabled();
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
}

test('каталог → товар → корзина → демозаказ → история → перезагрузка', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|hydrating/i.test(message.text())
    )
      errors.push(message.text());
  });
  const title = await addProduct(page);
  await page
    .getByRole('button', { name: 'Добавить в избранное', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Удалить из избранного', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Удалить из избранного', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Увеличить количество', exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('product.png'),
    fullPage: true,
  });
  await page
    .locator('.header__actions')
    .getByRole('link', { name: /Избранное/ })
    .click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card h3 a')).toContainText(title);
  await page.locator('.product-card__image-wrap').click();
  await expect(
    page.getByRole('heading', { name: title, exact: true }),
  ).toBeVisible();
  await page
    .locator('.header__actions')
    .getByRole('link', { name: /Корзина/ })
    .click();
  await expect(page.locator('.cart-item')).toContainText(title);
  await expect(page.locator('.cart-item h3 a')).toHaveAttribute(
    'href',
    /\/product\/\d+/,
  );
  await page.getByRole('link', { name: 'Оформить заказ', exact: true }).click();
  await fillCheckout(page);
  await page
    .getByRole('button', { name: 'Подтвердить демозаказ', exact: true })
    .dblclick();
  await expect(
    page.getByRole('heading', { name: 'Демозаказ сохранён!' }),
  ).toBeVisible();
  const id = await page.getByTestId('saved-order-id').innerText();
  expect(id).toMatch(/^demo-/);
  await expect(page).toHaveURL(new RegExp(`order=${id}$`));
  const persisted = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('orvix-storage')!),
  );
  expect(persisted.state.orders).toHaveLength(1);
  expect(persisted.state.cartItems).toHaveLength(0);
  expect(persisted.state.orders[0].details.email).toBe('buyer@example.com');
  expect(JSON.stringify(persisted)).not.toContain('password');
  await page.reload();
  await expect(page.getByTestId('saved-order-id')).toHaveText(id);
  await page
    .getByRole('link', { name: 'История демозаказов', exact: true })
    .click();
  await expect(page.getByTestId('order-card')).toHaveCount(1);
  await expect(page.getByTestId('order-card')).toContainText(id);
  await expect(page.getByTestId('order-card')).toContainText(title);
  await page.reload();
  await expect(page.getByTestId('order-card')).toContainText(id);
  await expect(page.getByTestId('order-card')).toContainText(
    'buyer@example.com',
  );
  await page.screenshot({
    path: testInfo.outputPath('history.png'),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test('ошибка записи оставляет корзину и прежнее сохранение', async ({
  page,
}) => {
  await addProduct(page);
  await page.goto('/checkout');
  await fillCheckout(page);
  const before = await page.evaluate(() =>
    localStorage.getItem('orvix-storage'),
  );
  // Имитируем только отказ записи. Успешное сохранение и перезагрузка в основном тесте используют настоящий localStorage.
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    };
  });
  await page
    .getByRole('button', { name: 'Подтвердить демозаказ', exact: true })
    .click();
  await expect(page.locator('main').getByRole('alert')).toContainText(
    'Не удалось сохранить',
  );
  expect(await page.evaluate(() => localStorage.getItem('orvix-storage'))).toBe(
    before,
  );
  await page.reload();
  await page.goto('/cart');
  await expect(page.locator('.cart-item')).toHaveCount(1);
});

test('город гостя, меню, клавиатура, категории, 404 и Hero', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await expect(page.locator('.product-card h3').first()).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('home-initial.png') });
  await page.locator('.city-btn').click();
  const city = page.getByRole('dialog', { name: 'Выберите город' });
  await expect(
    city.getByRole('button', { name: 'Закрыть выбор города' }),
  ).toBeFocused();
  await city.getByRole('button', { name: 'Москва', exact: true }).click();
  await expect(page.locator('.city-btn')).toContainText('Москва');
  await expect(page.locator('.city-btn')).toBeFocused();
  await page.reload();
  await expect(page.locator('.city-btn')).toContainText('Москва');
  const trigger = page.getByRole('button', { name: 'Каталог', exact: true });
  await trigger.click();
  const menu = page.getByRole('dialog', { name: 'Каталог и навигация' });
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Shift+Tab');
  await expect(menu.locator('a').last()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  if (testInfo.project.name === 'mobile') {
    await expect(
      menu
        .getByRole('navigation')
        .getByRole('link', { name: 'Поддержка', exact: true }),
    ).toBeVisible();
    await menu
      .getByRole('navigation')
      .getByRole('link', { name: 'Поддержка', exact: true })
      .click();
    await expect(page).toHaveURL(/\/support$/);
    await page.goto('/');
    await trigger.click();
  }
  await menu.getByRole('link', { name: 'Смартфоны', exact: true }).click();
  await expect(page).toHaveURL(/\/category\/smartphones$/);
  await expect(page.locator('.product-card h3').first()).toBeVisible();
  await page.goto('/category/unknown-category');
  await expect(page.getByRole('heading', { name: /404/ })).toBeVisible();
  await page.goto('/product/999999');
  await expect(page.getByRole('heading', { name: /404/ })).toBeVisible();
  await page.goto('/');
  await page.getByRole('button', { name: 'Следующий слайд' }).click();
  await expect(page.locator('.hero__subtitle')).toHaveText('Электроника');
  await page.getByRole('button', { name: 'Слайд 3', exact: true }).click();
  await expect(page.locator('.hero__subtitle')).toHaveText('Дом и интерьер');
  await expect(page.locator('.hero__cta')).toHaveAttribute(
    'href',
    '/category/furniture',
  );
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('home.png'),
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Слайд 1', exact: true }).click();
  await page
    .getByRole('link', { name: 'Смотреть предложения', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Скидки', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/#catalog-products$/);
});
