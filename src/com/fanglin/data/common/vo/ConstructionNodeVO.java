package com.fanglin.data.common.vo;

import java.io.Serializable;

public class ConstructionNodeVO implements Serializable {

	private static final long serialVersionUID = -665024502622400929L;

	private Long cnid;

	private String name;

	private Integer precheck;

	private Integer postcheck;

	private Integer stacheck;

	private Integer fincheck;

	private Short checkout;

	private String startalk;

	private String endtalk;

	private SurveyTemplateVO startSurvey;

	private SurveyTemplateVO endSurvey;

	private Integer timeLimit;

	private Integer prenum;

	private Integer postnum;

	private Integer salaryLimit;

	private Integer accessoryLimit;

	private Short process;

	private Short sort;

	private Short proset;

	private String kino;

	private String kiname;

	private Short mark;

	private Short account;

	private Short status;

	private Integer company;

	public ConstructionNodeVO() {
		super();
	}

	public ConstructionNodeVO(SurveyTemplateVO startSurvey, SurveyTemplateVO endSurvey) {
		super();
		this.startSurvey = startSurvey;
		this.endSurvey = endSurvey;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getPrecheck() {
		return precheck;
	}

	public void setPrecheck(Integer precheck) {
		this.precheck = precheck;
	}

	public Integer getPostcheck() {
		return postcheck;
	}

	public void setPostcheck(Integer postcheck) {
		this.postcheck = postcheck;
	}

	public Integer getStacheck() {
		return stacheck;
	}

	public void setStacheck(Integer stacheck) {
		this.stacheck = stacheck;
	}

	public Integer getFincheck() {
		return fincheck;
	}

	public void setFincheck(Integer fincheck) {
		this.fincheck = fincheck;
	}

	public Short getCheckout() {
		return checkout;
	}

	public void setCheckout(Short checkout) {
		this.checkout = checkout;
	}

	public String getStartalk() {
		return startalk;
	}

	public void setStartalk(String startalk) {
		this.startalk = startalk;
	}

	public String getEndtalk() {
		return endtalk;
	}

	public void setEndtalk(String endtalk) {
		this.endtalk = endtalk;
	}

	public SurveyTemplateVO getStartSurvey() {
		return startSurvey;
	}

	public void setStartSurvey(SurveyTemplateVO startSurvey) {
		this.startSurvey = startSurvey;
	}

	public SurveyTemplateVO getEndSurvey() {
		return endSurvey;
	}

	public void setEndSurvey(SurveyTemplateVO endSurvey) {
		this.endSurvey = endSurvey;
	}

	public Integer getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(Integer timeLimit) {
		this.timeLimit = timeLimit;
	}

	public Integer getPrenum() {
		return prenum;
	}

	public void setPrenum(Integer prenum) {
		this.prenum = prenum;
	}

	public Integer getPostnum() {
		return postnum;
	}

	public void setPostnum(Integer postnum) {
		this.postnum = postnum;
	}

	public Short getProcess() {
		return process;
	}

	public void setProcess(Short process) {
		this.process = process;
	}

	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}

	public Short getProset() {
		return proset;
	}

	public void setProset(Short proset) {
		this.proset = proset;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getMark() {
		return mark;
	}

	public void setMark(Short mark) {
		this.mark = mark;
	}

	public Short getAccount() {
		return account;
	}

	public void setAccount(Short account) {
		this.account = account;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Integer getSalaryLimit() {
		return salaryLimit;
	}

	public void setSalaryLimit(Integer salaryLimit) {
		this.salaryLimit = salaryLimit;
	}

	public Integer getAccessoryLimit() {
		return accessoryLimit;
	}

	public void setAccessoryLimit(Integer accessoryLimit) {
		this.accessoryLimit = accessoryLimit;
	}

}
