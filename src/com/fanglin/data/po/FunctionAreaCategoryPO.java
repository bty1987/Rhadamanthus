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

import com.fanglin.communion.po.CategoryPO;

@Entity
@Table(name = "functionareacategory", catalog = "quotation")
public class FunctionAreaCategoryPO implements Serializable {

	private static final long serialVersionUID = 5489210663721847391L;

	private long fcid;

	private FunctionAreaPO functionArea;

	private CategoryPO category;

	public FunctionAreaCategoryPO() {
		super();
	}

	public FunctionAreaCategoryPO(long fcid) {
		super();
		this.fcid = fcid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "fcid")
	public long getFcid() {
		return fcid;
	}

	public void setFcid(long fcid) {
		this.fcid = fcid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "faid")
	public FunctionAreaPO getFunctionArea() {
		return functionArea;
	}

	public void setFunctionArea(FunctionAreaPO functionArea) {
		this.functionArea = functionArea;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cid")
	public CategoryPO getCategory() {
		return category;
	}

	public void setCategory(CategoryPO category) {
		this.category = category;
	}

}
