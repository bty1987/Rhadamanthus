package com.fanglin.decoration.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.information.po.ActivityPO;

@Entity
@Table(name = "decorationactivity", catalog = "platform")
public class DecorationActivityPO implements java.io.Serializable {

	private static final long serialVersionUID = 5426521470719770019L;
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	private int daId;
	
	private String orderId;
	
	private ActivityPO activity;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "daId")
	public int getDaId() {
		return this.daId;
	}

	public void setDaId(int daId) {
		this.daId = daId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aId", referencedColumnName = "aId")
	public ActivityPO getActivity() {
		return activity;
	}

	public void setActivity(ActivityPO activity) {
		this.activity = activity;
	}

}