package com.fanglin.audit.service;

import java.util.List;

import com.fanglin.audit.vo.BudgetAuditItemVO;
import com.fanglin.audit.vo.BudgetAuditVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface BudgetAuditItemService {
	
	public void pageBudgetAuditItemByOrderId(Paging paging, List<FilterVO> filters, BudgetAuditVO budgetAuditVO);

	public BudgetAuditVO queryBudgetAuditItemByOrderId(BudgetAuditVO budgetAuditVO);
	
	public void addBudgetAuditItem(BudgetAuditVO budgetAuditVO);

	public void submitBudgetAuditItem(BudgetAuditVO budgetAuditVO, String currentUserId) throws FLException;
	
	public void changeBudgetAuditItemForStatus(BudgetAuditItemVO auditItem, String currentUserId) throws FLException;

}
