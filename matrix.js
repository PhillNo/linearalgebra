"use strict";

class Matrix
{
  constructor(rows, cols, type, data = undefined)
  {
    this.rows = rows;
    this.cols = cols;
    this.size = rows * cols;
    this.buffer;
    this.arr;
    this.numberType = type;

    switch (type)
    {
      case "Int8Array":
        this.buffer = new ArrayBuffer(this.size);
        this.arr = new Int8Array(this.buffer);
        break;
      case "Uint8Array":
        this.buffer = new ArrayBuffer(this.size);
        this.arr = new Uint8Array(this.buffer);
        break;
      case "Uint8ClampedArray":
        this.buffer = new ArrayBuffer(this.size);
        this.arr = new Uint8ClampedArray(this.buffer);
        break;
      case "Int16Array":
        this.buffer = new ArrayBuffer(this.size * 2);
        this.arr = new Int16Array(this.buffer);
        break;
      case "Uint16Array":
        this.buffer = new ArrayBuffer(this.size * 2);
        this.arr = new Uint16Array(this.buffer);
        break;
      case "Int32Array":
        this.buffer = new ArrayBuffer(this.size * 4);
        this.arr = new Int32Array(this.buffer);
        break;
      case "Uint32Array":
        this.buffer = new ArrayBuffer(this.size * 4);
        this.arr = new Uint32Array(this.buffer);
        break;
      case "Float32Array":
        this.buffer = new ArrayBuffer(this.size * 4);
        this.arr = new Float32Array(this.buffer);
        break;
      case "Float64Array":
        this.buffer = new ArrayBuffer(this.size * 8);
        this.arr = new Float64Array(this.buffer);
        break;
      case "BigInt64Array":
        this.buffer = new ArrayBuffer(this.size * 8);
        this.arr = new BigInt64Array(this.buffer);
        break;
      case "BigUint64Array":
        this.buffer = new ArrayBuffer(this.size * 8);
        this.arr = new BigUint64Array(this.buffer);
        break;
      default:
        throw "no valid numeric data type provided in string argument - see MDN for JavaScript typed arrays";
        break;
    }

    if (!(data === undefined))
    {
      if (data.length !== this.rows * this.cols)
      {
        throw "input data size does not match matrix size";
      }
      for (let i = 0; i < this.size; i++)
      {
        this.arr[i] = data[i];
      }
    }
  }//constructor

  Get(row, col)
  {
    return this.arr[this.GetIndex(row, col)];
  }//Get

  GetIndex(row, col)
  {
    if (row >= this.rows || col >= this.cols)
    {
      throw "specified row or column is out of bounds";
    }

    return (row * this.cols) + col;
  }//GetIndex

  Set(row, col, val)
  {
    this.arr[this.GetIndex(row, col)] = val;
  }//Set

  ReplaceData(newData)
  {
    if (newData.length != this.size)
    {
      throw "argument does not fit size of Matrix";
    }

    for ( let i = 0; i < newData.length; i++)
    {
      this.arr[i] = newData[i];
    }
  }//ReplaceData

  static Multiply(a, b)//instead of Multiply(a, b), invoke a.Multiply(b). Equivalent but I think this forces one to be more conscious of matrix multiplication not being commutative
  {
    if (a.cols != b.rows)
    {
      throw "columns in first Matrix must equal rows in second";
    }

    let result = new Matrix(a.rows, b.cols, a.numberType);
    let resultIndex = 0;

    let sum = 0;
    //go by row and col of the resulting vector (dimensions are rows in a by cols in b
    //compute dot prod between row of a and col of b - i is the length of each of those vectors
    for (let row = 0; row < a.rows; row++)
    {
      for (let col = 0; col < b.cols; col++)
      {
        sum = 0;
        for (let i = 0; i < a.cols; i++)
        {
          sum += a.arr[row * a.cols + i] * b.arr[col + i * b.cols];
        }
        result.arr[resultIndex] = sum;
        resultIndex++;
      }
    }
    return result;
  }//Multiply

  static CrossProduct(a, b)
  {

    if (a.rows == 3 && a.cols == 1 && b.rows == 3 && b.cols == 1 && a.numberType == b.numberType)
    {
      return new Matrix(3, 1, a.numberType, [a.Get(1, 0) * b.Get(2, 0) - a.Get(2, 0) * b.Get(1, 0),
                                             a.Get(2, 0) * b.Get(0, 0) - a.Get(0, 0) * b.Get(2, 0),
                                             a.Get(0, 0) * b.Get(1, 0) - a.Get(1, 0) * b.Get(0, 0)]);
    }

    if (a.cols == 3 && a.rows == 1 && b.cols == 3 && b.rows == 1 && a.numberType == b.numberType)
    {
      return new Matrix(3, 1, a.numberType, [a.Get(0, 1) * b.Get(0, 2) - a.Get(0, 2) * b.Get(0, 1),
                                             a.Get(2, 0) * b.Get(0, 0) - a.Get(0, 0) * b.Get(2, 0),
                                             a.Get(0, 0) * b.Get(0, 1) - a.Get(0, 1) * b.Get(0, 0)]);
    }

    throw "Cross product only works for vectors of length 3";

  }
  
  static Add(a, b)
  {
    if (a.rows == b.rows && a.cols == b.cols && a.numberType == b.numberType)
    {
      let sum = new Matrix(a.rows, a.cols, a.numberType);
      for (let i = 0; i < a.size; i++)
      {
        sum.arr[i] = a.arr[i] + b.arr[i];
      }
      return sum;
    }

    throw "matrices provided must have matching dimensions";
  }
  
  static Subtract(a, b)
  {
    if (a.rows == b.rows && a.cols == b.cols && a.numberType == b.numberType)
    {
      let difference = new Matrix(a.rows, a.cols, a.numberType);
      for (let i = 0; i < a.size; i++)
      {
        difference.arr[i] = a.arr[i] - b.arr[i];
      }
      return difference;
    }
    
    throw "matrices provided must have matching dimensions";
  }

}//Matrix