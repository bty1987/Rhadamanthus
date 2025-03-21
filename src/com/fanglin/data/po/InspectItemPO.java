package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "inspectitem", catalog = "data")
public class InspectItemPO implements Serializable {

	private static final long serialVersionUID = -5139405352008532742L;

	public static final String COLUMN_IID_STR = "iid";

	public static final String COLUMN_TYPE_STR = "type";

	public static final short ISREQUIRE_NO_SHORT = 0;

	public static final short ISREQUIRE_YES_SHORT = 1;

	private long iiid;

	private long iid;

	private String title;

	private short type;

	private short isRequire;

	public InspectItemPO() {
		super();
	}

	public InspectItemPO(long iiid) {
		super();
		this.iiid = iiid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "iiid")
	public long getIiid() {
		return iiid;
	}

	public void setIiid(long iiid) {
		this.iiid = iiid;
	}

	@Column(name = "iid")
	public long getIid() {
		return iid;
	}

	public void setIid(long iid) {
		this.iid = iid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "isRequire")
	public short getIsRequire() {
		return isRequire;
	}

	public void setIsRequire(short isRequire) {
		this.isRequire = isRequire;
	}

}
