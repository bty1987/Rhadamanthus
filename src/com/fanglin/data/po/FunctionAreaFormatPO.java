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
@Table(name = "functionareaformat", catalog = "quotation")
public class FunctionAreaFormatPO implements Serializable {

	private static final long serialVersionUID = -1794268035276184353L;

	private long ffid;

	private FunctionAreaCategoryPO functionAreaCategory;

	private String format;

	private String formula;

	private String comment;

	public FunctionAreaFormatPO() {
		super();
	}

	public FunctionAreaFormatPO(long ffid) {
		super();
		this.ffid = ffid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ffid")
	public long getFfid() {
		return ffid;
	}

	public void setFfid(long ffid) {
		this.ffid = ffid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "facid")
	public FunctionAreaCategoryPO getFunctionAreaCategory() {
		return functionAreaCategory;
	}

	public void setFunctionAreaCategory(FunctionAreaCategoryPO functionAreaCategory) {
		this.functionAreaCategory = functionAreaCategory;
	}

	@Column(name = "format")
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	@Column(name = "formula")
	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
