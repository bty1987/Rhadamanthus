package com.fanglin.finance.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "period", catalog = "finance")
public class PeriodPO implements java.io.Serializable {

	private static final long serialVersionUID = -4255437082086461222L;
	
	public static final String COLUMN_PERIOD_STR = "period";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_INIT_INT = 0;
	
	public static final short STATUS_CLOSED_INT = 1;

	private long pid;
	
	private String period;
	
	private short status;

	public PeriodPO() {
		super();
	}

	public PeriodPO(String period, short status) {
		super();
		this.period = period;
		this.status = status;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "pId")
	public long getPid() {
		return this.pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "period")
	public String getPeriod() {
		return this.period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	public static String nextPeriod(String period){
		
		SimpleDateFormat sdf2;
		Calendar calendar;
		
		try {
			SimpleDateFormat sdf = new SimpleDateFormat ("yyyyMM");
			sdf2 = new SimpleDateFormat ("yyyyMM");
			Date date = sdf.parse (period);
			calendar = Calendar.getInstance ();
			calendar.setTime (date);
			calendar.add (Calendar.MONTH, 1);
			
			return sdf2.format (calendar.getTime ());
		} catch (ParseException e) {}
        
        return null;
	}
	
	public static String previousPeriod(String period){
		
		SimpleDateFormat sdf2;
		Calendar calendar;
		
		try {
			SimpleDateFormat sdf = new SimpleDateFormat ("yyyyMM");
			sdf2 = new SimpleDateFormat ("yyyyMM");
			Date date = sdf.parse (period);
			calendar = Calendar.getInstance ();
			calendar.setTime (date);
			calendar.add (Calendar.MONTH, -1);
			
			return sdf2.format (calendar.getTime ());
		} catch (ParseException e) {}
        
        return null;
	}

}