package com.fanglin.member.vo;

import com.fanglin.personel.vo.UserVO;

public class MemberDetailVO  implements java.io.Serializable {

	private static final long serialVersionUID = 3709606119480537095L;

	private Long mdId;
	
	private MemberCardVO memberCard;
	
	private Long pid;
	
	private Short type;
	
	private Short subType;
	
	private Float credit;
	
	private Float balance; 
	
	private Integer multiple;
	
	private Integer divider;
	
	private UserVO cuId;
	
	private Long createTime;
	
	private String comment;
	
	public MemberDetailVO() {
		super();
	}
	
	public MemberDetailVO(UserVO cuId) {
		super();
		this.cuId = cuId;
	}

	public MemberDetailVO(MemberCardVO memberCard ,UserVO cuId) {
		super();
		this.memberCard = memberCard;
		this.cuId = cuId;
	}

	public Long getMdId() {
		return mdId;
	}

	public void setMdId(Long mdId) {
		this.mdId = mdId;
	}

	public MemberCardVO getMemberCard() {
		return memberCard;
	}

	public void setMemberCard(MemberCardVO memberCard) {
		this.memberCard = memberCard;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getSubType() {
		return subType;
	}

	public void setSubType(Short subType) {
		this.subType = subType;
	}

	public Float getCredit() {
		return credit;
	}

	public void setCredit(Float credit) {
		this.credit = credit;
	}

	public UserVO getCuId() {
		return cuId;
	}

	public void setCuId(UserVO cuId) {
		this.cuId = cuId;
	}

	public Long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Float getBalance() {
		return balance;
	}

	public void setBalance(Float balance) {
		this.balance = balance;
	}

	public Integer getMultiple() {
		return multiple;
	}

	public void setMultiple(Integer multiple) {
		this.multiple = multiple;
	}

	public Integer getDivider() {
		return divider;
	}

	public void setDivider(Integer divider) {
		this.divider = divider;
	}

}
