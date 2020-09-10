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
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
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

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Override
	public List<ExtensionItemVO> queryExtensionItemByEid(ExtensionItemVO extensionItemVO) {

		List<ExtensionItemPO> extensionItemPOs = extensionItemDao.queryExtensionItemByEid(extensionItemVO.getEid());
		List<ExtensionItemVO> extensionItemVOs = handleExtensionItem(extensionItemPOs);

		return extensionItemVOs;
	}

	@Override
	public List<ExtensionItemVO> queryExtensionItemByEids(List<Long> extensionIds) {

		if (extensionIds == null || extensionIds.size() == 0) {
			return null;
		}

		List<ExtensionItemPO> extensionItemPOs = extensionItemDao.queryExtensionItemByEids(extensionIds);
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

		ExtensionItemPO extensionItemPO;

		checkExtension(extensionPO);

		if (extensionItemVO.getEiid() == null) {

			extensionItemPO = new ExtensionItemPO();

			BeanUtil.copyProperties(extensionItemVO, extensionItemPO, Arrays.asList("quotationFunctionArea"));

			extensionItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(extensionItemVO.getQuotationFunctionAreaId()));
		} else {

			extensionItemPO = extensionItemDao.get(extensionItemVO.getEiid());

			if (selectionItemDao.countSelectionItem(extensionPO.getOrderId(), extensionPO.getEid(), extensionItemPO.getEiid()) > 0) {
				throw new FLException(200037, "存在关联选材项");
			}

			BeanUtil.copyProperties(extensionItemVO, extensionItemPO, Arrays.asList("quotationFunctionArea"));

			extensionItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(extensionItemVO.getQuotationFunctionAreaId()));
		}

		extensionPO.setUndisPrice(extensionVO.getUndisPrice());
		extensionPO.setDisPrice(extensionVO.getDisPrice());
		extensionPO.setTotal(extensionVO.getTotal());

		extensionDao.update(extensionPO);
		extensionItemDao.saveOrUpdate(extensionItemPO);

		extensionItemVO.setEiid(extensionItemPO.getEiid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteExtensionItem(ExtensionItemVO extensionItemVO, ExtensionVO extensionVO) throws FLException {

		ExtensionPO extensionPO = extensionDao.get(extensionItemVO.getEid());

		if (extensionPO == null) {
			throw new FLException(200027, "扩展项不存在");
		}

		checkExtension(extensionPO);

		ExtensionItemPO extensionItemPO = extensionItemDao.get(extensionItemVO.getEiid());

		if (extensionItemPO == null) {
			throw new FLException(200027, "扩展项不存在");
		}

		int count = selectionItemDao.countSelectionItem(extensionPO.getOrderId(), extensionPO.getEid(), extensionItemPO.getEiid());

		if (count > 0) {
			throw new FLException(200037, "存在关联选材项");
		}

		extensionPO.setUndisPrice(extensionVO.getUndisPrice());
		extensionPO.setDisPrice(extensionVO.getDisPrice());
		extensionPO.setTotal(extensionVO.getTotal());

		extensionDao.update(extensionPO);
		extensionItemDao.delete(extensionItemPO);
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

	private void checkExtension(ExtensionPO extensionPO) throws FLException {

		String orderId = extensionPO.getOrderId();

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_COMPLETED_INT, DecorationPO.STATUS_TERMINATION_INT });

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (status.contains(decorationPO.getStatus())) {
			throw new FLException(140049, "装修单状态,不可操作");
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() == QuotationPO.STATUS_LOCK_INT) {
			throw new FLException(200033, "报价已锁定");
		}
	}

}
