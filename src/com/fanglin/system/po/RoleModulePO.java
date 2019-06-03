package com.fanglin.system.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rolemodule", catalog = "communion")
public class RoleModulePO implements java.io.Serializable {

	private static final long serialVersionUID = -6081152605726686260L;

	private int rmId;
	
	private int rid;
	
	private ModulePO module;
	
	private short link;
	
	public RoleModulePO() {
		super();
	}
	
	public RoleModulePO(ModulePO module, int rid, short link) {
		super();
		this.module = module;
		this.rid = rid;
		this.link = link;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rmId")
	public int getRmId() {
		return this.rmId;
	}

	public void setRmId(int rmId) {
		this.rmId = rmId;
	}

	@Column(name = "rId")
	public int getRid() {
		return rid;
	}

	public void setRid(int rid) {
		this.rid = rid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mId", referencedColumnName = "mId")
	public ModulePO getModule() {
		return module;
	}

	public void setModule(ModulePO module) {
		this.module = module;
	}

	public short getLink() {
		return link;
	}

	public void setLink(short link) {
		this.link = link;
	}

}