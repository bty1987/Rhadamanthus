package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "waterwaycircuitcheckdrawing", catalog = "platform")
public class WaterwayCircuitCheckDrawingPO implements java.io.Serializable {

	private static final long serialVersionUID = 5433324916892202297L;
	
	public static final String COLUMN_WCCCSID_STR = "wcccsId";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	private int wccdId;
	
	private int wcccsId;
	
	private int csId;
	
	private String drawingName;
	
	private String drawingUrl;
	
	private String drawingAddUrl;
	
	private short type;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wccdId")
	public int getWccdId(){
		return this.wccdId;
	}

	public void setWccdId(int wccdId){
		this.wccdId = wccdId;
	}

	@Column(name = "wcccsId")
	public int getWcccsId(){
		return this.wcccsId;
	}

	public void setWcccsId(int wcccsId){
		this.wcccsId = wcccsId;
	}

	@Column(name = "drawingName")
	public String getDrawingName(){
		return this.drawingName;
	}

	public void setDrawingName(String drawingName){
		this.drawingName = drawingName;
	}

	@Column(name = "drawingUrl")
	public String getDrawingUrl(){
		return this.drawingUrl;
	}

	public void setDrawingUrl(String drawingUrl){
		this.drawingUrl = drawingUrl;
	}

	@Column(name = "drawingAddUrl")
	public String getDrawingAddUrl(){
		return this.drawingAddUrl;
	}

	public void setDrawingAddUrl(String drawingAddUrl){
		this.drawingAddUrl = drawingAddUrl;
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