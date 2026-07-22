package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "constructionNode", catalog = "data")
public class ConstructionNodePO implements Serializable {

	private static final long serialVersionUID = 7434364138129555698L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_SORT_STR = "sort";

	public static final short STATUS_INIT_SHORT = 0;

	public static final short PROCESS_INIT_INT = 0;

	public static final short MARK_START_INT = 1;

	public static final short MARK_FINISH_INT = 2;

	public static final short ACCOUNT_INVALID_INT = 0;

	public static final short ACCOUNT_VALID_INT = 1;

	private long cnid;

	private String name;

	private int precheck;

	private int postcheck;

	private int stacheck;

	private int fincheck;

	private String startalk;

	private String endtalk;

	private SurveyTemplatePO startSurvey;

	private SurveyTemplatePO endSurvey;

	private int timeLimit;

	private int salaryLimit;

	private int accessoryLimit;

	private short process;

	private short sort;

	private short proset;

	private String kino;

	private String kiname;

	private short mark;

	private short account;

	private short status;

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

	@Column(name = "process")
	public short getProcess() {
		return process;
	}

	public void setProcess(short process) {
		this.process = process;
	}

	@Column(name = "sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}

	@Column(name = "proset")
	public short getProset() {
		return proset;
	}

	public void setProset(short proset) {
		this.proset = proset;
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

	@Column(name = "mark")
	public short getMark() {
		return mark;
	}

	public void setMark(short mark) {
		this.mark = mark;
	}

	@Column(name = "account")
	public short getAccount() {
		return account;
	}

	public void setAccount(short account) {
		this.account = account;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "salaryLimit")
	public int getSalaryLimit() {
		return salaryLimit;
	}

	public void setSalaryLimit(int salaryLimit) {
		this.salaryLimit = salaryLimit;
	}

	@Column(name = "accessoryLimit")
	public int getAccessoryLimit() {
		return accessoryLimit;
	}

	public void setAccessoryLimit(int accessoryLimit) {
		this.accessoryLimit = accessoryLimit;
	}

	public ConstructionNodeVO ptv(ConstructionNodeVO constructionNodeVO) {

		BeanUtil.copyProperties(this, constructionNodeVO, Arrays.asList("startSurvey", "endSurvey"));

		if (constructionNodeVO.getStartSurvey() != null && getStartSurvey() != null) constructionNodeVO.getStartSurvey().setBaseInfo(getStartSurvey());
		if (constructionNodeVO.getEndSurvey() != null && getEndSurvey() != null) constructionNodeVO.getEndSurvey().setBaseInfo(getEndSurvey());

		return constructionNodeVO;
	}

}
