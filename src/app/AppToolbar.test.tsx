import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../courses/common/testUtils';
import { AppToolbar } from './AppToolbar';

function renderToolbar(route = '/') {
  return renderWithProviders(
    <>
      <AppToolbar />
      <div>current page</div>
    </>,
    { route },
  );
}

describe('AppToolbar', () => {
  it('links to COURSES and ABOUT', () => {
    renderToolbar();

    expect(screen.getByRole('link', { name: 'COURSES' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'ABOUT' })).toHaveAttribute('href', '/about');
  });

  it('renders the links in order inside the primary (teal) app bar', () => {
    renderToolbar();

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('MuiAppBar-colorPrimary', 'MuiPaper-elevation6');
    expect(Array.from(banner.querySelectorAll('a'), (a) => a.textContent)).toEqual(['COURSES', 'ABOUT']);
  });

  it('keeps the label text as written (no uppercase transform) like mat-button', () => {
    renderToolbar();

    expect(screen.getByRole('link', { name: 'ABOUT' })).toHaveStyle({ textTransform: 'none' });
  });

  it('navigates to /about and back to / when the links are clicked', async () => {
    const user = userEvent.setup();
    const { router } = renderToolbar('/');

    await user.click(screen.getByRole('link', { name: 'ABOUT' }));
    expect(router.state.location.pathname).toBe('/about');

    await user.click(screen.getByRole('link', { name: 'COURSES' }));
    expect(router.state.location.pathname).toBe('/');
  });
});
