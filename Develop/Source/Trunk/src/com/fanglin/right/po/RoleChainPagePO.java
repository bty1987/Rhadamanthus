package com.fanglin.right.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.ChainPagePO;

@Entity
@Table(name = "rolechainpage", catalog = "platform")
public class RoleChainPagePO implements java.io.Serializable {

	private static final long serialVersionUID = -4074450023871807494L;

	public static final String COLUMN_RID_STR = "rid";
	
	private long rcpid;
	
	private int rid;
	
	private ChainPagePO chainPage;
	
	public RoleChainPagePO(int rid, ChainPagePO chainPage) {
		super();
		this.rid = rid;
		this.chainPage = chainPage;
	}
	public RoleChainPagePO() {
		super();
	}
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rcpid")
	public long getRcpid() {
		return rcpid;
	}

	public void setRcpid(long rcpid) {
		this.rcpid = rcpid;
	}
	
	@Column(name = "rid")
	public int getRid() {
		return rid;
	}

	public void setRid(int rid) {
		this.rid = rid;
	}
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cpid", referencedColumnName = "cpid")
	
	public ChainPagePO getChainPage() {
		return chainPage;
	}

	public void setChainPage(ChainPagePO chainPage) {
		this.chainPage = chainPage;
	} 
	
	
}
