let arr = [12,3,4,1,2,3];
let sum = arr.reduce(function(sumSoFar, el){
    return sumSoFar + el;
},0)
let sum = 0;
for(let i=0; i<arr.length; i++){
    sum = sum + arr[i];
}
