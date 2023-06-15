/**
 * 三次bezier曲线类,参数为4个控制点坐标
 */ 
function CubicBezier( p0, p1, p2, p3 ) {
  this.p0 = p0;
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;
}

CubicBezier.prototype = {

  cal: function( t, a, b, c, d ) {
    var k = 1 - t;
    return k * k * k * a + 3 * k * k * t * b + 3 * ( 1 - t ) * t * t * c + t * t * t * d;
  },
  
  // 根据t获取曲线点坐标
  get: function( t ) {
    return {
    x: this.cal( t, this.p0.x, this.p1.x, this.p2.x, this.p3.x ),
        y: this.cal( t, this.p0.y, this.p1.y, this.p2.y, this.p3.y )
    }
  }
}

/** 
 * 三次Bezier曲线查找表(lut, look up table)
 * count是计算点的数量，越大越精确
 */
function CubicBezierLut( p0, p1, p2, p3, count ) {
  this.bezier = new CubicBezier( p0, p1, p2, p3 );
  this.lut = [];
  
  count = count || 100;

  var step = 1 / count;
  var t = 0;

  for ( var i = 0; i < count; i++ ) {
      this.lut.push( this.bezier.get( t ) );
      t += step;
  }
}

CubicBezierLut.prototype = {
  getYbyX: function( x ) {
      // 找一个最接近的点
      for ( var i = 0; i < this.lut.length - 1; i++ ) {
          var point = this.lut[ i ];
          var nextPoint = this.lut[ i + 1 ];
          if ( Math.abs( x - point.x ) <= Math.abs( x - nextPoint.x ) ) {
              return point.y;
          }
      }
      return null;
  }
}

export { CubicBezier, CubicBezierLut }

