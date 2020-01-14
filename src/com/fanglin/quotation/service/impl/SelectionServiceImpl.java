package com.fanglin.quotation.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.SelectionDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.SelectionPO;
import com.fanglin.quotation.service.SelectionService;
import com.fanglin.quotation.vo.SelectionVO;
import com.fanglin.utils.BeanUtil;

@Service("selectionService")
@Transactional(readOnly = true)
public class SelectionServiceImpl implements SelectionService{
	
	@Autowired
	private SelectionDao selectionDao; 
	
	@Autowired
	private QuotationDao quotationDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public SelectionVO querySelectionByQid(SelectionVO selectionVO) {
		
		SelectionPO selectionPO = selectionDao.querySelectionByQid(selectionVO.getQid());
		
		selectionVO = new SelectionVO();
		
		BeanUtil.copyProperties(selectionPO, selectionVO);
		
		return selectionVO;
	}
	

	@Override
	@Transactional(rollbackFor = Exception.class)
	public SelectionVO querySelectionByOrderId(SelectionVO selectionVO) {
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(selectionVO.getOrderId());
		
		SelectionPO selectionPO = selectionDao.querySelectionByOrderId(quotationPO.getOrderId());
		
		selectionVO = new SelectionVO();
		
		BeanUtil.copyProperties(selectionPO, selectionVO);
		
		return selectionVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSelectionForAdvance(SelectionVO selectionVO) throws FLException{
		
		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());
		
		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}
		
		BeanUtil.copyProperties(selectionVO, selectionPO);
		
		selectionDao.update(selectionPO);
		
		return 0;
	}

}
