/**
 * @File Name		: WaterwayCircuitPowerDrawing.java
 * @Package   	: com.fanglin.entity.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="waterwaycircuitpowerdrawing", catalog = "platform")
public class WaterwayCircuitPowerDrawingPO implements Serializable {

	private static final long serialVersionUID = 5794355535060643372L;
	
	public static final String COLUMN_WCPCSID_STR = "wcpcsId";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	private int wcpdId;
	
	private int wcpcsId;
	
	private int csId;
	
	private String drawingName;
	
	private String drawingUrl;

	private String drawingAddUrl;
	
	private short type;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="wcpdId")
	public int getWcpdId(){
		return wcpdId;
	}

	public void setWcpdId(int wcpdId){
		this.wcpdId = wcpdId;
	}

	@Column(name="wcpcsId")
	public int getWcpcsId(){
		return wcpcsId;
	}

	public void setWcpcsId(int wcpcsId){
		this.wcpcsId = wcpcsId;
	}

	@Column(name="drawingAddUrl")
	public String getDrawingAddUrl(){
		return drawingAddUrl;
	}

	public String getDrawingUrl(){
		return drawingUrl;
	}

	@Column(name="drawingUrl")
	public void setDrawingUrl(String drawingUrl){
		this.drawingUrl = drawingUrl;
	}

	public void setDrawingAddUrl(String drawingAddUrl){
		this.drawingAddUrl = drawingAddUrl;
	}

	@Column(name="drawingName")
	public String getDrawingName(){
		return drawingName;
	}

	public void setDrawingName(String drawingName){
		this.drawingName = drawingName;
	}

	@Column(name = "csId")
	public int getCsId() {
		return csId;
	}

	public void setCsId(int csId) {
		this.csId = csId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}
	
}
