import * as React from "react"
import { TextStyle, StyleProp, StyleSheet } from "react-native"
import { Badge, BadgeProps } from "react-native-elements"
import { primaryColor } from "../../lib/colors"

interface OwnProps extends BadgeProps {
}

const MBadge: React.FC<OwnProps> = ({ badgeStyle, ...props }) => (
  <Badge
    textStyle={styles.badgeTextStyle}
    badgeStyle={StyleSheet.flatten([badgeStyle, styles.badgeBadgeStyle])}
    {...props}
  />
)

export default MBadge

const styles = StyleSheet.create({
  badgeTextStyle: {
    fontFamily: "Nunito-Regular",
  },
  badgeBadgeStyle: {
    backgroundColor: primaryColor,
  },
})
