package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.AuditPO;
import com.fanglin.utils.Paging;

public interface AuditDao extends Dao<AuditPO> {
	
	public List<AuditPO> pageAudit(Paging paging, List<Filter> filters);
	
	public AuditPO queryAuditByOrderId(String orderId);
	
}
