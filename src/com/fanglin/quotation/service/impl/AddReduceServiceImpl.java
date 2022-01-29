/**
 * @File Name		: AddReduceServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
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
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.AddReduceItemDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.AddReduceDO;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.service.AddReduceService;
import com.fanglin.quotation.vo.AddReduceItemVO;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("addReduceService")
@Transactional(readOnly = true)
public class AddReduceServiceImpl implements AddReduceService {

	@Autowired
	private AddReduceDao addReduceDao;

	@Autowired
	private AddReduceItemDao addReduceItemDao;

	@Autowired
	private ExtensionItemDao extensionItemDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Autowired
	private AddReduceItemServiceImpl addReduceItemService;

	@Override
	public void pageAddReduce(Paging paging, List<Filter> filters, AddReduceVO addReduceVO) throws FLException {

		if (addReduceVO != null && addReduceVO.getOrderId() != null) {
			filters.add(new Filter(AddReducePO.COLUMN_ORDERID_STR, addReduceVO.getOrderId(), "eq"));
		}

		if (addReduceVO != null && addReduceVO.getStatus() != null) {
			filters.add(new Filter(AddReducePO.COLUMN_STATUS_STR, String.valueOf(addReduceVO.getStatus()), "eq"));
		}

		if (addReduceVO != null && addReduceVO.getType() != null) {
			filters.add(new Filter(AddReducePO.COLUMN_TYPE_STR, String.valueOf(addReduceVO.getType()), "eq"));
		}

		if (addReduceVO != null && addReduceVO.getPaytype() != null) {
			filters.add(new Filter(AddReducePO.COLUMN_PAYTYPE_STR, String.valueOf(addReduceVO.getPaytype()), "eq"));
		}

		List<AddReduceDO> addReduceDOs = addReduceDao.pageAddReduce(paging, filters);
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();

		for (AddReduceDO addReduceDO : addReduceDOs) {

			addReduceVO = new AddReduceVO(new DecorationVO());

			addReduceVO.getDecoration().setSupervisor(new UserBaseVO());

			BeanUtil.copyPropertie(addReduceDO, addReduceVO, Arrays.asList("decoration"));

			addReduceDO.getDecoration().ptvcascade(addReduceVO.getDecoration());

			addReduceVOs.add(addReduceVO);
		}

		paging.setData(addReduceVOs);
	}

	@Override
	public void pageAddReduceByOrderId(Paging paging, List<Filter> filters, AddReduceVO addReduceVO) throws FLException {

		filters.add(new Filter(AddReducePO.COLUMN_ORDERID_STR, addReduceVO.getOrderId(), "eq"));

		List<AddReducePO> addReducePOs = addReduceDao.pageAddReduce(paging, filters, addReduceVO.getOrderId());
		List<AddReduceVO> addReduceVOs = handleAddReduce(addReducePOs);

		paging.setData(addReduceVOs);
	}

	@Override
	public List<AddReduceVO> queryAddReduceByOrderId(AddReduceVO addReduceVO) throws FLException {

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduce(addReduceVO.getOrderId(), null);
		List<AddReduceVO> addReduceVOs = handleAddReduce(addReducePOs);

		return addReduceVOs;
	}

	@Override
	public List<AddReduceVO> queryAddReduceForPayedByOrderId(AddReduceVO addReduceVO) throws FLException {

		List<Short> statuses = Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT);

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduce(addReduceVO.getOrderId(), statuses);
		List<AddReduceVO> addReduceVOs = handleAddReduce(addReducePOs);

		return addReduceVOs;
	}

	@Override
	public AddReduceVO queryAddReduceByArid(AddReduceVO addReduceVO) throws FLException {

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		BeanUtil.copyProperties(addReducePO, addReduceVO);

		addReduceVO.setAddReduceItems(handleAddReduceItem(addReducePO.getArId()));

		return addReduceVO;
	}

	@Override
	public AddReduceVO queryAddReduceByDecorationPaymentId(AddReduceVO addReduceVO) throws FLException {

		AddReducePO addReducePO = addReduceDao.queryAddReduce(addReduceVO.getDpId());

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		BeanUtil.copyProperties(addReducePO, addReduceVO);

		addReduceVO.setAddReduceItems(handleAddReduceItem(addReducePO.getArId()));

		return addReduceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAddReduce(AddReduceVO addReduceVO) {

		AddReducePO addReducePO = new AddReducePO();

		BeanUtil.copyProperties(addReduceVO, addReducePO, Arrays.asList("arId"));

		addReducePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		addReducePO.setStatus(AddReducePO.STATUS_UNSUBMIT_INT);

		addReducePO.setTotal(0);
		addReducePO.setManageRate(0);
		addReducePO.setManagePrice(0);
		addReducePO.setUndisPrice(0);
		addReducePO.setDisPrice(0);
		addReducePO.setUncalPrice(0);
		addReducePO.setCalPrice(0);

		addReduceDao.save(addReducePO);

		addReduceVO.setArId(addReducePO.getArId());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAddReduce(AddReduceVO addReduceVO) throws FLException {

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		addReducePO.setUndisPrice(addReduceVO.getUndisPrice());
		addReducePO.setDisPrice(addReduceVO.getDisPrice());
		addReducePO.setUncalPrice(addReduceVO.getUncalPrice());
		addReducePO.setCalPrice(addReduceVO.getCalPrice());

		addReduceDao.update(addReducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAddReduceForAdvance(AddReduceVO addReduceVO) throws FLException {

		List<Short> status = Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT);

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		if (status.contains(addReducePO.getStatus())) {
			throw new FLException(200061, "增减单状态不可操作");
		}

		addReducePO.setTotal(addReduceVO.getTotal());
		addReducePO.setManagePrice(addReduceVO.getManagePrice());
		addReducePO.setManageRate(addReduceVO.getManageRate());
		addReducePO.setUndisPrice(addReduceVO.getUndisPrice());
		addReducePO.setDisPrice(addReduceVO.getDisPrice());
		addReducePO.setUncalPrice(addReduceVO.getUncalPrice());
		addReducePO.setCalPrice(addReduceVO.getCalPrice());
		addReducePO.setDiscount(addReduceVO.getDiscount());

		addReduceDao.update(addReducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitAddReduce(AddReduceVO addReduceVO, String userId) throws FLException {

		List<Short> paymentStatus = Arrays.asList(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
		List<Short> status = Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT);

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		if (status.contains(addReducePO.getStatus())) {
			throw new FLException(200061, "增减单状态不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(addReducePO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		DecorationPaymentPO decorationPaymentPO = null;

		if (addReducePO.getDpId() != 0) {
			decorationPaymentPO = decorationPaymentDao.get(addReducePO.getDpId());

			if (decorationPaymentPO != null && !paymentStatus.contains(decorationPaymentPO.getPaymentStatus())) {
				throw new FLException(140002, "已付款或已确认,不可修改");
			}
		} else {
			decorationPaymentPO = new DecorationPaymentPO();
		}

		if (addReducePO.getStatus() == AddReducePO.STATUS_UNSUBMIT_INT) { // 初始

			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
			decorationPaymentPO.setReferMoney(Arith.mul(Arith.div(addReduceVO.getTotal(), 1000000), 1000000));

			if (addReducePO.getType() == AddReducePO.TYPE_ADD_INT || addReducePO.getType() == AddReducePO.TYPE_LEAKAGE_INT) {
				decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
				decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_ADD_REDUCE_INT);
			} else {
				decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
				decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_ADD_REDUCE_INT);
			}

			decorationPaymentPO.setDecoration(decorationPO);
			decorationPaymentPO.setCreater(userDao.queryUserByUserId(userId));
			decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationPaymentPO.setPaymentType(addReducePO.getType() == 0 ? DecorationPaymentPO.PAYMENTTYPE_ADD_STR : DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR);
			decorationPaymentPO.setCompany(decorationPO.getCompany());

		} else if (addReducePO.getStatus() == AddReducePO.STATUS_SUBMIT_INT) { // 提交
			decorationPaymentPO.setReferMoney(Arith.mul(Arith.div(addReduceVO.getTotal(), 1000000), 1000000));
		}

		decorationPaymentDao.saveOrUpdate(decorationPaymentPO);

		addReducePO.setStatus(AddReducePO.STATUS_SUBMIT_INT);
		addReducePO.setDpId(decorationPaymentPO.getDpid());

		convertAddReduceVOToPOForAdvance(addReduceVO, addReducePO);

		addReduceDao.update(addReducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unpayAddReduce(AddReduceVO addReduceVO) throws FLException {

		List<Short> status = Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT);

		long arId = addReduceVO.getArId();

		AddReducePO addReducePO = addReduceDao.get(arId);

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		if (status.contains(addReducePO.getStatus())) {
			throw new FLException(200061, "增减单状态不可操作");
		}

		if (AddReducePO.TYPE_ADD_INT != addReducePO.getType()) {
			throw new FLException(200062, "增减单类型不可操作");
		}

		if (AddReducePO.PAYTYPE_PAY_INT != addReducePO.getPaytype()) {
			throw new FLException(200062, "增减单类型不可操作");
		}

		decorationPaymentDao.deleteById(addReducePO.getDpId());

		addReducePO.setPaytype(addReduceVO.getPaytype());

		addReduceDao.update(addReducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmAddReduce(AddReduceVO addReduceVO) throws FLException {

		List<Short> status = Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT);

		long arId = addReduceVO.getArId();

		AddReducePO addReducePO = addReduceDao.get(arId);

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		if (status.contains(addReducePO.getStatus())) {
			throw new FLException(200061, "增减单状态不可操作");
		}

		if (AddReducePO.PAYTYPE_PAY_INT == addReducePO.getPaytype()) {
			throw new FLException(200062, "增减单类型不可操作");
		}

		addReducePO.setStatus(AddReducePO.STATUS_CONFIRMED_INT);

		addReduceDao.update(addReducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAddReduceByArId(AddReduceVO addReduceVO) throws FLException {

		List<Short> status = Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT);

		long arId = addReduceVO.getArId();

		AddReducePO addReducePO = addReduceDao.get(arId);

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		if (status.contains(addReducePO.getStatus())) {
			throw new FLException(200061, "增减单状态不可操作");
		}

		if (selectionItemDao.countSelectionItem(addReducePO.getOrderId(), addReducePO.getArId()) > 0) {
			throw new FLException(200037, "存在关联选材项");
		}

		List<AddReduceItemPO> addReduceItemPOs = addReduceItemDao.queryAddReduceItem(arId);

		for (AddReduceItemPO addReduceItemPO : addReduceItemPOs) {

			if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {

				QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(addReduceItemPO.getQuotationFunctionArea().getQfaId());
				QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), addReduceItemPO.getQuoteItemId());

				if (quotationFunctionAreaItemPO == null) {
					throw new FLException(200013, "报价项不存在");
				}

				int quotationFunctionAreaItemNum = quotationFunctionAreaItemPO.getNum();
				int addReduceItemNum = addReduceItemPO.getNum();

				quotationFunctionAreaItemPO.setNum(Arith.add(quotationFunctionAreaItemNum, addReduceItemNum));
				quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
			} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_ADD_ITEM_INT) {

				AddReduceItemPO _addReduceItemPO = addReduceItemDao.get(addReduceItemPO.getQuoteItemId());

				if (_addReduceItemPO == null) {
					throw new FLException(140036, "增减项目不存在");
				}

				int _addReduceItemNum = _addReduceItemPO.getNum();
				int addReduceItemNum = addReduceItemPO.getNum();

				_addReduceItemPO.setNum(Arith.add(_addReduceItemNum, addReduceItemNum));
				addReduceItemDao.update(_addReduceItemPO);
			} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT) {

				ExtensionItemPO extensionItemPO = extensionItemDao.get(addReduceItemPO.getQuoteItemId());

				if (extensionItemPO == null) {
					throw new FLException(200027, "扩展项不存在");
				}

				int _extensionItemNum = extensionItemPO.getNum();
				int addReduceItemNum = addReduceItemPO.getNum();

				extensionItemPO.setNum(Arith.add(_extensionItemNum, addReduceItemNum));
				addReduceItemDao.update(extensionItemPO);
			}

			addReduceItemDao.delete(addReduceItemPO);
		}

		decorationPaymentDao.deleteById(addReducePO.getDpId());

		addReduceDao.delete(addReducePO);

		return 0;
	}

	private List<AddReduceVO> handleAddReduce(List<AddReducePO> addReducePOs) throws FLException {

		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();

		for (AddReducePO addReducePO : addReducePOs) {

			AddReduceVO addReduceVO = new AddReduceVO();

			BeanUtil.copyProperties(addReducePO, addReduceVO);

			addReduceVO.setAddReduceItems(handleAddReduceItem(addReducePO.getArId()));

			addReduceVOs.add(addReduceVO);
		}

		return addReduceVOs;
	}

	private List<AddReduceItemVO> handleAddReduceItem(long arid) throws FLException {

		List<AddReduceItemPO> addReduceItemPOs = addReduceItemDao.queryAddReduceItem(arid);
		List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();

		for (AddReduceItemPO addReduceItemPO : addReduceItemPOs) {
			addReduceItemVOs.add(addReduceItemService.ptv(addReduceItemPO));
		}

		return addReduceItemVOs;
	}

	public static void convertAddReduceVOToPOForAdvance(AddReduceVO addReduceVO, AddReducePO addReducePO) {
		addReducePO.setTotal(addReduceVO.getTotal());
		addReducePO.setManageRate(addReduceVO.getManageRate());
		addReducePO.setManagePrice(addReduceVO.getManagePrice());
		addReducePO.setUndisPrice(addReduceVO.getUndisPrice());
		addReducePO.setDisPrice(addReduceVO.getDisPrice());
		addReducePO.setUncalPrice(addReduceVO.getUncalPrice());
		addReducePO.setCalPrice(addReduceVO.getCalPrice());
	}

}