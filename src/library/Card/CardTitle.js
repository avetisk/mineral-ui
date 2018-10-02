/* @flow */
import React, { Children, cloneElement } from 'react';
import { ellipsis } from 'polished';
import { createStyledComponent, pxToRem } from '../styles';
import IconDanger from '../Icon/IconDanger';
import IconSuccess from '../Icon/IconSuccess';
import IconWarning from '../Icon/IconWarning';
import CardRow from './CardRow';

type Props = {
  /** See the [Actions Menu](#actions-menu) example (will take precedence over `secondaryText`) */
  actions?: React$Node,
  /** Avatar image displayed beside the title */
  avatar?: string | React$Element<*>,
  /** Title of Card */
  children: React$Node,
  /** Information displayed beside the title (`actions` will take precedence over this) */
  secondaryText?: string | React$Element<*>,
  /** Subtitle displayed under the title */
  subtitle?: React$Node,
  /** Available variants */
  variant?: 'danger' | 'success' | 'warning'
};

export const componentTheme = (baseTheme: Object) => ({
  CardTitle_color: baseTheme.h4_color,
  CardTitle_fontSize: baseTheme.h4_fontSize,
  CardTitle_fontWeight: baseTheme.h4_fontWeight,

  CardTitleAvatar_margin: baseTheme.space_inline_sm,
  CardTitleAvatarSize: baseTheme.size_small,
  CardTitleAvatarSize_large: baseTheme.size_large,

  CardTitleIcon_margin: baseTheme.space_inline_sm,

  CardTitleSecondaryText_color: baseTheme.color_mouse,
  CardTitleSecondaryText_fontSize: baseTheme.fontSize_mouse,
  CardTitleSecondaryText_fontWeight: baseTheme.fontWeight_regular,

  CardSubtitle_color: baseTheme.color_mouse,
  CardSubtitle_fontSize: baseTheme.fontSize_mouse,
  CardSubtitle_fontWeight: baseTheme.fontWeight_regular,
  CardSubtitle_marginTop: baseTheme.space_stack_sm,

  ...baseTheme
});

const styles = {
  avatar: ({ subtitle, theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);

    const width = subtitle
      ? theme.CardTitleAvatarSize_large
      : theme.CardTitleAvatarSize;

    return {
      flex: '0 0 auto',
      [`margin${theme.rtlEnd}`]: theme.CardTitleAvatar_margin,
      width,

      '&[class] > *': {
        height: 'auto',
        width: '100%'
      }
    };
  },
  inner: {
    flex: '1 1 auto'
  },
  secondaryText: ({ theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);

    return {
      color: theme.CardTitleSecondaryText_color,
      flex: '0 0 auto',
      fontSize: theme.CardTitleSecondaryText_fontSize,
      fontWeight: theme.CardTitleSecondaryText_fontWeight,
      transform: `translateY(${pxToRem(5, theme)})`, // Optical alignment
      ...ellipsis('33%')
    };
  },
  root: {
    display: 'flex'
  },
  subtitle: ({ avatar, theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);

    return {
      color: theme.CardSubtitle_color,
      fontSize: theme.CardSubtitle_fontSize,
      fontWeight: theme.CardSubtitle_fontWeight,
      margin: 0,
      marginTop: avatar ? null : theme.CardSubtitle_marginTop
    };
  },
  title: ({ theme: baseTheme, variant }) => {
    const theme = componentTheme(baseTheme);

    return {
      alignItems: 'flex-start',
      display: 'flex',

      '& > [role="img"]': {
        color: variant ? theme[`icon_color_${variant}`] : null,
        [`margin${theme.rtlEnd}`]: theme.CardTitleIcon_margin,
        position: 'relative',
        top: pxToRem(4, theme) // optical alignment
      }
    };
  },
  titleContent: ({ actions, theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);

    return {
      color: theme.CardTitle_color,
      flex: '1 1 auto',
      fontSize: theme.CardTitle_fontSize,
      fontWeight: theme.CardTitle_fontWeight,
      margin: 0,
      [`margin${theme.rtlEnd}`]: actions && theme.CardTitleIcon_margin
    };
  }
};

const Avatar = createStyledComponent('span', styles.avatar);
const Inner = createStyledComponent('div', styles.inner);
const Root = createStyledComponent(CardRow, styles.root, {
  displayName: 'CardTitle'
});
const SecondaryText = createStyledComponent('span', styles.secondaryText);
const Subtitle = createStyledComponent('h4', styles.subtitle);
const Title = createStyledComponent('div', styles.title);
const TitleContent = createStyledComponent('h3', styles.titleContent);

const variantIcons = {
  danger: <IconDanger size="medium" />,
  success: <IconSuccess size="medium" />,
  warning: <IconWarning size="medium" />
};

/**
 * CardTitle displays a Card title and an optional subtitle.
 * You can put CardTitle in any order in relation to other root components of
 * [Card](/components/card).
 */
export default function CardTitle(props: Props) {
  const {
    actions,
    avatar,
    children,
    secondaryText,
    subtitle,
    variant,
    ...restProps
  } = props;
  const rootProps = {
    ...restProps
  };

  const secondaryComponent = actions ? (
    Children.map(actions, (action, index) =>
      cloneElement(action, { key: index })
    )
  ) : secondaryText ? (
    <SecondaryText>{secondaryText}</SecondaryText>
  ) : null;

  return (
    <Root {...rootProps}>
      {avatar && <Avatar subtitle={subtitle}>{avatar}</Avatar>}
      <Inner>
        <Title variant={variant}>
          {variant && variantIcons[variant]}
          <TitleContent actions={actions}>{children}</TitleContent>
          {secondaryComponent}
        </Title>
        {subtitle && <Subtitle avatar={avatar}>{subtitle}</Subtitle>}
      </Inner>
    </Root>
  );
}
