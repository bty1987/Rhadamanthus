package com.fanglin.store.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;
public class EvaluateVO implements Serializable{
	
	private static final long serialVersionUID = -4753987975347003497L;

	private Long eid;
	
	private Long oid;
	
	private MpriceVO mprice;
	
	private Long gid;
	
	private String unionId;
	
	private String name;
	
	private Timestamp createTime;
	
	private Short score;
	
	private String comment;
	
	private Short discribeRate;
	
	private Short logisticsRate;
	
	private Short serviceRate;
	
	private String imgs;
	
	public EvaluateVO() {
		super();
	}

	public EvaluateVO(MpriceVO mprice) {
		super();
		this.mprice = mprice;
	}

	public Long getEid() {
		return eid;
	}

	public void setEid(Long eid) {
		this.eid = eid;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}
	
	public MpriceVO getMprice() {
		return mprice;
	}

	public void setMprice(MpriceVO mprice) {
		this.mprice = mprice;
	}
	
	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getScore() {
		return score;
	}

	public void setScore(Short score) {
		this.score = score;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Short getDiscribeRate() {
		return discribeRate;
	}

	public void setDiscribeRate(Short discribeRate) {
		this.discribeRate = discribeRate;
	}

	public Short getLogisticsRate() {
		return logisticsRate;
	}

	public void setLogisticsRate(Short logisticsRate) {
		this.logisticsRate = logisticsRate;
	}

	public Short getServiceRate() {
		return serviceRate;
	}

	public void setServiceRate(Short serviceRate) {
		this.serviceRate = serviceRate;
	}

	public String getImgs() {
		return imgs;
	}

	public void setImgs(String imgs) {
		this.imgs = imgs;
	}
}
