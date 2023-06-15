package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationpicturerecord", catalog = "decoration")
public class DecorationPictureRecordPO implements Serializable {

	private static final long serialVersionUID = -6002560128126657762L;

	private long dprid;

	private long dpid;

	private long ouid;

	private Timestamp operateTime;

	public DecorationPictureRecordPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dprid")
	public long getDprid() {
		return dprid;
	}

	public void setDprid(long dprid) {
		this.dprid = dprid;
	}

	@Column(name = "dpid")
	public long getDpid() {
		return dpid;
	}

	public void setDpid(long dpid) {
		this.dpid = dpid;
	}

	@Column(name = "ouid")
	public long getOuid() {
		return ouid;
	}

	public void setOuid(long ouid) {
		this.ouid = ouid;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

}
