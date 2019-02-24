'use babel';
import React from 'react';
import interact from 'interactjs';

import {StyledBubble, StyledHandle, StyledDragIcon} from './styled/bubble.styled.js';

const esprima = require('esprima'); //js parser
const escodegen = require('escodegen'); //convert syntax tree to code

export default class Bubble extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,
    };

    this.ref = React.createRef();
    this.interact = null;

    this.toggleMenu = this.toggleMenu.bind(this);
    this.getMenu = this.getMenu.bind(this);
    this.changeDetect = this.changeDetect.bind(this);
    this.findFunctionRange = this.findFunctionRange.bind(this);
    this.getFunction = this.getFunction.bind(this);
  };



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

  //detect changes in both the Bubble and the original text editor
  changeDetect(bubblemodel) {
    var clone,original;

    if (this.props.select.length !== 0) { //if extract method is used
      //detect change in bubble, update original text editor if change
      clone = bubblemodel.onDidStopChanging(()=>{
        var originalfunctionrange = this.findFunctionRange(this.props.originalmodel.getText());
        if (this.props.originalmodel.getTextInBufferRange(originalfunctionrange) !== bubblemodel.getText()) {
          this.props.originalmodel.setTextInBufferRange(originalfunctionrange,bubblemodel.getText());
        }
      });
      //detect change in original text editor, if change edit bubble
      original = this.props.originalmodel.onDidSave(()=>{
        var originalfunctionrange = this.findFunctionRange(this.props.originalmodel.getText());
        bubblemodel.setText(this.props.originalmodel.getTextInBufferRange(originalfunctionrange));
      });

    } else { //else if bubblify is used*********************************************************************
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

    this.setState({clone,original});
  };

  //parse string and return an array of row column coordinate
  findFunctionRange(text) {
    var parsedtext = esprima.parseScript(text,{loc:true});
    var selectedfunction = parsedtext.body.filter(x => x.id.name === this.props.select);
    var startrow = selectedfunction[0].loc.start.line - 1;
    var startcol = selectedfunction[0].loc.start.column;
    var endrow = selectedfunction[0].loc.end.line - 1;
    var endcol = selectedfunction[0].loc.end.column;

    return [[startrow,startcol],[endrow,endcol]];
  }

  //get selected function inside original editor range
  getFunction(text) {
    var parsedtext = esprima.parseScript(text,{loc:true});
    var selectedfunction = parsedtext.body.filter(x => x.id.name === this.props.select);

    return escodegen.generate(selectedfunction[0]);
  }

  componentDidMount() {
      this.interact = interact(this.ref.current);
      this.setInteractions();

      //create new atom text editor to update version
      var bubble = document.createElement('atom-text-editor');
      console.log(bubble);
      var bubblemodel = bubble.getModel();
      var fulltext = this.props.originalmodel.getText();
      //add grammar to bubble
      bubblemodel.setGrammar(this.props.originalmodel.getGrammar());

      //initialise text in bubble from original text editor if extract used
      if (this.props.select.length !== 0) { //if extract option used
        var functionrange = this.findFunctionRange(fulltext);
        var functioncode = this.getFunction(fulltext);
        bubblemodel.insertText(functioncode);
        this.props.originalmodel.setTextInBufferRange(functionrange,functioncode);
      } else { //else if bubblify used
        bubblemodel.insertText(this.props.originalmodel.getText());
      }
      //insert atom-text-editor to its corresponding bubble
      document.getElementById("bubble"+this.props.unique).append(bubble);

      //store model disposable to be called later after bubble deletion
      this.changeDetect(bubblemodel);
  };

  //unsubscribe model reference upon deletion of bubble
  componentWillUnmount() {
    this.state.clone.dispose();
    this.state.original.dispose();
    this.interact.unset();
    this.interactable = null;
    console.log("bubble"+this.props.index+" deleted!");
  };

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

  };

  //toggle bubble menu
  toggleMenu(e) {
    e.preventDefault();
    this.setState(prevState => ({
      menu: !prevState.menu
    }));
  };

  getMenu() {
    return (
      <StyledHandle>
        <button class='btn btn-error icon icon-x inline-block-tight'
          onClick={(e)=>{this.props.removeBubble(e,this.props.index,this.state.clone,this.state.original)}}>
          Delete
        </button>
        <button class='btn btn-primary icon icon-book inline-block-tight'
          onClick={()=>{this.props.originalmodel.save()}}>
          Save
        </button>
        <button class='btn icon icon-dash inline-block-tight'>Minimise</button>
      </StyledHandle>
    );
  };

  render() {
    //prevent bubble going pass top and left side of board
    (this.state.x <= -16 && this.setState({x: -15}));
    (this.state.y <= -16 && this.setState({y: -15}));
    return (
      <StyledBubble ref={this.ref}  colour={this.props.colour} id={"border"+this.props.unique}>
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
  };
}
