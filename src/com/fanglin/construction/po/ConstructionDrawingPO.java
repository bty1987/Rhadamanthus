/**
 * @File Name	: Bricklaydrawing.java
 * @Package   	: com.fanglin.entity.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
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
@Table(name="constructiondrawing", catalog = "construction")
public class ConstructionDrawingPO implements Serializable{

	private static final long serialVersionUID = 7271383081662976002L;
	
	public static final String COLUMN_CDID_STR = "cdId";
	
	public static final String COLUMN_CID_STR = "cid";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_SCHEDULE_STR = "schedule";
	
	private int cdId;
	
	private long cid;
	
	private String drawingName;
	
	private String drawingUrl;
	
	private String drawingAddUrl;
	
	private short type;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private short schedule;

	@Id
	@GeneratedValue(strategy=IDENTITY)
	@Column(name = "cdId")
	public int getCdId(){
		return this.cdId;
	}

	public void setCdId(int cdId){
		this.cdId = cdId;
	}
	
	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name="drawingName")
	public String getDrawingName(){
		return drawingName;
	}

	public void setDrawingName(String drawingName){
		this.drawingName = drawingName;
	}
	
	@Column(name = "drawingUrl")
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

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName="uid")
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

	@Column(name = "schedule")
	public short getSchedule() {
		return schedule;
	}

	public void setSchedule(short schedule) {
		this.schedule = schedule;
	}
	
	
}
