package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.service.ExtensionService;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("extensionService")
@Transactional(readOnly=true)
public class ExtensionServiceImpl implements ExtensionService{
	
	@Autowired
	private ExtensionDao extensionDao;
	
	@Autowired
	private ExtensionItemDao extensionItemDao;
	
	@Autowired
	private DecorationDao decorationDao;

	@Override
	public void pageExtensionByOrderId(Paging paging, List<Filter> filters,ExtensionVO extensionVO) {
		
		filters.add(new Filter(ExtensionPO.COLUMN_ORDERID_STR, extensionVO.getOrderId(), "eq"));
		
		List<ExtensionPO> extensionPOs = extensionDao.pageExtensionByOrderId(paging,filters);
		List<ExtensionVO> extensionVOs = handleExtension(extensionPOs);
		paging.setData(extensionVOs);
	}
	
	@Override
	public List<ExtensionVO> queryExtensionByOrderId(ExtensionVO extensionVO) {
		List<ExtensionPO> extensionPOs = null;
		if(extensionVO.getType()!=null){
			extensionPOs	 = extensionDao.queryExtensionForTypeByOrderId(extensionVO.getOrderId(),extensionVO.getType());
		}else{
			extensionPOs	 = extensionDao.queryExtensionByOrderId(extensionVO.getOrderId());
		}
		List<ExtensionVO> extensionVOs = handleExtension(extensionPOs);
		return extensionVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addExtension(ExtensionVO extensionVO) throws FLException {
		
		checkExtensionItemForStatusByOrderId(extensionVO.getOrderId());
		
		ExtensionPO extensionPO = new ExtensionPO();
		
		BeanUtil.copyProperties(extensionVO, extensionPO);
		extensionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		extensionPO.setStatus(ExtensionPO.STATUS_INIT_SHORT);
		
		extensionDao.save(extensionPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateExtension(ExtensionVO extensionVO) throws FLException {
		
		ExtensionPO extensionPO = extensionDao.get(extensionVO.getEid());
		
		checkExtensionItemForStatusByOrderId(extensionPO.getOrderId());
		
		BeanUtil.copyProperties(extensionVO, extensionPO);
		
		extensionDao.update(extensionPO);
		
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateExtensionForAdvance(ExtensionVO extensionVO)throws FLException {
		
		ExtensionPO extensionPO = extensionDao.get(extensionVO.getEid());
		
		checkExtensionItemForStatusByOrderId(extensionPO.getOrderId());
		
		BeanUtil.copyProperties(extensionVO, extensionPO);
		
		extensionPO.setStatus(ExtensionPO.STATUS_SUBMIT_INT);
		
		extensionDao.update(extensionPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteExtension(ExtensionVO extensionVO) throws FLException {
		
		ExtensionPO extensionPO = extensionDao.get(extensionVO.getEid());
		
		checkExtensionItemForStatusByOrderId(extensionPO.getOrderId());
		
		List<ExtensionItemPO> extensionItemPOs= extensionItemDao.queryExtensionItemByEid(extensionPO.getEid());
		for(ExtensionItemPO extensionItemPO:extensionItemPOs){
			extensionItemDao.delete(extensionItemPO);
		}
		extensionDao.delete(extensionPO);
	}
	private List<ExtensionVO> handleExtension(List<ExtensionPO> extensionPOs){
		List<ExtensionVO> extensionVOs = new ArrayList<ExtensionVO>();
		for(ExtensionPO extensionPO: extensionPOs){
			ExtensionVO _extensionVO = new ExtensionVO();
			BeanUtil.copyProperties(extensionPO, _extensionVO);
			extensionVOs.add(_extensionVO);
		}
		return extensionVOs;
	}
	
	private void checkExtensionItemForStatusByOrderId(String orderId)throws FLException{
		
		DecorationPO	decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		List<Short> status = Arrays.asList(new Short[]{DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_RESIGNED_INT, DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_COMPLETED_INT, DecorationPO.STATUS_TERMINATION_INT});
		
		if(status.contains(decorationPO.getStatus())){
			throw new FLException(140049, "装修单状态,不可操作");
		}
	}
}
