'use babel';
import React from 'react';
import {DragSource} from 'react-dnd';
import styled from 'styled-components';

export const StyledBubble = styled.button`
  display: inline-block;
  color: blue;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

// Drag sources and drop targets only interact
// if they have the same string type.
// You want to keep types in a separate file with
// the rest of your app's constants.

const Types = {
  BUBBLE: 'bubble'
};

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const bubbleSource = {
  isDragging(props, monitor) {
    // If your component gets unmounted while dragged
    // (like a card in Kanban board dragged between lists)
    // you can implement something like this to keep its
    // appearance dragged:
    return monitor.getItem().id === props.id;
  },

  beginDrag(props, monitor, component) {
    // Return the data describing the dragged item
    const item = { id: props.id };
    return item;
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }

    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    const item = monitor.getItem();

    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    const dropResult = monitor.getDropResult();

    // This is a good place to call some Flux action
    BubbleActions.moveCardToList(item.id, dropResult.listId);
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging()
  };
}


class Bubble extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Your component receives its own props as usual
    const { id } = this.props;

    // These props are injected by React DnD,
    // as defined by your `collect` function above:
    const { isDragging, connectDragSource } = this.props;
    return connectDragSource(
      <div>
        <StyledBubble>
          <p>Bubble</p>
        </StyledBubble>
      </div>
    );
  }
}
export default DragSource(Types.BUBBLE, bubbleSource, collect)(Bubble);
