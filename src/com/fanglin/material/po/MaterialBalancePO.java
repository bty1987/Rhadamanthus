package com.fanglin.material.po;

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
@Table(name = "materialbalance", catalog = "material")
public class MaterialBalancePO implements java.io.Serializable {

	private static final long serialVersionUID = -7169809440225703812L;
	
	public static final String COLUMN_USERID_STR = "user.userId";
	
	public static final String COLUMN_MID_STR = "material.mid";
	
	public static final String COLUMN_ORDERID_STR = "material.orderId";
	
	public static final String COLUMN_MSONO_STR = "material.no";
	
	public static final String COLUMN_INSTOREID_STR = "instorer.userId";
	
	public static final String COLUMN_FULLPAYTIME_STR = "material.fullpayTime";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_STATUS_STR = "status";
	//增加品牌名称
	public static final String COLUMN_MATERIALBRAND_STR="material.brand";
	//增加厂商结算时间
	public static final String COLUMN_VBALANCETIME_STR="vbalanceTime";
	//增加预结算时间
	public static final String COLUMN_PREBALANCETIME_STR = "balanceTime";
	//增加结算时间
	public static final String COLUMN_POSTBALANCETIME_STR = "postTime";
	
	public static final short STATUS_PRE_BALANCE_INT = 0;
	
	public static final short STATUS_VENDER_BALANCE_INT = 1;
	
	public static final short STATUS_FINISH_INT = 2;
	
	public static final short TYPE_ADD_INT = 0;
	
	public static final short TYPE_SUB_INT = 1;
	
	public static final short TYPE_SUBED_INT = 2; // 结算之后退货
	
	private long mbid;
	
	private MaterialPO material;
	
	private UserPO creater;
	
	private UserPO instorer;
	
	private UserPO poster;
	
	private Timestamp balanceTime;
	
	private Timestamp postTime;
	
	private float balance;
	
	private float difference;
	
	private float vbalance;
	
	private float post;
	
	private Timestamp vbalanceTime;
	
	private float total;
	
	private short status;
	
	private short type;
	
	private int ident;
	
	private long mpId;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mbid")
	public long getMbid() {
		return mbid;
	}

	public void setMbid(long mbid) {
		this.mbid = mbid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mid", referencedColumnName="mid")
	public MaterialPO getMaterial() {
		return material;
	}

	public void setMaterial(MaterialPO material) {
		this.material = material;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName="uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "iuid", referencedColumnName="uid")
	public UserPO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserPO instorer) {
		this.instorer = instorer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "puid", referencedColumnName="uid")
	public UserPO getPoster() {
		return poster;
	}

	public void setPoster(UserPO poster) {
		this.poster = poster;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "postTime")
	public Timestamp getPostTime() {
		return postTime;
	}

	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
	}

	@Column(name = "balance")
	public float getBalance() {
		return balance;
	}

	public void setBalance(float balance) {
		this.balance = balance;
	}

	@Column(name = "difference")
	public float getDifference() {
		return difference;
	}

	public void setDifference(float difference) {
		this.difference = difference;
	}

	@Column(name = "vbalance")
	public float getVbalance() {
		return vbalance;
	}

	public void setVbalance(float vbalance) {
		this.vbalance = vbalance;
	}

	@Column(name = "post")
	public float getPost() {
		return post;
	}

	public void setPost(float post) {
		this.post = post;
	}

	@Column(name = "vbalanceTime")
	public Timestamp getVbalanceTime() {
		return vbalanceTime;
	}

	public void setVbalanceTime(Timestamp vbalanceTime) {
		this.vbalanceTime = vbalanceTime;
	}

	@Column(name = "total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "ident")
	public int getIdent() {
		return ident;
	}

	public void setIdent(int ident) {
		this.ident = ident;
	}

	@Column(name = "mpId")
	public long getMpId() {
		return mpId;
	}

	public void setMpId(long mpId) {
		this.mpId = mpId;
	}
	
}