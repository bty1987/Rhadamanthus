package com.fanglin.communion.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "category", catalog = "communion")
public class CategoryPO implements java.io.Serializable {

	private static final long serialVersionUID = -8704336558286265464L;
	
	public static final String COLUMN_CID_STR = "cId";
	
	public static final String COLUMN_CATEGORYID_STR = "categoryId";
	
	private long cid;
	
	private String categoryId;
	
	private String categoryName;
	

	public CategoryPO() {
		super();
	}

	public CategoryPO(long cid) {
		super();
		this.cid = cid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cId")
	public long getCid() {
		return this.cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "categoryId")
	public String getCategoryId() {
		return this.categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	@Column(name = "categoryName")
	public String getCategoryName() {
		return this.categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	
	

}