'use babel';
import React from 'react';
import interact from 'interactjs';

import { StyledBubble, StyledHandle, StyledDragIcon, StyledEditor,StyledMenu } from './styled/bubble.styled.js';

const acorn_loose = require('acorn-loose'); //js parser
const acorn = require('acorn');
const escodegen = require('escodegen'); //convert syntax tree to code

export default class Bubble extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,
      border: "solid",
      menuHeight: "0fr",
      x: props.x,
      y: props.y,
      width: props.w,
      height: props.h
    };

    this.ref = React.createRef();
    this.bubbleref = React.createRef();
    this.interact = null;

    this.toggleMenu = this.toggleMenu.bind(this);
    this.getMenu = this.getMenu.bind(this);
    this.changeDetect = this.changeDetect.bind(this);
    this.findFunctionRange = this.findFunctionRange.bind(this);
    this.syntaxHighlight = this.syntaxHighlight.bind(this);
  };



  dragMoveListener = event => {
    const target = event.target;
    const stateX = this.state.x;
    const stateY = this.state.y;

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
    const stateX = this.state.x;
    const stateY = this.state.y;

    let x = parseFloat(stateX) || 0;
    let y = parseFloat(stateY) || 0;

    // update the element's style
    target.style.width = `${this.state.width}px`;
    target.style.height = `${this.state.height}px`;

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform = `translate(${x}px,${y}px)`;
    this.setState({ x, y, width:event.rect.width, height:event.rect.height});
  };

  //detect changes in both the Bubble and the original text editor
  changeDetect(bubblemodel) {
    var clone, original;

    if (this.props.select.length !== 0) { //if extract method is used
      //detect change in bubble, update original text editor if change
      clone = bubblemodel.onDidStopChanging(() => {
        var originalfunctionrange = this.findFunctionRange(this.props.originalmodel.getText(), bubblemodel);
        if (this.props.originalmodel.getTextInBufferRange(originalfunctionrange) !== bubblemodel.getText()) {
          this.props.originalmodel.setTextInBufferRange(originalfunctionrange, bubblemodel.getText());
        }
        //rechecking syntax error
        var error = false;
        try { acorn.parse(bubblemodel.getText(), { locations: true }) }
        catch (e) {
          error = !error;
          var row = e.loc.line - 1;
          var col = e.loc.column - 1;
          //delete previous error highlight, so only one error hightlight at a time
          bubblemodel.getDecorations().forEach((x) => {
            if (x.properties.class === 'inline-block highlight-error') x.destroy();
          });
          this.syntaxHighlight(row, col, bubblemodel);
        }
        //if no error, destroy all decorations
        if (!error) {
          bubblemodel.getDecorations().forEach((x) => {
            if (x.properties.class === 'inline-block highlight-error') x.destroy();
            this.setState({ border: "solid" });
          });
        } else { //set border of bubble dashed red, signify error
          if (this.state.border !== "dashed red") this.setState({ border: "dashed red" })
        }
      });
      //detect change in original text editor, if change edit bubble
      original = this.props.originalmodel.onDidSave(() => {
        var originalfunctionrange = this.findFunctionRange(this.props.originalmodel.getText(), bubblemodel);
        bubblemodel.setText(this.props.originalmodel.getTextInBufferRange(originalfunctionrange));
      });

    } else { //else if bubblify is used*********************************************************************
      //detect change in bubble, update original text editor if change
      clone = bubblemodel.onDidStopChanging(() => {
        if (this.props.originalmodel.getText() !== bubblemodel.getText()) { //prevent re setText
          this.props.originalmodel.setText(bubblemodel.getText());
        }
      });
      //detect change in original text editor, if change edit bubble
      original = this.props.originalmodel.onDidSave(() => {
        bubblemodel.setText(this.props.originalmodel.getText());
      });
    }

    this.setState({ clone, original });
  };

  //highlight erroneous code
  syntaxHighlight(row, col, bmodel) {
    if (!bmodel.isEmpty()) { //execute only when bubble is not empty
      var marker = bmodel.markBufferRange([[row, col], [row, col]]);
      bmodel.decorateMarker(marker, { type: 'line-number', class: "inline-block highlight-error" });
    }
  }

  //parse string and return an array of row column coordinate
  findFunctionRange(text, bmodel) {
    var error = false;
    var parsedtext;
    try { parsedtext = acorn.parse(text, { locations: true,allowImportExportEverywhere: true }); }
    catch (e) {
      error = !error;
      var row = e.loc.line - 1;
      var col = e.loc.column - 1;
      this.syntaxHighlight(row, col, bmodel);
    }
    if (error) {
      parsedtext = acorn_loose.parse(text, { locations: true,allowImportExportEverywhere: true });
      error = !error;
    }
    var selectedfunction, startrow, startcol, endrow, endcol;
    try { selectedfunction = parsedtext.body.filter(y => y.type === "FunctionDeclaration").filter(x => x.id.name === this.props.select)}
    catch (e) {
      error = !error;
    }
    console.log(parsedtext,selectedfunction)
    if (error) {
      startrow = 0;
      startcol = 0;
      endrow = bmodel.getLastBufferRow() + 1;
      endcol = 0;
    } else {
      startrow = selectedfunction[0].loc.start.line - 1;
      startcol = selectedfunction[0].loc.start.column;
      endrow = selectedfunction[0].loc.end.line - 1;
      endcol = selectedfunction[0].loc.end.column;
    }

    return [[startrow, startcol], [endrow, endcol]];
  }

  componentDidMount() {
    this.interact = interact(this.ref.current);
    this.setInteractions();

    //create new atom text editor to update version
    var bubble = document.createElement('atom-text-editor');
    var bubblemodel = bubble.getModel();
    var fulltext = this.props.originalmodel.getText();
    //add grammar to bubble
    bubblemodel.setGrammar(this.props.originalmodel.getGrammar());

    //initialise text in bubble from original text editor if extract used
    if (this.props.select.length !== 0) { //if extract option used
      var functionrange = this.findFunctionRange(fulltext, bubblemodel);
      var functioncode = this.props.originalmodel.getTextInBufferRange(functionrange);
      bubblemodel.insertText(functioncode);
    } else { //else if bubblify used
      bubblemodel.insertText(this.props.originalmodel.getText());
    }
    //insert atom-text-editor to its corresponding bubble
    this.bubbleref.current.append(bubble);

    //save original model upon bubble creation
    this.props.originalmodel.save()
    //store model disposable to be called later after bubble deletion
    this.changeDetect(bubblemodel);
  };

  //unsubscribe model reference upon deletion of bubble
  componentWillUnmount() {
    this.state.clone.dispose();
    this.state.original.dispose();
    this.interact.unset();
    this.interactable = null;
    console.log("bubble" + this.props.index + " deleted!");
  };

  setInteractions() {
    if (this.props.draggable)
      this.interact.draggable({
        allowFrom: '#handle' + this.props.unique,
        autoScroll: true,
        restrict: {
          elementRect: { top: 1, left: 0, bottom: 1, right: 0 }
        },
        onmove: this.dragMoveListener,
        onend: ()=>{this.props.setCoordinate(this.props.index,this.state.x,this.state.y)},
      });


    if (this.props.resizable)
      this.interact.resizable({
        onmove: this.resizeListener,
        onend: ()=>{this.props.setSize(this.props.index,this.state.width,this.state.height)},
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
      menu: !prevState.menu,
      menuHeight: prevState.menuHeight === "0fr" ? "0.25fr" : "0fr"
    }));
  };

  getMenu(menu) {
    if (menu) {
      return (
        <StyledMenu>
          <button class='btn btn-error icon icon-x inline-block-tight'
            onClick={(e) => { this.props.removeBubble(e, this.props.unique) }}>
            Delete
          </button>
          <button class='btn btn-primary icon icon-book inline-block-tight'
            onClick={() => { this.props.originalmodel.save() }}>
            Save
          </button>
          <button class='btn icon icon-alignment-aligned-to inline-block-tight'
            onClick={()=>{ this.props.linkBubbles(this.props.index) }}>
            Link
          </button>
        </StyledMenu>
      );
    } else {
      return (
        <StyledMenu/>
      );
    }
  }

  render() {
    //prevent bubble going pass top and left side of board
    (this.state.x <= -16 && this.setState({ x: -15 }));
    (this.state.y <= -16 && this.setState({ y: -15 }));
    return (
      <StyledBubble ref={this.ref} colour={this.props.colour} border={this.state.border} menuHeight={this.state.menuHeight}
        coordinate={"translate("+this.state.x+"px,"+this.state.y+"px)"} id={"border" + this.props.unique}
        width={this.state.width+"px"} height={this.state.height+"px"}>

        <StyledHandle onContextMenu={(e) => { this.toggleMenu(e) }} id={"handle" + this.props.unique}>
          <StyledDragIcon>{this.props.filename}</StyledDragIcon>
        </StyledHandle>

        {this.getMenu(this.state.menu)}

        <StyledEditor ref={this.bubbleref}></StyledEditor>

      </StyledBubble>
    );
  };
}
