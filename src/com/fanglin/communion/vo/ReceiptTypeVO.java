package com.fanglin.communion.vo;

public class ReceiptTypeVO implements java.io.Serializable {

	private static final long serialVersionUID = 186150588872194351L;

	private Integer rtId;
	
	private String name;
	
	private String no;
	
	private Short type;
	
	private Short status;
	
	private String grade;
	
	private String kino;
	
	private String kiname;
	
	private String assistant;

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

	public String getAssistant() {
		return assistant;
	}

	public void setAssistant(String assistant) {
		this.assistant = assistant;
	}

}