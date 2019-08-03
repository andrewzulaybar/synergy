import { Component } from 'react';

class Subject extends Component {
  observers = [];

  addObserver = (observer) => {
    this.observers.push(observer);
  };

  notifyAllObservers() {
    let i;
    for(i = 0; i < this.observers.length; i++)
      this.observers[i].update();
  }
}

export default Subject;