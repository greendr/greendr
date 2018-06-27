import * as React from 'react';
import { Slider, FontIcon, Grid, Cell } from 'react-md';

interface IProps {
  icon: string;
  sliderColor?: string;
  iconColor?: string;
}

interface IState {
  progress: number;
}

/**
 * A class to display an icon and a slider which represents a KPI
 */
export default class KPI extends React.Component<IProps, IState> {

  private interval: NodeJS.Timer | null = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      progress: 0
    };
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  render() {

    const iconColor = this.props.iconColor || '#AD1457';
    const sliderColor = this.props.sliderColor || '#E91E63';

    return (
      <Grid style={{ width: 300, margin: 0 }}>
        <Cell size={12}>
          <Slider
            id="continuous-plain-slider"
            value={this.state.progress}
            discrete={true}
            disabled={true}
            leftIcon={<FontIcon primary={true} style={{ color: iconColor }}>{this.props.icon}</FontIcon>}
            trackStyle={{ background: sliderColor }}
            thumbStyle={{ background: sliderColor }}
          />
        </Cell>
      </Grid>
    );
  }

  private clearInterval = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private start = () => {
    this.clearInterval();

    this.interval = setInterval(
      () => {
        const progress = this.state.progress + 10;
        this.setState({ progress: progress <= 100 ? progress : 0 });
      },
      1000);
  }
}