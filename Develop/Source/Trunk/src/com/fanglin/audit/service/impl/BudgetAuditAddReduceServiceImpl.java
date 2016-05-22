package com.fanglin.audit.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.audit.service.BudgetAuditAddReduceService;
import com.fanglin.construction.dao.AddReduceDao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.dao.AddOrReduceDetailDao;
import com.fanglin.decoration.po.AddOrReduceDetailPO;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.decoration.vo.AddOrReduceItemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("budgetAuditAddReduceService")
@Transactional(readOnly = true)
public class BudgetAuditAddReduceServiceImpl implements BudgetAuditAddReduceService {

	@Autowired
	private AddOrReduceDetailDao addOrReduceDetailDao;

	@Autowired
	private AddReduceDao addReduceDao;

	@Override
	public void pageAddOrReduceItem(Paging paging, List<FilterVO> filters){
		
		List<AddOrReduceDetailPO> addOrReduceDetailPOs = addOrReduceDetailDao.pageAddOrReduceDetail(paging, filters);
		List<AddOrReduceItemVO> addOrReduceItemVOs = new ArrayList<AddOrReduceItemVO>();

		for(AddOrReduceDetailPO addOrReduceDetailPO: addOrReduceDetailPOs){
			AddOrReduceItemVO addOrReduceItemVO = new AddOrReduceItemVO();
			BeanUtil.copyProperties(addOrReduceDetailPO, addOrReduceItemVO);

			addOrReduceItemVO.setMeasurementUnit(addOrReduceDetailPO.getMeasurementUnitPO().getName());
			addOrReduceItemVO.setMeasurementUnitId(addOrReduceDetailPO.getMeasurementUnitPO().getId());

			addOrReduceItemVO.setQuotationBigCategory(addOrReduceDetailPO.getQuotationBigCategoryPO().getName());
			addOrReduceItemVO.setQuotationBigCategoryId(addOrReduceDetailPO.getQuotationBigCategoryPO().getId());

			addOrReduceItemVO.setWorkType(addOrReduceDetailPO.getWorkTypePO().getName());
			addOrReduceItemVO.setWorkTypeId(addOrReduceDetailPO.getWorkTypePO().getId());

			addOrReduceItemVO.setQuotationFunctionAreaId(addOrReduceDetailPO.getQuotationFunctionAreaPO().getAutoId());
			addOrReduceItemVO.setQuotationFunctionAreaName(addOrReduceDetailPO.getQuotationFunctionAreaPO().getFunctionAreaName());

			addOrReduceItemVOs.add(addOrReduceItemVO);
		}

		paging.setData(addOrReduceItemVOs);
	}

	@Override
	public void pageAddOrReduceItemByOrderPaymentId(Paging paging, List<FilterVO> filters, Long orderPaymentId){
		AddReducePO addReducePO = addReduceDao.queryAddReduceByOrderPaymentId(orderPaymentId);

		filters.add(new FilterVO("addOrReduceId", String.valueOf(addReducePO.getArId()), "eq"));
		
		pageAddOrReduceItem(paging, filters);
	}

}
