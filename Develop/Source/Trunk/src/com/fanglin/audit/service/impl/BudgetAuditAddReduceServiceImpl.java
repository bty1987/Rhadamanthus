package com.fanglin.audit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.audit.service.BudgetAuditAddReduceService;
import com.fanglin.construction.dao.AddReduceDao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.utils.Paging;

@Service("budgetAuditAddReduceService")
@Transactional(readOnly = true)
public class BudgetAuditAddReduceServiceImpl implements BudgetAuditAddReduceService {

	@Autowired
	private AddReduceDao addReduceDao;

	@Override
	public void pageAddOrReduceItem(Paging paging, List<FilterVO> filters){
		
	}

	@Override
	public void pageAddOrReduceItemByOrderPaymentId(Paging paging, List<FilterVO> filters, Long orderPaymentId){
		AddReducePO addReducePO = addReduceDao.queryAddReduceByOrderPaymentId(orderPaymentId);

		filters.add(new FilterVO("addOrReduceId", String.valueOf(addReducePO.getArId()), "eq"));
		
		pageAddOrReduceItem(paging, filters);
	}

}
