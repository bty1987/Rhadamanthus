package com.fanglin.personel.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.LabelPO;

@Entity
@Table(name = "userlabel", schema = "communion")
public class UserLabelPO implements Serializable {

	private static final long serialVersionUID = 4609938318464178918L;
	
	public static final String COLUMN_USER_STR = "user.uid";
	
	public static final String COLUMN_LABEL_STR = "lable.lid";
	
	private long ulid;
	
	private UserPO user;
	
	private LabelPO label;
	
	private String scope;
	
	public UserLabelPO() {
		super();
	}

	public UserLabelPO(UserPO user, LabelPO label) {
		super();
		this.user = user;
		this.label = label;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ulid")
	public long getUlid() {
		return ulid;
	}

	public void setUlid(long ulid) {
		this.ulid = ulid;
	}

	@ManyToOne
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@ManyToOne
	@JoinColumn(name = "lid", referencedColumnName = "lid")
	public LabelPO getLabel() {
		return label;
	}

	public void setLabel(LabelPO label) {
		this.label = label;
	}

	@Column(name = "scope")
	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

}
