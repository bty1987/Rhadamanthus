package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "groundlevelingdrawing", catalog = "platform")
public class GroundLevelingDrawingPO implements java.io.Serializable {

	private static final long serialVersionUID = -4621939416199727243L;
	
	public static final String COLUMN_GLCSID_STR = "glcsId";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_TYPE_STR = "type";

	private int gldId;
	
	private int glcsId;
	
	private long csId;
	
	private String drawingName;
	
	private String drawingUrl;
	
	private String drawingAddUrl;
	
	private short type;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "gldId")
	public int getGldId(){
		return this.gldId;
	}

	public void setGldId(int gldId){
		this.gldId = gldId;
	}

	@Column(name = "glcsId")
	public int getGlcsId(){
		return this.glcsId;
	}

	public void setGlcsId(int glcsId){
		this.glcsId = glcsId;
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
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "createrId", referencedColumnName="userId")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}