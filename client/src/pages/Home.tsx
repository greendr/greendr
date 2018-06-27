import * as React from 'react';
import TodoListView from '../components/TodoListView';

import './timeline.css';
import KPI from '../components/KPIs/KPI';

export default class Home extends React.Component {
  render() {
    return (
      <div className="home">
        Home
        <KPI icon="home" />
        <KPI icon="favorite" />
        <TodoListView name="Mor" />
      </div>
    );
  }
}
