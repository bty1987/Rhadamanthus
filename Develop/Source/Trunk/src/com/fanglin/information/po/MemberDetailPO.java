package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "memberdetail", catalog = "information")
public class MemberDetailPO  implements java.io.Serializable {

	private static final long serialVersionUID = 4617781950715580910L;

	public static final short SUBTYPE_PLUS_INT = 0;    //增加积分状态0
	
	public static final short SUBTYPE_LESS_INT = 1;    //减少积分状态1
	
	public static final int BALANCE_ZERO_INT = 0;
	
	public static final String COLUMN_PID_STR = "pid"; 
	
	public static final short PID_INIT_SHORT = 0;            //新增明细pid默认值
	
	public static final short SUBTYPE_TURNPOINTSTYPE_INT = 3;
	
	public static final String COLUMN_MEMBERCARDORDERID_STR = "memberCard.orderId";
	
	private long mdId;
	
	private MemberCardPO memberCard;
	
	private long pid;
	
	private short type;
	
	private short subType;
	
	private float credit;
	
	private float balance;
	
	private int multiple;
	
	private int divider;
	
	private UserPO cuId;
	
	private long createTime;
	
	private String comment;
	
	public MemberDetailPO() {
		super();
	}
	
	public MemberDetailPO(MemberCardPO memberCard,UserPO cuId) {
		super();
		this.memberCard = memberCard;
		this.cuId = cuId;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mdid")
	public long getMdId() {
		return mdId;
	}

	public void setMdId(long mdId) {
		this.mdId = mdId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mcid", referencedColumnName = "mcid")
	public MemberCardPO getMemberCard() {
		return memberCard;
	}

	public void setMemberCard(MemberCardPO memberCard) {
		this.memberCard = memberCard;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "subtype")
	public short getSubType() {
		return subType;
	}

	public void setSubType(short subType) {
		this.subType = subType;
	}

	@Column(name = "credit")
	public float getCredit() {
		return credit;
	}

	public void setCredit(float credit) {
		this.credit = credit;
	}

	@Column(name = "divider")
	public int getDivider() {
		return divider;
	}

	public void setDivider(int divider) {
		this.divider = divider;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCuId() {
		return cuId;
	}

	public void setCuId(UserPO cuId) {
		this.cuId = cuId;
	}

	@Column(name = "createTime")
	public long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "balance")
	public float getBalance() {
		return balance;
	}

	public void setBalance(float balance) {
		this.balance = balance;
	}

	@Column(name = "multiple")
	public int getMultiple() {
		return multiple;
	}

	public void setMultiple(int multiple) {
		this.multiple = multiple;
	}
	
	
}
