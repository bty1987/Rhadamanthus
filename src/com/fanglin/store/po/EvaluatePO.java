package com.fanglin.store.po;

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

@Entity
@Table(name = "evaluate", catalog = "store")
public class EvaluatePO implements Serializable{

	private static final long serialVersionUID = 1655684434156917492L;
	
	public static final String COLUMN_SCORE_STR = "score";
	
	public static final String COLUMN_UNIONID_STR = "unionId";
	
	public static final String COLUMN_PID_STR = "mprice.pid";
	
	private long eid;
	
	private long oid;
	
	private MpricePO mprice;
	
	private long gid;
	
	private String unionId;
	
	private String name;
	
	private Timestamp createTime;
	
	private short score;
	
	private String comment;
	
	private short discribeRate;
	
	private short logisticsRate;
	
	private short serviceRate;
	
	private String imgs;
	
	public EvaluatePO(){
		super();
	}
	
	public EvaluatePO(MpricePO mprice) {
		super();
		this.mprice = mprice;
	}

	@Id
	@GeneratedValue
	@Column(name = "eid")
	public long getEid() {
		return eid;
	}

	public void setEid(long eid) {
		this.eid = eid;
	}
	
	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pid", referencedColumnName = "pid")
	public MpricePO getMprice() {
		return mprice;
	}

	public void setMprice(MpricePO mprice) {
		this.mprice = mprice;
	}
	
	@Column(name = "gid")
	public long getGid() {
		return gid;
	}

	public void setGid(long gid) {
		this.gid = gid;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}
	
	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "score")
	public short getScore() {
		return score;
	}

	public void setScore(short score) {
		this.score = score;
	}
	
	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "discribeRate")
	public short getDiscribeRate() {
		return discribeRate;
	}

	public void setDiscribeRate(short discribeRate) {
		this.discribeRate = discribeRate;
	}

	@Column(name = "logisticsRate")
	public short getLogisticsRate() {
		return logisticsRate;
	}

	public void setLogisticsRate(short logisticsRate) {
		this.logisticsRate = logisticsRate;
	}

	@Column(name = "serviceRate")
	public short getServiceRate() {
		return serviceRate;
	}

	public void setServiceRate(short serviceRate) {
		this.serviceRate = serviceRate;
	}

	@Column(name = "imgs")
	public String getImgs() {
		return imgs;
	}

	public void setImgs(String imgs) {
		this.imgs = imgs;
	}

}
