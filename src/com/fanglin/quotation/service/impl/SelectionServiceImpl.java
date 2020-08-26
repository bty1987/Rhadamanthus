package com.fanglin.quotation.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
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
	
	@Autowired
	private DecorationDao decorationDao; 

	@Override
	public SelectionVO querySelectionByQid(SelectionVO selectionVO) throws FLException {
		
		SelectionPO selectionPO = selectionDao.querySelectionByQid(selectionVO.getQid());
		
		if (selectionPO == null) return null;
		
		selectionVO = new SelectionVO();
		
		BeanUtil.copyProperties(selectionPO, selectionVO);
		
		return selectionVO;
	}
	

	@Override
	public SelectionVO querySelectionByOrderId(SelectionVO selectionVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(selectionVO.getOrderId());
		
		if (quotationPO == null) {
			throw new FLException(200017, "默认报价不存在");
		}
		
		SelectionPO selectionPO = selectionDao.querySelectionByQid(quotationPO.getQid());
		
		if (selectionPO == null) return null;
		
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
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public SelectionVO addSelection(SelectionVO selectionVO) throws FLException{
		
		SelectionPO selectionPO = sevaOrgetSelectionPOByQid(selectionVO.getQid());
		
		BeanUtil.copyProperties(selectionPO, selectionVO);
		
		return selectionVO;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSelection(Long qid) throws FLException{
		
		sevaOrgetSelectionPOByQid(qid);
		
	}
	
	private SelectionPO sevaOrgetSelectionPOByQid(Long qid) throws FLException{
		
		QuotationPO quotationPO = quotationDao.get(qid);
		
		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}
		
		SelectionPO selectionPO = new SelectionPO();
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());
		
		selectionPO.setCompany(decorationPO.getCompany());
		selectionPO.setOrderId(quotationPO.getOrderId());
		selectionPO.setQid(quotationPO.getQid());
		selectionPO.setStatus(SelectionPO.STATUS_INIT_INT);
		selectionPO.setTotal(0L);

		selectionDao.save(selectionPO);
		
		return selectionPO;
	}
}
