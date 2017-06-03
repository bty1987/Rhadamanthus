/**
 * @File Name		: ChanDrawingPO.java
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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "putlinedrawing", catalog = "platform")
public class PutlineDrawingPO implements java.io.Serializable {

	private static final long serialVersionUID = 3416454033644580019L;
	
	public static final String COLUMN_PLCSID_STR = "plcsId";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	private int pldId;
	
	private int plcsId;
	
	private long csId;
	
	private String drawingName;
	
	private String drawingUrl;
	
	private String drawingAddUrl;
	
	private short type;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "pldId")
	public int getPldId(){
		return this.pldId;
	}

	public void setPldId(int pldId){
		this.pldId = pldId;
	}

	@Column(name = "plcsId")
	public int getPlcsId(){
		return this.plcsId;
	}

	public void setPlcsId(int plcsId){
		this.plcsId = plcsId;
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
	public long getCsId() {
		return csId;
	}

	public void setCsId(long csId) {
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