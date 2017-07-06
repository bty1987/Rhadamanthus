/**
 * @File Name		: CleaningDrawingPO.java
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
@Table(name="cleaningdrawing", catalog = "platform")
public class CleaningDrawingPO implements Serializable {

	private static final long serialVersionUID = -7518811163496320161L;
	
	public static final String COLUMN_CCSID_STR = "ccsId";
	
	public static final String COLUMN_CSID_STR = "csId";
	
	public static final String COLUMN_TYPE_STR = "type";
	
    private int cdId;
    
    private int ccsId;
    
    private long csId;
    
    private String drawingName;
    
    private String drawingUrl;
    
    private String drawingAddUrl;
    
    private short type;
    
    private UserPO creater;
    
    private Timestamp createTime;
    
    @Column(name="drawingName")
	public String getDrawingName(){
		return drawingName;
	}

    @Id 
    @GeneratedValue(strategy=IDENTITY)
    @Column(name="cdId")
	public int getCdId(){
		return cdId;
	}

	public void setCdId(int cdId){
		this.cdId = cdId;
	}

	public int getCcsId(){
		return ccsId;
	}

	public void setCcsId(int ccsId){
		this.ccsId = ccsId;
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
