package com.fanglin.audit.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface BudgetAuditAddReduceService {

	public void pageAddOrReduceItem(Paging paging, List<FilterVO> filters);

	public void pageAddOrReduceItemByOrderPaymentId(Paging paging, List<FilterVO> filters, Long orderPaymentId);

}
