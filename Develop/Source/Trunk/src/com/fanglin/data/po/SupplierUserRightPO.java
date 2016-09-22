package com.fanglin.data.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "supplieruserright", catalog = "communion")
public class SupplierUserRightPO implements java.io.Serializable {

	private static final long serialVersionUID = 8356344784419261408L;
	
	public static final String COLUMN_SID_STR = "sid";

	private long surId;
	
	private long sid;
	
	private UserPO user;
	
	public SupplierUserRightPO() {
		super();
	}

	public SupplierUserRightPO(long sid, UserPO user) {
		super();
		this.sid = sid;
		this.user = user;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "surId")
	public long getSurId() {
		return this.surId;
	}

	public void setSurId(long surId) {
		this.surId = surId;
	}

	@Column(name = "sId")
	public long getSid() {
		return this.sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId", referencedColumnName="userId")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

}