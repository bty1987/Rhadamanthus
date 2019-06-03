package com.fanglin.information.vo;

public class ActivityItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 2606014203338812720L;

	private Long aiid;
	
	private Long aid;
	
	private String name;
	
	private Short type;
	
	private Long asid;
	
	private Float money;
	
	private String activity;
	
	public ActivityItemVO() {
		super();
	}

	public Long getAiid() {
		return aiid;
	}

	public void setAiid(Long aiid) {
		this.aiid = aiid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getAsid() {
		return asid;
	}

	public void setAsid(Long asid) {
		this.asid = asid;
	}

	public Float getMoney() {
		return money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}
	
}