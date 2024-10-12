'use client';

import { Button } from 'rizzui';
import SimpleBar from '@ui/simplebar';
import EnvatoIcon from '@components/icons/envato';
import LayoutSwitcher from '@/layouts/layout-switcher';
import ColorOptions from '@/layouts/settings/color-options';
import ThemeSwitcher from '@/layouts/settings/theme-switcher';

export default function SettingsDrawer() {
  return (
    <>
      <SimpleBar className="h-[calc(100%-138px)]">
        <div className="px-5 py-6">
          <ThemeSwitcher />
          <ColorOptions />
        </div>
      </SimpleBar>

      <SettingsFooterButton />
    </>
  );
}

function SettingsFooterButton() {
  return (
    <a
      href="https://themeforest.net/item/isomorphic-react-redux-admin-dashboard/20262330?ref=redqteam"
      target="_blank"
      className="grid grid-cols-1 border-t border-muted px-6 pt-4"
    >
     
    </a>
  );
}
