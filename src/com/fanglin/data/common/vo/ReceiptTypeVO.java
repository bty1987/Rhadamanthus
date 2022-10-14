package com.fanglin.data.common.vo;

import java.util.List;

public class ReceiptTypeVO implements java.io.Serializable {

	private static final long serialVersionUID = 186150588872194351L;

	private Integer rtId;

	private String name;

	private String no;

	private Short type;

	private Short fund;

	private Short status;

	private String grade;

	private String kino;

	private String kiname;

	private String kibalance;

	private String bankno;

	private String assistant;

	private String value;

	private List<ReceiptTypeItemVO> receiptTypeItems;

	public Integer getRtId() {
		return this.rtId;
	}

	public void setRtId(Integer rtId) {
		this.rtId = rtId;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public Short getType() {
		return this.type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getFund() {
		return fund;
	}

	public void setFund(Short fund) {
		this.fund = fund;
	}

	public Short getStatus() {
		return this.status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public String getKino() {
		return kino;
	}

	public void setKino(String kino) {
		this.kino = kino;
	}

	public String getKiname() {
		return kiname;
	}

	public void setKiname(String kiname) {
		this.kiname = kiname;
	}

	public String getKibalance() {
		return kibalance;
	}

	public void setKibalance(String kibalance) {
		this.kibalance = kibalance;
	}

	public String getBankno() {
		return bankno;
	}

	public void setBankno(String bankno) {
		this.bankno = bankno;
	}

	public String getAssistant() {
		return assistant;
	}

	public void setAssistant(String assistant) {
		this.assistant = assistant;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public List<ReceiptTypeItemVO> getReceiptTypeItems() {
		return receiptTypeItems;
	}

	public void setReceiptTypeItems(List<ReceiptTypeItemVO> receiptTypeItems) {
		this.receiptTypeItems = receiptTypeItems;
	}

}