package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.AddReduceDao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.dao.AddOrReduceDetailDao;
import com.fanglin.decoration.po.AddOrReduceDetailPO;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.decoration.service.AddOrReduceItemService;
import com.fanglin.decoration.vo.AddOrReduceItemVO;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;


@Service("addOrReduceItemService")
@Transactional(readOnly = true)
public class AddOrReduceItemServiceImpl implements AddOrReduceItemService {
	
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
	public void pageAddOrReduceItemByPaymentId(Paging paging, List<FilterVO> filters, AddReduceVO addReduceVO){
		
		AddReducePO addReducePO = addReduceDao.queryAddReduceByOrderPaymentId(addReduceVO.getOrderPaymentId());
		
		filters.add(new FilterVO("addOrReduceId",String.valueOf(addReducePO.getArId()),"eq"));
		
		pageAddOrReduceItem(paging, filters);
	}
}
