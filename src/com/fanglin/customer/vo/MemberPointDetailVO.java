package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class MemberPointDetailVO implements Serializable {

	private static final long serialVersionUID = 8894713205684230177L;

	private String typeName;// 款项类型(首付款/二期款/主材预付款等)

	private Long money;// 金额(应收额/充值额,存毫)

	private Integer multiple;// 积分倍数(1000=1倍)

	private Long point;// 积分额(存毫)

	private Short status;// 款项状态

	private Timestamp time;// 时间(款项创建时间/收款时间)

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

	public Integer getMultiple() {
		return multiple;
	}

	public void setMultiple(Integer multiple) {
		this.multiple = multiple;
	}

	public Long getPoint() {
		return point;
	}

	public void setPoint(Long point) {
		this.point = point;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Timestamp getTime() {
		return time;
	}

	public void setTime(Timestamp time) {
		this.time = time;
	}

}
