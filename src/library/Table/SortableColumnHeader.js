/* @flow */
import React from 'react';
import { createStyledComponent, pxToEm } from '../styles';
import IconArrowDropdownDown from '../Icon/IconArrowDropdownDown';
import IconArrowDropdownUp from '../Icon/IconArrowDropdownUp';
import TH from './TH';

import type { Messages, Sort } from './DataTable';

type Props = {
  /** Rendered content */
  children: React$Node,
  /** Accessible label */
  label?: string,
  /** Name of column */
  name: string,
  /** Called when button is clicked */
  onClick: (name: string, nextDirection: string) => void,
  /** Various messages and labels used by DataTable */
  messages: Messages,
  /** Sorted column & direction. For use with controlled components. */
  sort?: Sort
};

const componentTheme = (baseTheme: Object) => ({
  TH_border_focus: `1px solid ${baseTheme.borderColor_theme_focus}`,
  ...baseTheme
});

const focusStyles = (theme) => ({
  outline: theme.TH_border_focus,
  outlineOffset: `-${theme.TH_border_focus.split(' ')[0]}` // TODO: IE?
});

const styles = {
  root: ({ theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);

    return {
      cursor: 'pointer',

      '&:hover': {
        color: theme.icon_color_theme
      },

      '&:focus-within': focusStyles(theme)
    };
  },
  button: ({ theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);

    return {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      verticalAlign: theme.TH_verticalAlign,
      whiteSpace: 'nowrap',
      width: '100%',

      '&:focus': focusStyles(theme),

      '*:focus-within > &:focus': {
        outline: 0
      }
    };
  },
  content: {
    whiteSpace: 'normal'
  },
  iconHolder: ({ isActiveSort, theme }) => {
    const iconAdjustment = pxToEm(2);
    const space = `${parseFloat(theme.space_inline_xxs) +
      parseFloat(iconAdjustment)}em`;

    return {
      color: theme.icon_color,
      display: 'inline-block',
      height: '0.875em',
      marginLeft: theme.direction === 'ltr' ? space : null,
      marginRight: theme.direction === 'rtl' ? space : null,
      opacity: isActiveSort ? null : 0,
      position: 'relative',
      top: 3,
      width: '0.875em',

      '& > [role="img"]': {
        margin: `-${iconAdjustment}`
      },

      '*:hover > button > &, button:focus > &': {
        color: 'inherit',
        opacity: 1
      }
    };
  }
};

const Root = createStyledComponent(TH, styles.root, {
  withProps: { noPadding: true }
});
const Button = createStyledComponent(TH, styles.button, {
  withProps: { element: 'button' }
});
const Content = createStyledComponent('span', styles.content);
const IconHolder = createStyledComponent('span', styles.iconHolder);

const iconProps = {
  'aria-hidden': true,
  size: 'auto'
};
const sortIcon = {
  ascending: <IconArrowDropdownUp {...iconProps} />,
  descending: <IconArrowDropdownDown {...iconProps} />
};

export default function SortableColumnHeader({
  children,
  label,
  name,
  messages,
  onClick,
  sort,
  ...restProps
}: Props) {
  const sortColumn = sort && sort.column;
  const sortDirection = sort && sort.direction;

  const isActiveSort = sortColumn === name && Boolean(sortDirection);
  const activeDirection = isActiveSort && sortDirection;
  const nextDirection =
    activeDirection === 'ascending' ? 'descending' : 'ascending';

  const a11yLabel = label || children;

  const rootProps = {
    ...restProps,
    // TODO: Mac Chrome VO (others?) announces this twice?
    'aria-label': a11yLabel,
    'aria-sort': sortColumn === name ? sortDirection : 'none',
    // TODO: Feels wrong to duplicate onClick like this (see buttonProps)
    // onClick: () => {
    //   onClick(name, nextDirection);
    // },
    role: 'columnheader'
  };

  const buttonProps = {
    ...restProps,
    'aria-label': messages.sortButtonLabel(messages.sortOrder[nextDirection]),
    onClick: () => {
      onClick(name, nextDirection);
    }
  };
  const iconHolderProps = {
    isActiveSort
  };

  return (
    <Root {...rootProps}>
      <Button {...buttonProps}>
        <Content>{children}</Content>&nbsp;<IconHolder {...iconHolderProps}>
          {activeDirection ? sortIcon[activeDirection] : sortIcon.ascending}
        </IconHolder>
      </Button>
    </Root>
  );
}
