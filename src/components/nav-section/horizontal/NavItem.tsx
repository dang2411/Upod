import { ReactElement, forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
// config
import { ICON } from '../../../config';
// type
import { NavItemProps } from '../type';
//
import Iconify from '../../Iconify';
import { ListItemStyle, ListItemStyleProps } from './style';
import { isExternalLink } from '..';

// ----------------------------------------------------------------------

// HANDLE SHOW ITEM BY ROLE
const ListItem = forwardRef<HTMLButtonElement & HTMLAnchorElement, ListItemStyleProps>(
  (props, ref) => (
    <RoleBasedGuard roles={props.roles}>
      <ListItemStyle {...props} ref={ref}>
        {props.children}
      </ListItemStyle>
    </RoleBasedGuard>
  )
);

export const NavItemRoot = forwardRef<HTMLButtonElement & HTMLAnchorElement, NavItemProps>(
  ({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
    const { translate } = useLocales();

    const { title, path, icon, children, disabled, roles } = item;

    if (children) {
      return (
        <ListItem
          ref={ref}
          open={open}
          activeRoot={active}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          disabled={disabled}
          roles={roles}
        >
          <NavItemContent icon={icon} title={translate(title)} children={children} />
        </ListItem>
      );
    }

    return isExternalLink(path) ? (
      <ListItem
        component={Link}
        href={path}
        target="_blank"
        rel="noopener"
        disabled={disabled}
        roles={roles}
      >
        <NavItemContent icon={icon} title={translate(title)} children={children} />
      </ListItem>
    ) : (
      <ListItem
        component={RouterLink}
        to={path}
        activeRoot={active}
        disabled={disabled}
        roles={roles}
      >
        <NavItemContent icon={icon} title={translate(title)} children={children} />
      </ListItem>
    );
  }
);

// ----------------------------------------------------------------------

export const NavItemSub = forwardRef<HTMLButtonElement & HTMLAnchorElement, NavItemProps>(
  ({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
    const { translate } = useLocales();

    const { title, path, icon, children, disabled, roles } = item;

    if (children) {
      return (
        <ListItem
          ref={ref}
          subItem
          disableRipple
          open={open}
          activeSub={active}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          disabled={disabled}
          roles={roles}
        >
          <NavItemContent icon={icon} title={translate(title)} children={children} subItem />
        </ListItem>
      );
    }

    return isExternalLink(path) ? (
      <ListItem
        subItem
        href={path}
        disableRipple
        rel="noopener"
        target="_blank"
        component={Link}
        disabled={disabled}
        roles={roles}
      >
        <NavItemContent icon={icon} title={translate(title)} children={children} subItem />
      </ListItem>
    ) : (
      <ListItem
        disableRipple
        component={RouterLink}
        to={path}
        activeSub={active}
        subItem
        disabled={disabled}
        roles={roles}
      >
        <NavItemContent icon={icon} title={translate(title)} children={children} subItem />
      </ListItem>
    );
  }
);

// ----------------------------------------------------------------------

type NavItemContentProps = {
  title: string;
  icon?: ReactElement;
  children?: { title: string; path: string }[];
  subItem?: boolean;
};

function NavItemContent({ icon, title, children, subItem }: NavItemContentProps) {
  const { translate } = useLocales();

  return (
    <>
      {icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
            '& svg': { width: '100%', height: '100%' },
          }}
        >
          {icon}
        </Box>
      )}

      {translate(title)}

      {children && (
        <Iconify
          icon={subItem ? 'eva:chevron-right-fill' : 'eva:chevron-down-fill'}
          sx={{
            ml: 0.5,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
          }}
        />
      )}
    </>
  );
}
