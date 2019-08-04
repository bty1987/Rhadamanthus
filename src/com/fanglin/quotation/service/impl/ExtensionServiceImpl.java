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
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.ExtensionService;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("extensionService")
@Transactional(readOnly = true)
public class ExtensionServiceImpl implements ExtensionService {

	@Autowired
	private ExtensionDao extensionDao;

	@Autowired
	private ExtensionItemDao extensionItemDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationDao quotationDao;

	@Override
	public void pageExtensionByOrderId(Paging paging, List<Filter> filters, ExtensionVO extensionVO) {

		filters.add(new Filter(ExtensionPO.COLUMN_ORDERID_STR, extensionVO.getOrderId(), "eq"));

		List<ExtensionPO> extensionPOs = extensionDao.pageExtensionByOrderId(paging, filters);
		List<ExtensionVO> extensionVOs = handleExtension(extensionPOs);

		paging.setData(extensionVOs);
	}

	@Override
	public List<ExtensionVO> queryExtensionByOrderId(ExtensionVO extensionVO) {

		List<ExtensionPO> extensionPOs = null;

		if (extensionVO.getType() != null) {
			extensionPOs = extensionDao.queryExtensionForTypeByOrderId(extensionVO.getOrderId(), extensionVO.getType());
		} else {
			extensionPOs = extensionDao.queryExtensionByOrderId(extensionVO.getOrderId());
		}

		List<ExtensionVO> extensionVOs = handleExtension(extensionPOs);

		return extensionVOs;
	}

	@Override
	public ExtensionVO queryExtensionByEid(ExtensionVO extensionVO) throws FLException {

		ExtensionPO extensionPO = extensionDao.get(extensionVO.getEid());

		if (extensionPO == null) {
			throw new FLException(200027, "扩展项不存在");
		}

		BeanUtil.copyProperties(extensionPO, extensionVO);

		return extensionVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addExtension(ExtensionVO extensionVO) throws FLException {

		ExtensionPO extensionPO = new ExtensionPO();

		BeanUtil.copyProperties(extensionVO, extensionPO);

		checkExtension(extensionPO);

		extensionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		extensionPO.setStatus(ExtensionPO.STATUS_INIT_SHORT);

		extensionDao.save(extensionPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateExtension(ExtensionVO extensionVO) throws FLException {

		ExtensionPO extensionPO = extensionDao.get(extensionVO.getEid());

		checkExtension(extensionPO);

		extensionPO.setContent(extensionVO.getContent());

		extensionDao.update(extensionPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateExtensionForAdvance(ExtensionVO extensionVO) throws FLException {

		ExtensionPO extensionPO = extensionDao.get(extensionVO.getEid());

		checkExtension(extensionPO);

		extensionPO.setUndisPrice(extensionVO.getUndisPrice());
		extensionPO.setDisPrice(extensionVO.getDisPrice());
		extensionPO.setTotal(extensionVO.getTotal());

		extensionDao.update(extensionPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteExtension(ExtensionVO extensionVO) throws FLException {

		ExtensionPO extensionPO = extensionDao.get(extensionVO.getEid());

		if (extensionPO == null) {
			throw new FLException(200027, "扩展项不存在");
		}

		checkExtension(extensionPO);

		extensionItemDao.deleteExtensionItem(extensionVO.getEid());
		extensionDao.delete(extensionPO);
	}

	private List<ExtensionVO> handleExtension(List<ExtensionPO> extensionPOs) {

		List<ExtensionVO> extensionVOs = new ArrayList<ExtensionVO>();

		ExtensionVO extensionVO = null;

		for (ExtensionPO extensionPO : extensionPOs) {
			extensionVO = new ExtensionVO();

			BeanUtil.copyProperties(extensionPO, extensionVO);

			extensionVOs.add(extensionVO);
		}
		return extensionVOs;
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
