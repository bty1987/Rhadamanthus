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
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
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
@Transactional(readOnly = true)
public class ExtensionItemServiceImpl implements ExtensionItemService {

	@Autowired
	private ExtensionItemDao extensionItemDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Autowired
	private ExtensionDao extensionDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public List<ExtensionItemVO> queryExtensionItemByEid(ExtensionItemVO extensionItemVO) {
		
		List<ExtensionItemPO> extensionItemPOs = extensionItemDao.queryExtensionItemByEid(extensionItemVO.getEid());
		List<ExtensionItemVO> extensionItemVOs = handleExtensionItem(extensionItemPOs);
		
		return extensionItemVOs;
	}

	@Override
	public List<ExtensionItemVO> queryExtensionItemByEids(List<Long> extensionItemIDs) {

		if (extensionItemIDs == null || extensionItemIDs.size() == 0) {
			return null;
		}
		
		List<ExtensionItemPO> extensionItemPOs = extensionItemDao.queryExtensionItemByEids(extensionItemIDs);
		List<ExtensionItemVO> extensionItemVOs = handleExtensionItem(extensionItemPOs);
		
		return extensionItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateExtensionItem(ExtensionItemVO extensionItemVO, ExtensionVO extensionVO) throws FLException {

		ExtensionPO extensionPO = extensionDao.get(extensionVO.getEid());

		if (extensionPO == null) {
			throw new FLException(200027, "扩展项不存在");
		}

		checkExtensionItemForStatusByOrderId(extensionPO.getOrderId());

		ExtensionItemPO extensionItemPO = null;
		
		if (extensionItemVO.getEiId() == null) {
			
			extensionItemPO = new ExtensionItemPO();
			
			BeanUtil.copyProperties(extensionItemVO, extensionItemPO, Arrays.asList("quotationFunctionArea"));
			
			extensionItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(extensionItemVO.getQuotationFunctionAreaId()));
		} else {
			
			extensionItemPO = extensionItemDao.get(extensionItemVO.getEiId());
			
			if (extensionItemPO == null) {
				throw new FLException(200027, "扩展项不存在");
			}
			
			BeanUtil.copyProperties(extensionItemVO, extensionItemPO, Arrays.asList("quotationFunctionArea"));
			
			extensionItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(extensionItemVO.getQuotationFunctionAreaId()));
		}
		
		extensionPO.setTotal(extensionVO.getTotal());
		
		extensionDao.update(extensionPO);
		extensionItemDao.saveOrUpdate(extensionItemPO);
		
		extensionItemVO.setEiId(extensionItemPO.getEiId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteExtensionItem(ExtensionItemVO extensionItemVO, ExtensionVO extensionVO) throws FLException {

		ExtensionPO extensionPO = extensionDao.get(extensionItemVO.getEid());

		if (extensionPO == null) {
			throw new FLException(200027, "扩展项不存在");
		}

		checkExtensionItemForStatusByOrderId(extensionPO.getOrderId());

		ExtensionItemPO extensionItemPO = extensionItemDao.get(extensionItemVO.getEiId());

		if (extensionItemPO == null) {
			throw new FLException(200027, "扩展项不存在");
		}

		extensionPO.setTotal(extensionVO.getTotal());

		extensionDao.update(extensionPO);
		extensionItemDao.delete(extensionItemPO);
	}

	private void checkExtensionItemForStatusByOrderId(String orderId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_COMPLETED_INT, DecorationPO.STATUS_TERMINATION_INT });

		if (status.contains(decorationPO.getStatus())) {
			throw new FLException(140049, "装修单状态,不可操作");
		}
	}

	private List<ExtensionItemVO> handleExtensionItem(List<ExtensionItemPO> extensionItemPOs) {

		List<ExtensionItemVO> extensionItemVOs = new ArrayList<ExtensionItemVO>();

		ExtensionItemVO extensionItemVO;

		for (ExtensionItemPO extensionItemPO : extensionItemPOs) {

			extensionItemVO = new ExtensionItemVO();

			BeanUtil.copyProperties(extensionItemPO, extensionItemVO, Arrays.asList("quotationFunctionArea"));

			extensionItemVO.setQuotationFunctionAreaId(extensionItemPO.getQuotationFunctionArea().getQfaId());
			extensionItemVO.setQuotationFunctionAreaName(extensionItemPO.getQuotationFunctionArea().getFunctionAreaName());

			if (extensionItemPO.getQuoteItemId() != 0) {

				QuotationItemPO quotationItemPO = quotationItemDao.get(extensionItemPO.getQuoteItemId());

				if (quotationItemPO != null) {
					extensionItemVO.setContent(quotationItemPO.getQuotationItemDes());
				}
			}

			extensionItemVOs.add(extensionItemVO);
		}
		return extensionItemVOs;
	}

}
