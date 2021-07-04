/**
 * @File Name		: AddReduceItemServiceImpl.java
 * @Package   	: com.fanglin.decoration.service.impl
 * @Version		: 1.0
 * @Date			: 2016-6-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.SystemDefineItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.dao.SystemDefineItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.AddReduceItemDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.SelectionDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.quotation.po.SelectionPO;
import com.fanglin.quotation.service.AddReduceItemService;
import com.fanglin.quotation.vo.AddReduceItemVO;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("addReduceItemService")
@Transactional(readOnly = true)
public class AddReduceItemServiceImpl implements AddReduceItemService {

	@Autowired
	private AddReduceDao addReduceDao;

	@Autowired
	private AddReduceItemDao addReduceItemDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Autowired
	private SystemDefineItemDao systemDefineItemDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ExtensionItemDao extensionItemDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Autowired
	private SelectionDao selectionDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Override
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceId(AddReduceVO addReduceVO) throws FLException {

		List<AddReduceItemPO> addReduceItemPOs = addReduceItemDao.queryAddReduceItem(addReduceVO.getArId());
		List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();

		for (AddReduceItemPO addReduceItemPO : addReduceItemPOs) {
			addReduceItemVOs.add(ptv(addReduceItemPO));
		}

		return addReduceItemVOs;
	}

	@Override
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceIds(List<Long> arids) throws FLException {

		List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();

		if (arids != null && arids.size() > 0) {

			List<AddReduceItemPO> addReduceItemPOs = addReduceItemDao.queryAddReduceItem(arids);

			for (AddReduceItemPO addReduceItemPO : addReduceItemPOs) {
				addReduceItemVOs.add(ptv(addReduceItemPO));
			}
		}

		return addReduceItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAddReduceItem(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException {

		List<Integer> statuses = Arrays.asList(AddReducePO.STATUS_UNSUBMIT_INT, AddReducePO.STATUS_SUBMIT_INT);

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(140018, "增减项不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(addReducePO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!statuses.contains(addReducePO.getStatus())) {
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}

		AddReduceServiceImpl.convertAddReduceVOToPOForAdvance(addReduceVO, addReducePO);

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(addReduceItemVO.getQuotationFunctionAreaId());

		AddReduceItemPO addReduceItemPO = null;

		Long areaId = null;

		if (addReduceItemVO.getAriId() == null) {

			if (addReduceItemVO.getType() != AddReduceItemPO.TYPE_CUSTOM_QUOTATION_INT && addReduceItemVO.getQuoteItemId() == null) {
				throw new FLException(140038, "非自定义增减项目需要引用项");
			}

			addReduceItemPO = new AddReduceItemPO();

			BeanUtil.copyProperties(addReduceItemVO, addReduceItemPO);

			addReduceItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);
			if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {
				areaId = handleQuotationItem(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex(), addReduceItemPO.getQuoteItemId(), addReduceItemVO.getNum(), 0);
			} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_ADD_ITEM_INT) {
				areaId = handleAddReduceItem(addReduceItemPO.getQuoteItemId(), addReduceItemVO.getNum(), 0);
			} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT) {
				areaId = handleExtensionItem(addReduceItemPO.getQuoteItemId(), addReduceItemVO.getNum(), 0);
			}

		} else {
			addReduceItemPO = addReduceItemDao.get(addReduceItemVO.getAriId());

			if (addReduceItemPO == null) {
				throw new FLException(140036, "增减项目不存在");
			}

			if (selectionItemDao.countSelectionItem(addReducePO.getOrderId(), addReducePO.getArId(), addReduceItemPO.getAriId()) > 0) {
				throw new FLException(200037, "存在关联选材项");
			}

			if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {
				areaId = handleQuotationItem(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex(), addReduceItemPO.getQuoteItemId(), addReduceItemVO.getNum(), addReduceItemPO.getNum());
			} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_ADD_ITEM_INT) {
				areaId = handleAddReduceItem(addReduceItemPO.getQuoteItemId(), addReduceItemVO.getNum(), addReduceItemPO.getNum());
			} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT) {
				areaId = handleExtensionItem(addReduceItemPO.getQuoteItemId(), addReduceItemVO.getNum(), addReduceItemPO.getNum());
			}

			addReduceItemPO.setNum(addReduceItemVO.getNum());
		}

		handleDecorationPayment(addReducePO);

		addReduceItemDao.saveOrUpdate(addReduceItemPO);
		addSelectionItem(addReducePO, addReduceItemPO, areaId);
		addReduceDao.update(addReducePO);

		addReduceItemVO.setAriId(addReduceItemPO.getAriId());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAddReduceItemForAdvance(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException {

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(140018, "增减项不存在");
		}

		AddReduceItemPO addReduceItemPO = addReduceItemDao.get(addReduceItemVO.getAriId());

		if (addReduceItemPO == null) {
			throw new FLException(140036, "增减项目不存在");
		}

		addReducePO.setUncalPrice(addReduceVO.getUncalPrice());
		addReducePO.setCalPrice(addReduceVO.getCalPrice());

		addReduceItemPO.setDiscount(addReduceItemVO.getDiscount());

		addReduceItemDao.update(addReduceItemPO);
		addReduceDao.update(addReducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAddReduceItem(AddReduceVO addReduceVO, AddReduceItemVO addReduceItemVO) throws FLException {

		List<Integer> statuses = Arrays.asList(AddReducePO.STATUS_UNSUBMIT_INT, AddReducePO.STATUS_SUBMIT_INT);

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(140018, "增减项不存在");
		}

		if (!statuses.contains(addReducePO.getStatus())) {
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}

		AddReduceItemPO addReduceItemPO = addReduceItemDao.get(addReduceItemVO.getAriId());

		if (addReduceItemPO == null) {
			throw new FLException(140036, "增减项目不存在");
		}

		if (selectionItemDao.countSelectionItem(addReducePO.getOrderId(), addReducePO.getArId(), addReduceItemPO.getAriId()) > 0) {
			throw new FLException(200037, "存在关联选材项");
		}

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(addReduceItemPO.getQuotationFunctionArea().getQfaId());

		if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {
			handleQuotationItem(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex(), addReduceItemPO.getQuoteItemId(), 0, addReduceItemPO.getNum());
		} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_ADD_ITEM_INT) {
			handleAddReduceItem(addReduceItemPO.getQuoteItemId(), 0, addReduceItemPO.getNum());
		} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT) {
			handleExtensionItem(addReduceItemPO.getQuoteItemId(), 0, addReduceItemPO.getNum());
		}

		AddReduceServiceImpl.convertAddReduceVOToPOForAdvance(addReduceVO, addReducePO);

		handleDecorationPayment(addReducePO);

		addReduceItemDao.delete(addReduceItemPO);
		addReduceDao.update(addReducePO);

		return 0;
	}

	private Long handleQuotationItem(long quotationFunctionAreaId, short index, long quotationItemId, int vonum, int ponum) throws FLException {

		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaId, index), quotationItemId);

		if (quotationFunctionAreaItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		int quotationFunctionAreaItemNum = quotationFunctionAreaItemPO.getNum();
		int _diff = Arith.sub(vonum, ponum);

		if (_diff > 0 && quotationFunctionAreaItemNum < _diff) {
			throw new FLException(140039, "减项工程量大于引用项目");
		}

		quotationFunctionAreaItemPO.setNum(Arith.add(quotationFunctionAreaItemNum, Arith.sub(ponum, vonum)));

		quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);

		return quotationFunctionAreaId;
	}

	private Long handleAddReduceItem(long quotationItemId, int vonum, int ponum) throws FLException {

		AddReduceItemPO _addReduceItemPO = addReduceItemDao.get(quotationItemId);

		if (_addReduceItemPO == null) {
			throw new FLException(140036, "增减项目不存在");
		}

		int _addReduceItemNum = _addReduceItemPO.getNum();
		int _diff = Arith.sub(vonum, ponum);

		if (_diff > 0 && _addReduceItemNum < _diff) {
			throw new FLException(140039, "减项工程量大于引用项目");
		}

		_addReduceItemPO.setNum(Arith.add(_addReduceItemNum, Arith.sub(ponum, vonum)));

		addReduceItemDao.update(_addReduceItemPO);

		return _addReduceItemPO.getArId();
	}

	private Long handleExtensionItem(long quotationItemId, int vonum, int ponum) throws FLException {

		ExtensionItemPO _extensionItemPO = extensionItemDao.get(quotationItemId);

		if (_extensionItemPO == null) {
			throw new FLException(140036, "增减项目不存在");
		}

		int _extensionItemNum = _extensionItemPO.getNum();
		int _diff = Arith.sub(vonum, ponum);

		if (_diff > 0 && _extensionItemNum < _diff) {
			throw new FLException(140039, "减项工程量大于引用项目");
		}

		_extensionItemPO.setNum(Arith.add(_extensionItemNum, Arith.sub(ponum, vonum)));

		extensionItemDao.update(_extensionItemPO);

		return _extensionItemPO.getEid();
	}

	private int handleDecorationPayment(AddReducePO addReducePO) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(addReducePO.getDpId());

		if (decorationPaymentPO == null)
			return 0;

		if (decorationPaymentPO.getPaymentStatus() != DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT) {
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}

		decorationPaymentPO.setReferMoney(Arith.mul(Arith.div(addReducePO.getTotal(), 1000000), 1000000));

		decorationPaymentDao.update(decorationPaymentPO);

		return 0;
	}

	private void addSelectionItem(AddReducePO addReducePO, AddReduceItemPO addReduceItemPO, Long areaId) throws FLException {

		if (addReducePO.getType() == 0)
			return;

		SelectionItemPO querySelectionItem = null;

		if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {
			querySelectionItem = selectionItemDao.querySelectionItem(addReducePO.getOrderId(), areaId, addReduceItemPO.getQuoteItemId(), SelectionItemPO.TYPE_QUOTATION_SHORT);
		} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_ADD_ITEM_INT) {
			querySelectionItem = selectionItemDao.querySelectionItem(addReducePO.getOrderId(), areaId, addReduceItemPO.getQuoteItemId(), SelectionItemPO.TYPE_ADDITEM_SHORT);
		} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT) {
			querySelectionItem = selectionItemDao.querySelectionItem(addReducePO.getOrderId(), areaId, addReduceItemPO.getQuoteItemId(), SelectionItemPO.TYPE_EXTENSIONADD_SHORT);
		}

		if (querySelectionItem != null) {

			int num = addReduceItemPO.getNum();

			if (num > querySelectionItem.getNum()) {
				throw new FLException(140039, "减项工程量大于引用项目");
			}

			long gid = querySelectionItem.getGoods().getGid();

			SelectionItemPO selectionItemPO = new SelectionItemPO(new GoodsPO(gid));

			BeanUtil.copyProperties(querySelectionItem, selectionItemPO, Arrays.asList("siid", "goods", "traner", "checker", "confirmer", "balancer", "finish"));

			QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(addReduceItemPO.getQuotationFunctionArea().getQfaId());

			selectionItemPO.setAreaName(quotationFunctionAreaPO.getFunctionAreaName());
			selectionItemPO.setAreaId(addReducePO.getArId());
			selectionItemPO.setQuoteId(addReduceItemPO.getAriId());
			selectionItemPO.setType(SelectionItemPO.TYPE_MINUSITEM_SHORT);
			selectionItemPO.setStatus(SelectionItemPO.STATUS_INIT_SHORT);
			selectionItemPO.setNum(num);
			selectionItemPO.setInitNum(num);
			selectionItemPO.setPreprice(addReduceItemPO.getSubPrice());
			selectionItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			selectionItemDao.save(selectionItemPO);

			SelectionPO selectionPO = selectionDao.get(querySelectionItem.getSid());

			int price = Arith.mul(querySelectionItem.getPostprice(), num);
			long newAddReduceMinusTotal = Arith.add(selectionPO.getAddReduceMinusTotal(), price);
			long newTotal = Arith.sub(selectionPO.getTotal(), price);

			selectionPO.setTotal(newTotal);
			selectionPO.setAddReduceMinusTotal(newAddReduceMinusTotal);

			selectionDao.update(selectionPO);
		}
	}

	public AddReduceItemVO ptv(AddReduceItemPO addReduceItemPO) throws FLException {

		AddReduceItemVO addReduceItemVO = new AddReduceItemVO();

		BeanUtil.copyProperties(addReduceItemPO, addReduceItemVO);

		short addReduceItemType = addReduceItemPO.getType();

		if (addReduceItemType == AddReduceItemPO.TYPE_COMMON_QUOTATION_INT) {
			QuotationItemPO quotationItemPO = quotationItemDao.get(addReduceItemPO.getQuoteItemId());

			if (quotationItemPO != null) {
				addReduceItemVO.setContent(quotationItemPO.getComment());
			}
		} else if (addReduceItemType == AddReduceItemPO.TYPE_SYSTEM_QUOTATION_INT) {
			SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(addReduceItemPO.getQuoteItemId());

			if (systemDefineItemPO != null) {
				addReduceItemVO.setContent(systemDefineItemPO.getComment());
			}
		} else if (addReduceItemType == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {

			QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(addReduceItemPO.getQuotationFunctionArea().getQfaId());
			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), addReduceItemPO.getQuoteItemId());

			if (quotationFunctionAreaItemPO != null) {
				if (quotationFunctionAreaItemPO.getQuotationItem() != null) {
					addReduceItemVO.setContent(quotationFunctionAreaItemPO.getQuotationItem().getComment());
					addReduceItemVO.setQuotationItemId(quotationFunctionAreaItemPO.getQuotationItem().getQiid());
				} else {
					addReduceItemVO.setContent(quotationFunctionAreaItemPO.getContent());
				}
			} else {
				addReduceItemVO.setContent("报价项已被删除");
			}
		} else if (addReduceItemType == AddReduceItemPO.TYPE_ADD_ITEM_INT) {

			AddReduceItemPO _addReduceItemPO = addReduceItemDao.get(addReduceItemPO.getQuoteItemId());

			if (_addReduceItemPO != null) {
				addReduceItemVO.setQuotationItemId(_addReduceItemPO.getQuoteItemId());
			}
		} else if (addReduceItemType == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT) {

			ExtensionItemPO extensionItemPO = extensionItemDao.get(addReduceItemPO.getQuoteItemId());
			if (extensionItemPO != null) {
				addReduceItemVO.setContent(extensionItemPO.getContent());
				addReduceItemVO.setQuotationItemId(extensionItemPO.getQuoteItemId());
			}
		}

		QuotationFunctionAreaPO quotationFunctionAreaPO = addReduceItemPO.getQuotationFunctionArea();
		addReduceItemVO.setQuotationFunctionAreaType(quotationFunctionAreaPO.getType());
		addReduceItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());
		addReduceItemVO.setQuotationFunctionAreaName(quotationFunctionAreaPO.getFunctionAreaName());

		return addReduceItemVO;
	}
}
