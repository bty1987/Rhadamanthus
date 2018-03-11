package com.fanglin.inventory.po;

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
@Table(name = "storehouseuser", catalog = "inventory")
public class StorehouseUserPO implements java.io.Serializable {

	private static final long serialVersionUID = -7275795701320333075L;
	
	public static final String COLUMN_UID_STR = "user.uid";
	
	public static final String COLUMN_USERID_STR = "user.userId";
	
	private long shuId;
	
	private UserPO user;
	
	private StorehousePO storehouse;
	
	public StorehouseUserPO() {
		super();
	}

	public StorehouseUserPO(UserPO user, StorehousePO storehouse) {
		super();
		this.user = user;
		this.storehouse = storehouse;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "shuId")
	public long getShuId() {
		return this.shuId;
	}

	public void setShuId(long shuId) {
		this.shuId = shuId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uId", referencedColumnName = "uId")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shId", referencedColumnName = "shId")
	public StorehousePO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehousePO storehouse) {
		this.storehouse = storehouse;
	}

}