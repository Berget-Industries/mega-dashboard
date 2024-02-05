import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { user } = useAuthContext();

  const data = useMemo(() => {
    const items = [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Statistik', path: paths.dashboard.analytics, icon: ICONS.analytics },
      { title: 'Ärenden', path: paths.dashboard.tickets.root, icon: ICONS.booking },
    ];
    if (user?.systemAdmin) {
      items.push({ title: 'Anpassning', path: paths.dashboard.settings, icon: ICONS.lock });
    }
    const adminItems = [
      { title: 'Organisationer', path: paths.dashboard.admin.organizations, icon: ICONS.banking },
      { title: 'Användare', path: paths.dashboard.admin.users, icon: ICONS.user },
    ];

    const sections = [
      {
        subheader: 'Översikt',
        items,
      },
    ];

    if (user?.systemAdmin) {
      sections.push({
        subheader: 'Admin',
        items: adminItems,
      });
    }
    return sections;
  }, [user]);

  return data;
}
