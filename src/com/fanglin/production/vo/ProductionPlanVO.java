package com.fanglin.production.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ProductionPlanVO implements Serializable {

	private static final long serialVersionUID = 4559894231877224250L;

	private Long ppid;

	private ProductionVO production;

	private String no;

	private String path;
	
	private UserBaseVO creater;

	private Timestamp createTime;

	private Timestamp finishTime;
	
	private Integer timeLimit;

	private Short status;
	
	private Integer company;

	private String comment;
	
	private Integer num;

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public ProductionPlanVO() {
		super();

	}
	
	public ProductionPlanVO(ProductionVO production, UserBaseVO creater) {
		super();
		this.production = production;
		this.creater = creater;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public ProductionVO getProduction() {
		return production;
	}

	public void setProduction(ProductionVO production) {
		this.production = production;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}
	
	public Integer getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(Integer timeLimit) {
		this.timeLimit = timeLimit;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
