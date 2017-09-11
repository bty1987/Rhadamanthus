package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.service.ExtensionItemService;
import com.fanglin.quotation.vo.ExtensionItemVO;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.utils.BeanUtil;

@Service("extensionItemService")
@Transactional(readOnly=true)
public class ExtensionItemServiceImpl implements ExtensionItemService{
	
	@Autowired
	private ExtensionItemDao extensionItemDao;
	
	@Autowired
	private QuotationItemDao quotationItemDao;
	
	@Autowired
	private ExtensionDao extensionDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Override
	public List<ExtensionItemVO> queryExtensionItemByEid(ExtensionItemVO extensionItemVO) {

		List<ExtensionItemPO> extensionItemPOs = extensionItemDao.queryExtensionItemByEid(extensionItemVO.getEid());
		List<ExtensionItemVO> extensionItemVOs = new ArrayList<ExtensionItemVO>();
		for(ExtensionItemPO extensionItemPO: extensionItemPOs){
			ExtensionItemVO _extensionItemVO = new ExtensionItemVO();
			BeanUtil.copyProperties(extensionItemPO, _extensionItemVO,Arrays.asList("quotationFunctionAreaPO"));
			_extensionItemVO.setQuotationFunctionAreaId(extensionItemPO.getQuotationFunctionAreaPO().getQfaId());
			_extensionItemVO.setQuotationFunctionAreaName(extensionItemPO.getQuotationFunctionAreaPO().getFunctionAreaName());
			if(extensionItemPO.getQuoteItemId()!=0){
				QuotationItemPO quotationItemPO = quotationItemDao.get(extensionItemPO.getQuoteItemId());
				if (quotationItemPO != null) {
					_extensionItemVO.setContent(quotationItemPO.getQuotationItemDes());
				}
			}
			extensionItemVOs.add(_extensionItemVO);
		}
		return extensionItemVOs;
	}

	@Override
	public List<ExtensionItemVO> queryExtensionItemByEids(List<Long> extensionItemIDs) {
		
		if (extensionItemIDs == null || extensionItemIDs.size() == 0) {
			return null;
		}
		List<ExtensionItemVO> extensionItemVOs = new ArrayList<ExtensionItemVO>();
		List<ExtensionItemPO> extensionItemPOs = extensionItemDao.queryExtensionItemByEids(extensionItemIDs);
		
		for (ExtensionItemPO extensionItemPO : extensionItemPOs) {
			ExtensionItemVO extensionItemVO = new ExtensionItemVO();
			BeanUtil.copyProperties(extensionItemPO, extensionItemVO,Arrays.asList("quotationFunctionAreaPO"));
			extensionItemVO.setQuotationFunctionAreaId(extensionItemPO.getQuotationFunctionAreaPO().getQfaId());
			extensionItemVO.setQuotationFunctionAreaName(extensionItemPO.getQuotationFunctionAreaPO().getFunctionAreaName());
			if(extensionItemPO.getQuoteItemId()!=0){
				QuotationItemPO quotationItemPO = quotationItemDao.get(extensionItemPO.getQuoteItemId());
				if (quotationItemPO != null) {
					extensionItemVO.setContent(quotationItemPO.getQuotationItemDes());
					extensionItemVO.setQuotationType(quotationItemPO.getQuotationType().getName());
				}
			}
			extensionItemVOs.add(extensionItemVO);
		}
		return extensionItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateExtensionItem(ExtensionItemVO extensionItemVO,ExtensionVO extensionVO)throws FLException {
		
		ExtensionPO extensionPO = extensionDao.get(extensionVO.getEid());
		
		if(extensionPO == null){
			throw new FLException(200027, "扩展项不存在");
		}
		
		checkExtensionItemForStatusByOrderId(extensionPO.getOrderId());
		
		ExtensionItemPO extensionItemPO = null;
		if(extensionItemVO.getEiId() == null){
			extensionItemPO= new ExtensionItemPO();
			BeanUtil.copyProperties(extensionItemVO, extensionItemPO,Arrays.asList("quotationFunctionAreaPO"));
			extensionItemPO.setQuotationFunctionAreaPO(new QuotationFunctionAreaPO(extensionItemVO.getQuotationFunctionAreaId()));
		}else{
			extensionItemPO = extensionItemDao.get(extensionItemVO.getEiId());
			if(extensionItemPO == null){
				throw new FLException(200027, "扩展项不存在");
			}
			BeanUtil.copyProperties(extensionItemVO, extensionItemPO,Arrays.asList("quotationFunctionAreaPO"));
			extensionItemPO.setQuotationFunctionAreaPO(new QuotationFunctionAreaPO(extensionItemVO.getQuotationFunctionAreaId()));
		}
		extensionPO.setTotal(extensionVO.getTotal());
		extensionDao.update(extensionPO);
		extensionItemDao.saveOrUpdate(extensionItemPO);
		extensionItemVO.setEiId(extensionItemPO.getEiId());
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteExtensionItem(ExtensionItemVO extensionItemVO,ExtensionVO extensionVO) throws FLException {
		
		ExtensionPO extensionPO = extensionDao.get(extensionItemVO.getEid());
		
		if(extensionPO == null){
			throw new FLException(200027, "扩展项不存在");
		}
		
		checkExtensionItemForStatusByOrderId(extensionPO.getOrderId());
	
		ExtensionItemPO extensionItemPO = extensionItemDao.get(extensionItemVO.getEiId());
		
		if(extensionItemPO == null){
			throw new FLException(200027, "扩展项不存在");
		}
		extensionPO.setTotal(extensionVO.getTotal());
		extensionDao.update(extensionPO);
		extensionItemDao.delete(extensionItemPO);
		
	}
	private void checkExtensionItemForStatusByOrderId(String orderId)throws FLException{
		
		DecorationOrderPO	decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_SIGNED_STR,DecorationOrderPO.STATUS_RESIGNED_STR,DecorationOrderPO.STATUS_WASTE_STR,DecorationOrderPO.STATUS_COMPLETED_STR,DecorationOrderPO.STATUS_TERMINATION_STR});
		
		if(status.contains(decorationOrderPO.getStatus())){
			throw new FLException(140049, "装修单状态,不可操作");
		}
	}
}
