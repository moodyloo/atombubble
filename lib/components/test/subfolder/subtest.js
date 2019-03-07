function subtestX() {
  var x = [1, 2, 3];
  var y = x.filter(m => m !== 1);

  if (y === [2, 3]) {
    console.log("CORRECT!");
  }
}