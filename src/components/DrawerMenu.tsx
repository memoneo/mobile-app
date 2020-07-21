import React from "react"
import { Icon } from "react-native-elements"
import { withNavigation, NavigationInjectedProps } from "react-navigation"
import { ViewStyle, View } from "react-native"

interface OwnProps {
  style: ViewStyle
}

type Props = OwnProps & NavigationInjectedProps

class DrawerMenu extends React.PureComponent<Props> {
  render(): JSX.Element {
    return <View style={this.props.style}><Icon  name="menu" type="feather" /></View>
  }
}

export default withNavigation(DrawerMenu)
