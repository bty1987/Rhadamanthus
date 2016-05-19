/**
 * @File Name		: Bricklaydrawing.java
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
@Table(name="bricklaydrawing", catalog = "platform")
public class BricklayDrawingPO implements Serializable{

	private static final long serialVersionUID = 7271383081662976002L;
	
	public static final String COLUMN_BCSID_STR = "bcsId";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	private int bdId;
	
	private int bcsId;
	
	private int csId;
	
	private String drawingName;
	
	private String drawingUrl;
	
	private String drawingAddUrl;
	
	private short type;
	
	@Id
	@GeneratedValue(strategy=IDENTITY)
	@Column(name = "bdId")
	public int getBdId(){
		return this.bdId;
	}

	public void setBdId(int bdId){
		this.bdId = bdId;
	}

	@Column(name = "bcsId")
	public int getBcsId(){
		return this.bcsId;
	}

	public void setBcsId(int bcsId){
		this.bcsId = bcsId;
	}

	@Column(name = "drawingUrl")
	public String getDrawingUrl(){
		return drawingUrl;
	}

	public String getDrawingName(){
		return drawingName;
	}

	@Column(name="drawingName")
	public void setDrawingName(String drawingName){
		this.drawingName = drawingName;
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
