import { Injectable } from '@angular/core';
import { Machine, State, StateNode } from 'xstate';
import { StandardMachine, ParallelMachine } from 'xstate/lib/types';

/*
  Generated class for the LightMachineProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LightMachineProvider {
  private lightMachine: StandardMachine | ParallelMachine;
  public currentState: State;

  constructor() {
    const pedestrianStates = {
      initial: 'walk',
      states: {
        walk: {
          on: {
            PED_COUNTDOWN: 'wait'
          },
          data: {
            pedLightColor: 'green',
            mode: 'constant',
          },
        },
        wait: {
          on: {
            PED_COUNTDOWN: 'stop'
          },
          data: {
            pedLightColor: 'red',
            mode: 'constant',
          },
        },
        stop: {
          data: {
            pedLightColor: 'red',
            mode: 'flash',
          },
        }
      }
    };
    
    this.lightMachine = Machine({
      key: 'light',
      strict: true,
      initial: 'red',
      states: {
        green: {
          on: {
            TIMER: {
              'yellow': {
                actions: [
                  'goToYellow'
                ]
              }
            },
            POWER_OUTAGE: 'red'
          },
          data: {
            lightColor: 'green',
            mode: 'constant',
          },
          onEntry: [
            'onEntryGreen'
          ]
        },
        yellow: {
          on: {
            TIMER: 'red',
            POWER_OUTAGE: 'red'
          },
          data: {
            lightColor: 'yellow',
            mode: 'constant',
          },
        },
        red: {
          on: {
            TIMER: 'green',
            POWER_OUTAGE: 'red'
          },
          data: {
            lightColor: 'red',
            mode: 'constant',
          },
          onEntry: ['onEntryRed'],
          ...pedestrianStates
        }
      }
    });

    this.currentState = this.lightMachine.initialState;
    // initial transition needed, because otherwise 'data' is not set correctly
    this.transition({ type: 'TIMER' });
  }

  /**
   * Returns a list of all events allowed for the given state.
   * 
   * @param state State or StateNode object
   * @returns Array
   */
  listEvents(state: State | StateNode): string[] {
    let events = [];
    // get node to access events of the state
    let stateNode = (state instanceof State) ? this.lightMachine.getState(state.toString()) : state;
    // add state events
    if (Object.keys(stateNode.on).length) {
      events.push(...Object.keys(stateNode.on));
    }
    // add events of all superstates
    if (stateNode.parent) {
      let parentEvents = this.listEvents(stateNode.parent!);
      if (parentEvents.length) {
        events.push(...parentEvents);
      }
    }
    return events;
  }

  /**
   * Returns whether the event can be triggered on the given state or not.
   * 
   * @param state State or StateNode object
   * @param event event as string
   */
  eventAllowed(state: State | StateNode, event: string): boolean {
    return this.listEvents(state).indexOf(event) >= 0;
  }

  /**
   * 
   * @param event 
   */
  transition(event: any): any {
    this.currentState = this.lightMachine.transition(this.currentState, event.type);

    let nextStateData = this.currentState.actions.
      reduce((state, action) => this.command(action, event.data) || state, {});
    console.log(nextStateData);
    return nextStateData;
  }

  /**
   * Returns string representation for fetched data
   * @param action 
   * @param event 
   */
  command(action: any, data: any) {
    switch (action) {
      case 'onEntryRed':
      console.log('initializing red');
        return {
          input: data,
          return: 'Server response: fetched data for initializing state red'
        };
      case 'onEntryGreen':
        console.log('initializing green');
        return {
          input: data,
          return: 'Server response: fetched data for initializing state green'
        };
      case 'goToYellow':
        console.log('switching to yellow');
        return {
          input: data,
          return: 'Server response: data for state yellow'
        };
      default:
        console.log('action not allowed');
    }
  }

  getData(): any {
    let dataObj = {};
    for (var data in this.currentState.data) {
      dataObj = Object.assign(this.currentState.data[data], dataObj);
    }
    return dataObj;
  }
}
