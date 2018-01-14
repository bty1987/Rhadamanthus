package com.fanglin.right.vo;

import com.fanglin.data.common.vo.ChainPageVO;

public class RoleChainPageVO implements java.io.Serializable {

	private static final long serialVersionUID = 160135836315539969L;

	private Long rcpid;
	
	private Integer rid;
	
	private ChainPageVO chainPage;

	public Long getRcpid() {
		return rcpid;
	}

	public void setRcpid(Long rcpid) {
		this.rcpid = rcpid;
	}

	public Integer getRid() {
		return rid;
	}

	public void setRid(Integer rid) {
		this.rid = rid;
	}

	public ChainPageVO getChainPage() {
		return chainPage;
	}

	public void setChainPage(ChainPageVO chainPage) {
		this.chainPage = chainPage;
	}
	
	
	
}
