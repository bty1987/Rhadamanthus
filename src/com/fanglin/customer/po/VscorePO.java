package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vscore", catalog = "customer")
public class VscorePO implements Serializable {
	
	private static final long serialVersionUID = -3719118450308572107L;
	
	public static final String COLUMN_UNIONID_STR = "unionId";
	
	public static final int COLUMN_SCORE_INT = 0;     //初始积分
	
	private long vsid;
	
	private String unionId;
	
	private int score;
	
	public VscorePO(){
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vsid")
	public long getVsid() {
		return vsid;
	}

	public void setVsid(long vsid) {
		this.vsid = vsid;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "score")
	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}
	
}
