package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "holiday", catalog = "data")
public class HolidayPO implements Serializable {

	private static final long serialVersionUID = -2996737815281174330L;

	public static final String COLUMN_PERIOD_STR = "period";

	public static final String COLUMN_STARTTIME_STR = "startTime";

	public static final String COLUMN_ENDTIME_STR = "endTime";

	public static final short ATTTYPE_COMMON_INT = 0;

	private long hdid;

	private String period;

	private Timestamp startTime;

	private Timestamp endTime;

	private int daynum;

	private short atttype;

	public HolidayPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "hdid")
	public long getHdid() {
		return hdid;
	}

	public void setHdid(long hdid) {
		this.hdid = hdid;
	}

	@Column(name = "period")
	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	@Column(name = "startTime")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	@Column(name = "daynum")
	public int getDaynum() {
		return daynum;
	}

	public void setDaynum(int daynum) {
		this.daynum = daynum;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

}
