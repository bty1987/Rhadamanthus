package com.fanglin.report.vo;

public class AddReduceRankVO implements java.io.Serializable {

	private static final long serialVersionUID = -422576880725194412L;

	private String name;

	private Integer total;

	private String count;

	public AddReduceRankVO() {
		super();
	}

	public String getname() {
		return name;
	}

	public void setname(String name) {
		this.name = name;
	}

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}

	public String getCount() {
		return count;
	}

	public void setCount(String count) {
		this.count = count;
	}

}
