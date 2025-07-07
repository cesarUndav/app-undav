// components/ApplyRadiusToLastChild.tsx

import React from 'react';
import { ViewStyle, StyleProp, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
  borderRadiusStyle?: StyleProp<ViewStyle>;
};

export default function ApplyRadiusToLastChild({ children, borderRadiusStyle = styles.defaultRadius }: Props) {
  const childrenArray = React.Children.toArray(children);

  return (
    <>
      {childrenArray.map((child, index) => {
        const isLast = index === childrenArray.length - 1;

        if (React.isValidElement(child)) {
          // Cast to ReactElement with props
          const typedChild = child as React.ReactElement<any>;

          return React.cloneElement(typedChild, {
            ...typedChild.props,
            style: [typedChild.props.style, isLast ? borderRadiusStyle : null],
          });
        }

        return child;
      })}
    </>
  );
}

const styles = StyleSheet.create({
  defaultRadius: {
    borderBottomRightRadius: 20,
  },
});
