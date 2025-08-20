function solvePuzzle(clues) {
  let arr = new Array(6).fill().map(() => new Array(6).fill());
  let arr_chg = new Array(6).fill().map(() => new Array(6).fill());
  let arr_chg_t = new Array(6).fill().map(() => new Array(6).fill());
  const row_start = [18, 19, 20, 21, 22, 23];
  const row_end = [6, 7, 8, 9, 10, 11];
  const col_start = [0, 1, 2, 3, 4, 5];
  const col_end = [12, 13, 14, 15, 16, 17];
  const valid_clues = clues.map((el, ind) => el > 0 ? ind : -1).filter((el) => el >= 0);
  
  
  /*  ### Create a support matrix where all cells have all the possible skyscapers ### */
  const fill_arr_chg = function(){
    for(let i = 0; i < 6; i++){
      for(let j = 0; j < 6; j++) {
        arr_chg[i][j] = [1, 2, 3, 4, 5, 6];
        arr_chg_t[i][j] = [1, 2, 3, 4, 5, 6];
      }
        
    }  
  }
  
  /*  ### delete skyscraper from the coloumn and row where it was inserted ###*/
  const delete_skyscraper = function(skyscraper, col, row){
    for(let i = 0; i < 6; i++) {
      arr_chg[row][i] = arr_chg[row][i].filter(el => el !== skyscraper);
      arr_chg[i][col] = arr_chg[i][col].filter(el => el !== skyscraper);
      arr_chg_t[i][row] = arr_chg_t[i][row].filter(el => el !== skyscraper);
      arr_chg_t[col][i] = arr_chg_t[col][i].filter(el => el !== skyscraper);
    }
    arr_chg[row][col] = [];
    arr_chg_t[col][row] = []
  }
  
  /*  ### delete skyscraper from the cell of support (transpose) matrix*/
  const delete_skyscraper_1 = function(skyscraper, col, row){
    arr_chg[row][col] = arr_chg[row][col].filter(el => el !== skyscraper);
    arr_chg_t[col][row] = arr_chg_t[col][row].filter(el => el !== skyscraper);
  }

  const searchDirection = function(skyscraper, x, z) {
    if(clues[x] === 1 && skyscraper <= 5) z = 1;
     if(row_start.find(el => el === x) !== undefined) {
          for(let j = 0; j < z; j++)
            delete_skyscraper_1(skyscraper, j, 23 - x)
        } else if(row_end.find(el => el === x) !== undefined){
          for(let j = 5; j > 5 - z; j--)
            delete_skyscraper_1(skyscraper, j, x - 6)
        } else if(col_start.find(el => el === x) !== undefined){
          for(let j = 0; j < z; j++)
            delete_skyscraper_1(skyscraper, x, j)
        } else{
          for(let j = 5; j > 5 - z; j--)
            delete_skyscraper_1(skyscraper, 17 - x, j)
        }
  }

  
 /*  ### delete skyscraper from support matrix depends on clue ###*/
  const deleteSkyscraper = function(skyscraper){
    let y = 6 - skyscraper;
    for(let i = 0; i < valid_clues.length; i++){
      let x = valid_clues[i];
      let z = clues[x] - y - 1;
      if(z > 0 || (skyscraper !== 6 && clues[x] === 1)) {
        searchDirection(skyscraper, x, z)
      }
    }
  }



  const delSkyscraperAll = function() {
    for(let i = 1; i <= 6; i++)
      deleteSkyscraper(i);
  }

  
  
    const findRightPosition_sub = function(skyscraper, i, tmp, direction) {
    if(direction === 'r'){
      for(let j = 0; j < 6; j++){
        if(arr[i][j] === skyscraper)
          j = 6
        else if(j === 5){
          arr[i][tmp[0]] = skyscraper;
          delete_skyscraper(skyscraper, tmp[0], i);
        }
      }
    }
    else if(direction === 'c') {
      for(let j = 0; j < 6; j++){
        if(arr[j][i] === skyscraper)
          j = 6
        else if(j === 5){
          arr[tmp[0]][i] = skyscraper
          delete_skyscraper(skyscraper, i, tmp[0]);
        }
      }
    }
  }
   
  
  //this function is used to find the right position for a skyscraper
  //to be more specific, the function seeks the right position comparision rows and columns
  //with support matrix and transpose support matrix
    
  //tmp verify if there is only one subarray on support (transpose) matrix  of length equals to one that has a value equals to skyscraper, for a column or a row
  //tmp1 instead verify that only one subarray on support (transpose) matrix  has a value equals to skyscraper, for a column or a row
  const findRightPosition = function(skyscraper){
    for(let i = 0; i < 6; i++){
      let tmp_1 = arr_chg[i].map((el, ind) => el.find(el_t => el_t === skyscraper) !== undefined ? ind : undefined).filter(el => el !== undefined);
      let tmp = arr_chg[i].map((el, ind) => el.length === 1 && el[0] === skyscraper ? ind : undefined).filter(el => el !== undefined);
      if(tmp_1.length === 1)
        findRightPosition_sub(skyscraper, i, tmp_1, 'r');
      if(tmp.length === 1)
        findRightPosition_sub(skyscraper, i, tmp, 'r');
    }
    
    for(let j = 0; j < 6; j++){
      let tmp = arr_chg_t[j].map((el, ind) => el.length === 1 && el[0] === skyscraper ? ind : undefined).filter(el => el !== undefined);
      let tmp_1 = arr_chg_t[j].map((el, ind) => el.find(el_t => el_t === skyscraper) !== undefined ? ind : undefined).filter(el => el !== undefined);
      if(tmp.length === 1)
        findRightPosition_sub(skyscraper, j, tmp, 'c')
      if(tmp_1.length === 1)
        findRightPosition_sub(skyscraper, j, tmp_1, 'c')
    }
  }




  const findRightPositionAll = function(){
    let arr_tmp = [];
    while(JSON.stringify(arr_tmp) !== JSON.stringify(arr)){
      arr_tmp = arr.map(inner => inner.slice());
      for(let i = 6; i >= 1; i--)
        findRightPosition(i);
    }
  }
  
  

  //return the correct array for the clue index passed as parameter
  const tmpFunction = function(ind){
    let tmp_arr = []
   
    if(row_start.find(el => el === ind) !== undefined) {
      return arr[23 - ind].filter(el => el)
    } else if(row_end.find(el => el === ind) !== undefined){
      return [...arr[ind - 6]].reverse().filter(el => el) 
    } else if(col_start.find(el => el === ind) !== undefined){
      for(let i = 0; i < 6; i++)
        tmp_arr.push(arr[i][ind])
      return tmp_arr.filter(el => el)
    } else{
      for(let i = 0; i < 6; i++)
        tmp_arr.push(arr[i][17 - ind])
      return tmp_arr.reverse().filter(el => el)
    }
  }
  
  const checkConsistentMatrix = function(){ 
    for(let i = 0; i < valid_clues.length; i++){
      let count = 1;
      let y = valid_clues[i];
      if(clues[y] !== 0 && clues[y] !== 1){
        let tmp = tmpFunction(y);
        if(tmp.length === 6){
            let x = tmp[0];
            for(let j = 1; j < tmp.length; j++){
                if(tmp[j] > x) {
                    count++;
                    x = tmp[j]
                }
            }
            if((count < clues[y] || count > clues[y])) return false;
        }
      }
    }
    return true;
  }
  
  
  //check if there are no options anymore on arr_chg

  const checkSupportArrIsEmpty = function(){
    return !arr_chg.map(el => el.map((el1, ind) => el1.length > 0 ? ind : null).filter(el => el !== null))
                    .map(el => el.length)
                    .filter(el => el).length;
  }

  //return an array of length 2
  //the first element is the index that indicate the row of support array that contains the smallest array options
  //the second element is the lenght of the smallest array options contained in support array (arr_chg)
  const findBestCase = function(){
    let vari = arr_chg.map(el => el.map(el => el.length)).map(el => el.sort()).map(el => el.filter(el => el)).map(el => el[0]);
    let vari_1 = vari.slice().sort();
    return [vari.findIndex(el => el === vari_1[0]), vari_1[0]]
  }

  const findSomeUndefinedCell = function (){
    return arr.map(el => el.map(el => el === undefined ? 'si' : 'no'))
              .filter(el => el.includes('si'))
              .length;
  }
  
  
  const recursiveFillMatrix = function(){
    let arr_chg_tmp = arr_chg.map(inner => inner.map(el => el.slice()));
    let arr_chg_t_tmp = arr_chg_t.map(inner => inner.map(el => el.slice()));
    let arr_tmp = arr.map(inner => inner.slice());
    let bool = false; 
    

    //cases useful to finish
    if(checkSupportArrIsEmpty() && findSomeUndefinedCell()){
      return false;
    }
    if(!checkConsistentMatrix()){
      return false;
    }
    if(!findSomeUndefinedCell() && checkConsistentMatrix())
      return true;
    
    //operative cases
    let x = findBestCase();
    let tmp = arr_chg[x[0]].findIndex(el => el.length === x[1]);
    for(let i = 0; i < arr_chg[x[0]][tmp].length; i++){
      arr[x[0]][tmp] = arr_chg[x[0]][tmp][i];
      delete_skyscraper(arr_chg[x[0]][tmp][i], tmp, x[0]);
      bool = recursiveFillMatrix();
      if(!bool){
        arr_chg = arr_chg_tmp.map(inner => inner.map(el => el.slice()));
        arr_chg_t = arr_chg_t_tmp.map(inner => inner.map(el => el.slice()));
        arr = arr_tmp.map(inner => inner.slice());
      } else return bool;
    }
    return bool;
  
  }

  const finalfunction = function(){
    fill_arr_chg();
    delSkyscraperAll();
    findRightPositionAll();
    recursiveFillMatrix();
    return arr;
  }

  return finalfunction();

}


module.exports = solvePuzzle;
