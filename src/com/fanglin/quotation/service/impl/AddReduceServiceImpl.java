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
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
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
import com.fanglin.quotation.dao.NormoodItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.AddReduceDO;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.NormoodItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.quotation.service.AddReduceService;
import com.fanglin.quotation.service.NormtionService;
import com.fanglin.quotation.vo.AddReduceItemVO;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.quotation.vo.NormtionVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
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
	private QuotationDao quotationDao;

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

	@Autowired
	private NormtionService normtionService;

	@Autowired
	private NormoodItemDao normoodItemDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Override
	public void pageAddReduce(Paging paging, List<Filter> filters, AddReduceVO addReduceVO, List<Short> statuses, Integer company) throws FLException {

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

		if (addReduceVO != null && addReduceVO.getAtttype() != null) {
			filters.add(new Filter(AddReducePO.COLUMN_ATTTYPE_STR, String.valueOf(addReduceVO.getAtttype()), "eq"));
		}

		if (statuses != null) {
			filters.add(new Filter("statuses", statuses, "eq", Filter.RANGE_TYPE_SHORT_INT));
		}

		if (filters.size() == 0) return;

		List<AddReduceDO> addReduceDOs = addReduceDao.pageAddReduce(paging, filters, company);
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();

		for (AddReduceDO addReduceDO : addReduceDOs) {

			addReduceVO = new AddReduceVO(new DecorationVO(), new UserBaseVO(), new ConstructionNodeVO());

			addReduceVO.getDecoration().setSupervisor(new UserBaseVO());

			BeanUtil.copyPropertie(addReduceDO, addReduceVO, Arrays.asList("decoration", "creater", "constructionNode"));

			BeanUtil.copyProperties(addReduceDO.getCreater(), addReduceVO.getCreater(), Arrays.asList("duty", "dept", "role"));

			BeanUtil.copyProperties(addReduceDO.getConstructionNode(), addReduceVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

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

		BeanUtil.copyProperties(addReducePO, addReduceVO, Arrays.asList("creater", "constructionNode"));

		addReduceVO.setAddReduceItems(handleAddReduceItem(addReducePO.getArId()));

		return addReduceVO;
	}

	@Override
	public List<AddReduceVO> queryAddReduceByDpid(AddReduceVO addReduceVO) throws FLException {

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduce(addReduceVO.getDpId());
		List<AddReduceVO> addReduceVOs = handleAddReduce(addReducePOs);

		return addReduceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int sendAddReduce(AddReduceVO addReduceVO, List<AddReduceVO> addReduceVOs) throws FLException {

		String orderId = addReduceVO.getOrderId();

		System.out.println(String.format("pages/quotation/addReduce/addReduce?orderId=%s&arids=%s", orderId, addReduceVO.getContent()));

		decorationService.sendMessage(orderId, "装修单", "请您及时查收点确认增减项, 如未付款请付款。", String.format("pages/quotation/addReduce/addReduce?orderId=%s&arids=%s", orderId, addReduceVO.getContent()));

		for (AddReduceVO addReduce : addReduceVOs) {

			AddReducePO addReducePO = addReduceDao.get(addReduce.getArId());

			addReducePO.setSendTime(DateUtil.getDateToTimestamp(new Date()));

			addReduceDao.update(addReducePO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAddReduce(AddReduceVO addReduceVO, String userId) throws FLException {

		AddReducePO addReducePO = new AddReducePO();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(addReduceVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (addReduceVO.getType() == AddReducePO.TYPE_REDUCE_INT && Arrays.asList(DecorationPO.STATUS_FINAL_INT).contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(decorationPO.getProjectStatus());

		BeanUtil.copyProperties(addReduceVO, addReducePO, Arrays.asList("arId", "creater", "constructionNode"));

		addReducePO.setSchedule(decorationPO.getStatus());
		addReducePO.setConstructionNode(constructionNodePO);

		addReducePO.setCreater(userDao.queryUserByUserId(userId));
		addReducePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		addReducePO.setStatus(AddReducePO.STATUS_UNSUBMIT_INT);

		addReducePO.setTotal(0);
		addReducePO.setManageRate(0);
		addReducePO.setManagePrice(0);
		addReducePO.setTaxRate(0);
		addReducePO.setTaxPrice(0);
		addReducePO.setUndisPrice(0);
		addReducePO.setDisPrice(0);
		addReducePO.setUncalPrice(0);
		addReducePO.setCalPrice(0);
		addReducePO.setConsPrice(0);
		addReducePO.setComsPrice(0);

		addReducePO.setAccountDiscount(addReducePO.getDiscount());
		addReducePO.setAccountManageDiscount(addReducePO.getManageDiscount());
		addReducePO.setAccountTaxDiscount(addReducePO.getTaxDiscount());

		if (decorationPO.getType() == DecorationPO.TYPE_HOLONOMY_INT) {
			addReducePO.setDiscount(decorationPO.getDiscount());
		}

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
		addReducePO.setConsPrice(addReduceVO.getConsPrice());
		addReducePO.setComsPrice(addReduceVO.getComsPrice());

		addReduceDao.update(addReducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAddReduceForAdvance(AddReduceVO addReduceVO) throws FLException {

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		if (addReducePO.getStatus() != AddReducePO.STATUS_UNSUBMIT_INT) {
			throw new FLException(200061, "增减单状态不可操作");
		}

		addReducePO.setDiscount(addReduceVO.getDiscount());
		addReducePO.setManagePrice(addReduceVO.getManagePrice());
		addReducePO.setManageRate(addReduceVO.getManageRate());
		addReducePO.setManageDiscount(addReduceVO.getManageDiscount());
		addReducePO.setTaxPrice(addReduceVO.getTaxPrice());
		addReducePO.setTaxRate(addReduceVO.getTaxRate());
		addReducePO.setTaxDiscount(addReduceVO.getTaxDiscount());
		addReducePO.setUndisPrice(addReduceVO.getUndisPrice());
		addReducePO.setDisPrice(addReduceVO.getDisPrice());
		addReducePO.setUncalPrice(addReduceVO.getUncalPrice());
		addReducePO.setCalPrice(addReduceVO.getCalPrice());
		addReducePO.setConsPrice(addReduceVO.getConsPrice());
		addReducePO.setComsPrice(addReduceVO.getComsPrice());
		addReducePO.setTotal(addReduceVO.getTotal());

		addReducePO.setAccountDiscount(addReduceVO.getDiscount());
		addReducePO.setAccountManageDiscount(addReduceVO.getManageDiscount());
		addReducePO.setAccountTaxDiscount(addReduceVO.getTaxDiscount());

		addReduceDao.update(addReducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAddReduceForAccount(AddReduceVO addReduceVO) throws FLException {

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(addReducePO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (Arrays.asList(DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_TERMINATION_INT, DecorationPO.STATUS_FINAL_INT, DecorationPO.STATUS_COMPLETED_INT).contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		addReducePO.setAccountDiscount(addReduceVO.getAccountDiscount());
		addReducePO.setAccountManageDiscount(addReduceVO.getAccountManageDiscount());
		addReducePO.setAccountTaxDiscount(addReduceVO.getAccountTaxDiscount());

		addReduceDao.update(addReducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitAddReduce(AddReduceVO addReduceVO, List<AddReduceVO> addReduceVOs, String userId) throws FLException {

		String orderId = addReduceVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		List<AddReducePO> addReducePOs = new ArrayList<AddReducePO>();

		long total = 0l;

		for (AddReduceVO addReduce : addReduceVOs) {

			AddReducePO addReducePO = addReduceDao.get(addReduce.getArId());

			if (addReducePO == null) {
				throw new FLException(200060, "增减单不存在");
			}

			if (addReducePO.getStatus() != AddReducePO.STATUS_UNSUBMIT_INT) {
				throw new FLException(200061, "增减单状态不可操作");
			}

			if (addReducePO.getPaytype() != AddReducePO.PAYTYPE_PAY_INT) {
				throw new FLException(200062, "增减单类型不可操作");
			}

			if (addReducePO.getDpId() != 0) {
				throw new FLException(150002, "款项已存在");
			}

			if (!addReducePO.getOrderId().equals(orderId)) {
				throw new FLException(200061, "增减单状态不可操作");
			}

			total = addReducePO.getType() == AddReducePO.TYPE_ADD_INT ? Arith.add(total, addReducePO.getTotal()) : Arith.sub(total, addReducePO.getTotal());

			addReducePOs.add(addReducePO);
		}

		DecorationPaymentPO decorationPaymentPO = new DecorationPaymentPO();

		if (total < 0) {
			decorationPaymentPO.setReferMoney(Arith.mul(Arith.div(total, 1000000), -1000000));

			decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
			decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_ADD_REDUCE_INT);

			decorationPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR);
		} else {
			decorationPaymentPO.setReferMoney(Arith.mul(Arith.div(total, 1000000), 1000000));

			decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
			decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_ADD_REDUCE_INT);

			decorationPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_ADD_STR);
		}

		decorationPaymentPO.setDecoration(decorationPO);

		decorationPaymentPO.setCreater(userDao.queryUserByUserId(userId));
		decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
		decorationPaymentPO.setCompany(decorationPO.getCompany());

		decorationPaymentDao.save(decorationPaymentPO);

		for (AddReducePO addReducePO : addReducePOs) {

			addReducePO.setStatus(AddReducePO.STATUS_SUBMIT_INT);
			addReducePO.setDpId(decorationPaymentPO.getDpid());

			addReduceDao.update(addReducePO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelAddReduce(AddReduceVO addReduceVO) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(addReduceVO.getDpId());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		if (decorationPaymentPO.getPaymentStatus() != DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT) {
			throw new FLException(150019, "款项不能撤销");
		}

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduce(addReduceVO.getDpId());

		for (AddReducePO addReducePO : addReducePOs) {

			if (addReducePO == null) {
				throw new FLException(200060, "增减单不存在");
			}

			if (addReducePO.getStatus() != AddReducePO.STATUS_SUBMIT_INT) {
				throw new FLException(200061, "增减单状态不可操作");
			}

			if (decorationPaymentDao.get(addReducePO.getDpId()) == null) {
				throw new FLException(150003, "款项不存在");
			}

			addReducePO.setStatus(AddReducePO.STATUS_UNSUBMIT_INT);
			addReducePO.setDpId(0);

			addReduceDao.update(addReducePO);
		}

		decorationPaymentDao.delete(decorationPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unpayAddReduce(AddReduceVO addReduceVO, String userId) throws FLException {

		long arId = addReduceVO.getArId();

		AddReducePO addReducePO = addReduceDao.get(arId);

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		if (addReducePO.getStatus() != AddReducePO.STATUS_UNSUBMIT_INT) {
			throw new FLException(200061, "增减单状态不可操作");
		}

		if (AddReducePO.PAYTYPE_PAY_INT != addReducePO.getPaytype()) {
			throw new FLException(200062, "增减单类型不可操作");
		}

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(addReducePO.getDpId());

		if (decorationPaymentPO != null && decorationPaymentPO.getPaymentStatus() != DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT) {
			throw new FLException(200061, "增减单状态不可操作");
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(addReducePO.getOrderId());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		decorationPaymentDao.deleteById(addReducePO.getDpId());

		addReducePO.setPaytype(addReduceVO.getPaytype());

		addReduceDao.update(addReducePO);

		normtionService.makeNormtion(new NormtionVO(addReducePO.getOrderId(), quotationPO.getQid()), new AddReduceVO(addReducePO.getArId()), addReducePO.getSchedule(), userId);

		// 1: 下拨(增项) , 2: 特批(增项) , 3: 不退(减项)

		if (addReduceVO.getPaytype() == AddReducePO.PAYTYPE_COM_INT) {
			selectionItemDao.updateSelectionItem(addReducePO.getArId(), SelectionItemPO.TYPE_ADDITEM_SHORT, SelectionItemPO.TYPE_ADDITEM_DOWN_SHORT);
		}

		if (addReduceVO.getPaytype() == AddReducePO.PAYTYPE_ARO_INT) {
			selectionItemDao.updateSelectionItem(addReducePO.getArId(), SelectionItemPO.TYPE_ADDITEM_SHORT, SelectionItemPO.TYPE_ADDITEM_ADVANCE_SHORT);
		}

		if (addReduceVO.getPaytype() == AddReducePO.PAYTYPE_REF_INT) {
			selectionItemDao.updateSelectionItem(addReducePO.getArId(), SelectionItemPO.TYPE_MINUSITEM_SHORT, SelectionItemPO.TYPE_MINUSITEM_UNREF_SHORT);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirmAddReduce(DecorationVO decorationVO, List<AddReduceVO> addReduceVOs, String securityCode, String verifyCode) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationVO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		if (decorationVO.getCustomer().getPhone() != null && !decorationPO.getCustomer().getPhone().equals(FormatUtil.encodePhone(decorationVO.getCustomer().getPhone()))) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cecorationVO.setOrderId(orderId);
		cecorationVO.setUnionId(decorationVO.getCustomer().getNo());

		if (decorationVO.getCustomer().getNo() != null && decorationService.queryDecoration(cecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

		for (AddReduceVO addReduce : addReduceVOs) {

			AddReducePO addReducePO = addReduceDao.get(addReduce.getArId());

			if (addReducePO == null) continue;

			addReducePO.setIsAffirm(AddReducePO.ISAFFIRM_CONFIRMED_INT);
			addReducePO.setAffirmTime(DateUtil.getDateToTimestamp(new Date()));

			addReduceDao.update(addReducePO);
		}

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

		addReducePO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));

		addReduceDao.update(addReducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAddReduceByArId(AddReduceVO addReduceVO) throws FLException {

		long arId = addReduceVO.getArId();

		AddReducePO addReducePO = addReduceDao.get(arId);

		if (addReducePO == null) {
			throw new FLException(200060, "增减单不存在");
		}

		if (addReducePO.getStatus() != AddReducePO.STATUS_UNSUBMIT_INT) {
			throw new FLException(200061, "增减单状态不可操作");
		}

		if (selectionItemDao.countSelectionItem(addReducePO.getOrderId(), addReducePO.getArId()) > 0) {
			throw new FLException(200037, "存在关联选材项");
		}

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(addReducePO.getDpId());

		if (decorationPaymentPO != null && decorationPaymentPO.getPaymentStatus() != DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT) {
			throw new FLException(150019, "款项不能撤销");
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(addReducePO.getOrderId());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
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

		if (decorationPaymentPO != null) {
			decorationPaymentDao.delete(decorationPaymentPO);
		}

		normoodItemDao.deleteNormoodItem(quotationPO.getQid(), arId, NormoodItemPO.TYPE_ADDCUT_INT);

		addReduceDao.delete(addReducePO);

		return 0;
	}

	private List<AddReduceVO> handleAddReduce(List<AddReducePO> addReducePOs) throws FLException {

		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();

		for (AddReducePO addReducePO : addReducePOs) {

			AddReduceVO addReduceVO = new AddReduceVO();

			BeanUtil.copyProperties(addReducePO, addReduceVO, Arrays.asList("creater", "constructionNode"));

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

}