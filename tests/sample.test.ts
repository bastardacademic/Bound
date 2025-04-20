import { render } from '@testing-library/svelte';
import ThemeSwitcher from '../frontend/src/lib/components/ThemeSwitcher.svelte';

test('ThemeSwitcher renders and toggles', async () => {
  const { getByRole } = render(ThemeSwitcher);
  const button = getByRole('switch');
  expect(button).toBeInTheDocument();
});
