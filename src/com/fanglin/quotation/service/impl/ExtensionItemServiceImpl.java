package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.ExtensionItemService;
import com.fanglin.quotation.vo.ExtensionItemVO;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

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

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<ExtensionItemVO> queryExtensionItemByEid(ExtensionItemVO extensionItemVO) {

		List<ExtensionItemPO> extensionItemPOs = extensionItemDao.queryExtensionItem(extensionItemVO.getEid());
		List<ExtensionItemVO> extensionItemVOs = handleExtensionItem(extensionItemPOs);

		return extensionItemVOs;
	}

	@Override
	public List<ExtensionItemVO> queryExtensionItemByEids(List<Long> extensionIds) {

		if (extensionIds == null || extensionIds.size() == 0) {
			return null;
		}

		List<ExtensionItemPO> extensionItemPOs = extensionItemDao.queryExtensionItem(extensionIds);
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

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(extensionItemVO.getQuotationFunctionAreaId());

		if (extensionItemVO.getEiid() == null) {

			extensionItemPO = new ExtensionItemPO();

			BeanUtil.copyProperties(extensionItemVO, extensionItemPO, Arrays.asList("quotationFunctionArea"));

			extensionItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);

			if (extensionItemPO.getType() == ExtensionItemPO.TYPE_SUB_QUOTE_INT) {
				handleQuotationItem(extensionItemPO, quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex(), extensionItemPO.getQuoteItemId(), extensionItemVO.getNum(), 0);
			}
		} else {

			extensionItemPO = extensionItemDao.get(extensionItemVO.getEiid());

			if (selectionItemDao.countSelectionItem(extensionPO.getOrderId(), extensionPO.getEid(), extensionItemPO.getEiid()) > 0) {
				throw new FLException(200037, "存在关联选材项");
			}

			BeanUtil.copyProperties(extensionItemVO, extensionItemPO, Arrays.asList("quotationFunctionArea"));

			extensionItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(extensionItemVO.getQuotationFunctionAreaId()));

			if (extensionItemPO.getType() == ExtensionItemPO.TYPE_SUB_QUOTE_INT) {
				handleQuotationItem(extensionItemPO, quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex(), extensionItemPO.getQuoteItemId(), extensionItemVO.getNum(), extensionItemPO.getNum());
			}
		}

		extensionItemPO.setNum(extensionItemVO.getNum());
		extensionItemPO.setInitnum(extensionItemVO.getNum());

		extensionItemDao.saveOrUpdate(extensionItemPO);

		extensionPO.advance(extensionVO);

		extensionDao.update(extensionPO);

		extensionItemVO.setEiid(extensionItemPO.getEiid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int upgradeExtensionItem(ExtensionItemVO extensionItemVO, ExtensionVO extensionVO, String userId) throws FLException {

		ExtensionPO extensionPO = extensionDao.queryExtension(extensionVO.getQid(), ExtensionPO.TYPE_ADD_INT, ExtensionPO.ATTTYPE_QUOTATION_INT);

		if (extensionPO == null) {
			extensionPO = new ExtensionPO();

			BeanUtil.copyProperties(extensionVO, extensionPO, Arrays.asList("decoration", "quotation", "creater"));

			extensionPO.setQid(extensionVO.getQid());

			extensionPO.setCreater(userDao.queryUserByUserId(userId));
			extensionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			extensionPO.setType(ExtensionPO.TYPE_ADD_INT);
			extensionPO.setAtttype(ExtensionPO.ATTTYPE_QUOTATION_INT);

			extensionPO.setStatus(ExtensionPO.STATUS_INIT_SHORT);

			extensionDao.save(extensionPO);
		}

		checkExtension(extensionPO);

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(extensionItemVO.getQuotationFunctionAreaId());

		ExtensionItemPO extensionItemPO = new ExtensionItemPO();

		BeanUtil.copyProperties(extensionItemVO, extensionItemPO, Arrays.asList("quotationFunctionArea"));

		extensionItemPO.setEid(extensionPO.getEid());
		extensionItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);

		extensionItemPO.setNum(extensionItemVO.getNum());
		extensionItemPO.setInitnum(extensionItemVO.getNum());

		extensionItemDao.saveOrUpdate(extensionItemPO);

		BeanUtil.copyProperties(extensionItemPO, extensionItemVO, Arrays.asList("quotationFunctionArea"));

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

		if (extensionItemPO.getType() == ExtensionItemPO.TYPE_SUB_QUOTE_INT) {

			QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(extensionItemPO.getQuotationFunctionArea().getQfaId());

			handleQuotationItem(extensionItemPO, quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex(), extensionItemPO.getQuoteItemId(), 0, extensionItemPO.getNum());
		}

		extensionItemDao.delete(extensionItemPO);

		extensionPO.advance(extensionVO);

		extensionDao.update(extensionPO);
	}

	private List<ExtensionItemVO> handleExtensionItem(List<ExtensionItemPO> extensionItemPOs) {

		List<ExtensionItemVO> extensionItemVOs = new ArrayList<ExtensionItemVO>();

		for (ExtensionItemPO extensionItemPO : extensionItemPOs) {
			extensionItemVOs.add(ptv(extensionItemPO));
		}
		return extensionItemVOs;
	}

	public ExtensionItemVO ptv(ExtensionItemPO extensionItemPO) {

		ExtensionItemVO extensionItemVO = new ExtensionItemVO();

		BeanUtil.copyProperties(extensionItemPO, extensionItemVO, Arrays.asList("quotationFunctionArea"));

		extensionItemVO.setQuotationFunctionAreaId(extensionItemPO.getQuotationFunctionArea().getQfaId());
		extensionItemVO.setQuotationFunctionAreaName(extensionItemPO.getQuotationFunctionArea().getFunctionAreaName());

		if (extensionItemPO.getQuoteItemId() != 0) {

			QuotationItemPO quotationItemPO = quotationItemDao.get(extensionItemPO.getQuoteItemId());

			if (quotationItemPO != null) {
				extensionItemVO.setContent(quotationItemPO.getComment());
			}
		}

		return extensionItemVO;
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

		if (quotationPO.getStatus() != QuotationPO.STATUS_INIT_INT) {
			throw new FLException(200030, "报价不可操作");
		}
	}

	private Long handleQuotationItem(ExtensionItemPO extensionItemPO, long quotationFunctionAreaId, short index, long quotationItemId, int vonum, int ponum) throws FLException {

		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaId, index), quotationItemId);

		if (quotationFunctionAreaItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		int num = quotationFunctionAreaItemPO.getNum();
		int _diff = Arith.sub(vonum, ponum);

		if (quotationFunctionAreaItemPO.getInitNum() < vonum) {
			throw new FLException(140039, "减项工程量大于引用项目");
		}

		if (_diff >= 0 && num < vonum) {
			throw new FLException(140039, "减项工程量大于引用项目");
		}

		quotationFunctionAreaItemPO.setNum(Arith.add(num, Arith.sub(ponum, vonum)));

		quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);

		return quotationFunctionAreaId;
	}

}
