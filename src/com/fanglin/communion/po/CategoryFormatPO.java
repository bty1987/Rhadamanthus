package com.fanglin.communion.po;

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

/**
 * 品类规格。
 *
 * <p>品类(communion.category)下维护的规格字典行,是该品类的规格可选范围:
 * <ul>
 *   <li>商品-整装创建过程:所选品类已维护规格时,商品规格必须取自本表</li>
 *   <li>功能区品类规格(functionareaformat):规格取值范围同样约束于本表</li>
 * </ul>
 *
 * @see com.fanglin.communion.po.CategoryPO
 */
@Entity
@Table(name = "categoryformat", catalog = "communion")
public class CategoryFormatPO implements Serializable {

	private static final long serialVersionUID = -6713492735102458912L;

	private long cfid;

	private CategoryPO category;

	private String format;

	private String comment;

	public CategoryFormatPO() {
		super();
	}

	public CategoryFormatPO(long cfid) {
		super();
		this.cfid = cfid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cfid")
	public long getCfid() {
		return cfid;
	}

	public void setCfid(long cfid) {
		this.cfid = cfid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cid")
	public CategoryPO getCategory() {
		return category;
	}

	public void setCategory(CategoryPO category) {
		this.category = category;
	}

	@Column(name = "format")
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
