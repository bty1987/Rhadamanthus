package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "constructionNode", catalog = "data")
public class ConstructionNodePO implements Serializable {

	private static final long serialVersionUID = 7434364138129555698L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_SORT_STR = "sort";

	public static final short STATUS_INIT_SHORT = 0;

	private long cnid;

	private String name;

	private int precheck;

	private int postcheck;

	private int stacheck;

	private int fincheck;

	private short status;

	private String startalk;

	private String endtalk;

	private SurveyTemplatePO startSurvey;

	private SurveyTemplatePO endSurvey;

	private int timeLimit;

	private short sort;

	private String kino;

	private String kiname;

	private int company;

	public ConstructionNodePO() {
		super();
	}

	public ConstructionNodePO(long cnid) {
		super();
		this.cnid = cnid;
	}

	public ConstructionNodePO(SurveyTemplatePO startSurvey, SurveyTemplatePO endSurvey) {
		super();
		this.startSurvey = startSurvey;
		this.endSurvey = endSurvey;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getPrecheck() {
		return precheck;
	}

	public void setPrecheck(int precheck) {
		this.precheck = precheck;
	}

	public int getPostcheck() {
		return postcheck;
	}

	public void setPostcheck(int postcheck) {
		this.postcheck = postcheck;
	}

	@Column(name = "stacheck")
	public int getStacheck() {
		return stacheck;
	}

	public void setStacheck(int stacheck) {
		this.stacheck = stacheck;
	}

	@Column(name = "fincheck")
	public int getFincheck() {
		return fincheck;
	}

	public void setFincheck(int fincheck) {
		this.fincheck = fincheck;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "startalk")
	public String getStartalk() {
		return startalk;
	}

	public void setStartalk(String startalk) {
		this.startalk = startalk;
	}

	@Column(name = "endtalk")
	public String getEndtalk() {
		return endtalk;
	}

	public void setEndtalk(String endtalk) {
		this.endtalk = endtalk;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sstid", referencedColumnName = "stid")
	public SurveyTemplatePO getStartSurvey() {
		return startSurvey;
	}

	public void setStartSurvey(SurveyTemplatePO startSurvey) {
		this.startSurvey = startSurvey;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "estid", referencedColumnName = "stid")
	public SurveyTemplatePO getEndSurvey() {
		return endSurvey;
	}

	public void setEndSurvey(SurveyTemplatePO endSurvey) {
		this.endSurvey = endSurvey;
	}

	@Column(name = "timeLimit")
	public int getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(int timeLimit) {
		this.timeLimit = timeLimit;
	}

	@Column(name = "sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}

	@Column(name = "kino")
	public String getKino() {
		return kino;
	}

	public void setKino(String kino) {
		this.kino = kino;
	}

	@Column(name = "kiname")
	public String getKiname() {
		return kiname;
	}

	public void setKiname(String kiname) {
		this.kiname = kiname;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
