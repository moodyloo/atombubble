'use babel';
import React from 'react';
import interact from 'interactjs';

import {StyledBubble, StyledHandle, StyledDragIcon,
          StyledRemoveIcon, StyledMinusIcon,StyledLinkIcon} from './styled/bubble.styled.js';

export default class Bubble extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.getMenu = this.getMenu.bind(this);
    this.linkBubble = this.linkBubble.bind(this);
  }


  dragMoveListener = event => {
   const target = event.target;
   const { x: stateX, y: stateY } = this.state;
   // keep the dragged position in the data-x/data-y attributes
   const x = (parseFloat(stateX) || 0) + event.dx;
   const y = (parseFloat(stateY) || 0) + event.dy;

   // translate the element
   target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;

   // update the position attributes
   this.setState({ x, y });
  };

  resizeListener = event => {
    const target = event.target;
    const { x: stateX, y: stateY } = this.state;
    let x = parseFloat(stateX) || 0;
    let y = parseFloat(stateY) || 0;

    // update the element's style
    target.style.width = `${event.rect.width}px`;
    target.style.height = `${event.rect.height}px`;

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform = `translate(${x}px,${y}px)`;

    this.setState({ x, y });
  };

  ref = React.createRef();

  interact = null;


  componentDidMount() {
      this.interact = interact(this.ref.current);
      this.setInteractions();
      //create new atom text editor to update version
      var bubble = document.createElement('atom-text-editor');
      var bubblemodel = bubble.getModel();
      //marker
      var marker = this.props.marker;

      var clone,original;

      if (Object.keys(marker) !== 0) { //if marker exist
        //detect change in bubble, update original text editor if change
        clone = bubblemodel.onDidStopChanging(()=>{
          if (this.props.originalmodel.getTextInBufferRange(marker) !== bubblemodel.getText()) {
            this.props.originalmodel.setTextInBufferRange(marker,bubblemodel.getText());
          }
        });
        //detect change in original text editor, if change edit bubble
        original = this.props.originalmodel.onDidSave(()=>{
          bubblemodel.setText(this.props.originalmodel.getTextInBufferRange(marker));
        });

      } else { //else*********************************************************************
        //detect change in bubble, update original text editor if change
        clone = bubblemodel.onDidStopChanging(()=>{
          if (this.props.originalmodel.getText() !== bubblemodel.getText()) { //prevent re setText
              this.props.originalmodel.setText(bubblemodel.getText());
          }
        });
        //detect change in original text editor, if change edit bubble
        original = this.props.originalmodel.onDidSave(()=> {
          bubblemodel.setText(this.props.originalmodel.getText());
        });
      }


      //initialise text in bubble from original text editor
      bubblemodel.insertText(this.props.originalmodel.getText());
      //insert atom-text-editor to its corresponding bubble
      document.getElementById("bubble"+this.props.unique).append(bubble);

      //set colour of bubble
      var bubbleColour ="rgb("+this.props.colour[0]+","+this.props.colour[1]+","+this.props.colour[2]+")";
      //store model disposable to be called later after bubble deletion
      this.setState({clone,original,bubbleColour,marker});
  }

  //unsubscribe model reference upon deletion of bubble
  componentWillUnmount() {
    this.state.clone.dispose();
    this.state.original.dispose();
    this.state.marker.destroy();
    this.interact.unset();
    console.log("bubble"+this.props.unique+" deleted!");
  }

  setInteractions() {
    if (this.props.draggable)
      this.interact.draggable({
        allowFrom: '#handle'+this.props.unique,
        autoScroll: true,
        restrict: {
            elementRect: { top: 1, left: 0, bottom: 1, right: 0 }
        },
        onmove: this.dragMoveListener,
      });


    if (this.props.resizable)
      this.interact.resizable({
        onmove: this.resizeListener,
        edges: {
          left: true,
          right: true,
          bottom: true,
          top: false,
        },
        autoScroll: {
          container: document.getElementById("board"),
          margin: 50,
          distance: 5,
          interval: 10
        }
      });

  }

  //toggle bubble menu
  toggleMenu(e) {
    e.preventDefault();
    this.setState(prevState => ({
      menu: !prevState.menu
    }));
  }

  getMenu() {
    return (
      <StyledHandle>
        <StyledRemoveIcon className="icon icon-remove-close" onClick={(e)=>{this.props.removeBubble(e,this.props.unique)}}/>
        <StyledLinkIcon className="icon icon-alignment-aligned-to"/>
        <StyledMinusIcon className="icon icon-dash"/>
      </StyledHandle>
    );
  }

  render() {
    //prevent bubble going pass top and left side of board
    (this.state.x <= -16 && this.setState({x: -15}));
    (this.state.y <= -16 && this.setState({y: -15}));
    return (
      <StyledBubble ref={this.ref}  colour={this.state.bubbleColour} id={"border"+this.props.unique}>
          <StyledHandle onContextMenu={(e)=>{this.toggleMenu(e)}} id={"handle"+this.props.unique}>
            <StyledDragIcon className="icon icon-grabber"/>
          </StyledHandle>
          {this.state.menu && this.getMenu()}
          <div
            id={"bubble"+this.props.unique}
            style={{
              width: "100%",
              height: "95%",
              position: 'relative',
              border: 'solid',
              overflow: 'auto',
          }}>
          </div>
      </StyledBubble>
    );
  }
}
