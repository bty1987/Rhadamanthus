/**
 * @File Name		: OilDrawingPO.java
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
@Table(name="oildrawing", catalog = "platform")
public class OilDrawingPO implements Serializable {

	private static final long serialVersionUID = 5023668651641989013L;
	
	public static final String COLUMN_OCSID_STR = "ocsId";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	private int odId;
	
	private int ocsId;
	
	private int csId;
	
	private String drawingName;
	
	private String drawingUrl;
	
	private String drawingAddUrl;
	
	private short type;
	
	@Id
	@GeneratedValue(strategy=IDENTITY)
	@Column(name = "odId")
	public int getOdId(){
		return this.odId;
	}

	public void setOdId(int odId){
		this.odId = odId;
	}

	@Column(name = "ocsId")
	public int getOcsId(){
		return this.ocsId;
	}

	public void setOcsId(int ocsId){
		this.ocsId = ocsId;
	}

	@Column(name="drawingName")
	public String getDrawingName(){
		return drawingName;
	}

	public void setDrawingName(String drawingName){
		this.drawingName = drawingName;
	}

	@Column(name="drawingUrl")
	public String getDrawingUrl(){
		return drawingUrl;
	}

	public void setDrawingUrl(String drawingUrl){
		this.drawingUrl = drawingUrl;
	}

	@Column(name="drawingAddUrl")
	public String getDrawingAddUrl(){
		return drawingAddUrl;
	}

	public void setDrawingAddUrl(String drawingAddUrl){
		this.drawingAddUrl = drawingAddUrl;
	}

	@Column(name="csId")
	public int getCsId() {
		return csId;
	}

	public void setCsId(int csId) {
		this.csId = csId;
	}

	@Column(name="type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

}
