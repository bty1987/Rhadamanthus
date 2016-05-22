package com.fanglin.audit.dao;

import java.util.List;

import com.fanglin.audit.po.BudgetAuditItemPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface BudgetAuditItemDao extends Dao<BudgetAuditItemPO> {
	
	public List<BudgetAuditItemPO> pageBudgetAuditByOrderId(Paging paging, List<FilterVO> filters, String orderId);

	public List<BudgetAuditItemPO> queryBudgetAuditByOrderId(String orderId);

	public void deleteBudgetAuditByOrderId(String orderId);

}
