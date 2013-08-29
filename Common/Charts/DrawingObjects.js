﻿
/* DrawingObjects.js
*
* Author: Dmitry Vikulov
* Date:   13/08/2012
*/

var CLASS_TYPE_CHART_DATA = 1000;

if ( !window["Asc"] ) {		// Для вставки диаграмм в Word
	window["Asc"] = {};
}

function isObject(what) {
	return ( (what != null) && (typeof(what) == "object") );
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function isNullOrEmptyString(str) {
	return (str == undefined) || (str == null) || (str == "");
}

function convertFormula(formula, ws) {
	var range = null;

	if (formula && ws) {
		var ref3D = parserHelp.is3DRef(formula, 0);
		if (!ref3D[0])
			range = ws.model.getRange2(formula.toUpperCase());
		else {
			var resultRef = parserHelp.parse3DRef(formula);
			if (null !== resultRef) {
				var ws = ws.model.workbook.getWorksheetByName(resultRef.sheet);
				if (ws)
					range = ws.getRange2(resultRef.range);
			}
		}
	}
	return range;
}

function getFullImageSrc(src) {
	var start = src.substring(0, 6);
    if ( 0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:") ) {
		var api = window["Asc"]["editor"];
        if ( 0 == src.indexOf(g_sResourceServiceLocalUrl + api.documentId) )
            return src;
        return g_sResourceServiceLocalUrl + api.documentId + "/media/" + src;
    }
	else
		return src;
};


//{ ASC Classes

//-----------------------------------------------------------------------------------
// Chart style
//-----------------------------------------------------------------------------------

function asc_CChartStyle() {
	this.style = null;
	this.imageUrl = null;
}

asc_CChartStyle.prototype = {
	asc_getStyle: function() { return this.style; },
	asc_setStyle: function(style) { this.style = style; },

	asc_getImageUrl: function() { return this.imageUrl; },
	asc_setImageUrl: function(imageUrl) { this.imageUrl = imageUrl; }
}

//{ asc_CChartStyle export
window["Asc"].asc_CChartStyle = asc_CChartStyle;
window["Asc"]["asc_CChartStyle"] = asc_CChartStyle;
prot = asc_CChartStyle.prototype;

prot["asc_getStyle"] = prot.asc_getStyle;
prot["asc_setStyle"] = prot.asc_setStyle;

prot["asc_getImageUrl"] = prot.asc_getImageUrl;
prot["asc_setImageUrl"] = prot.asc_setImageUrl;
//}

//-----------------------------------------------------------------------------------
// Chart translate
//-----------------------------------------------------------------------------------

function asc_CChartTranslate() {
	
	this.title = "Diagram Title";
	this.xAxis = "X Axis";
	this.yAxis = "Y Axis";
	this.series = "Series";
}

asc_CChartTranslate.prototype = {
	
	asc_getTitle: function() { return this.title; },
	asc_setTitle: function(val) { this.title = val; },
	
	asc_getXAxis: function() { return this.xAxis; },
	asc_setXAxis: function(val) { this.xAxis = val; },
	
	asc_getYAxis: function() { return this.yAxis; },
	asc_setYAxis: function(val) { this.yAxis = val; },
	
	asc_getSeries: function() { return this.series; },
	asc_setSeries: function(val) { this.series = val; }
}

//{ asc_CChartTranslate export
window["Asc"].asc_CChartTranslate = asc_CChartTranslate;
window["Asc"]["asc_CChartTranslate"] = asc_CChartTranslate;
prot = asc_CChartTranslate.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getXAxis"] = prot.asc_getXAxis;
prot["asc_setXAxis"] = prot.asc_setXAxis;

prot["asc_getYAxis"] = prot.asc_getYAxis;
prot["asc_setYAxis"] = prot.asc_setYAxis;

prot["asc_getSeries"] = prot.asc_getSeries;
prot["asc_setSeries"] = prot.asc_setSeries;
//}

//-----------------------------------------------------------------------------------
// Chart
//-----------------------------------------------------------------------------------

function asc_CChart(object) {

	var bCopy = isObject(object);
	
	this.worksheet = bCopy ? object.worksheet : null;
	this.type = bCopy ? object.type : null;
	this.subType = bCopy ? object.subType : c_oAscChartSubType.normal;
	
	this.bShowValue = bCopy ? object.bShowValue : false;
	this.bShowBorder = bCopy ? object.bShowBorder : true;
	this.styleId = bCopy ? object.styleId : c_oAscChartStyle.Standart;

	this.header = bCopy ? new asc_CChartHeader(object.header) : new asc_CChartHeader();
	this.range = bCopy ? new asc_CChartRange(object.range) : new asc_CChartRange();
	
	this.xAxis = bCopy ? new asc_CChartAxisX(object.xAxis) : new asc_CChartAxisX();
	this.yAxis = bCopy ? new asc_CChartAxisY(object.yAxis) : new asc_CChartAxisY();
	
	this.legend = bCopy ? new asc_CChartLegend(object.legend) : new asc_CChartLegend();

	this.series = [];
	if ( bCopy && object.series ) {
		for (var i = 0; i < object.series.length; i++) {
			var ser = new asc_CChartSeria();

			ser.asc_setTitle(object.series[i].TxCache.Tx);
			ser.asc_setTitleFormula(object.series[i].TxCache.Formula);
			
			if (object.series[i].Val && object.series[i].Val.Formula)
				ser.asc_setValFormula(object.series[i].Val.Formula);
				
			if (object.series[i].xVal && object.series[i].xVal.Formula)
				ser.asc_setxValFormula(object.series[i].xVal.Formula);
				
			if (object.series[i].Cat && object.series[i].Cat.Formula)
				ser.asc_setCatFormula(object.series[i].Cat.Formula);
				
			if (object.series[i].Marker) {
				ser.asc_setMarkerSize(object.series[i].Marker.Size);
				ser.asc_setMarkerSymbol(object.series[i].Marker.Symbol);
			}
			ser.asc_setOutlineColor(object.series[i].OutlineColor);
			ser.asc_setFormatCode(object.series[i].FormatCode);

			this.series.push(ser);
		}
	}
 	
	this.themeColors = [];
	if ( bCopy && object.themeColors ) {
		for (var i = 0; i < object.themeColors.length; i++) {
			this.themeColors.push(object.themeColors[i]);
		}
	}
	
	this.Id = g_oIdCounter.Get_NewId();
	g_oTableId.Add(this, this.Id);
}

asc_CChart.prototype = {

	asc_getType: function() { return this.type; },
	asc_setType: function(type) { this.type = type; },

	asc_getSubType: function() { return this.subType; },
	asc_setSubType: function(subType) { this.subType = subType; },

	asc_getStyleId: function() { return this.styleId; },
	asc_setStyleId: function(styleId) { this.styleId = styleId; },

	asc_getShowValueFlag: function() { return this.bShowValue; },
	asc_setShowValueFlag: function(show) { this.bShowValue = show; },
	
	asc_getShowBorderFlag: function() { return this.bShowBorder; },
	asc_setShowBorderFlag: function(show) { this.bShowBorder = show; },
	
	asc_getHeader: function() { return this.header; },
	asc_setHeader: function(headerObj) { this.header = headerObj; },

	asc_getRange: function() { return this.range; },
	asc_setRange: function(rangeObj) { this.range = rangeObj; },

	asc_getXAxis: function() { return this.xAxis; },
	asc_setXAxis: function(axisObj) { this.xAxis = axisObj; },

	asc_getYAxis: function() { return this.yAxis; },
	asc_setYAxis: function(axisObj) { this.yAxis = axisObj; },

	asc_getLegend: function() { return this.legend; },
	asc_setLegend: function(legendObj) { this.legend = legendObj; },

	asc_getSeria: function(index) { return (index < this.series.length) ? this.series[index] : null; },
	asc_setSeria: function(seriaObj) { if (seriaObj) this.series.push(seriaObj); },
	asc_removeSeries: function() { this.series = []; },
	
	parseSeriesHeaders: function() {
		
		var cntLeft = 0, cntTop = 0;
		var headers = { bLeft: false, bTop: false };
		
		var _t = this;
		var bbox = _t.range.intervalObject.getBBox0();
		
		for (var i = bbox.r1; i <= bbox.r2; i++) {
			
			var cell = _t.range.intervalObject.worksheet.getCell( new CellAddress(i, bbox.c1, 0) );
			var value = cell.getValue();
			if ( !isNumber(value) && (value != "") )
				cntLeft++;
		}
		if ( (cntLeft > 0) && (cntLeft >= bbox.r2 - bbox.r1) )
			headers.bLeft = true;
		
		for (var i = bbox.c1; i <= bbox.c2; i++) {
			
			var cell = _t.range.intervalObject.worksheet.getCell( new CellAddress(bbox.r1, i, 0) );
			var value = cell.getValue();
			if ( !isNumber(value) && (value != "") )
				cntTop++;
		}
		if ( (cntTop > 0) && (cntTop >= bbox.c2 - bbox.c1) )
			headers.bTop = true;
		
		return headers;
	},
	
	rebuildSeries: function() {
		var _t = this;
		var bbox = _t.range.intervalObject.getBBox0();
		var nameIndex = 1;
		var api = window["Asc"]["editor"];
		
		// Save old series colors
		var oldSeriaData = [];
		for ( var i = 0; i < _t.series.length; i++ ) {
			oldSeriaData.push( _t.series[i].OutlineColor );
		}
		_t.series = [];
		
		function getNumCache(c1, c2, r1, r2) {
			
			// (c1 == c2) || (r1 == r2)
			var cache = [];
			
			if ( c1 == c2 ) {		// vertical cache
				for (var row = r1; row <= r2; row++) {
					var cell = _t.range.intervalObject.worksheet.getCell( new CellAddress(row, c1, 0) );
					
					var item = {};
					item.numFormatStr = cell.getNumFormatStr();
					item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
					item.val = cell.getValue();
					item.isHidden = (_t.range.intervalObject.worksheet._getCol(c1).hd === true) || (_t.range.intervalObject.worksheet._getRow(row).hd === true);
					
					cache.push(item);
				}
			}
			else /*r1 == r2*/ {		// horizontal cache
				for (var col = c1; col <= c2; col++) {
					var cell = _t.range.intervalObject.worksheet.getCell( new CellAddress(r1, col, 0) );
					
					var item = {};
					item.numFormatStr = cell.getNumFormatStr();
					item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
					item.val = cell.getValue();
					item.isHidden = (_t.range.intervalObject.worksheet._getCol(col).hd === true) || (_t.range.intervalObject.worksheet._getRow(r1).hd === true);
					
					cache.push(item);
				}
			}
			
			return cache;
		}
		
		var parsedHeaders = _t.parseSeriesHeaders();
		
		if (_t.range.rows) {
			for (var i = bbox.r1 + (parsedHeaders.bTop ? 1 : 0); i <= bbox.r2; i++) {
				
				var ser = new asc_CChartSeria();
				var startCell = new CellAddress(i, bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), 0);
				var endCell = new CellAddress(i, bbox.c2, 0);
				
				if ( _t.range.intervalObject.worksheet._getRow(i).hd === true )
					ser.isHidden = true;

				// Val
				if (startCell && endCell) {
					if (startCell.getID() == endCell.getID())
						ser.Val.Formula = startCell.getID();
					else {
						ser.Val.Formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
											+ "!" + startCell.getID() + ":" + endCell.getID();
					}
				}
				ser.Val.NumCache = getNumCache(bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), bbox.c2, i, i);
				
				// xVal
				if ( parsedHeaders.bTop ) {
					
					var start = new CellAddress(bbox.r1, bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), 0);
					var end = new CellAddress(bbox.r1, bbox.c2, 0);
					
					var formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
										+ "!" + start.getID() + ":" + end.getID();
					var numCache = getNumCache( bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), bbox.c2, bbox.r1, bbox.r1 );
					
					if ( _t.type == c_oAscChartType.scatter ) {
						ser.xVal.Formula = formula;
						ser.xVal.NumCache = numCache;
					}
					else {
						ser.Cat.Formula = formula;
						ser.Cat.NumCache = numCache;
					}
				}
				
				if ( parsedHeaders.bLeft ) {
					var formulaCell = new CellAddress(i, bbox.c1 + (parsedHeaders.bLeft ? 1 : 0));
					ser.TxCache.Formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
											+ "!" + formulaCell.getID();
				}
				
				var seriaName = parsedHeaders.bLeft ? ( _t.range.intervalObject.worksheet.getCell(new CellAddress(i, bbox.c1, 0)).getValue() ) : (api.chartTranslate.series + " " + nameIndex);
				ser.TxCache.Tx = seriaName;
				_t.series.push(ser);
				nameIndex++;
			}
		}
		else {
			for (var i = bbox.c1 + (parsedHeaders.bLeft ? 1 : 0); i <= bbox.c2; i++) {
				
				var ser = new asc_CChartSeria();
				var startCell = new CellAddress(bbox.r1 + (parsedHeaders.bTop ? 1 : 0), i, 0);
				var endCell = new CellAddress(bbox.r2, i, 0);
				
				if ( _t.range.intervalObject.worksheet._getCol(i).hd === true )
					ser.isHidden = true;

				// Val
				if (startCell && endCell) {
					if (startCell.getID() == endCell.getID())
						ser.Val.Formula = startCell.getID();
					else {
						ser.Val.Formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
											+ "!" + startCell.getID() + ":" + endCell.getID();
					}
				}
				ser.Val.NumCache = getNumCache(i, i, bbox.r1 + (parsedHeaders.bTop ? 1 : 0), bbox.r2);
				
				// xVal
				if ( parsedHeaders.bLeft ) {
					
					var start = new CellAddress(bbox.r1 + (parsedHeaders.bTop ? 1 : 0), bbox.c1, 0);
					var end = new CellAddress(bbox.r2, bbox.c1, 0);
					
					var formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
										+ "!" + start.getID() + ":" + end.getID();
					var numCache = getNumCache( bbox.c1, bbox.c1, bbox.r1 + (parsedHeaders.bTop ? 1 : 0), bbox.r2 );
					
					if ( _t.type == c_oAscChartType.scatter ) {
						ser.xVal.Formula = formula;
						ser.xVal.NumCache = numCache;
					}
					else {
						ser.Cat.Formula = formula;
						ser.Cat.NumCache = numCache;
					}
				}
				
				if ( parsedHeaders.bTop ) {
					var formulaCell = new CellAddress(bbox.r1 + (parsedHeaders.bTop ? 1 : 0), i);
					ser.TxCache.Formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
											+ "!" + formulaCell.getID();
				}
				
				var seriaName = parsedHeaders.bTop ? ( _t.range.intervalObject.worksheet.getCell(new CellAddress(bbox.r1, i, 0)).getValue() ) : (api.chartTranslate.series + " " + nameIndex);
				ser.TxCache.Tx = seriaName;
				_t.series.push(ser);
				nameIndex++;
			}
		}
		
		// Colors
		var seriaUniColors = _t.generateUniColors(_t.series.length);
		
		if ( _t.type == c_oAscChartType.hbar )
			seriaUniColors = OfficeExcel.array_reverse(seriaUniColors);
			
		// Restore old series colors
		for ( var i = 0; i < _t.series.length; i++ ) {
			
			if ( i < oldSeriaData.length ) {
				_t.series[i].OutlineColor = oldSeriaData[i];
			}
			else
				_t.series[i].OutlineColor = seriaUniColors[i];
		}
	},
	
	generateUniColors: function(count) {
		var uniColors = [];
		var api_doc = window["editor"];
		var api_sheet = window["Asc"]["editor"];
		var api = api_sheet ? api_sheet : api_doc;
		
		if ( count > 0 ) {
			if ( !api.chartStyleManager.isReady() )
				api.chartStyleManager.init();
				
			var baseColors = api.chartStyleManager.getBaseColors( parseInt(this.styleId) );
			var colors = generateColors(count, baseColors, true);
		}
		for ( var i = 0; i < colors.length; i++ ) {
			var rgbColor = new RGBColor(colors[i]);
			var uniColor = CreateUniColorRGB(rgbColor.r, rgbColor.g, rgbColor.b);
			uniColors.push(uniColor);
		}
		
		return uniColors;
	},
	
	getLegendInfo: function() {
		
		var aInfo = [];
		function legendInfo() { return { text: null, color: null, marker: null } };
		var aColors = generateColors(this.series.length, arrBaseColors, true);
		
		for ( var i = 0; i < this.series.length; i++ ) {
		
			var info = new legendInfo();
			info.text = this.series[i].asc_getTitle();
			info.color = aColors[i];
			info.marker = c_oAscLegendMarkerType.Line;
			aInfo.push(info);
		}
		return aInfo;
	},
	
	Get_Id: function() {
		return this.Id;
	},
	
	getObjectType: function() {
        return CLASS_TYPE_CHART_DATA;
    },
	
	Write_ToBinary2: function(Writer) {
		
		Writer.WriteLong(CLASS_TYPE_CHART_DATA);
		Writer.WriteString2( this.Id );
		
		Writer.WriteString2( this.type );
		Writer.WriteString2( this.subType );
		Writer.WriteLong( this.styleId );
		
		Writer.WriteBool( this.bShowValue );
		Writer.WriteBool( this.bShowBorder );
		
		// Header
		Writer.WriteString2( this.header.title );
		Writer.WriteString2( this.header.subTitle );
		Writer.WriteBool( this.header.bDefaultTitle );
			
		// Range
		Writer.WriteString2( this.range.interval );
		Writer.WriteBool( this.range.rows );
		Writer.WriteBool( this.range.columns );
			
		// Axis X
		Writer.WriteString2( this.xAxis.title );
		Writer.WriteBool( this.xAxis.bDefaultTitle );
		Writer.WriteBool( this.xAxis.bShow );
		Writer.WriteBool( this.xAxis.bGrid );
		
		// Axis Y
		Writer.WriteString2( this.yAxis.title );
		Writer.WriteBool( this.yAxis.bDefaultTitle );
		Writer.WriteBool( this.yAxis.bShow );
		Writer.WriteBool( this.yAxis.bGrid );
		
		// Legend
		Writer.WriteString2( this.legend.position );
		Writer.WriteBool( this.legend.bShow );
		Writer.WriteBool( this.legend.bOverlay );
		
		// Series
		Writer.WriteLong( this.series.length );
		for (var i = 0; i < this.series.length; i++) {
			
			Writer.WriteString2(this.series[i].Val.Formula);
			Writer.WriteLong(this.series[i].Val.NumCache.length);
			for (var j = 0; j < this.series[i].Val.NumCache.length; j++) {
				Writer.WriteString2(this.series[i].Val.NumCache[j].numFormatStr);
				Writer.WriteBool(this.series[i].Val.NumCache[j].isDateTimeFormat);
				Writer.WriteString2(this.series[i].Val.NumCache[j].val);
				Writer.WriteBool(this.series[i].Val.NumCache[j].isHidden);
			}
			
			Writer.WriteString2(this.series[i].xVal.Formula);
			Writer.WriteLong(this.series[i].xVal.NumCache.length);
			for (var j = 0; j < this.series[i].xVal.NumCache.length; j++) {
				Writer.WriteString2(this.series[i].xVal.NumCache[j].numFormatStr);
				Writer.WriteBool(this.series[i].xVal.NumCache[j].isDateTimeFormat);
				Writer.WriteString2(this.series[i].xVal.NumCache[j].val);
				Writer.WriteBool(this.series[i].xVal.NumCache[j].isHidden);
			}
			
			Writer.WriteString2(this.series[i].Cat.Formula);
			Writer.WriteLong(this.series[i].Cat.NumCache.length);
			for (var j = 0; j < this.series[i].Cat.NumCache.length; j++) {
				Writer.WriteString2(this.series[i].Cat.NumCache[j].numFormatStr);
				Writer.WriteBool(this.series[i].Cat.NumCache[j].isDateTimeFormat);
				Writer.WriteString2(this.series[i].Cat.NumCache[j].val);
				Writer.WriteBool(this.series[i].Cat.NumCache[j].isHidden);
			}
			
			Writer.WriteString2(this.series[i].TxCache.Tx);
			Writer.WriteString2(this.series[i].TxCache.Formula);
			
			Writer.WriteString2(this.series[i].Marker.Size);
			Writer.WriteString2(this.series[i].Marker.Symbol);
			
			Writer.WriteString2(this.series[i].FormatCode);
			Writer.WriteBool(this.series[i].isHidden);
		}
		
		// Theme Colors
		Writer.WriteLong( this.themeColors.length );
		for (var i = 0; i < this.themeColors.length; i++) {
			Writer.WriteString2(this.themeColors[i]);
		}
	},
	
	Read_FromBinary2: function(Reader) {
		
		this.Id = Reader.GetString2();
		
		this.type = Reader.GetString2();
		this.subType = Reader.GetString2();
		this.styleId = Reader.GetLong();
		
		this.bShowValue = Reader.GetBool();
		this.bShowBorder = Reader.GetBool();
		
		// Header
		this.header.title = Reader.GetString2();
		this.header.subTitle = Reader.GetString2();
		this.header.bDefaultTitle = Reader.GetBool();
		
		// Range
		this.range.interval = Reader.GetString2();
		this.range.rows = Reader.GetBool();
		this.range.columns = Reader.GetBool();
			
		// Axis X
		this.xAxis.title = Reader.GetString2();
		this.xAxis.bDefaultTitle = Reader.GetBool();
		this.xAxis.bShow = Reader.GetBool();
		this.xAxis.bGrid = Reader.GetBool();
		
		// Axis Y
		this.yAxis.title = Reader.GetString2();
		this.yAxis.bDefaultTitle = Reader.GetBool();
		this.yAxis.bShow = Reader.GetBool();
		this.yAxis.bGrid = Reader.GetBool();
		
		// Legend
		this.legend.position = Reader.GetString2();
		this.legend.bShow = Reader.GetBool();
		this.legend.bOverlay = Reader.GetBool();
		
		// Series
		this.series = [];
		var seriesCount = Reader.GetLong();
		for (var i = 0; i < seriesCount; i++) {
		
			var seria = new asc_CChartSeria();
			seria.Val.Formula = Reader.GetString2();
			
			var numCacheCount = Reader.GetLong();
			for (var j = 0; j < numCacheCount; j++) {
				this.series[i].Val.NumCache[j].numFormatStr = Reader.GetString2();
				this.series[i].Val.NumCache[j].isDateTimeFormat = Reader.GetBool();
				this.series[i].Val.NumCache[j].val = Reader.GetString2();
				this.series[i].Val.NumCache[j].isHidden = Reader.GetBool();
			}
			
			seria.xVal.Formula = Reader.GetString2();
			numCacheCount = Reader.GetLong();
			for (var j = 0; j < numCacheCount; j++) {
				this.series[i].xVal.NumCache[j].numFormatStr = Reader.GetString2();
				this.series[i].xVal.NumCache[j].isDateTimeFormat = Reader.GetBool();
				this.series[i].xVal.NumCache[j].val = Reader.GetString2();
				this.series[i].xVal.NumCache[j].isHidden = Reader.GetBool();
			}
			
			seria.Cat.Formula = Reader.GetString2();
			numCacheCount = Reader.GetLong();
			for (var j = 0; j < numCacheCount; j++) {
				this.series[i].Cat.NumCache[j].numFormatStr = Reader.GetString2();
				this.series[i].Cat.NumCache[j].isDateTimeFormat = Reader.GetBool();
				this.series[i].Cat.NumCache[j].val = Reader.GetString2();
				this.series[i].Cat.NumCache[j].isHidden = Reader.GetBool();
			}
			
			seria.TxCache.Tx = Reader.GetString2();
			seria.TxCache.Formula = Reader.GetString2();
			
			seria.Marker.Size = Reader.GetString2();
			seria.Marker.Symbol = Reader.GetString2();
			
			seria.FormatCode = Reader.GetString2();
			seria.isHidden = Reader.GetBool();
			
			this.series.push(seria);
		}		
		
		// Theme Colors
		this.themeColors = [];
		var themeColorsCount = Reader.GetLong();
		for (var i = 0; i < themeColorsCount; i++) {
			this.themeColors.push(Reader.GetString2());
		}
	},
	
	Save_Changes: function(data, Writer) {
		this.Write_ToBinary2(Writer);
	},
	
	Load_Changes: function(Reader) {
		Reader.GetLong();	// CLASS_TYPE_CHART_DATA
		this.Read_FromBinary2(Reader);
	},
	
	Refresh_RecalcData: function(data) {
	},
	
	Undo: function(type, data) {
		
		switch (type) {
		
			// type, subType, styleId
			case historyitem_Chart_Type:
				this.type = data.oldValue;
				break;
				
			case historyitem_Chart_SubType:
				this.subType = data.oldValue;
				break;
				
			case historyitem_Chart_Style:
				this.styleId = data.oldValue;
				break;
				
			// showValue, showBorder
			case historyitem_Chart_IsShowValue:
				this.bShowValue = data.oldValue;
				break;
			
			case historyitem_Chart_IsShowBorder:
				this.bShowBorder = data.oldValue;
				break;
				
			// range
			case historyitem_Chart_RangeInterval:
				this.range.interval = data.oldValue;
				if ( this.worksheet ) {
					this.range.intervalObject = convertFormula(this.range.interval, this.worksheet);
					this.rebuildSeries();
				}
				break;
				
			case historyitem_Chart_RangeRowColumns:
				this.range.rows = data.oldValue;
				this.range.columns = !data.oldValue;
				break;
				
			// header
			case historyitem_Chart_HeaderTitle:
				this.header.title = data.oldValue;
				break;
				
			case historyitem_Chart_HeaderSubTitle:
				this.header.subTitle = data.oldValue;
				break;
				
			case historyitem_Chart_IsDefaultHeaderTitle:
				this.header.bDefaultTitle = data.oldValue;
				break;
			
			// xAxis
			case historyitem_Chart_xAxisTitle:
				this.xAxis.title = data.oldValue;
				break;
				
			case historyitem_Chart_xAxisIsDefaultTitle:
				this.xAxis.bDefaultTitle = data.oldValue;
				break;
				
			case historyitem_Chart_xAxisIsShow:
				this.xAxis.bShow = data.oldValue;
				break;
				
			case historyitem_Chart_xAxisIsGrid:
				this.xAxis.bGrid = data.oldValue;
				break;
				
			// yAxis
			case historyitem_Chart_yAxisTitle:
				this.yAxis.title = data.oldValue;
				break;
				
			case historyitem_Chart_yAxisIsDefaultTitle:
				this.yAxis.bDefaultTitle = data.oldValue;
				break;
				
			case historyitem_Chart_yAxisIsShow:
				this.yAxis.bShow = data.oldValue;
				break;
				
			case historyitem_Chart_yAxisIsGrid:
				this.yAxis.bGrid = data.oldValue;
				break;
				
			// legend
			case historyitem_Chart_LegendPosition:
				this.legend.position = data.oldValue;
				break;
				
			case historyitem_Chart_LegendIsShow:
				this.legend.bShow = data.oldValue;
				break;
				
			case historyitem_Chart_LegendIsOverlay:
				this.legend.bOverlay = data.oldValue;
				break;
			
		}
		if ( this.worksheet ) {
			this.worksheet.objectRender.rebuildChartGraphicObjects();
			this.worksheet.objectRender.showDrawingObjects(false);
		}
	},
	
	Redo: function(type, data) {
		
		// type, subType, styleId
		switch (type) {
			case historyitem_Chart_Type:
				this.type = data.newValue;
				break;
				
			case historyitem_Chart_SubType:
				this.subType = data.newValue;
				break;
				
			case historyitem_Chart_Style:
				this.styleId = data.newValue;
				break;
				
			// showValue, showBorder
			case historyitem_Chart_IsShowValue:
				this.bShowValue = data.newValue;
				break;
			
			case historyitem_Chart_IsShowBorder:
				this.bShowBorder = data.newValue;
				break;
				
			// range
			case historyitem_Chart_RangeInterval:
				this.range.interval = data.newValue;
				if ( this.worksheet ) {
					this.range.intervalObject = convertFormula(this.range.interval, this.worksheet);
					this.rebuildSeries();
				}
				break;
				
			case historyitem_Chart_RangeRowColumns:
				this.range.rows = data.newValue;
				this.range.columns = !data.newValue;
				break;
				
			// header
			case historyitem_Chart_HeaderTitle:
				this.header.title = data.newValue;
				break;
				
			case historyitem_Chart_HeaderSubTitle:
				this.header.subTitle = data.newValue;
				break;
				
			case historyitem_Chart_IsDefaultHeaderTitle:
				this.header.bDefaultTitle = data.newValue;
				break;
			
			// xAxis
			case historyitem_Chart_xAxisTitle:
				this.xAxis.title = data.newValue;
				break;
				
			case historyitem_Chart_xAxisIsDefaultTitle:
				this.xAxis.bDefaultTitle = data.newValue;
				break;
				
			case historyitem_Chart_xAxisIsShow:
				this.xAxis.bShow = data.newValue;
				break;
				
			case historyitem_Chart_xAxisIsGrid:
				this.xAxis.bGrid = data.newValue;
				break;
				
			// yAxis
			case historyitem_Chart_yAxisTitle:
				this.yAxis.title = data.newValue;
				break;
				
			case historyitem_Chart_yAxisIsDefaultTitle:
				this.yAxis.bDefaultTitle = data.newValue;
				break;
				
			case historyitem_Chart_yAxisIsShow:
				this.yAxis.bShow = data.newValue;
				break;
				
			case historyitem_Chart_yAxisIsGrid:
				this.yAxis.bGrid = data.newValue;
				break;
				
			// legend
			case historyitem_Chart_LegendPosition:
				this.legend.position = data.newValue;
				break;
				
			case historyitem_Chart_LegendIsShow:
				this.legend.bShow = data.newValue;
				break;
				
			case historyitem_Chart_LegendIsOverlay:
				this.legend.bOverlay = data.newValue;
				break;
		}
		if ( this.worksheet ) {
			this.worksheet.objectRender.rebuildChartGraphicObjects();
			this.worksheet.objectRender.showDrawingObjects(false);
		}
	}
}

//{ asc_CChart export
window["Asc"].asc_CChart = asc_CChart;
window["Asc"]["asc_CChart"] = asc_CChart;
prot = asc_CChart.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_setType"] = prot.asc_setType;

prot["asc_getSubType"] = prot.asc_getSubType;
prot["asc_setSubType"] = prot.asc_setSubType;

prot["asc_getStyleId"] = prot.asc_getStyleId;
prot["asc_setStyleId"] = prot.asc_setStyleId;

prot["asc_getShowValueFlag"] = prot.asc_getShowValueFlag;
prot["asc_setShowValueFlag"] = prot.asc_setShowValueFlag;

prot["asc_getShowBorderFlag"] = prot.asc_getShowBorderFlag;
prot["asc_setShowBorderFlag"] = prot.asc_setShowBorderFlag;

prot["asc_getHeader"] = prot.asc_getHeader;
prot["asc_setHeader"] = prot.asc_setHeader;

prot["asc_getRange"] = prot.asc_getRange;
prot["asc_setRange"] = prot.asc_setRange;

prot["asc_getXAxis"] = prot.asc_getXAxis;
prot["asc_setXAxis"] = prot.asc_setXAxis;

prot["asc_getYAxis"] = prot.asc_getYAxis;
prot["asc_setYAxis"] = prot.asc_setYAxis;

prot["asc_getLegend"] = prot.asc_getLegend;
prot["asc_setLegend"] = prot.asc_setLegend;

prot["asc_getSeria"] = prot.asc_getSeria;
prot["asc_setSeria"] = prot.asc_setSeria;
prot["asc_removeSeries"] = prot.asc_removeSeries;
//}

//-----------------------------------------------------------------------------------
// Chart binary
//-----------------------------------------------------------------------------------

function asc_CChartBinary(chart) {
	
	this["binary"] = null;
	if (chart instanceof CChartAsGroup)
		this["binary"] = chart.getChartBinary();
}

asc_CChartBinary.prototype = {
	
	asc_getBinary: function() { return this["binary"]; },
	asc_setBinary: function(val) { this["binary"] = val; }
}

//{ asc_CChartBinary export
window["Asc"].asc_CChartBinary = asc_CChartBinary;
window["Asc"]["asc_CChartBinary"] = asc_CChartBinary;
prot = asc_CChartBinary.prototype;

prot["asc_getBinary"] = prot.asc_getBinary;
prot["asc_setBinary"] = prot.asc_setBinary;
//}

//-----------------------------------------------------------------------------------
// Chart range
//-----------------------------------------------------------------------------------

function asc_CChartRange(object) {
	
	var bCopy = isObject(object);
	
	this.interval = bCopy ? object.interval : "";
	this.intervalObject = bCopy ? object.intervalObject : null;
	this.rows = bCopy ? object.rows : false;
	this.columns = bCopy ? object.columns : true;
}

asc_CChartRange.prototype = {

	isEqual: function(object) {
		return ( (this.interval == object.interval) && (this.rows == object.rows) && (this.columns == object.columns) );
	},

	asc_getInterval: function() { return this.interval; },
	asc_setInterval: function(interval) { this.interval = interval; },

	asc_getRowsFlag: function() { return this.rows; },
	asc_setRowsFlag: function(value) {
		this.rows = value;
		this.columns = !value;
	},
	
	asc_getColumnsFlag: function() { return this.columns; },
	asc_setColumnsFlag: function(value) {
		this.rows = !value;
		this.columns = value;
	}
}

//{ asc_CChartRange export
window["Asc"].asc_CChartRange = asc_CChartRange;
window["Asc"]["asc_CChartRange"] = asc_CChartRange;
prot = asc_CChartRange.prototype;

prot["asc_getInterval"] = prot.asc_getInterval;
prot["asc_setInterval"] = prot.asc_setInterval;
	
prot["asc_getRowsFlag"] = prot.asc_getRowsFlag;
prot["asc_setRowsFlag"] = prot.asc_setRowsFlag;

prot["asc_getColumnsFlag"] = prot.asc_getColumnsFlag;
prot["asc_setColumnsFlag"] = prot.asc_setColumnsFlag;
//}

//-----------------------------------------------------------------------------------
// Chart title
//-----------------------------------------------------------------------------------

function asc_CChartHeader(object) {

	var bCopy = isObject(object);
	
	this.title = bCopy ? object.title : "";
	this.subTitle = bCopy ? object.subTitle : "";
	this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
}

asc_CChartHeader.prototype = {

	isEqual: function(object) {
		return ( (this.title == object.title) && (this.subTitle == object.subTitle) && (this.bDefaultTitle == object.bDefaultTitle) );
	},

	asc_getTitle: function() { return this.title; },
	asc_setTitle: function(title) { this.title = title; },
	
	asc_getSubTitle: function() { return this.subTitle; },
	asc_setSubTitle: function(subTitle) { this.subTitle = subTitle; },

	asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
	asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; }
}

//{ asc_CChartHeader export
window["Asc"].asc_CChartHeader = asc_CChartHeader;
window["Asc"]["asc_CChartHeader"] = asc_CChartHeader;
prot = asc_CChartHeader.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getSubTitle"] = prot.asc_getSubTitle;
prot["asc_setSubTitle"] = prot.asc_setSubTitle;

prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;
//}

//-----------------------------------------------------------------------------------
// Chart axis X
//-----------------------------------------------------------------------------------

function asc_CChartAxisX(object) {

	var bCopy = isObject(object);
	
	this.title = bCopy ? object.title : "";
	this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
	this.bShow = bCopy ? object.bShow : true;
	this.bGrid = bCopy ? object.bGrid : true;
}

asc_CChartAxisX.prototype = {

	isEqual: function(object) {
		return ( (this.title == object.title) && (this.bDefaultTitle == object.bDefaultTitle) && (this.bShow == object.bShow) && (this.bGrid == object.bGrid) );
	},

	asc_getTitle: function() { return this.title; },
	asc_setTitle: function(title) { this.title = title; },

	asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
	asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; },

	asc_getShowFlag: function() { return this.bShow; },
	asc_setShowFlag: function(showFlag) { this.bShow = showFlag; },

	asc_getGridFlag: function() { return this.bGrid; },
	asc_setGridFlag: function(gridFlag) { this.bGrid = gridFlag; }
}

//{ asc_CChartAxisX export
window["Asc"].asc_CChartAxisX = asc_CChartAxisX;
window["Asc"]["asc_CChartAxisX"] = asc_CChartAxisX;
prot = asc_CChartAxisX.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;

prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;

prot["asc_getGridFlag"] = prot.asc_getGridFlag;
prot["asc_setGridFlag"] = prot.asc_setGridFlag;
//}

//-----------------------------------------------------------------------------------
// Chart axis Y
//-----------------------------------------------------------------------------------

function asc_CChartAxisY(object) {

	var bCopy = isObject(object);
	
	this.title = bCopy ? object.title : "";
	this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
	this.bShow = bCopy ? object.bShow : true;
	this.bGrid = bCopy ? object.bGrid : true;
}

asc_CChartAxisY.prototype = {

	isEqual: function(object) {
		return ( (this.title == object.title) && (this.bDefaultTitle == object.bDefaultTitle) && (this.bShow == object.bShow) && (this.bGrid == object.bGrid) );
	},

	asc_getTitle: function() { return this.title; },
	asc_setTitle: function(title) { this.title = title; },

	asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
	asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; },

	asc_getShowFlag: function() { return this.bShow; },
	asc_setShowFlag: function(showFlag) { this.bShow = showFlag; },

	asc_getGridFlag: function() { return this.bGrid; },
	asc_setGridFlag: function(gridFlag) { this.bGrid = gridFlag; }
}

//{ asc_CChartAxisY export
window["Asc"].asc_CChartAxisY = asc_CChartAxisY;
window["Asc"]["asc_CChartAxisY"] = asc_CChartAxisY;
prot = asc_CChartAxisY.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;

prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;

prot["asc_getGridFlag"] = prot.asc_getGridFlag;
prot["asc_setGridFlag"] = prot.asc_setGridFlag;
//}

//-----------------------------------------------------------------------------------
// Chart legend
//-----------------------------------------------------------------------------------	

function asc_CChartLegend(object) {

	var bCopy = isObject(object);
	
	this.position = bCopy ? object.position : c_oAscChartLegend.right;
	this.bShow = bCopy ? object.bShow : true;
	this.bOverlay = bCopy ? object.bOverlay : false;
}

asc_CChartLegend.prototype = {

	isEqual: function(object) {
		return ( (this.position == object.position) && (this.bShow == object.bShow) && (this.bOverlay == object.bOverlay) );
	},

	asc_getPosition: function() { return this.position; },
	asc_setPosition: function(pos) { this.position = pos; },

	asc_getShowFlag: function() { return this.bShow; },
	asc_setShowFlag: function(showFlag) { this.bShow = showFlag; },

	asc_getOverlayFlag: function() { return this.bOverlay; },
	asc_setOverlayFlag: function(overlayFlag) { this.bOverlay = overlayFlag; }
}

//{ asc_CChartLegend export
window["Asc"].asc_CChartLegend = asc_CChartLegend;
window["Asc"]["asc_CChartLegend"] = asc_CChartLegend;
prot = asc_CChartLegend.prototype;

prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_setPosition"] = prot.asc_setPosition;

prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;

prot["asc_getOverlayFlag"] = prot.asc_getOverlayFlag;
prot["asc_setOverlayFlag"] = prot.asc_setOverlayFlag;
//}

//-----------------------------------------------------------------------------------
// Chart font
//-----------------------------------------------------------------------------------

function asc_CChartFont(object) {

    var bCopy = isObject(object);

    this.name = bCopy ? object.name : "Calibri";
    this.size = bCopy ? object.size : 10;
    this.color = bCopy ? object.color : "#000000";

    this.bold = bCopy ? object.bold : 0;
    this.italic = bCopy ? object.italic : 0;
    this.underline = bCopy ? object.underline : 0;

    this.Properties = {
        name: 0,
        size: 1,
        color: 2,
        bold: 3,
        italic: 4,
        underline: 5
    }
}

asc_CChartFont.prototype = {
    asc_getName: function() { return this.name; },
    asc_setName: function(val) { this.name = val; },

    asc_getSize: function() { return this.size; },
    asc_setSize: function(val) { this.size = val; },

    asc_getColor: function() { return this.color; },
    asc_setColor: function(val) { this.color = val; },

    asc_getBold: function() { return this.bold; },
    asc_setBold: function(val) { this.bold = val; },

    asc_getItalic: function() { return this.italic; },
    asc_setItalic: function(val) { this.italic = val; },

    asc_getUnderline: function() { return this.underline; },
    asc_setUnderline: function(val) { this.underline = val; },

    //	For collaborative editing
    getType: function() {
        return UndoRedoDataTypes.ChartFont;
    },

    getProperties: function() {
        return this.Properties;
    },

    getProperty: function(nType) {
        switch (nType) {
            case this.Properties.name: return this.name; break;
            case this.Properties.size: return this.size; break;
            case this.Properties.color: return this.color; break;

            case this.Properties.bold: return this.bold; break;
            case this.Properties.italic: return this.italic; break;
            case this.Properties.underline: return this.underline; break;
        }
    },

    setProperty: function(nType, value) {
        switch (nType) {
            case this.Properties.name: this.name = value; break;
            case this.Properties.size: this.size = value; break;
            case this.Properties.color: this.color = value; break;

            case this.Properties.bold: this.bold = value; break;
            case this.Properties.italic: this.italic = value; break;
            case this.Properties.underline: this.underline = value; break;
        }
    }
}

//{ asc_CChartFont export
window["Asc"].asc_CChartFont = asc_CChartFont;
window["Asc"]["asc_CChartFont"] = asc_CChartFont;
prot = asc_CChartFont.prototype;

prot["asc_getName"] = prot.asc_getName;
prot["asc_setName"] = prot.asc_setName;

prot["asc_getSize"] = prot.asc_getSize;
prot["asc_setSize"] = prot.asc_setSize;

prot["asc_getColor"] = prot.asc_getColor;
prot["asc_setColor"] = prot.asc_setColor;

prot["asc_getBold"] = prot.asc_getBold;
prot["asc_setBold"] = prot.asc_setBold;

prot["asc_getItalic"] = prot.asc_getItalic;
prot["asc_setItalic"] = prot.asc_setItalic;

prot["asc_getUnderline"] = prot.asc_getUnderline;
prot["asc_setUnderline"] = prot.asc_setUnderline;
//}

//-----------------------------------------------------------------------------------
// Chart series
//-----------------------------------------------------------------------------------

function asc_CChartSeria() {
	this.Val = { Formula: null, NumCache: [] };
	this.xVal = { Formula: null, NumCache: [] };
	this.Cat = { Formula: null, NumCache: [] };
	this.TxCache = { Formula: null, Tx: null };
	this.Marker = { Size: null, Symbol: null };
	this.OutlineColor = null;
	this.FormatCode = "";
	this.isHidden = false;
}

asc_CChartSeria.prototype = {

	asc_getValFormula: function() { return this.Val.Formula; },
	asc_setValFormula: function(formula) { this.Val.Formula = formula; },

	asc_getxValFormula: function() { return this.xVal.Formula; },
	asc_setxValFormula: function(formula) { this.xVal.Formula = formula; },
	
	asc_getCatFormula: function() { return this.Cat.Formula; },
	asc_setCatFormula: function(formula) { this.Cat.Formula = formula; },

	asc_getTitle: function() { return this.TxCache.Tx; },
	asc_setTitle: function(title) { this.TxCache.Tx = title; },
	
	asc_getTitleFormula: function() { return this.TxCache.Formula; },
	asc_setTitleFormula: function(val) { this.TxCache.Formula = val; },
	
	asc_getMarkerSize: function() { return this.Marker.Size; },
	asc_setMarkerSize: function(size) { this.Marker.Size = size; },

	asc_getMarkerSymbol: function() { return this.Marker.Symbol; },
	asc_setMarkerSymbol: function(symbol) { this.Marker.Symbol = symbol; },

	asc_getOutlineColor: function() { return this.OutlineColor; },
	asc_setOutlineColor: function(color) { this.OutlineColor = color; },
	
	asc_getFormatCode: function() { return this.FormatCode; },
	asc_setFormatCode: function(format) { this.FormatCode = format; }
}

//{ asc_CChartSeria export
window["Asc"].asc_CChartSeria = asc_CChartSeria;
window["Asc"]["asc_CChartSeria"] = asc_CChartSeria;
prot = asc_CChartSeria.prototype;

prot["asc_getValFormula"] = prot.asc_getValFormula;
prot["asc_setValFormula"] = prot.asc_setValFormula;

prot["asc_getxValFormula"] = prot.asc_getxValFormula;
prot["asc_setxValFormula"] = prot.asc_setxValFormula;

prot["asc_getCatFormula"] = prot.asc_getCatFormula;
prot["asc_setCatFormula"] = prot.asc_setCatFormula;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getTitleFormula"] = prot.asc_getTitleFormula;
prot["asc_setTitleFormula"] = prot.asc_setTitleFormula;

prot["asc_getMarkerSize"] = prot.asc_getMarkerSize;
prot["asc_setMarkerSize"] = prot.asc_setMarkerSize;

prot["asc_getMarkerSymbol"] = prot.asc_getMarkerSymbol;
prot["asc_setMarkerSymbol"] = prot.asc_setMarkerSymbol;

prot["asc_getOutlineColor"] = prot.asc_getOutlineColor;
prot["asc_setOutlineColor"] = prot.asc_setOutlineColor;

prot["asc_getFormatCode"] = prot.asc_getFormatCode;
prot["asc_setFormatCode"] = prot.asc_setFormatCode;
//}


//-----------------------------------------------------------------------------------
// Selected graphic object(properties)
//-----------------------------------------------------------------------------------	

function asc_CSelectedObject( type, val ) {
	this.Type = (undefined != type) ? type : null;
	this.Value = (undefined != val) ? val : null;
}

asc_CSelectedObject.prototype = {
	asc_getObjectType: function() { return this.Type; },
	asc_getObjectValue: function() { return this.Value; }
}

//{ asc_CSelectedObject export
window["Asc"].asc_CSelectedObject = asc_CSelectedObject;
window["Asc"]["asc_CSelectedObject"] = asc_CSelectedObject;
prot = asc_CSelectedObject.prototype;

prot["asc_getObjectType"] = prot.asc_getObjectType;
prot["asc_getObjectValue"] = prot.asc_getObjectValue;
//}

//-----------------------------------------------------------------------------------
// CImgProperty
//-----------------------------------------------------------------------------------
	
function asc_CImgProperty( obj ) {
	
	if( obj ) {
        this.CanBeFlow = (undefined != obj.CanBeFlow) ? obj.CanBeFlow : true;

		this.Width         = (undefined != obj.Width        ) ? obj.Width                          : undefined;
		this.Height        = (undefined != obj.Height       ) ? obj.Height                         : undefined;
		this.WrappingStyle = (undefined != obj.WrappingStyle) ? obj.WrappingStyle                  : undefined;
		this.Paddings      = (undefined != obj.Paddings     ) ? new CPaddings (obj.Paddings)       : undefined;
		this.Position      = (undefined != obj.Position     ) ? new CPosition (obj.Position)       : undefined;
        this.AllowOverlap  = (undefined != obj.AllowOverlap ) ? obj.AllowOverlap                   : undefined;
        this.PositionH     = (undefined != obj.PositionH    ) ? new CImagePositionH(obj.PositionH) : undefined;
        this.PositionV     = (undefined != obj.PositionV    ) ? new CImagePositionV(obj.PositionV) : undefined;

        this.Internal_Position = (undefined != obj.Internal_Position) ? obj.Internal_Position : null;

		this.ImageUrl = (undefined != obj.ImageUrl) ? obj.ImageUrl : null;
        this.Locked   = (undefined != obj.Locked) ? obj.Locked : false;


        this.ChartProperties = (undefined != obj.ChartProperties) ? obj.ChartProperties : null;
        this.ShapeProperties = (undefined != obj.ShapeProperties) ? /*CreateAscShapePropFromProp*/(obj.ShapeProperties) : null;

        this.ChangeLevel = (undefined != obj.ChangeLevel) ? obj.ChangeLevel : null;
        this.Group = (obj.Group != undefined) ? obj.Group : null;

        this.fromGroup = obj.fromGroup != undefined ? obj.fromGroup : null;
        this.severalCharts = obj.severalCharts != undefined ? obj.severalCharts : false;
        this.severalChartTypes = obj.severalChartTypes != undefined ? obj.severalChartTypes : undefined;
        this.severalChartStyles = obj.severalChartStyles != undefined ? obj.severalChartStyles : undefined;
        this.verticalTextAlign = obj.verticalTextAlign != undefined ? obj.verticalTextAlign : undefined;
	}
	else {
        this.CanBeFlow = true;
		this.Width         = undefined;
		this.Height        = undefined;
		this.WrappingStyle = undefined;
		this.Paddings      = undefined;
		this.Position      = undefined;
        this.PositionH     = undefined;
        this.PositionV     = undefined;
        this.Internal_Position = null;
        this.ImageUrl = null;
        this.Locked   = false;

        this.ChartProperties = null;
        this.ShapeProperties = null;
        this.ImageProperties = null;

        this.ChangeLevel = null;
        this.Group = null;
        this.fromGroup = null;
        this.severalCharts = false;
        this.severalChartTypes = undefined;
        this.severalChartStyles = undefined;
        this.verticalTextAlign = undefined;
	}
}
	
asc_CImgProperty.prototype = {
	
	asc_getChangeLevel: function() { return this.ChangeLevel; },
	asc_putChangeLevel: function(v) { this.ChangeLevel = v; },

	asc_getCanBeFlow: function() { return this.CanBeFlow; },
	asc_getWidth: function() { return this.Width; },
	asc_putWidth: function(v) { this.Width = v; },
	asc_getHeight: function() { return this.Height; },
	asc_putHeight: function(v) { this.Height = v; },
	asc_getWrappingStyle: function() { return this.WrappingStyle; },
	asc_putWrappingStyle: function(v) { this.WrappingStyle = v; },
	
	// Возвращается объект класса CPaddings
	asc_getPaddings: function() { return this.Paddings; },
	// Аргумент объект класса CPaddings
	asc_putPaddings: function(v) { this.Paddings = v; },
	asc_getAllowOverlap: function() {return this.AllowOverlap;},
	asc_putAllowOverlap: function(v) {this.AllowOverlap = v;},
	// Возвращается объект класса CPosition
	asc_getPosition: function() { return this.Position; },
	// Аргумент объект класса CPosition
	asc_putPosition: function(v) { this.Position = v; },
	asc_getPositionH: function()  { return this.PositionH; },
	asc_putPositionH: function(v) { this.PositionH = v; },
	asc_getPositionV: function()  { return this.PositionV; },
	asc_putPositionV: function(v) { this.PositionV = v; },
	asc_getValue_X: function(RelativeFrom) { if ( null != this.Internal_Position ) return this.Internal_Position.Calculate_X_Value(RelativeFrom);  return 0; },
	asc_getValue_Y: function(RelativeFrom) { if ( null != this.Internal_Position ) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);  return 0; },

	asc_getImageUrl: function() { return this.ImageUrl; },
	asc_putImageUrl: function(v) { this.ImageUrl = v; },
	asc_getGroup: function() { return this.Group; },
	asc_putGroup: function(v) { this.Group = v; },
	asc_getFromGroup: function() { return this.fromGroup; },
	asc_putFromGroup: function(v) { this.fromGroup = v; },
	
	asc_getisChartProps: function() { return this.isChartProps; },
	asc_putisChartPross: function(v) { this.isChartProps = v; },

	asc_getSeveralCharts: function() { return this.severalCharts; },
	asc_putSeveralCharts: function(v) { this.severalCharts = v; },
	asc_getSeveralChartTypes: function() { return this.severalChartTypes; },
	asc_putSeveralChartTypes: function(v) { this.severalChartTypes = v; },

	asc_getSeveralChartStyles: function() { return this.severalChartStyles; },
	asc_putSeveralChartStyles: function(v) { this.severalChartStyles = v; },

	asc_getVerticalTextAlign: function() { return this.verticalTextAlign; },
	asc_putVerticalTextAlign: function(v) { this.verticalTextAlign = v; },
	
	asc_getLocked: function() { return this.Locked; },
	asc_getChartProperties: function() { return this.ChartProperties; },
	asc_putChartProperties: function(v) { this.ChartProperties = v; },
	asc_getShapeProperties: function() { return this.ShapeProperties; },
	asc_putShapeProperties: function(v) { this.ShapeProperties = v; }
}

//{ asc_CImgProperty export
window["Asc"].asc_CImgProperty = asc_CImgProperty;
window["Asc"]["asc_CImgProperty"] = asc_CImgProperty;
prot = asc_CImgProperty.prototype;

prot["asc_getChangeLevel"] = prot.asc_getChangeLevel;
prot["asc_putChangeLevel"] = prot.asc_putChangeLevel;

prot["asc_getCanBeFlow"] = prot.asc_getCanBeFlow;
prot["asc_getWidth"] = prot.asc_getWidth;
prot["asc_putWidth"] = prot.asc_putWidth;
prot["asc_getHeight"] = prot.asc_getHeight;
prot["asc_putHeight"] = prot.asc_putHeight;
prot["asc_getWrappingStyle"] = prot.asc_getWrappingStyle;
prot["asc_putWrappingStyle"] = prot.asc_putWrappingStyle;

prot["asc_getPaddings"] = prot.asc_getPaddings;
prot["asc_putPaddings"] = prot.asc_putPaddings;
prot["asc_getAllowOverlap"] = prot.asc_getAllowOverlap;
prot["asc_putAllowOverlap"] = prot.asc_putAllowOverlap;
prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_putPosition"] = prot.asc_putPosition;
prot["asc_getPositionH"] = prot.asc_getPositionH;
prot["asc_putPositionH"] = prot.asc_putPositionH;
prot["asc_getPositionV"] = prot.asc_getPositionV;
prot["asc_putPositionV"] = prot.asc_putPositionV;
prot["asc_getValue_X"] = prot.asc_getValue_X;
prot["asc_getValue_Y"] = prot.asc_getValue_Y;

prot["asc_getImageUrl"] = prot.asc_getImageUrl;
prot["asc_putImageUrl"] = prot.asc_putImageUrl;
prot["asc_getGroup"] = prot.asc_getGroup;
prot["asc_putGroup"] = prot.asc_putGroup;
prot["asc_getFromGroup"] = prot.asc_getFromGroup;
prot["asc_putFromGroup"] = prot.asc_putFromGroup;
prot["asc_getisChartProps"] = prot.asc_getisChartProps;
prot["asc_putisChartPross"] = prot.asc_putisChartPross;
	
prot["asc_getSeveralCharts"] = prot.asc_getSeveralCharts;
prot["asc_putSeveralCharts"] = prot.asc_putSeveralCharts;
prot["asc_getSeveralChartTypes"] = prot.asc_getSeveralChartTypes;
prot["asc_putSeveralChartTypes"] = prot.asc_putSeveralChartTypes;
prot["asc_getSeveralChartStyles"] = prot.asc_getSeveralChartStyles;
prot["asc_putSeveralChartStyles"] = prot.asc_putSeveralChartStyles;
prot["asc_getVerticalTextAlign"] = prot.asc_getVerticalTextAlign;
prot["asc_putVerticalTextAlign"] = prot.asc_putVerticalTextAlign;
prot["asc_getLocked"] = prot.asc_getLocked;
prot["asc_getChartProperties"] = prot.asc_getChartProperties;
prot["asc_putChartProperties"] = prot.asc_putChartProperties;
prot["asc_getShapeProperties"] = prot.asc_getShapeProperties;
prot["asc_putShapeProperties"] = prot.asc_putShapeProperties;
//}

//-----------------------------------------------------------------------------------
// CShapeProperty
//-----------------------------------------------------------------------------------

function asc_CShapeProperty() {
    this.type = null; // custom
    this.fill = null;
    this.stroke = null;
    this.paddings = null;
}

asc_CShapeProperty.prototype = {
	
	asc_getType: function() { return this.type; },
	asc_putType: function(v) { this.type = v; },
	asc_getFill: function() { return this.fill; },
	asc_putFill: function(v) { this.fill = v; },
	asc_getStroke: function() { return this.stroke; },
	asc_putStroke: function(v) { this.stroke = v; },
    asc_getPaddings: function() { return this.paddings; },
    asc_putPaddings: function(v) { this.paddings = v; }
}

//{ asc_CShapeProperty export
window["Asc"].asc_CShapeProperty = asc_CShapeProperty;
window["Asc"]["asc_CShapeProperty"] = asc_CShapeProperty;
prot = asc_CShapeProperty.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getFill"] = prot.asc_getFill;
prot["asc_putFill"] = prot.asc_putFill;
prot["asc_getStroke"] = prot.asc_getStroke;
prot["asc_putStroke"] = prot.asc_putStroke;
//}

//-----------------------------------------------------------------------------------
// CPaddings
//-----------------------------------------------------------------------------------

function asc_CPaddings(obj) {
    
	if ( obj ) {
        this.Left = (undefined == obj.Left) ? null : obj.Left;
        this.Top = (undefined == obj.Top) ? null : obj.Top;
        this.Bottom = (undefined == obj.Bottom) ? null : obj.Bottom;
        this.Right = (undefined == obj.Right) ? null : obj.Right;
    }
    else {
        this.Left = null;
        this.Top = null;
        this.Bottom = null;
        this.Right = null;
    }
}

asc_CPaddings.prototype = {
	asc_getLeft: function() { return this.Left; },
	asc_putLeft: function(v) { this.Left = v; },
	asc_getTop: function() { return this.Top; },
	asc_putTop: function(v) { this.Top = v; },
	asc_getBottom: function() { return this.Bottom; },
	asc_putBottom: function(v) { this.Bottom = v; },
	asc_getRight: function() { return this.Right; },
	asc_putRight: function(v) { this.Right = v; }
}

//{ asc_CPaddings export
window["Asc"].asc_CPaddings = asc_CPaddings;
window["Asc"]["asc_CPaddings"] = asc_CPaddings;
prot = asc_CPaddings.prototype;

prot["asc_getLeft"] = prot.asc_getLeft;
prot["asc_putLeft"] = prot.asc_putLeft;
prot["asc_getTop"] = prot.asc_getTop;
prot["asc_putTop"] = prot.asc_putTop;
prot["asc_getBottom"] = prot.asc_getBottom;
prot["asc_putBottom"] = prot.asc_putBottom;
prot["asc_getRight"] = prot.asc_getRight;
prot["asc_putRight"] = prot.asc_putRight;
//}

//-----------------------------------------------------------------------------------
// CImageSize
//-----------------------------------------------------------------------------------

function asc_CImageSize( width, height, isCorrect ) {
	this.Width = (undefined == width) ? 0.0 : width;
	this.Height = (undefined == height) ? 0.0 : height;
    this.IsCorrect = isCorrect;
}

asc_CImageSize.prototype = {
	
	asc_getImageWidth: function() { return this.Width; },
	asc_getImageHeight: function() { return this.Height; },
	asc_getIsCorrect: function() { return this.IsCorrect; }
}

//{ asc_CImageSize export
window["Asc"].asc_CImageSize = asc_CImageSize;
window["Asc"]["asc_CImageSize"] = asc_CImageSize;
prot = asc_CImageSize.prototype;

prot["asc_getImageWidth"] = prot.asc_getImageWidth;
prot["asc_getImageHeight"] = prot.asc_getImageHeight;
prot["asc_getIsCorrect"] = prot.asc_getIsCorrect;
//}

//-----------------------------------------------------------------------------------
// CTexture
//-----------------------------------------------------------------------------------

function asc_CTexture() {
    this.Id = 0;
    this.Image = "";
}

asc_CTexture.prototype = {
	asc_getId: function() { return this.Id; },
	asc_getImage: function() { return this.Image; }
}

//{ asc_CTexture export
window["Asc"].asc_CTexture = asc_CTexture;
window["Asc"]["asc_CTexture"] = asc_CTexture;
prot = asc_CTexture.prototype;

prot["asc_getId"] = prot.asc_getId;
prot["asc_getImage"] = prot.asc_getImage;
//}

//-----------------------------------------------------------------------------------
// CParagraphProperty
//-----------------------------------------------------------------------------------

function asc_CParagraphProperty(obj) {
	
	if (obj) {
		this.ContextualSpacing = (undefined != obj.ContextualSpacing)              ? obj.ContextualSpacing : null;
		this.Ind               = (undefined != obj.Ind     && null != obj.Ind)     ? new asc_CParagraphInd (obj.Ind) : null;
		this.KeepLines         = (undefined != obj.KeepLines)                      ? obj.KeepLines : null;
        this.KeepNext          = (undefined != obj.KeepNext)                       ? obj.KeepNext  : undefined;
        this.WidowControl      = (undefined != obj.WidowControl                    ? obj.WidowControl : undefined );
		this.PageBreakBefore   = (undefined != obj.PageBreakBefore)                ? obj.PageBreakBefore : null;
		this.Spacing           = (undefined != obj.Spacing && null != obj.Spacing) ? new asc_CParagraphSpacing (obj.Spacing) : null;
		this.Brd               = (undefined != obj.Brd     && null != obj.Brd)     ? new asc_CParagraphBorders (obj.Brd) : null;
		this.Shd               = (undefined != obj.Shd     && null != obj.Shd)     ? new asc_CParagraphShd (obj.Shd) : null;
        this.Tabs              = (undefined != obj.Tabs)                           ? new asc_CParagraphTabs(obj.Tabs) : undefined;
        this.DefaultTab        = Default_Tab_Stop;
        this.Locked            = (undefined != obj.Locked  && null != obj.Locked ) ? obj.Locked : false;
        this.CanAddTable       = (undefined != obj.CanAddTable )                   ? obj.CanAddTable : true;

        this.Subscript         = (undefined != obj.Subscript)                      ? obj.Subscript : undefined;
        this.Superscript       = (undefined != obj.Superscript)                    ? obj.Superscript : undefined;
        this.SmallCaps         = (undefined != obj.SmallCaps)                      ? obj.SmallCaps : undefined;
        this.AllCaps           = (undefined != obj.AllCaps)                        ? obj.AllCaps : undefined;
        this.Strikeout         = (undefined != obj.Strikeout)                      ? obj.Strikeout : undefined;
        this.DStrikeout        = (undefined != obj.DStrikeout)                     ? obj.DStrikeout : undefined;
        this.TextSpacing       = (undefined != obj.TextSpacing)                    ? obj.TextSpacing : undefined;
        this.Position          = (undefined != obj.Position)                       ? obj.Position : undefined;
	}
	else {
		//ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
		//
		//    Ind :
		//    {
		//        Left      : 0,                    // Левый отступ
		//        Right     : 0,                    // Правый отступ
		//        FirstLine : 0                     // Первая строка
		//    },
		//
		//    Jc : align_Left,                      // Прилегание параграфа
		//
		//    KeepLines : false,                    // переносить параграф на новую страницу,
		//                                          // если на текущей он целиком не убирается
		//    KeepNext  : false,                    // переносить параграф вместе со следующим параграфом
		//
		//    PageBreakBefore : false,              // начинать параграф с новой страницы

		this.ContextualSpacing = undefined;
		this.Ind               = new asc_CParagraphInd();
		this.KeepLines         = undefined;
        this.KeepNext          = undefined;
        this.WidowControl      = undefined;
		this.PageBreakBefore   = undefined;
		this.Spacing           = new asc_CParagraphSpacing();
		this.Brd               = undefined;
        this.Shd               = undefined;
        this.Locked            = false;
        this.CanAddTable       = true;
        this.Tabs              = undefined;

        this.Subscript         = undefined;
        this.Superscript       = undefined;
        this.SmallCaps         = undefined;
        this.AllCaps           = undefined;
        this.Strikeout         = undefined;
        this.DStrikeout        = undefined;
        this.TextSpacing       = undefined;
        this.Position          = undefined;
    }
}

asc_CParagraphProperty.prototype = {
	
	asc_getContextualSpacing: function () { return this.ContextualSpacing; },
	asc_putContextualSpacing: function (v) { this.ContextualSpacing = v; },
	asc_getInd: function () { return this.Ind; },
	asc_putInd: function (v) { this.Ind = v; },
	asc_getKeepLines: function () { return this.KeepLines; },
	asc_putKeepLines: function (v) { this.KeepLines = v; },
	asc_getKeepNext: function () { return this.KeepNext; },
	asc_putKeepNext: function (v) { this.KeepNext = v; },
	asc_getPageBreakBefore: function (){ return this.PageBreakBefore; },
	asc_putPageBreakBefore: function (v){ this.PageBreakBefore = v; },
	asc_getWidowControl: function (){ return this.WidowControl; },
	asc_putWidowControl: function (v){ this.WidowControl = v; },
	asc_getSpacing: function () { return this.Spacing; },
	asc_putSpacing: function (v) { this.Spacing = v; },
	asc_getBorders: function () { return this.Brd; },
	asc_putBorders: function (v) { this.Brd = v; },
	asc_getShade: function () { return this.Shd; },
	asc_putShade: function (v) { this.Shd = v; },
	asc_getLocked: function() { return this.Locked; },
	asc_getCanAddTable: function() { return this.CanAddTable; },
	asc_getSubscript: function () { return this.Subscript; },
	asc_putSubscript: function (v) { this.Subscript = v; },
	asc_getSuperscript: function () { return this.Superscript; },
	asc_putSuperscript: function (v) { this.Superscript = v; },
	asc_getSmallCaps: function () { return this.SmallCaps; },
	asc_putSmallCaps: function (v) { this.SmallCaps = v; },
	asc_getAllCaps: function () { return this.AllCaps; },
	asc_putAllCaps: function (v) { this.AllCaps = v; },
	asc_getStrikeout: function () { return this.Strikeout; },
	asc_putStrikeout: function (v) { this.Strikeout = v; },
	asc_getDStrikeout: function () { return this.DStrikeout; },
	asc_putDStrikeout: function (v) { this.DStrikeout = v; },
	asc_getTextSpacing: function () { return this.TextSpacing; },
	asc_putTextSpacing: function (v) { this.TextSpacing = v; },
	asc_getPosition: function () { return this.Position; },
	asc_putPosition: function (v) { this.Position = v; },
	asc_getTabs: function () { return this.Tabs; },
	asc_putTabs: function (v) { this.Tabs = v; },
	asc_getDefaultTab: function () { return this.DefaultTab; },
	asc_putDefaultTab: function (v) { this.DefaultTab = v; }
}

//{ asc_CParagraphProperty export
window["Asc"].asc_CParagraphProperty = asc_CParagraphProperty;
window["Asc"]["asc_CParagraphProperty"] = asc_CParagraphProperty;
prot = asc_CParagraphProperty.prototype;

prot["asc_getContextualSpacing"] = prot.asc_getContextualSpacing;
prot["asc_putContextualSpacing"] = prot.asc_putContextualSpacing;
prot["asc_getInd"] = prot.asc_getInd;
prot["asc_putInd"] = prot.asc_putInd;
prot["asc_getKeepLines"] = prot.asc_getKeepLines;
prot["asc_putKeepLines"] = prot.asc_putKeepLines;
prot["asc_getKeepNext"] = prot.asc_getKeepNext;
prot["asc_putKeepNext"] = prot.asc_putKeepNext;
prot["asc_getPageBreakBefore"] = prot.asc_getPageBreakBefore;
prot["asc_putPageBreakBefore"] = prot.asc_putPageBreakBefore;
prot["asc_getWidowControl"] = prot.asc_getWidowControl;
prot["asc_putWidowControl"] = prot.asc_putWidowControl;
prot["asc_getSpacing"] = prot.asc_getSpacing;
prot["asc_putSpacing"] = prot.asc_putSpacing;
prot["asc_getBorders"] = prot.asc_getBorders;
prot["asc_putBorders"] = prot.asc_putBorders;
prot["asc_getShade"] = prot.asc_getShade;
prot["asc_putShade"] = prot.asc_putShade;
prot["asc_getLocked"] = prot.asc_getLocked;
prot["asc_getCanAddTable"] = prot.asc_getCanAddTable;
prot["asc_getSubscript"] = prot.asc_getSubscript;
prot["asc_putSubscript"] = prot.asc_putSubscript;
prot["asc_getSuperscript"] = prot.asc_getSuperscript;
prot["asc_putSuperscript"] = prot.asc_putSuperscript;
prot["asc_getSmallCaps"] = prot.asc_getSmallCaps;
prot["asc_putSmallCaps"] = prot.asc_putSmallCaps;
prot["asc_getAllCaps"] = prot.asc_getAllCaps;
prot["asc_putAllCaps"] = prot.asc_putAllCaps;
prot["asc_getStrikeout"] = prot.asc_getStrikeout;
prot["asc_putStrikeout"] = prot.asc_putStrikeout;
prot["asc_getDStrikeout"] = prot.asc_getDStrikeout;
prot["asc_putDStrikeout"] = prot.asc_putDStrikeout;
prot["asc_getTextSpacing"] = prot.asc_getTextSpacing;
prot["asc_putTextSpacing"] = prot.asc_putTextSpacing;
prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_putPosition"] = prot.asc_putPosition;
prot["asc_getTabs"] = prot.asc_getTabs;
prot["asc_putTabs"] = prot.asc_putTabs;
prot["asc_getDefaultTab"] = prot.asc_getDefaultTab;
prot["asc_putDefaultTab"] = prot.asc_putDefaultTab;
//}

//-----------------------------------------------------------------------------------
// CParagraphInd
//-----------------------------------------------------------------------------------

function asc_CParagraphInd(obj) {
	if (obj) {
		this.Left      = (undefined != obj.Left     ) ? obj.Left      : null; // Левый отступ
		this.Right     = (undefined != obj.Right    ) ? obj.Right     : null; // Правый отступ
		this.FirstLine = (undefined != obj.FirstLine) ? obj.FirstLine : null; // Первая строка
	}
	else {
		this.Left      = undefined; // Левый отступ
		this.Right     = undefined; // Правый отступ
		this.FirstLine = undefined; // Первая строка
	}
}

asc_CParagraphInd.prototype = {
	asc_getLeft: function () { return this.Left; },
	asc_putLeft: function (v) { this.Left = v; },
	asc_getRight: function () { return this.Right; },
	asc_putRight: function (v) { this.Right = v; },
	asc_getFirstLine: function () { return this.FirstLine; },
	asc_putFirstLine: function (v) { this.FirstLine = v; }
}

//{ asc_CParagraphInd export
window["Asc"].asc_CParagraphInd = asc_CParagraphInd;
window["Asc"]["asc_CParagraphInd"] = asc_CParagraphInd;
prot = asc_CParagraphInd.prototype;

prot["asc_getLeft"] = prot.asc_getLeft;
prot["asc_putLeft"] = prot.asc_putLeft;
prot["asc_getRight"] = prot.asc_getRight;
prot["asc_putRight"] = prot.asc_putRight;
prot["asc_getFirstLine"] = prot.asc_getFirstLine;
prot["asc_getFirstLine"] = prot.asc_getFirstLine;
//}

//-----------------------------------------------------------------------------------
// CParagraphSpacing
//-----------------------------------------------------------------------------------

function asc_CParagraphSpacing(obj) {
	
	if (obj) {
		this.Line     = (undefined != obj.Line    ) ? obj.Line     : null; // Расстояние между строками внутри абзаца
		this.LineRule = (undefined != obj.LineRule) ? obj.LineRule : null; // Тип расстрояния между строками
		this.Before   = (undefined != obj.Before  ) ? obj.Before   : null; // Дополнительное расстояние до абзаца
		this.After    = (undefined != obj.After   ) ? obj.After    : null; // Дополнительное расстояние после абзаца
	}
	else {
		this.Line     = undefined; // Расстояние между строками внутри абзаца
		this.LineRule = undefined; // Тип расстрояния между строками
		this.Before   = undefined; // Дополнительное расстояние до абзаца
		this.After    = undefined; // Дополнительное расстояние после абзаца
	}
}

asc_CParagraphSpacing.prototype = {
	asc_getLine: function () { return this.Line; },
	asc_getLineRule: function () { return this.LineRule; },
	asc_getBefore: function () { return this.Before; },
	asc_getAfter: function () { return this.After; }
}

//{ asc_CParagraphSpacing export
window["Asc"].asc_CParagraphSpacing = asc_CParagraphSpacing;
window["Asc"]["asc_CParagraphSpacing"] = asc_CParagraphSpacing;
prot = asc_CParagraphSpacing.prototype;

prot["asc_getLine"] = prot.asc_getLine;
prot["asc_getLineRule"] = prot.asc_getLineRule;
prot["asc_getBefore"] = prot.asc_getBefore;
prot["asc_getAfter"] = prot.asc_getAfter;
//}

//-----------------------------------------------------------------------------------
// CParagraphShd
//-----------------------------------------------------------------------------------

function asc_CParagraphShd(obj) {
	
	if (obj) {
		this.Value = (undefined != obj.Value) ? obj.Value : null;
		this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustom( obj.Color.r, obj.Color.g, obj.Color.b ) : null;
	}
	else {
		this.Value = shd_Nil;
		this.Color = CreateAscColorCustom(255, 255, 255);
	}
}

asc_CParagraphShd.prototype = {
	asc_getValue: function (){ return this.Value; },
	asc_putValue: function (v){ this.Value = v; },
	asc_getColor: function (){ return this.Color; },
	asc_putColor: function (v){ this.Color = (v) ? v : null; }
}

//{ asc_CParagraphShd export
window["Asc"].asc_CParagraphShd = asc_CParagraphShd;
window["Asc"]["asc_CParagraphShd"] = asc_CParagraphShd;
prot = asc_CParagraphShd.prototype;

prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;
//}

//-----------------------------------------------------------------------------------
// CParagraphTab
//-----------------------------------------------------------------------------------

function asc_CParagraphTab(Pos, Value) {
    this.Pos   = Pos;
    this.Value = Value;
}

asc_CParagraphTab.prototype = {
	asc_getValue: function (){ return this.Value; },
	asc_putValue: function (v){ this.Value = v; },
	asc_getPos: function (){ return this.Pos; },
	asc_putPos: function (v){ this.Pos = v; }
}

//{ asc_CParagraphTab export
window["Asc"].asc_CParagraphTab = asc_CParagraphTab;
window["Asc"]["asc_CParagraphTab"] = asc_CParagraphTab;
prot = asc_CParagraphTab.prototype;

prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getPos"] = prot.asc_getPos;
prot["asc_putPos"] = prot.asc_putPos;
//}

//-----------------------------------------------------------------------------------
// CParagraphTabs
//-----------------------------------------------------------------------------------

function asc_CParagraphTabs(obj) {
    this.Tabs = new Array();

    if ( undefined != obj ) {
        var Count = obj.Tabs.length;
        for (var Index = 0; Index < Count; Index++)
        {
            this.Tabs.push( new asc_CParagraphTab(obj.Tabs[Index].Pos, obj.Tabs[Index].Value) );
        }
    }
}

asc_CParagraphTabs.prototype = {
	asc_getCount: function (){ return this.Tabs.length; },
	asc_getTab: function (Index){ return this.Tabs[Index]; },
	asc_addTab: function (Tab){ this.Tabs.push(Tab) },
	asc_clear: function (){ this.Tabs.length = 0; }
}

//{ asc_CParagraphTabs export
window["Asc"].asc_CParagraphTabs = asc_CParagraphTabs;
window["Asc"]["asc_CParagraphTabs"] = asc_CParagraphTabs;
prot = asc_CParagraphTabs.prototype;

prot["asc_getCount"] = prot.asc_getCount;
prot["asc_getTab"] = prot.asc_getTab;
prot["asc_addTab"] = prot.asc_addTab;
prot["asc_clear"] = prot.asc_clear;
//}

//-----------------------------------------------------------------------------------
// CParagraphBorders
//-----------------------------------------------------------------------------------

function asc_CParagraphBorders(obj) {
	
	if (obj) {
		this.Left = (undefined != obj.Left && null != obj.Left) ? new asc_CBorder (obj.Left) : null;
		this.Top = (undefined != obj.Top && null != obj.Top) ? new asc_CBorder (obj.Top) : null;
		this.Right = (undefined != obj.Right && null != obj.Right) ? new asc_CBorder (obj.Right) : null;
		this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new asc_CBorder (obj.Bottom) : null;
		this.Between = (undefined != obj.Between && null != obj.Between) ? new asc_CBorder (obj.Between) : null;
	}
	else {
		this.Left = null;
		this.Top = null;
		this.Right = null;
		this.Bottom = null;
		this.Between = null;
	}
}

asc_CParagraphBorders.prototype = {
	asc_getLeft: function(){return this.Left; },
	asc_putLeft: function(v){this.Left = (v) ? new asc_CBorder (v) : null;},
	asc_getTop: function(){return this.Top; },
	asc_putTop: function(v){this.Top = (v) ? new asc_CBorder (v) : null;},
	asc_getRight: function(){return this.Right; },
	asc_putRight: function(v){this.Right = (v) ? new asc_CBorder (v) : null;},
	asc_getBottom: function(){return this.Bottom; },
	asc_putBottom: function(v){this.Bottom = (v) ? new asc_CBorder (v) : null;},
	asc_getBetween: function(){return this.Between; },
	asc_putBetween: function(v){this.Between = (v) ? new asc_CBorder (v) : null;}
}

//{ asc_CParagraphBorders export
window["Asc"].asc_CParagraphBorders = asc_CParagraphBorders;
window["Asc"]["asc_CParagraphBorders"] = asc_CParagraphBorders;
prot = asc_CParagraphBorders.prototype;

prot["asc_getLeft"] = prot.asc_getLeft;
prot["asc_putLeft"] = prot.asc_putLeft;
prot["asc_getTop"] = prot.asc_getTop;
prot["asc_putTop"] = prot.asc_putTop;
prot["asc_getRight"] = prot.asc_getRight;
prot["asc_putRight"] = prot.asc_putRight;
prot["asc_getBottom"] = prot.asc_getBottom;
prot["asc_putBottom"] = prot.asc_putBottom;
prot["asc_getBetween"] = prot.asc_getBetween;
prot["asc_putBetween"] = prot.asc_putBetween;
//}

//-----------------------------------------------------------------------------------
// CBorder
//-----------------------------------------------------------------------------------

function asc_CBorder(obj) {
	
	if (obj) {
		this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustomEx(obj.Color.r, obj.Color.g, obj.Color.b) : null;
		this.Size = (undefined != obj.Size) ? obj.Size : null;
		this.Value = (undefined != obj.Value) ? obj.Value : null;
		this.Space = (undefined != obj.Space) ? obj.Space : null;
	}
	else {
		this.Color = CreateAscColorCustomEx(0,0,0);
		this.Size  = 0.5 * g_dKoef_pt_to_mm;
		this.Value = border_Single;
		this.Space = 0;
	}
}

asc_CBorder.prototype = {
	asc_getColor: function(){return this.Color; },
	asc_putColor: function(v){this.Color = v;},
	asc_getSize: function(){return this.Size; },
	asc_putSize: function(v){this.Size = v;},
	asc_getValue: function(){return this.Value; },
	asc_putValue: function(v){this.Value = v;},
	asc_getSpace: function(){return this.Space; },
	asc_putSpace: function(v){this.Space = v;},
	asc_getForSelectedCells: function(){return this.ForSelectedCells; },
	asc_putForSelectedCells: function(v){this.ForSelectedCells = v;}
}

//{ asc_CBorder export
window["Asc"].asc_CBorder = asc_CBorder;
window["Asc"]["asc_CBorder"] = asc_CBorder;
prot = asc_CBorder.prototype;

prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;
prot["asc_getSize"] = prot.asc_getSize;
prot["asc_putSize"] = prot.asc_putSize;
prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getSpace"] = prot.asc_getSpace;
prot["asc_putSpace"] = prot.asc_putSpace;
prot["asc_getForSelectedCells"] = prot.asc_getForSelectedCells;
prot["asc_putForSelectedCells"] = prot.asc_putForSelectedCells;
//}

//-----------------------------------------------------------------------------------
// CListType
//-----------------------------------------------------------------------------------

function asc_CListType(obj) {
	
	if (obj) {
		this.Type = (undefined == obj.Type) ? null : obj.Type;
		this.SubType = (undefined == obj.Type) ? null : obj.SubType;
	}
	else {
		this.Type = null;
		this.SubType = null;
	}
}

asc_CListType.prototype = {
	asc_getListType: function() { return this.Type; },
	asc_getListSubType: function() { return this.SubType; }
}

//{ asc_CListType export
window["Asc"].asc_CListType = asc_CListType;
window["Asc"]["asc_CListType"] = asc_CListType;
prot = asc_CListType.prototype;

prot["asc_getListType"] = prot.asc_getListType;
prot["asc_getListSubType"] = prot.asc_getListSubType;
//}

//-----------------------------------------------------------------------------------
// CTextFontFamily
//-----------------------------------------------------------------------------------

function asc_CTextFontFamily(obj) {
	
	if (obj) {
		this.Name = (undefined != obj.Name) ? obj.Name : null; 		// "Times New Roman"
		this.Index = (undefined != obj.Index) ? obj.Index : null;	// -1
	}
	else {
		this.Name = "Times New Roman";
		this.Index = -1;
	}
}

asc_CTextFontFamily.prototype = {
	asc_getName: function () { return this.Name; },
	asc_getIndex: function () { return this.Index; }
}

//{ asc_CTextFontFamily export
window["Asc"].asc_CTextFontFamily = asc_CTextFontFamily;
window["Asc"]["asc_CTextFontFamily"] = asc_CTextFontFamily;
prot = asc_CTextFontFamily.prototype;

prot["asc_getName"] = prot.asc_getName;
prot["asc_getIndex"] = prot.asc_getIndex;
//}

//}

//-----------------------------------------------------------------------------------
// Manager
//-----------------------------------------------------------------------------------

function DrawingObjects() {

	//-----------------------------------------------------------------------------------
	// Private
	//-----------------------------------------------------------------------------------
	
	var _this = this;
	var asc = window["Asc"];
	var api = asc["editor"];
	var asc_Range = asc.Range;
	
	var chartRender = new ChartRender();
	var worksheet = null;
	
	var drawingCtx = null;
	var overlayCtx = null;
	var shapeCtx = null;
	var shapeOverlayCtx = null;
	
	var trackOverlay = null;
	var autoShapeTrack = null;
	var scrollOffset = { x: 0, y: 0 };
	
	var aObjects = null;
	var aBoundsCheckers = [];
	
	var userId = null;
	var documentId = null;
	
	_this.zoom = 1;
	_this.isViewerMode = null;
	_this.objectLocker = null;
	_this.drawingDocument = null;
	_this.asyncImageEndLoaded = null;
	_this.asyncImagesDocumentEndLoaded = null;
	
	// Task timer
	var aDrawTasks = [];
	var drawTaskTimerId = null;
	function drawTaskFunction() {
	
		var taskLen = aDrawTasks.length;
		if ( taskLen ) {
		
			//console.log("Task count = " + taskLen);
			
			_this.showDrawingObjectsEx(aDrawTasks[taskLen - 1].params[0], aDrawTasks[taskLen - 1].params[1]);
			aDrawTasks.splice(0, (taskLen - 1 > 0) ? taskLen - 1 : 1);
		}
	}
	
	//-----------------------------------------------------------------------------------
	// Create drawing
	//-----------------------------------------------------------------------------------
	
	var DrawingBase = function(ws) {
		
		var _t = this;
		_t.worksheet = ws;
		
		_t.imageUrl = "";
		_t.Type = c_oAscCellAnchorType.cellanchorTwoCell;
		_t.Pos = { X: 0, Y: 0 };

		_t.from = { col: 0, colOff: 0, row: 0, rowOff: 0 };
		_t.to = { col: 0, colOff: 0, row: 0, rowOff: 0 };
		_t.ext = { cx: 0, cy: 0 };
		_t.size = { width: 0, height: 0 };

		_t.graphicObject = null; // CImage, CShape, GroupShape or CChartAsGroup

		_t.flags = {
			anchorUpdated: false,
			lockState: c_oAscObjectLockState.No
		};


        _t.getAllFonts = function(AllFonts) {
            _t.graphicObject && _t.graphicObject.getAllFonts && _t.graphicObject.getAllFonts(AllFonts);
        };

		// Свойства
		_t.isImage = function() {
			return _t.graphicObject ? _t.graphicObject.isImage() : false;
		}
		
		_t.isShape = function() {
			return _t.graphicObject ? _t.graphicObject.isShape() : false;
		}
		
		_t.isGroup = function() {
			return _t.graphicObject ? _t.graphicObject.isGroup() : false;
		}
		
		_t.isChart = function() {
			return _t.graphicObject ? _t.graphicObject.isChart() : false;
		}
		
		_t.isGraphicObject = function() {
			return _t.graphicObject != null;
		}
		
		_t.isLocked = function() {
			return ( (_t.graphicObject.lockType != c_oAscLockTypes.kLockTypeNone) && (_t.graphicObject.lockType != c_oAscLockTypes.kLockTypeMine) )
		}
		
		_t.getWorkbook = function() {
			return (_t.worksheet ? _t.worksheet.model.workbook : null);
		}

        _t.getCanvasContext = function() {
            return _this.drawingDocument.CanvasHitContext;
        }

		_t.setActive = function() {
			worksheet._moveActiveCellToXY( mmToPx(_t.graphicObject.x + 1), mmToPx(_t.graphicObject.y + 1) );
		}
		
		// GraphicObject: x, y, extX, extY
		_t.getGraphicObjectMetrics = function() {
			
			return { x: pxToMm(_t.getRealLeftOffset()),
					 y: pxToMm(_t.getRealTopOffset()),
					 extX: pxToMm(_t.getWidthFromTo()),
					 extY: pxToMm(_t.getHeightFromTo()) };
		}
		
		// Считаем From/To исходя из graphicObject
		_t.setGraphicObjectCoords = function() {
			if ( _t.isGraphicObject() ) {
			
				if ( (_t.graphicObject.x < 0) || (_t.graphicObject.y < 0) || (_t.graphicObject.extX <= 0) || (_t.graphicObject.extY <= 0) )
					return;
								
				var foundCol = _t.worksheet._findColUnderCursor( mmToPt(_t.graphicObject.x - worksheet.getCellLeft(worksheet.getFirstVisibleCol(), 3) + worksheet.getCellLeft(0, 3)), true );
				if ( !foundCol ) return;
				_t.from.col = foundCol.col;
				_t.from.colOff = _t.graphicObject.x - _t.worksheet.getCellLeft(_t.from.col, 3);

				var foundRow = _t.worksheet._findRowUnderCursor( mmToPt(_t.graphicObject.y - worksheet.getCellTop(worksheet.getFirstVisibleRow(), 3) + worksheet.getCellTop(0, 3)), true );
				if ( !foundRow ) return;
				_t.from.row = foundRow.row;
				_t.from.rowOff = _t.graphicObject.y - _t.worksheet.getCellTop(_t.from.row, 3);

				foundCol = _t.worksheet._findColUnderCursor( mmToPt(_t.graphicObject.x + _t.graphicObject.extX - worksheet.getCellLeft(worksheet.getFirstVisibleCol(), 3) + worksheet.getCellLeft(0, 3)), true );
				while (foundCol == null) {
					_t.worksheet.expandColsOnScroll(true);
					_t.worksheet._trigger("reinitializeScrollX");
					foundCol = _t.worksheet._findColUnderCursor( mmToPt(_t.graphicObject.x + _t.graphicObject.extX - worksheet.getCellLeft(worksheet.getFirstVisibleCol(), 3) + worksheet.getCellLeft(0, 3)), true );
				}
				_t.to.col = foundCol.col;
				_t.to.colOff = _t.graphicObject.x + _t.graphicObject.extX - _t.worksheet.getCellLeft(_t.to.col, 3);

				foundRow = _t.worksheet._findRowUnderCursor( mmToPt(_t.graphicObject.y + _t.graphicObject.extY - worksheet.getCellTop(worksheet.getFirstVisibleRow(), 3) + worksheet.getCellTop(0, 3)), true );
				while (foundRow == null) {
					_t.worksheet.expandRowsOnScroll(true);
					_t.worksheet._trigger("reinitializeScrollY");
					foundRow = _t.worksheet._findRowUnderCursor( mmToPt(_t.graphicObject.y + _t.graphicObject.extY - worksheet.getCellTop(worksheet.getFirstVisibleRow(), 3) + worksheet.getCellTop(0, 3)), true );
				}
				_t.to.row = foundRow.row;
				_t.to.rowOff = _t.graphicObject.y + _t.graphicObject.extY - _t.worksheet.getCellTop(_t.to.row, 3);
			}
		}
		
		// Проверяет выход за границы
		_t.canDraw = function() {
			var result = true;

			if ( (_t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(), 0) > _t.worksheet.getCellLeft(_t.to.col, 0) + mmToPx(_t.to.colOff)) ||
				 (_t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(), 0) > _t.worksheet.getCellTop(_t.to.row, 0) + mmToPx(_t.to.rowOff)))
			{ result = false; }

			return result;
		}

		_t.updateAnchorPosition = function() {

			switch (_t.Type) {
				case c_oAscCellAnchorType.cellanchorOneCell: 
					{
						var _left = _t.getRealLeftOffset();
						var _top = _t.getRealTopOffset();

						var foundCol = _t.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(_t.ext.cx)), true);
						while (foundCol == null) {
							_t.worksheet.expandColsOnScroll(true);
							_t.worksheet._trigger("reinitializeScrollX");
							foundCol = _t.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(_t.ext.cx)), true);
						}
						_t.to.col = foundCol.col;
						_t.to.colOff = pxToMm(_left + mmToPx(_t.ext.cx) - _t.worksheet.getCellLeft(_t.to.col, 0));

						var foundRow = _t.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(_t.ext.cy)), true);
						while (foundRow == null) {
							_t.worksheet.expandRowsOnScroll(true);
							_t.worksheet._trigger("reinitializeScrollY");
							foundRow = _t.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(_t.ext.cy)), true);
						}
						_t.to.row = foundRow.row;
						_t.to.rowOff = pxToMm(_top + mmToPx(_t.ext.cy) - _t.worksheet.getCellTop(_t.to.row, 0));
					}
					break;

				case c_oAscCellAnchorType.cellanchorAbsolute: 
					{
						if ( _t.Pos.X < 0 )
							_t.Pos.X = 0;
						if ( _t.Pos.Y < 0 )
							_t.Pos.Y = 0;
					
						_t.from.col = _t.worksheet._findColUnderCursor(pxToPt(mmToPx(_t.Pos.X) + _t.worksheet.getCellLeft(0, 0)), true).col;
						_t.from.colOff = pxToMm(mmToPx(_t.Pos.X) + _t.worksheet.getCellLeft(0, 0) - _t.worksheet.getCellLeft(_t.from.col, 0));

						_t.from.row = _t.worksheet._findRowUnderCursor(pxToPt(mmToPx(_t.Pos.Y) + _t.worksheet.getCellTop(0, 0)), true).row;
						_t.from.rowOff = pxToMm(mmToPx(_t.Pos.Y) + _t.worksheet.getCellTop(0, 0) - _t.worksheet.getCellTop(_t.from.row, 0));

						var _left = _t.getRealLeftOffset();
						var _top = _t.getRealTopOffset();

						var foundCol = _t.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(_t.ext.cx)), true);
						while (foundCol == null) {
							_t.worksheet.expandColsOnScroll(true);
							_t.worksheet._trigger("reinitializeScrollX");
							foundCol = _t.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(_t.ext.cx)), true);
						}
						_t.to.col = foundCol.col;
						_t.to.colOff = pxToMm(_left + mmToPx(_t.ext.cx) - _t.worksheet.getCellLeft(_t.to.col, 0));

						var foundRow = _t.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(_t.ext.cy)), true);
						while (foundRow == null) {
							_t.worksheet.expandRowsOnScroll(true);
							_t.worksheet._trigger("reinitializeScrollY");
							foundRow = _t.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(_t.ext.cy)), true);
						}
						_t.to.row = foundRow.row;
						_t.to.rowOff = pxToMm(_top + mmToPx(_t.ext.cy) - _t.worksheet.getCellTop(_t.to.row, 0));
					}
					break;
			}
			_t.flags.anchorUpdated = true;
		}

		// Реальное смещение по высоте
		_t.getRealTopOffset = function() {
			var val = _t.worksheet.getCellTop(_t.from.row, 0) + mmToPx(_t.from.rowOff);
			return asc.round(val);
		}

		// Реальное смещение по ширине
		_t.getRealLeftOffset = function() {
			var val = _t.worksheet.getCellLeft(_t.from.col, 0) + mmToPx(_t.from.colOff);
			return asc.round(val);
		}

		// Ширина по координатам
		_t.getWidthFromTo = function(withoutRound) {
			var val = _t.worksheet.getCellLeft(_t.to.col, 0) + mmToPx(_t.to.colOff) - _t.worksheet.getCellLeft(_t.from.col, 0) - mmToPx(_t.from.colOff);
			return withoutRound ? val : asc.round(val);
		}

		// Высота по координатам
		_t.getHeightFromTo = function(withoutRound) {
			var val = _t.worksheet.getCellTop(_t.to.row, 0) + mmToPx(_t.to.rowOff) - _t.worksheet.getCellTop(_t.from.row, 0) - mmToPx(_t.from.rowOff);
			return withoutRound ? val : asc.round(val);
		}

		// Видимая ширина при скролах
		_t.getVisibleWidth = function() {
			var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(), 0);
			var off = _t.getRealLeftOffset() - fvc;
			off = (off >= 0) ? 0 : Math.abs(off);
			return _t.getWidthFromTo() - off;
		}

		// Видимая высота при скролах
		_t.getVisibleHeight = function() {
			var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(), 0);
			var off = _t.getRealTopOffset() - fvr;
			off = (off >= 0) ? 0 : Math.abs(off);
			return _t.getHeightFromTo() - off;
		}

		// Видимое смещение объекта от первой видимой строки
		_t.getVisibleTopOffset = function(withHeader) {
			var headerRowOff = _t.worksheet.getCellTop(0, 0);
			var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(), 0);
			var off = _t.getRealTopOffset() - fvr;
			var off = (off > 0) ? off : 0;
			return withHeader ? headerRowOff + off : off;
		}

		// Видимое смещение объекта от первой видимой колонки
		_t.getVisibleLeftOffset = function(withHeader) {
			var headerColOff = _t.worksheet.getCellLeft(0, 0);
			var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(), 0);
			var off = _t.getRealLeftOffset() - fvc;
			var off = (off > 0) ? off : 0;
			return withHeader ? headerColOff + off : off;
		}

		// смещение по высоте внутри объекта
		_t.getInnerOffsetTop = function() {
			var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(), 0);
			var off = _t.getRealTopOffset() - fvr;
			return (off > 0) ? 0 : asc.round(Math.abs(off) * _t.getHeightCoeff());
		}

		// смещение по ширине внутри объекта
		_t.getInnerOffsetLeft = function() {
			var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(), 0);
			var off = _t.getRealLeftOffset() - fvc;
			return (off > 0) ? 0 : asc.round(Math.abs(off) * _t.getWidthCoeff());
		}

		// коэффициент по ширине если несоответствие с реальным размером
		_t.getWidthCoeff = function() {
			return _t.image.width / _t.getWidthFromTo();
		}

		// коэффициент по высоте если несоответствие с реальным размером
		_t.getHeightCoeff = function() {
			return _t.image.height / _t.getHeightFromTo();
		}
		
		_t.getDrawingObjects = function() {	
			return _this;
		}
	}
	
	//-----------------------------------------------------------------------------------
	// Constructor
	//-----------------------------------------------------------------------------------
	
	_this.createDrawingObject = function() {
	
		var drawing = new DrawingBase(worksheet);
		return drawing;
	}

	_this.cloneDrawingObject = function(obj) {

		var copyObject = _this.createDrawingObject();
		
		copyObject.worksheet = worksheet;

		copyObject.Type = obj.Type;
		copyObject.Pos.X = obj.Pos.X;
		copyObject.Pos.Y = obj.Pos.Y;
		copyObject.ext.cx = obj.ext.cx;
		copyObject.ext.cy = obj.ext.cy;
		copyObject.imageUrl = obj.imageUrl;

		copyObject.from.col = obj.from.col;
		copyObject.from.colOff = obj.from.colOff;
		copyObject.from.row = obj.from.row;
		copyObject.from.rowOff = obj.from.rowOff;

		copyObject.to.col = obj.to.col;
		copyObject.to.colOff = obj.to.colOff;
		copyObject.to.row = obj.to.row;
		copyObject.to.rowOff = obj.to.rowOff;
		
		copyObject.graphicObject = obj.graphicObject;
		
		// Series colors
		if ( copyObject.graphicObject instanceof  CChartAsGroup ) {
		
			var chart = copyObject.graphicObject.chart;
			var uniColors = chart.generateUniColors(chart.series.length);
			
			if ( chart.type == c_oAscChartType.hbar )
				uniColors = OfficeExcel.array_reverse(uniColors);
			
			for (var i = 0; i < chart.series.length; i++) {
				if ( !chart.series[i].OutlineColor )
					chart.series[i].OutlineColor = uniColors[i];
				if ( !chart.series[i].Tx )
					chart.series[i].Tx = api.chartTranslate.series + " " + (i + 1);
			}
		}
		
		return copyObject;
	}

	//-----------------------------------------------------------------------------------
	// Public methods
	//-----------------------------------------------------------------------------------
	
	_this.init = function(currentSheet) {
	
		var taskTimerId = setInterval(drawTaskFunction, 5);

		userId = api.User.asc_getId();
		documentId = api.documentId;
		worksheet = currentSheet;
		
		drawingCtx = currentSheet.drawingCtx;
		overlayCtx = currentSheet.overlayCtx;
		shapeCtx = currentSheet.shapeCtx;
		shapeOverlayCtx = currentSheet.shapeOverlayCtx;
		
		trackOverlay = new COverlay();
		trackOverlay.init( shapeOverlayCtx.m_oContext, "ws-canvas-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );
		
		autoShapeTrack = new CAutoshapeTrack();
		autoShapeTrack.init( trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );
		shapeCtx.m_oAutoShapesTrack = autoShapeTrack;
		
		_this.objectLocker = new ObjectLocker(worksheet);
		_this.drawingDocument = new CDrawingDocument(this);
		_this.drawingDocument.AutoShapesTrack = autoShapeTrack;
		_this.drawingDocument.TargetHtmlElement = document.getElementById('id_target_cursor');
		_this.drawingDocument.InitGuiCanvasShape(api.shapeElementId);
				
		_this.isViewerMode =  function() { return worksheet._trigger("getViewerMode"); };


		aObjects = [];
		aImagesSync = [];
		aObjectsSync = [];
		
		for (var i = 0; currentSheet.model.Drawings && (i < currentSheet.model.Drawings.length); i++) {
			
			var drawingObject = _this.cloneDrawingObject(currentSheet.model.Drawings[i]);
			
            if (drawingObject.graphicObject instanceof  CChartAsGroup) {
				
				_this.calcChartInterval(drawingObject.graphicObject.chart);
				drawingObject.graphicObject.drawingBase = drawingObject;
                drawingObject.graphicObject.drawingObjects = _this;
                
				if (drawingObject.graphicObject.chartTitle)
                    drawingObject.graphicObject.chartTitle.drawingObjects = _this;
					
                drawingObject.graphicObject.chart.worksheet = worksheet;
				
				if ( drawingObject.graphicObject.chart.series.length && !drawingObject.graphicObject.chart.series[0].Val.NumCache.length ) {
					drawingObject.graphicObject.chart.rebuildSeries();
				}
				
                drawingObject.graphicObject.init();	
				
                aObjects.push( drawingObject );
            }
			if (drawingObject.graphicObject instanceof  CShape) {
				
				drawingObject.graphicObject.drawingBase = drawingObject;
                drawingObject.graphicObject.drawingObjects = _this;
                drawingObject.graphicObject.setDrawingDocument(this.drawingDocument);
				drawingObject.graphicObject.recalculate();
				aObjects.push( drawingObject );
			}
            if (drawingObject.graphicObject instanceof  CImageShape) {

				aObjectsSync[aObjectsSync.length] = drawingObject;
                drawingObject.graphicObject.drawingBase = drawingObject;
                drawingObject.graphicObject.drawingObjects = _this;
                drawingObject.graphicObject.recalculate(aImagesSync);
			}

            if (drawingObject.graphicObject instanceof  CGroupShape) {

                drawingObject.graphicObject.drawingBase = drawingObject;
                drawingObject.graphicObject.drawingObjects = _this;
                drawingObject.graphicObject.setDrawingDocument(this.drawingDocument);
                drawingObject.graphicObject.recalculate(aImagesSync);
                aObjects.push( drawingObject );
            }
		}
		
		// Загружаем все картинки листа
		_this.asyncImagesDocumentEndLoaded = function() {
			
			for (var i = 0; i < aObjectsSync.length; i++) {
			
				var drawingObject = aObjectsSync[i];
				var image = api.ImageLoader.LoadImage(aImagesSync[i], 1);	// Должна быть в мапе
				
				if ( image != null ) {
				
					var headerTop = worksheet.getCellTop(0, 0);
					var headerLeft = worksheet.getCellLeft(0, 0);
									
					var x = pxToMm(drawingObject.getVisibleLeftOffset() + headerLeft);
					var y = pxToMm(drawingObject.getVisibleTopOffset() + headerTop);
					var w = pxToMm(drawingObject.getWidthFromTo());
					var h = pxToMm(drawingObject.getHeightFromTo());
					
					// CImage
					drawingObject.graphicObject = new CImageShape(drawingObject, _this);
					drawingObject.graphicObject.initDefault( x, y, w, h, image.src );
					drawingObject.setGraphicObjectCoords();
					drawingObject.graphicObject.draw(shapeCtx);
					aObjects.push(drawingObject);
					
					var boundsChecker = _this.getBoundsChecker(drawingObject);
					aBoundsCheckers.push(boundsChecker);
				}
			}
		}	
		
		api.ImageLoader.LoadDocumentImages(aImagesSync);

		// Upload event
		if (window.addEventListener) {
			window.addEventListener("message", this._uploadMessage, false);
		}
		else {
			if (window.attachEvent) {
				window.attachEvent("onmessage", this._uploadMessage);
			}
		}
	}

    _this.getAllFonts = function(AllFonts) {

    },

    _this.getChartRender = function() {
        return chartRender;
    };

    _this.getOverlay = function() {
        return trackOverlay;
    };

    _this.OnUpdateOverlay = function() {
        
        var overlay = trackOverlay;
		var ctx = overlay.m_oContext;
		var drDoc = this.drawingDocument;

        overlay.Clear();
        this.drawingDocument.Overlay = overlay;
		
		var bFullClear = (_this.controller.curState.id != STATES_ID_TEXT_ADD) && (_this.controller.curState.id != STATES_ID_TEXT_ADD_IN_GROUP);

		if ( bFullClear )
			shapeOverlayCtx.m_oContext.clearRect(0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix);
		else {
			for ( var i = 0; i < aObjects.length; i++ ) {
				var boundsChecker = _this.getBoundsChecker(aObjects[i]);
				var _w = boundsChecker.Bounds.max_x - boundsChecker.Bounds.min_x;
				var _h = boundsChecker.Bounds.max_y - boundsChecker.Bounds.min_y;
				shapeOverlayCtx.m_oContext.clearRect( mmToPx(boundsChecker.Bounds.min_x) + scrollOffset.x, mmToPx(boundsChecker.Bounds.min_y) + scrollOffset.y, mmToPx(_w), mmToPx(_h) );
			}
		}
		
		worksheet._drawCollaborativeElements(false);
		
		for ( var i = 0; i < _this.controller.selectedObjects.length; i++ ) {
			if ( _this.controller.selectedObjects[i].isChart() ) {
				_this.selectDrawingObjectRange(_this.controller.selectedObjects[i].Id);
				_this.controller.selectedObjects[i].draw(shapeOverlayCtx);
			}
		}

        if (null == drDoc.m_oDocumentRenderer)
        {
            if (drDoc.m_bIsSelection)
            {
                if (drDoc.m_bIsSelection )
                {

                    overlay.m_oControl.HtmlElement.style.display = "block";

                    if (null == overlay.m_oContext)
                        overlay.m_oContext = overlay.m_oControl.HtmlElement.getContext('2d');
                }
                drDoc.private_StartDrawSelection(overlay);
                this.controller.drawTextSelection();
                drDoc.private_EndDrawSelection();
            }

            ctx.globalAlpha = 1.0;

            this.controller.drawSelection(drDoc);
            if (_this.controller.needUpdateOverlay())
            {
                overlay.Show();
                shapeOverlayCtx.put_GlobalAlpha(true, 0.5);
                _this.controller.drawTracks(shapeOverlayCtx);
                shapeOverlayCtx.put_GlobalAlpha(true, 1);
            }

        }
        else
        {
            ctx.fillStyle = "rgba(51,102,204,255)";
            ctx.beginPath();

            for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++)
            {
                var drawPage = drDoc.m_arrPages[i].drawingPage;
                drDoc.m_oDocumentRenderer.DrawSelection(i, overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
            }

            ctx.globalAlpha = 0.2;
            ctx.fill();
            ctx.beginPath();
            ctx.globalAlpha = 1.0;
        }
		_this.drawWorksheetHeaders();

        return true;
    };

	_this.changeZoom = function(factor) {
		
		_this.zoom = factor;
		_this.resizeCanvas();
				
		_this.showDrawingObjects(true);
		_this.rebuildChartGraphicObjects();
	}
	
	_this.resizeCanvas = function() {
	
		shapeCtx.init( drawingCtx.ctx, drawingCtx.getWidth(0), drawingCtx.getHeight(0), drawingCtx.getWidth(3), drawingCtx.getHeight(3) );
		shapeCtx.CalculateFullTransform();
		
		shapeOverlayCtx.init( overlayCtx.ctx, overlayCtx.getWidth(0), overlayCtx.getHeight(0), overlayCtx.getWidth(3), overlayCtx.getHeight(3) );
		shapeOverlayCtx.CalculateFullTransform();
		
		trackOverlay.init( shapeOverlayCtx.m_oContext, "ws-canvas-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );
		autoShapeTrack.init( trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );		
		autoShapeTrack.Graphics.CalculateFullTransform();
	}
	
	_this.getWorkbook = function() {
		return (worksheet ? worksheet.model.workbook : null);
	}
	
	_this.getCanvasContext = function() {
        return _this.drawingDocument.CanvasHitContext;
    }
	
	_this.getDrawingObjects = function() {
		return aObjects;
	}
	
	_this.getWorksheet = function() {
		return worksheet;
	}

	_this._uploadMessage = function(event) {
		if ( null != event && null != event.data ) {

			var data = JSON.parse(event.data);
			if ((null != data) && (null != data["type"]))
			{
				if (PostMessageType.UploadImage == data["type"]) {
					if (c_oAscServerError.NoError == data["error"]) {
						var sheetId = null;
						if (null != data["input"])
							sheetId = data["input"]["sheetId"];
						var url = data["url"];
						
						if (sheetId == worksheet.model.getId()) {
							if ( api.isImageChangeUrl || api.isShapeImageChangeUrl )
								_this.editImageDrawingObject(url);
							else
								_this.addImageDrawingObject(url, null);
						}
						else
							worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
					}
					else {
						worksheet.model.workbook.handlers.trigger("asc_onError", api.asc_mapAscServerErrorToAscError(data.error), c_oAscError.Level.NoCritical);
						worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
					}
				}
			}
		}
	}

	_this.callTrigger = function(triggerName, param) {
		if ( triggerName )
			worksheet.model.workbook.handlers.trigger(triggerName, param);
	}
	
	_this.getBoundsChecker = function(drawingObject) {
		if ( drawingObject && drawingObject.graphicObject ) {
			var boundsChecker = new  CSlideBoundsChecker();
			boundsChecker.init(1, 1, 1, 1);
			boundsChecker.transform3(drawingObject.graphicObject.transform);
			boundsChecker.rect(0,0, drawingObject.graphicObject.extX, drawingObject.graphicObject.extY);
			drawingObject.graphicObject.draw(boundsChecker);
			boundsChecker.CorrectBounds();
			
			// Коррекция для селекта при блокировке
			var delta = (drawingObject.graphicObject.lockType == c_oAscLockTypes.kLockTypeNone) ? 0 : 6;
			boundsChecker.Bounds.min_x -= delta;
			boundsChecker.Bounds.min_y -= delta;
			boundsChecker.Bounds.max_x += delta;
			boundsChecker.Bounds.max_y += delta;
			return boundsChecker;
		}
		return null;
	}
	
	_this.clearDrawingObjects = function() {
		
		// Чистим предыдущие области
		var bHeaders = false;
		var _top = worksheet.getCellTop(worksheet.getFirstVisibleRow(), 3);
		var _left = worksheet.getCellLeft(worksheet.getFirstVisibleCol(), 3);
		for (var i = 0; i < aBoundsCheckers.length; i++) {
			restoreSheetArea(aBoundsCheckers[i]);
			if ( (_top >= aBoundsCheckers[i].Bounds.min_y) || (_left >= aBoundsCheckers[i].Bounds.min_x) )
				bHeaders = true;
		}
		aBoundsCheckers = [];
		
		// Чистим текущие области
		for ( var i = 0; i < aObjects.length; i++ ) {
			var boundsChecker = _this.getBoundsChecker(aObjects[i]);
			restoreSheetArea(boundsChecker);
			aBoundsCheckers.push(boundsChecker);
		}
		
		if ( bHeaders )
			_this.drawWorksheetHeaders(true);
	}
	
	function restoreSheetArea(checker) {
	
		var _w = checker.Bounds.max_x - checker.Bounds.min_x;
		var _h = checker.Bounds.max_y - checker.Bounds.min_y;
		
		//overlayCtx.clearRect( mmToPt(checker.Bounds.min_x + pxToMm(scrollOffset.x)), mmToPt(checker.Bounds.min_y + pxToMm(scrollOffset.y)), mmToPt(_w), mmToPt(_h) );
		//drawingCtx.clearRect( mmToPt(checker.Bounds.min_x + pxToMm(scrollOffset.x)), mmToPt(checker.Bounds.min_y + pxToMm(scrollOffset.y)), mmToPt(_w), mmToPt(_h) );
	
		var foundRow = worksheet._findRowUnderCursor( mmToPt(checker.Bounds.min_y + pxToMm(scrollOffset.y)), true);		
		var topRow = foundRow ? foundRow.row : 0;
		var foundCol = worksheet._findColUnderCursor( mmToPt(checker.Bounds.min_x + pxToMm(scrollOffset.x)), true);
		var leftCol = foundCol ? foundCol.col : 0;
		
		foundRow = worksheet._findRowUnderCursor( mmToPt(checker.Bounds.max_y + pxToMm(scrollOffset.y)), true);
		var bottomRow = foundRow ? foundRow.row : 0;
		foundCol = worksheet._findColUnderCursor( mmToPt(checker.Bounds.max_x + pxToMm(scrollOffset.x)), true);
		var rightcol = foundCol ? foundCol.col : 0;
		
		var r_ = asc_Range( leftCol, topRow, rightcol, bottomRow );
		worksheet._drawGrid( drawingCtx, r_);
		worksheet._drawCells(r_);
		worksheet._drawCellsBorders(undefined, r_);
	}

	_this.raiseLayerDrawingObjects = function() {
		
		for ( var i = 0; i < aObjects.length; i++ ) {
			/*var boundsChecker = _this.getBoundsChecker(aObjects[i]);
			var _w = boundsChecker.Bounds.max_x - boundsChecker.Bounds.min_x;
			var _h = boundsChecker.Bounds.max_y - boundsChecker.Bounds.min_y;
			overlayCtx.clearRect( mmToPt(boundsChecker.Bounds.min_x + pxToMm(scrollOffset.x)), mmToPt(boundsChecker.Bounds.min_y + pxToMm(scrollOffset.y)), mmToPt(_w), mmToPt(_h) );*/
			
			aObjects[i].graphicObject.draw(shapeOverlayCtx);
		}
		_this.drawWorksheetHeaders();
	}	

	//-----------------------------------------------------------------------------------
	// Drawing objects
	//-----------------------------------------------------------------------------------

	_this.showDrawingObjects = function(clearCanvas, printOptions) {
		
		var currDate = new Date();
		var currTime = currDate.getTime();
		if ( aDrawTasks.length ) {
			if ( currTime - aDrawTasks[aDrawTasks.length - 1].time < 40 )
				return;
		}
		aDrawTasks.push( { time: currTime, params: [clearCanvas, printOptions] } );
	}
	
	_this.showDrawingObjectsEx = function(clearCanvas, printOptions) {

		/*********** Print Options ***************
		printOptions : {
		ctx,
		margin : {
		left: 0,	// pt
		right: 0,	// pt
		top: 0,		// pt
		button: 0	// pt
		}
		}
		*****************************************/
		
		if ( drawingCtx ) {
			
			if ( clearCanvas )
				_this.clearDrawingObjects();

			if ( !aObjects.length )
				return;
			
			worksheet._drawGraphic();
			worksheet.model.Drawings = aObjects;
			
			for (var i = 0; i < aObjects.length; i++) {

				var index = i;
				var obj = aObjects[i];
				
				if ( !obj.canDraw() )
					continue;
					
				if ( !obj.flags.anchorUpdated )
					obj.updateAnchorPosition();
				
				// Shape render
				if ( obj.isGraphicObject() ) {
					obj.graphicObject.draw( printOptions ? printOptions.ctx.DocumentRenderer : shapeCtx);
					continue;
				}
			}
		}
		
		if ( !printOptions ) {
			if ( _this.controller.selectedObjects.length )
				_this.OnUpdateOverlay();
			else
				_this.raiseLayerDrawingObjects();

			_this.drawWorksheetHeaders();
		}		
	}

	_this.getDrawingAreaMetrics = function() {

		/*
		*	Объект, определяющий max колонку и строчку для отрисовки объектов листа
		*/

		var metrics = {
			maxCol: 0,
			maxRow: 0
		}

		for (var i = 0; i < aObjects.length; i++) {
			if (aObjects[i].to.col >= metrics.maxCol)
				metrics.maxCol = aObjects[i].to.col + 1; // учитываем colOff
			if (aObjects[i].to.row >= metrics.maxRow)
				metrics.maxRow = aObjects[i].to.row + 1; // учитываем rowOff
		}
		return metrics;
	}

	_this.drawWorksheetHeaders = function(bForce) {
	
		// Проверяем выход за видимую область
		var fvr = worksheet.getFirstVisibleRow();
		var fvc = worksheet.getFirstVisibleCol();
		
		var top = worksheet.getCellTop(0, 3) + pxToMm(1);
		var left = worksheet.getCellLeft(0, 3) + pxToMm(1);

		for (var i = 0; i < aObjects.length; i++) {
			
			var obj = aObjects[i];
			if ( bForce || (obj.from.col < fvc) || (obj.from.row < fvr) ) {
				worksheet._drawColumnHeaders();
				worksheet._drawRowHeaders();
			
				// cols header on overlay
				overlayCtx.clearRect( 0, 0, overlayCtx.getWidth(), worksheet.getCellTop(0, 1) );
				// rows header on overlay
				overlayCtx.clearRect( 0, 0, worksheet.getCellLeft(0, 1), overlayCtx.getHeight() );
				break;
			}
		}
		if ( !_this.selectedGraphicObjectsExists() )
			worksheet._drawActiveHeaders();
	}
	
	//-----------------------------------------------------------------------------------
	// For object type
	//-----------------------------------------------------------------------------------
	
	_this.addImageDrawingObject = function(imageUrl, options) {

		if ( imageUrl && !_this.isViewerMode() ) {
						
			var _image = api.ImageLoader.LoadImage(imageUrl, 1);
			var isOption = options && options.cell;
			
			if (null != _image) {
				addImageObject(_image);
			}
			else {
				_this.asyncImageEndLoaded = function(_image) {
					addImageObject(_image);
				}
			}
			
			function addImageObject(_image) {
			
				if ( !_image.Image ) {
					worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
				}
				else {
					var obj = _this.createDrawingObject();
					obj.worksheet = worksheet;
					
					obj.from.col = isOption ? options.cell.col : worksheet.getSelectedColumnIndex();
					obj.from.row = isOption ? options.cell.row : worksheet.getSelectedRowIndex();
					
					var headerTop = worksheet.getCellTop(0, 0);
					var headerLeft = worksheet.getCellLeft(0, 0);
					
					// Проверяем начальные координаты при вставке
					while ( !worksheet.cols[obj.from.col] ) {
						worksheet.expandColsOnScroll(true);
					}
					worksheet.expandColsOnScroll(true); 	// для colOff
					
					while ( !worksheet.rows[obj.from.row] ) {
						worksheet.expandRowsOnScroll(true);
					}
					worksheet.expandRowsOnScroll(true); 	// для rowOff
					
					calculateObjectMetrics(obj, isOption ? options.width : _image.Image.width, isOption ? options.height : _image.Image.height);
					
					var x = pxToMm(obj.getRealLeftOffset());
					var y = pxToMm(obj.getRealTopOffset());
					var w = pxToMm(obj.getWidthFromTo());
					var h = pxToMm(obj.getHeightFromTo());
					
					// CImage
					obj.graphicObject = new CImageShape(obj, _this);
					obj.graphicObject.initDefault( x, y, w, h, _image.src );
					obj.graphicObject.select(_this.controller);
					aObjects.push(obj);
					
					obj.setGraphicObjectCoords();
					obj.setActive();
					
					_this.showDrawingObjects(false);
					_this.sendGraphicObjectProps();
					
					var boundsChecker = _this.getBoundsChecker(obj);
					aBoundsCheckers.push(boundsChecker);
					
					_this.objectLocker.reset();
					_this.objectLocker.addObjectId(obj.id);
					_this.objectLocker.checkObjects( function(result){ return result; } );
				}
				
				worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
			}
			
			function calculateObjectMetrics(object, width, height) {
				// Обработка картинок большого разрешения
				var metricCoeff = 1;
				
				var realTopOffset = object.getRealTopOffset();
				var realLeftOffset = object.getRealLeftOffset();
				
				var areaWidth = worksheet.getCellLeft(worksheet.getLastVisibleCol(), 0) - worksheet.getCellLeft(worksheet.getFirstVisibleCol(), 0); 	// по ширине
				if (areaWidth < width) {
					metricCoeff = width / areaWidth;

					width = areaWidth;
					height /= metricCoeff;
				}

				var areaHeight = worksheet.getCellTop(worksheet.getLastVisibleRow(), 0) - worksheet.getCellTop(worksheet.getFirstVisibleRow(), 0); 	// по высоте
				if (areaHeight < height) {
					metricCoeff = height / areaHeight;

					height = areaHeight;
					width /= metricCoeff;
				}

				var endPoint = worksheet._findColUnderCursor(pxToPt(realLeftOffset + width), true);
				while (endPoint == null) {
					worksheet.expandColsOnScroll(true);
					endPoint = worksheet._findColUnderCursor(pxToPt(realLeftOffset + width), true);
				}
				worksheet.expandColsOnScroll(true); 	// для colOff

				object.to.col = worksheet._findColUnderCursor(pxToPt(realLeftOffset + width), true).col;
				object.to.colOff = pxToMm(realLeftOffset + width - worksheet.getCellLeft(object.to.col, 0));

				endPoint = worksheet._findRowUnderCursor(pxToPt(realTopOffset + height), true);
				while (endPoint == null) {
					worksheet.expandRowsOnScroll(true);
					endPoint = worksheet._findRowUnderCursor(pxToPt(realTopOffset + height), true);
				}
				worksheet.expandRowsOnScroll(true); 	// для rowOff

				object.to.row = worksheet._findRowUnderCursor(pxToPt(realTopOffset + height), true).row;
				object.to.rowOff = pxToMm(realTopOffset + height - worksheet.getCellTop(object.to.row, 0));
				
				worksheet._trigger("reinitializeScroll");
			}
		}
	}

	_this.editImageDrawingObject = function(imageUrl) {
		
		if ( imageUrl ) {
			var _image = api.ImageLoader.LoadImage(imageUrl, 1);
			if (null != _image) {
				addImageObject(_image);
			}
			else {
				_this.asyncImageEndLoaded = function(_image) {
					addImageObject(_image);
				}
			}
			
			function addImageObject(_image) {
			
				if ( !_image.Image ) {
					worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
				}
				else {
					if ( api.isImageChangeUrl ) {
						var imageProp = new asc_CImgProperty();
						imageProp.ImageUrl = _image.src;
						_this.setGraphicObjectProps(imageProp);
						api.isImageChangeUrl = false;
					}
					else if ( api.isShapeImageChangeUrl ) {
						var imgProps = new asc_CImgProperty();
						var shapeProp = new asc_CShapeProperty();
						imgProps.ShapeProperties = shapeProp;
						shapeProp.fill = new asc_CShapeFill();
						shapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
						shapeProp.fill.fill = new asc_CFillBlip();
						shapeProp.fill.fill.asc_putUrl(_image.src);
						_this.setGraphicObjectProps(imgProps);
						api.isShapeImageChangeUrl = false;
					}
					
					_this.showDrawingObjects(true);
				}
				worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
			}
		}
	}
	
	_this.addChartDrawingObject = function(chart, options) {

		if ( _this.isViewerMode() )
			return;

		if ( chart instanceof asc_CChart ) {
			var _range = convertFormula(chart.range.interval, worksheet);
			if (_range)
				chart.range.intervalObject = _range;

			chart.rebuildSeries();
			chart.worksheet = worksheet; 	// Для формул серий
			
			return this.controller.addChartDrawingObject(chart, options);
		}
		else if ( isObject(chart) && chart["binary"] ) {
			
			/* Вставка данных в таблицу и применение темы
			// Инжектим тему и перестраиваем превью диаграмм
			if ( wordChart.themeColors ) {
				
				api.GuiControlColorsMap = [];
				for (var i = 0; i < wordChart.themeColors.length; i++) {
					
					var color = new RGBColor( wordChart.themeColors[i] );
					api.GuiControlColorsMap.push(new CColor(color.r, color.g, color.b));
				}
				api.chartStyleManager.init();
				api.chartPreviewManager.init();
			}			
			
			// Заполняем таблицу
			if ( chart.data.length ) {
				var bbox = chart.range.intervalObject.getBBox0();
				var r = bbox.r1, c = bbox.c1;
				
				for (var row = bbox.r1; row <= bbox.r2; row++) {
					
					for (var col = bbox.c1; col <= bbox.c2; col++) {
					
						var cell = chart.range.intervalObject.worksheet.getCell(new CellAddress(row, col, 0));
						cell.setNumFormat(chart.data[row - r][col - c].numFormatStr);
						cell.setValue(chart.data[row - r][col - c].value);
					}
				}
			}
			else {
				var aCells = chart.range.intervalObject.getCells();
				for ( var i = 0; i < aCells.length; i++ ) {
					aCells[i].setValue( (i + 1).toString() );
				}
			}
			worksheet._updateCellsRange(chart.range.intervalObject.getBBox0());
			*/
		}
	}

	_this.editChartDrawingObject = function(chart) {
		if ( chart ) {
			_this.controller.editChartDrawingObjects(chart);
			_this.showDrawingObjects(false);
		}
	}
	
	_this.rebuildChartGraphicObjects = function() {
		for (var i = 0; i < aObjects.length; i++) {
			var graphicObject = aObjects[i].graphicObject;
			if ( graphicObject.isChart() ) {
				graphicObject.chart.rebuildSeries();
				graphicObject.recalculate();
			}
		}
	}
	
	_this.updateDrawingObject = function(bInsert, operType, updateRange) {

		var changedRange = null;
		var metrics = null;

		for (var i = 0; i < aObjects.length; i++) {
			
			var obj = aObjects[i];
			if ( !obj.isLocked() ) {
			
				var bbox = obj.isChart() ? obj.graphicObject.chart.range.intervalObject.getBBox0() : null;

				if ( obj.isChart() || obj.isImage() || obj.isShape() ) {

					metrics = { from: {}, to: {} };
					metrics.from.col = obj.from.col; metrics.to.col = obj.to.col;
					metrics.from.colOff = obj.from.colOff; metrics.to.colOff = obj.to.colOff;
					metrics.from.row = obj.from.row; metrics.to.row = obj.to.row;
					metrics.from.rowOff = obj.from.rowOff; metrics.to.rowOff = obj.to.rowOff;
					
					if (bInsert) {		// Insert
						switch (operType) {
							case c_oAscInsertOptions.InsertColumns: 
								{
									var count = updateRange.c2 - updateRange.c1 + 1;

									// Position
									if (updateRange.c1 <= obj.from.col) {
										metrics.from.col += count;
										metrics.to.col += count;
									}
									else if ((updateRange.c1 > obj.from.col) && (updateRange.c1 <= obj.to.col)) {
										metrics.to.col += count;
									}
									else
										metrics = null;

									// Range
									if (obj.isChart()) {
										if (updateRange.c1 <= bbox.c1)
											changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 + count , bbox.r2 , bbox.c2 + count );

										else if (updateRange.c1 <= bbox.c2)
											changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r2 , bbox.c2 + count );
									}
								}
								break;
							case c_oAscInsertOptions.InsertRows: 
								{

									// Position
									var count = updateRange.r2 - updateRange.r1 + 1;

									if (updateRange.r1 <= obj.from.row) {
										metrics.from.row += count;
										metrics.to.row += count;
									}
									else if ((updateRange.r1 > obj.from.row) && (updateRange.r1 <= obj.to.row)) {
										metrics.to.row += count;
									}
									else
										metrics = null;

									// Range
									if (obj.isChart()) {
										if (updateRange.r1 <= bbox.r1)
											changedRange = new Range(worksheet.model, bbox.r1 + count , bbox.c1 , bbox.r2 + count , bbox.c2 );

										else if (updateRange.r1 <= bbox.r2)
											changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r2 + count , bbox.c2 );
									}
								}
								break;
						}
					}
					else {				// Delete
						switch (operType) {
							case c_oAscDeleteOptions.DeleteColumns: 
								{

									// Position
									var count = updateRange.c2 - updateRange.c1 + 1;

									if (updateRange.c1 <= obj.from.col) {

										// outside
										if (updateRange.c2 < obj.from.col) {
											metrics.from.col -= count;
											metrics.to.col -= count;
										}
										// inside
										else {
											metrics.from.col = updateRange.c1;
											metrics.from.colOff = 0;

											var offset = 0;
											if (obj.to.col - updateRange.c2 - 1 > 0)
												offset = obj.to.col - updateRange.c2 - 1;
											else {
												offset = 1;
												metrics.to.colOff = 0;
											}
											metrics.to.col = metrics.from.col + offset;
										}
									}

									else if ((updateRange.c1 > obj.from.col) && (updateRange.c1 <= obj.to.col)) {

										// outside
										if (updateRange.c2 >= obj.to.col) {
											metrics.to.col = updateRange.c1;
											metrics.to.colOff = 0;
										}
										else
											metrics.to.col -= count;
									}
									else
										metrics = null;

									// Range
									if (obj.isChart()) {
										var count = updateRange.c2 - updateRange.c1 + 1;

										if (updateRange.c1 < bbox.c1) {

											if (updateRange.c2 < bbox.c1)
												changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 - count , bbox.r2 , bbox.c2 - count );
											else {

												// outside
												if (updateRange.c2 > bbox.c2)
													changedRange = new Range(worksheet.model, bbox.r1 , updateRange.c1 , bbox.r2 , updateRange.c1);

												// inside
												else {
													var offset = bbox.c2 - updateRange.c2;
													changedRange = new Range(worksheet.model, bbox.r1 , updateRange.c1 , bbox.r2 , updateRange.c1 + offset - 1);
												}
											}
										}

										else if ((updateRange.c1 >= bbox.c1) && (updateRange.c1 <= bbox.c2)) {

											// outside
											if (updateRange.c2 > bbox.c2) {
												var offset = (bbox.c1 + 1 > updateRange.c1) ? 1 : 0;
												changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r2 , updateRange.c1 + offset - 1);
											}

											// inside
											else {
												var offset = bbox.c2 + 1 - bbox.c1 - count;
												if (offset <= 0)
													offset = 1;
												changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r2 , bbox.c1 + offset - 1);
											}
										}
									}
								}
								break;

							case c_oAscDeleteOptions.DeleteRows: 
								{

									// Position
									var count = updateRange.r2 - updateRange.r1 + 1;

									if (updateRange.r1 <= obj.from.row) {

										// outside
										if (updateRange.r2 < obj.from.row) {
											metrics.from.row -= count;
											metrics.to.row -= count;
										}
										// inside
										else {
											metrics.from.row = updateRange.r1;
											metrics.from.colOff = 0;

											var offset = 0;
											if (obj.to.row - updateRange.r2 - 1 > 0)
												offset = obj.to.row - updateRange.r2 - 1;
											else {
												offset = 1;
												metrics.to.colOff = 0;
											}
											metrics.to.row = metrics.from.row + offset;
										}
									}

									else if ((updateRange.r1 > obj.from.row) && (updateRange.r1 <= obj.to.row)) {

										// outside
										if (updateRange.r2 >= obj.to.row) {
											metrics.to.row = updateRange.r1;
											metrics.to.colOff = 0;
										}
										else
											metrics.to.row -= count;
									}
									else
										metrics = null;

									// range
									if (obj.isChart()) {
										var count = updateRange.r2 - updateRange.r1 + 1;

										if (updateRange.r1 < bbox.r1) {

											if (updateRange.r2 < bbox.r1)
												changedRange = new Range(worksheet.model, bbox.r1 - count, bbox.c1 , bbox.r2 - count , bbox.c2 );
											else {

												// outside
												if (updateRange.r2 >= bbox.r2)
													changedRange = new Range(worksheet.model, updateRange.r1 , bbox.c1 , updateRange.r1 , bbox.c2);

												// inside
												else {
													var offset = bbox.r1 + 1 - updateRange.r2;
													changedRange = new Range(worksheet.model, updateRange.r1 , bbox.c1 , updateRange.r1 + offset, bbox.c2);
												}
											}
										}

										else if ((updateRange.r1 >= bbox.r1) && (updateRange.r1 <= bbox.r2)) {

											// outside
											if (updateRange.r2 > bbox.r2) {
												var offset = (bbox.r1 + 1 > updateRange.r1) ? 1 : 0;
												changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , updateRange.r1 + offset - 1, bbox.c2 );
											}

											// inside
											else {
												var offset = bbox.r2 + 1 - bbox.r1 - count;
												if (offset <= 0) offset = 1;
												changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r1 + offset - 1, bbox.c2 );
											}
										}
									}
								}
								break;
						}
					}

					// Normalize position
					if (metrics) {
						if (metrics.from.col < 0) {
							metrics.from.col = 0;
							metrics.from.colOff = 0;
						}

						if (metrics.to.col <= 0) {
							metrics.to.col = 1;
							metrics.to.colOff = 0;
						}

						if (metrics.from.row < 0) {
							metrics.from.row = 0;
							metrics.from.rowOff = 0;
						}

						if (metrics.to.row <= 0) {
							metrics.to.row = 1;
							metrics.to.rowOff = 0;
						}

						if (metrics.from.col == metrics.to.col) {
							metrics.to.col++;
							metrics.to.colOff = 0;
						}
						if (metrics.from.row == metrics.to.row) {
							metrics.to.row++;
							metrics.to.rowOff = 0;
						}
					}

					// Normalize range
					if (changedRange) {
						var bbox = changedRange.getBBox0();

						var tmp;
						if (bbox.c1 > bbox.c2) {
							tmp = bbox.c1;
							bbox.c1 = bbox.c2;
							bbox.c2 = tmp;
						}
						if (bbox.r1 > bbox.r2) {
							tmp = bbox.r1;
							bbox.r1 = bbox.r2;
							bbox.r2 = tmp;
						}
						changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2, bbox.c2);
					}

					if ( changedRange || metrics ) {
					
						if ( obj.isChart() && changedRange ) {
							obj.graphicObject.chart.range.intervalObject = changedRange;
							_this.calcChartInterval(obj.graphicObject.chart);
							obj.graphicObject.chart.rebuildSeries();
							obj.graphicObject.recalculate();
						}
						if (metrics) {
							obj.from.col = metrics.from.col;
							obj.from.colOff = metrics.from.colOff;
							obj.from.row = metrics.from.row;
							obj.from.rowOff = metrics.from.rowOff;

							obj.to.col = metrics.to.col;
							obj.to.colOff = metrics.to.colOff;
							obj.to.row = metrics.to.row;
							obj.to.rowOff = metrics.to.rowOff;
						}
						
						// Update graphic object
						History.TurnOff();
						obj.graphicObject.setPosition( pxToMm(obj.getRealLeftOffset(true)), pxToMm(obj.getRealTopOffset(true)) );
						obj.graphicObject.recalculateTransform();
						obj.graphicObject.calculateTransformTextMatrix();
						History.TurnOn();
						_this.showDrawingObjects(true);
					}
				}
			}
		}
	}
	
	_this.moveRangeDrawingObject = function(oBBoxFrom, oBBoxTo, bResize) {
		
		if ( oBBoxFrom && oBBoxTo ) {
						
			function editChart(drawingObject) {
				
				drawingObject.graphicObject.chart.range.intervalObject = worksheet._getRange(oBBoxTo.c1, oBBoxTo.r1, oBBoxTo.c2, oBBoxTo.r2);
				_this.calcChartInterval(drawingObject.graphicObject.chart);
				drawingObject.graphicObject.chart.rebuildSeries();
				
				drawingObject.graphicObject.recalculate();
				_this.editChartDrawingObject(drawingObject.graphicObject.chart);
			}
			
			for (var i = 0; i < aObjects.length; i++) {
								
				var drawingObject = aObjects[i];
				if ( drawingObject.isChart() ) {
					var bbox = drawingObject.graphicObject.chart.range.intervalObject.getBBox0();
					if ( oBBoxFrom.isEqual(bbox) ) {
						if ( bResize && drawingObject.graphicObject.selected ) {
							editChart(drawingObject);
							return;
						}
						else
							editChart(drawingObject);
					}
				}
			}
		}
	}

	//-----------------------------------------------------------------------------------
	// Chart
	//-----------------------------------------------------------------------------------
	
	_this.checkChartInterval = function(type, subtype, interval, isRows) {
		var result = false;
		if (interval && worksheet) {
			var _range = convertFormula(interval, worksheet);
			if (_range && checkDataRange(type, subtype, _range, isRows, worksheet))
				result = true;
		}
		return result;
	}

	_this.calcChartInterval = function(chart) {
		if (chart.range.intervalObject) {
			var box = chart.range.intervalObject.getBBox0();
			var startCell = new CellAddress(box.r1, box.c1, 0);
			var endCell = new CellAddress(box.r2, box.c2, 0);

			if (startCell && endCell) {
				
				if (startCell.getID() == endCell.getID())
					chart.range.interval = startCell.getID();
				else {
					var wsName = chart.range.intervalObject.worksheet.sName;								
					if ( !rx_test_ws_name.test(wsName) )
						wsName = "'" + wsName + "'";
						
					chart.range.interval = wsName + "!" + startCell.getID() + ":" + endCell.getID();
				}
			}
		}
	}

	_this.intervalToIntervalObject = function(chart) {
		if (chart.range.interval && worksheet) {
			var _range = convertFormula(chart.range.interval, worksheet);
			if (_range)
				chart.range.intervalObject = _range;
		}
	}

	//-----------------------------------------------------------------------------------
	// Graphic object
	//-----------------------------------------------------------------------------------
	
	_this.addGraphicObject = function(graphic, position) {
		
		var obj = _this.createDrawingObject();
		obj.graphicObject = graphic;
        graphic.setDrawingBase(obj);
				
        var ret;
        if(isRealNumber(position))
        {
            aObjects.splice(position, 0, obj);
            ret = position;
        }
        else
        {
            ret = aObjects.length;
            aObjects.push(obj);
        }

		obj.setGraphicObjectCoords();
		obj.setActive();
		
		_this.showDrawingObjects(false);
		_this.sendGraphicObjectProps();
		
		worksheet.model.workbook.handlers.trigger("asc_onEndAddShape");
		
		_this.objectLocker.reset();
		_this.objectLocker.addObjectId(obj.graphicObject.Id);
		_this.objectLocker.checkObjects( function(result) {} );
		
		var boundsChecker = _this.getBoundsChecker(obj);
		aBoundsCheckers.push(boundsChecker);
		
        return ret;
	}
	
	_this.groupGraphicObjects = function() {
	
		if ( _this.controller.canGroup() ) {
            _this.controller.createGroup(null);
		}
	}
	
	_this.unGroupGraphicObjects = function() {
	
		if ( _this.controller.canUnGroup() ) {
			_this.controller.unGroup();
			api.isStartAddShape = false;
		}
	}
	
	_this.insertUngroupedObjects = function(idGroup, aGraphics) {
		
		if ( idGroup && aGraphics.length ) {
			
			var aSingleObjects = [];
			for (var i = 0; i < aGraphics.length; i++) {
			
				var obj = _this.createDrawingObject();
				obj.graphicObject = aGraphics[i];
                aGraphics[i].setDrawingBase(obj);
				obj.graphicObject.select(_this.controller);
				obj.setGraphicObjectCoords();
				aSingleObjects.push(obj);
			}
			
			for (var i = 0; i < aObjects.length; i++) {
			
				if ( idGroup == aObjects[i].graphicObject.Id ) {
					
					aObjects.splice(i, 1);
					
					for (var j = aSingleObjects.length - 1; j > -1; j--) {
						aObjects.splice(i, 0, aSingleObjects[j]);
					}					
					_this.showDrawingObjects(true);
					break;
				}
			}
		}
	}
	
	_this.getDrawingBase = function(graphicId) {
		for (var i = 0; i < aObjects.length; i++) {
			if ( aObjects[i].graphicObject.Id == graphicId )
				return aObjects[i];
		}
		return null;
	}
	
	_this.deleteDrawingBase = function(graphicId) {
		
		for (var i = 0; i < aObjects.length; i++) {
			if ( aObjects[i].graphicObject.Id == graphicId ) {
				aObjects.splice(i, 1);
                return i;
			}
		}
        return null;
	};
	
	_this.checkGraphicObjectPosition = function(x, y, w, h) {
	
		/*	Принцип:
			true - если перемещение в области или требуется увеличить лист вправо/вниз
			false - наезд на хидеры
		*/
		
		var response = { result: true, x: 0, y: 0 };
		
		var top = worksheet.getCellTop(0, 3) + pxToMm(1);
		var left = worksheet.getCellLeft(0, 3) + pxToMm(1);
		
		// выход за границу слева или сверху
		if ( y < top ) {
			response.result = false;
			response.y = top - y;
		}
		if ( x < left ) {
			response.result = false;
			response.x = left - x;
		}
		
		// выход за границу справа
		var foundCol = worksheet._findColUnderCursor(mmToPt(x + w), true);
		while ( foundCol == null ) {
			worksheet.expandColsOnScroll(true);
			worksheet._trigger("reinitializeScrollX");
			foundCol = worksheet._findColUnderCursor(mmToPt(x + w), true);
		}

		// выход за границу снизу
		var foundRow = worksheet._findRowUnderCursor(mmToPt(y + h), true);
		while ( foundRow == null ) {
			worksheet.expandRowsOnScroll(true);
			worksheet._trigger("reinitializeScrollY");
			foundRow = worksheet._findRowUnderCursor(mmToPt(y + h), true);
		}
		
		return response;
	}
	
	_this.setGraphicObjectLockState = function(id, state) {
		
		for (var i = 0; i < aObjects.length; i++) {
			if ( id == aObjects[i].graphicObject.Id ) {
				aObjects[i].graphicObject.lockType = state;
				shapeCtx.DrawLockObjectRect(aObjects[i].graphicObject.lockType, aObjects[i].graphicObject.x, aObjects[i].graphicObject.y, aObjects[i].graphicObject.extX, aObjects[i].graphicObject.extY );
				break;
			}
		}
	}
	
	_this.reseltLockedGraphicObjects = function() {
		
		for (var i = 0; i < aObjects.length; i++) {
			aObjects[i].graphicObject.lockType = c_oAscLockTypes.kLockTypeNone;
		}
		_this.showDrawingObjects(true);
	}
	
	_this.setScrollOffset = function(x_px, y_px) {
		
		if ( shapeCtx || shapeOverlayCtx ) {
		
			scrollOffset.x -= x_px;
			scrollOffset.y -= y_px;

			shapeCtx.m_oCoordTransform.tx -= x_px;
			shapeCtx.m_oCoordTransform.ty -= y_px;
			shapeCtx.CalculateFullTransform();
			
			shapeOverlayCtx.m_oCoordTransform.tx -= x_px;
			shapeOverlayCtx.m_oCoordTransform.ty -= y_px;
			shapeOverlayCtx.CalculateFullTransform();
			
			autoShapeTrack.Graphics.m_oCoordTransform.tx -= x_px;
			autoShapeTrack.Graphics.m_oCoordTransform.ty -= y_px;
			autoShapeTrack.Graphics.CalculateFullTransform();
		}
	}
	
	_this.restoreScrollOffset = function() {
		shapeCtx.m_oCoordTransform.tx = scrollOffset.x;
		shapeCtx.m_oCoordTransform.ty = scrollOffset.y;
		shapeCtx.CalculateFullTransform();
		
		shapeOverlayCtx.m_oCoordTransform.tx = scrollOffset.x;
		shapeOverlayCtx.m_oCoordTransform.ty = scrollOffset.y;
		shapeOverlayCtx.CalculateFullTransform();
		
		autoShapeTrack.Graphics.m_oCoordTransform.tx = scrollOffset.x;
		autoShapeTrack.Graphics.m_oCoordTransform.ty = scrollOffset.y;
		autoShapeTrack.Graphics.CalculateFullTransform();
	}
	
	_this.convertMetric = function(val, from, to) {
		/* Параметры конвертирования (from/to)
			0 - px, 1 - pt, 2 - in, 3 - mm
		*/
		return val * ascCvtRatio(from, to);
	}
	
	_this.getSelectedGraphicObjects = function() {
		return _this.controller.selectedObjects;
	}
	
	_this.selectedGraphicObjectsExists = function() {
		return _this.controller.selectedObjects.length > 0;
	}
	
	_this.loadImageRedraw = function(imageUrl) {
		
		var _image = api.ImageLoader.LoadImage(imageUrl, 1);
				
		if (null != _image) {
			imageLoaded(_image);
		}
		else {
			_this.asyncImageEndLoaded = function(_image) {
				imageLoaded(_image);
			}
		}
		
		function imageLoaded(_image) {
			if ( !_image.Image ) {
				worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
			}
			else 
				_this.showDrawingObjects(true);
		}
	}
	
	_this.getOriginalImageSize = function() {
		
		var selectedObjects = _this.controller.selectedObjects;
		if ( (selectedObjects.length == 1) && selectedObjects[0].isImage() ) {
		
			var imageUrl = selectedObjects[0].getImageUrl();
			
			var _image = api.ImageLoader.map_image_index[getFullImageSrc(imageUrl)];
			if (_image != undefined && _image.Image != null && _image.Status == ImageLoadStatus.Complete) {
				
				var _w = 1, _h = 1;
				var bIsCorrect = false;
				if (_image.Image != null) {
				
					bIsCorrect = true;
					_w = Math.max( pxToMm(_image.Image.width), 1 );
					_h = Math.max( pxToMm(_image.Image.height), 1 );					
				}

				return new asc_CImageSize( _w, _h, bIsCorrect);
			}
		}
		return new asc_CImageSize( 50, 50, false );
	}
	
	_this.sendGraphicObjectProps = function() {
		if ( worksheet )
			worksheet._trigger("selectionChanged", worksheet.getSelectionInfo());
	}
	
	_this.setGraphicObjectProps = function(props) {
	
		var objectProperties = props;
				
        if ( !isNullOrEmptyString(objectProperties.ImageUrl) ) {
            var _img = api.ImageLoader.LoadImage(objectProperties.ImageUrl, 1) 
            
			if (null != _img) {
                objectProperties.ImageUrl = _img.src;
                _this.controller.setGraphicObjectProps( objectProperties );
            }
            else {
                _this.asyncImageEndLoaded = function(_image) {
                    objectProperties.ImageUrl = _image.src;
                    _this.controller.setGraphicObjectProps( objectProperties );
                }
            }
        }
        else if ( objectProperties.ShapeProperties && objectProperties.ShapeProperties.fill && objectProperties.ShapeProperties.fill.fill && 
					!isNullOrEmptyString(objectProperties.ShapeProperties.fill.fill.url) ) {
					
            var _img = api.ImageLoader.LoadImage(objectProperties.ShapeProperties.fill.fill.url, 1);            
			if ( null != _img ) {
                objectProperties.ImageUrl = _img.src;
                _this.controller.setGraphicObjectProps( objectProperties );
            }
            else {
                _this.asyncImageEndLoaded = function(_image) {
                    objectProperties.ImageUrl = _image.src;
                    _this.controller.setGraphicObjectProps( objectProperties );
                }
            }
        }
        else {
            objectProperties.ImageUrl = null;
            _this.controller.setGraphicObjectProps( objectProperties );
        }
		
		_this.sendGraphicObjectProps();
	}
	
	_this.showChartSettings = function() {
		api.wb.handlers.trigger("asc_onShowChartDialog", true);
	}
	
	_this.setDrawImagePlaceParagraph = function(element_id, props) {
		_this.drawingDocument.InitGuiCanvasTextProps(element_id);
		_this.drawingDocument.DrawGuiCanvasTextProps(props);
	}
	
	//-----------------------------------------------------------------------------------
	// Graphic object mouse & keyboard events
	//-----------------------------------------------------------------------------------
	
	_this.graphicObjectMouseDown = function(e, x, y) {
		_this.controller.onMouseDown( e, pxToMm(x - scrollOffset.x), pxToMm(y - scrollOffset.y) );
	}
	
	_this.graphicObjectMouseMove = function(e, x, y) {
		_this.controller.onMouseMove( e, pxToMm(x - scrollOffset.x), pxToMm(y - scrollOffset.y) );
	}
	
	_this.graphicObjectMouseUp = function(e, x, y) {
		_this.controller.onMouseUp( e, pxToMm(x - scrollOffset.x), pxToMm(y - scrollOffset.y) );
	}
	
	// keyboard
	
	_this.graphicObjectKeyDown = function(e) {
		return _this.controller.onKeyDown( e );
	}
	
	_this.graphicObjectKeyPress = function(e) {
		return _this.controller.onKeyPress( e );
	}
	
	//-----------------------------------------------------------------------------------
	// Asc
	//-----------------------------------------------------------------------------------
	
	_this.cleanWorksheet = function() {
		aObjects = [];
		worksheet._clean();			
		var listRange = new Range(worksheet.model, 0, 0, worksheet.nRowsCount - 1, worksheet.nColsCount - 1);
		listRange.cleanAll();
		History.Clear();
	}

	_this.getWordChartObject = function() {
		for (var i = 0; i < aObjects.length; i++) {
			var drawingObject = aObjects[i];
			
			if ( drawingObject.isChart() ) {
				drawingObject.getChartBinary();
				_this.cleanWorksheet();
				return chart;
			}
		}
		return null;
	}

	_this.getAscChartObject = function() {
	
		if ( !api.chartStyleManager.isReady() )
			api.chartStyleManager.init();
		if ( !api.chartPreviewManager.isReady() )
			api.chartPreviewManager.init();

        var chart = this.controller.getAscChartObject();
		if ( !chart ) {
			chart = new asc_CChart();			
			chart.range.interval = function() {
				var result = "";
				if (worksheet) {
					var selectedRange = worksheet.getSelectedRange();
					if (selectedRange) {
						var box = selectedRange.getBBox0();
						var startCell = new CellAddress(box.r1, box.c1, 0);
						var endCell = new CellAddress(box.r2, box.c2, 0);

						if (startCell && endCell) {
							var wsName = worksheet.model.sName;
							if ( !rx_test_ws_name.test(wsName) )
								wsName = "'" + wsName + "'";

							if (startCell.getID() == endCell.getID())
								result = wsName + "!" + startCell.getID();
							else
								result = wsName + "!" + startCell.getID() + ":" + endCell.getID();
						}
					}
				}
				return result;
			}();
			chart.range.intervalObject = function() {
				return worksheet ? worksheet.getSelectedRange() : null;
			}();
		}
		return chart;
	}
	
	//-----------------------------------------------------------------------------------
	// Selection
	//-----------------------------------------------------------------------------------

	_this.selectDrawingObjectRange = function(id) {

		worksheet.arrActiveChartsRanges = [];
		
		function getRandomColor() {
			var r = function () { return Math.floor(Math.random()*256) };
			return "rgb(" + r() + "," + r() + "," + r() + ")";
		}
		
		for (var i = 0; i < aObjects.length; i++) {

			var drawingObject = aObjects[i].graphicObject;
			if ( drawingObject.isChart() && (drawingObject.Id == id) ) {

				if ( !drawingObject.chart.range.intervalObject )
					_this.intervalToIntervalObject(drawingObject.chart);
				
				// Проверка для id листа				
				if ( drawingObject.chart.range.intervalObject.worksheet.Id != worksheet.model.Id )
					return;
					
				var BB = drawingObject.chart.range.intervalObject.getBBox0();
				var range = asc.Range(BB.c1, BB.r1, BB.c2, BB.r2, true);
				
				var fvr = worksheet.getFirstVisibleRow();
				var fvc = worksheet.getFirstVisibleCol();
				var headers = drawingObject.chart.parseSeriesHeaders();
				
				var c1 = BB.c1 - fvc;
				var c2 = BB.c2 - fvc;
				var r1 = BB.r1 - fvr;
				var r2 = BB.r2 - fvr;
				
				if ( headers.bTop && (r1 >= 0) && (r1 != r2) ) {
					var _c1 = (c1 >= 0) ? c1 /*+ (headers.bLeft ? 1 : 0)*/ : 0;
					var x = worksheet.getCellLeft(_c1, 1);
					var y = worksheet.getCellTop(r1 + 1, 1);
					var w = worksheet.getCellLeft(c2 + 1, 1);
					var h = y;
					
					overlayCtx.setStrokeStyle("#ff0000");
					overlayCtx.beginPath();
					overlayCtx.moveTo(x, y, -0.5, -0.5);
					overlayCtx.lineTo(w, h, -0.5, -0.5);
					overlayCtx.stroke();
				}
				if ( headers.bLeft && (c1 >= 0) && (c1 != c2) ) {
					var _r1 = (r1 >= 0) ? r1 /*+ (headers.bTop ? 1 : 0)*/ : 0;
					var x = worksheet.getCellLeft(c1 + 1, 1);
					var y = worksheet.getCellTop(_r1, 1);
					var w = x;
					var h = worksheet.getCellTop(r2 + 1, 1);
					
					overlayCtx.setStrokeStyle("#ff0000");
					overlayCtx.beginPath();
					overlayCtx.moveTo(x, y, -0.5, -0.5);
					overlayCtx.lineTo(w, h, -0.5, -0.5);
					overlayCtx.stroke();
				}
					
				worksheet.arrActiveChartsRanges.push(range);
				worksheet.isChartAreaEditMode = true;
				worksheet._drawFormulaRange(worksheet.arrActiveChartsRanges);
			}
		}
	}

	_this.unselectDrawingObjects = function() {
	
		if ( worksheet.isChartAreaEditMode ) {
			worksheet.isChartAreaEditMode = false;
			worksheet.arrActiveChartsRanges = [];
		}
		_this.controller.resetSelectionState();
		_this.OnUpdateOverlay();
	}

	_this.getDrawingObject = function(id) {

		for (var i = 0; i < aObjects.length; i++) {
			if (aObjects[i].graphicObject.Id == id)
				return aObjects[i];
		}
		return null;
	}
	
	_this.getGraphicSelectionType = function(id) {
				
		for ( var i = 0; i < aObjects.length; i++ ) {
			var obj = aObjects[i];
			if (obj.graphicObject.Id == id) {
				if (obj.isChart())
					return c_oAscSelectionType.RangeChart;
					
				if (obj.graphicObject.isImage())
					return c_oAscSelectionType.RangeImage;
					
				if (obj.graphicObject.isShape() || obj.graphicObject.isGroup())
					return c_oAscSelectionType.RangeShape;
			}
		}
		return undefined;
	}
	
	//-----------------------------------------------------------------------------------
	// Position
	//-----------------------------------------------------------------------------------

	_this.setGraphicObjectLayer = function(layerType) {
		_this.controller.setGraphicObjectLayer(layerType);
	}

	_this.saveSizeDrawingObjects = function() {

		for (var i = 0; i < aObjects.length; i++) {
			var obj = aObjects[i];

			obj.size.width = obj.getWidthFromTo();
			obj.size.height = obj.getHeightFromTo();
		}
	}

	_this.updateSizeDrawingObjects = function() {

		for (var i = 0; i < aObjects.length; i++) {
			var obj = aObjects[i];

			var left = obj.getRealLeftOffset();
			var top = obj.getRealTopOffset();

			var foundCol = worksheet._findColUnderCursor(pxToPt(left + obj.size.width), true);
			while (foundCol == null) {
				worksheet.expandColsOnScroll(true);
				worksheet._trigger("reinitializeScrollX");
				foundCol = worksheet._findColUnderCursor(pxToPt(left + obj.size.width), true);
			}
			obj.to.col = foundCol.col;
			obj.to.colOff = pxToMm(left + obj.size.width - worksheet.getCellLeft(obj.to.col, 0));

			var foundRow = worksheet._findRowUnderCursor(pxToPt(top + obj.size.height), true);
			while (foundRow == null) {
				worksheet.expandRowsOnScroll(true);
				worksheet._trigger("reinitializeScrollY");
				foundRow = worksheet._findRowUnderCursor(pxToPt(top + obj.size.height), true);
			}
			obj.to.row = foundRow.row;
			obj.to.rowOff = pxToMm(top + obj.size.height - worksheet.getCellTop(obj.to.row, 0));
			
			// Update graphic object
			obj.graphicObject.setPosition( pxToMm(obj.getRealLeftOffset(true)), pxToMm(obj.getRealTopOffset(true)) );
			obj.graphicObject.recalculateTransform();
			obj.graphicObject.calculateTransformTextMatrix();
		}
		_this.showDrawingObjects(true);
	}

	_this.checkCursorDrawingObject = function(x, y) {
	
		if ( !aObjects.length )
			return null;

		var objectInfo = { cursor: null, id: null, object: null, isGraphicObject: false };
		var graphicObjectInfo = _this.controller.isPointInDrawingObjects( pxToMm(x - scrollOffset.x), pxToMm(y - scrollOffset.y) );
		
		if ( graphicObjectInfo && graphicObjectInfo.objectId ) {
			objectInfo.id = graphicObjectInfo.objectId;
			objectInfo.object = _this.getDrawingBase(graphicObjectInfo.objectId);
			objectInfo.cursor = graphicObjectInfo.cursorType;
			objectInfo.isGraphicObject = true;
			
			return objectInfo;
		}		
		return null;
	}

	_this.getPositionInfo = function(x, y) {

		var info = { col: 0, colOff: 0, row: 0, rowOff: 0 };

		var tmp = worksheet._findColUnderCursor(pxToPt(x), true);
		if (tmp) {
			info.col = tmp.col;
			info.colOff = pxToMm(x - worksheet.getCellLeft(info.col, 0));
		}
		tmp = worksheet._findRowUnderCursor(pxToPt(y), true);
		if (tmp) {
			info.row = tmp.row;
			info.rowOff = pxToMm(y - worksheet.getCellTop(info.row, 0));
		}

		return info;
	}

	//-----------------------------------------------------------------------------------
	// File Dialog
	//-----------------------------------------------------------------------------------

	_this.showImageFileDialog = function(documentId, documentFormat) {

		if ( _this.isViewerMode() )
			return;

		var oImageUploader = document.getElementById("apiImageUpload");
		if (!oImageUploader) {
			var frame = document.createElement("iframe");
			frame.name = "apiImageUpload";
			frame.id = "apiImageUpload";
			frame.setAttribute("style", "position:absolute;left:-2px;top:-2px;width:1px;height:1px;z-index:-1000;");
			document.body.appendChild(frame);
		}
		var frameWindow = window.frames["apiImageUpload"];
		var content = '<html><head></head><body><form action="' + g_sUploadServiceLocalUrl + '?sheetId=' + worksheet.model.getId() + '&key=' + documentId + '" method="POST" enctype="multipart/form-data"><input id="apiiuFile" name="apiiuFile" type="file" size="1"><input id="apiiuSubmit" name="apiiuSubmit" type="submit" style="display:none;"></form></body></html>';
		frameWindow.document.open();
		frameWindow.document.write(content);
		frameWindow.document.close();

		var fileName = frameWindow.document.getElementById("apiiuFile");
		var fileSubmit = frameWindow.document.getElementById("apiiuSubmit");

		fileName.onchange = function(e) {
			if(e && e.target && e.target.files)
			{
				var files = e.target.files;
				if(files.length > 0)
				{
					var file = files[0];
					//проверяем расширение файла
					var sName = file.fileName || file.name;
					if(sName)
					{
						var bSupported = false;
						var nIndex = sName.lastIndexOf(".");
						if(-1 != nIndex)
						{
							var ext = sName.substring(nIndex + 1).toLowerCase();
							for(var i = 0, length = c_oAscImageUploadProp.SupportedFormats.length; i < length; i++)
							{
								if(c_oAscImageUploadProp.SupportedFormats[i] == ext)
								{
									bSupported = true;
									break;
								}
							}
						}
						if(false == bSupported)
						{
							worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageExt, c_oAscError.Level.NoCritical);
							return;
						}
					}
					var nSize = file.fileSize || file.size;
					if(nSize && c_oAscImageUploadProp.MaxFileSize < nSize)
					{
						worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageSize, c_oAscError.Level.NoCritical);
						return;
					}
				}
			}
			fileSubmit.click();
			worksheet.model.workbook.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
		}

		if (window.opera != undefined)
			setTimeout(function() { fileName.click(); }, 0);
		else
			fileName.click();
	}

	//-----------------------------------------------------------------------------------
	// Shapes controller
	//-----------------------------------------------------------------------------------
	
	_this.controller = new DrawingObjectsController(_this);
	
	//-----------------------------------------------------------------------------------
	// Private Misc Methods
	//-----------------------------------------------------------------------------------

	function guid() {
		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}

	function ascCvtRatio(fromUnits, toUnits) {
		return asc.getCvtRatio( fromUnits, toUnits, drawingCtx.getPPIX() );
	}

	function setCanvasZIndex(canvas, value) {
		if (canvas && (value >= 0) && (value <= 1))
			canvas.globalAlpha = value;
	}

	function emuToPx(emu) {
		var tmp = emu * 20 * 96 / 2.54 / 72 / 100 / 1000;
		return Math.floor(tmp);
	}

	function pxToEmu(px) {
		var tmp = px * 2.54 * 72 * 100 * 1000 / 20 / 96;
		return Math.floor(tmp);
	}

	function pxToPt(val) {
		var tmp = asc.round(val) * ascCvtRatio(0, 1);
		return tmp > 0 ? tmp : 0;
	}

	function ptToPx(val) {
		var tmp = val * ascCvtRatio(1, 0);
		return tmp;
	}

	function mmToPx(val) {
		var tmp = val * ascCvtRatio(3, 0);
		return tmp;
	}
	
	function mmToPt(val) {
		var tmp = val * ascCvtRatio(3, 1);
		return tmp;
	}

	function pxToMm(val) {
		var tmp = val * ascCvtRatio(0, 3);
		return tmp;
	}
}

//-----------------------------------------------------------------------------------
// Universal object locker/checker
//-----------------------------------------------------------------------------------

function ObjectLocker(ws) {
	
	var _t = this;
	var aObjectId = [];
	var worksheet = ws;
	
	_t.reset = function() {
		aObjectId = [];
	}
	
	_t.addObjectId = function(id) {
		aObjectId.push(id);
	}
	
	// For array of objects -=Use reset before use=-
	_t.checkObjects = function(callback) {
		
		function callbackEx(result) {
			worksheet._drawCollaborativeElements(true);
			if ( callback )
				callback(result);
		}
		
		if ( !aObjectId.length || (false === worksheet.collaborativeEditing.isCoAuthoringExcellEnable()) ) {
			// Запрещено совместное редактирование
			if ($.isFunction(callback)) {callbackEx(true);}
			return;
		}
		
		var sheetId = worksheet.model.getId();
		worksheet.collaborativeEditing.onStartCheckLock();
		for ( var i = 0; i < aObjectId.length; i++ ) {
			
			var lockInfo = worksheet.collaborativeEditing.getLockInfo( c_oAscLockTypeElem.Object, /*subType*/null, sheetId, aObjectId[i] );

			if ( false === worksheet.collaborativeEditing.getCollaborativeEditing() ) {
				// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
				if ($.isFunction(callback)) { callbackEx(true); }
				callback = undefined;
			}
			else if ( false !== worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine) ) {
				// Редактируем сами, проверяем дальше
				continue;
			}
			else if ( false !== worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther) ) {
				// Уже ячейку кто-то редактирует
				if ($.isFunction(callback)) {callbackEx(false);}
				return;
			}
			worksheet.collaborativeEditing.addCheckLock(lockInfo);
		}
		
		worksheet.collaborativeEditing.onEndCheckLock(callbackEx);
	}
}