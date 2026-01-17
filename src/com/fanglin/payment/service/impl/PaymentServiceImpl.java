/**
 * Title: PaymentServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ConstantDao;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.ConstantPO;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.dingding.service.DingTalkMessageService;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.AdvanceReceiptDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.PaymentDO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.payment.service.PaymentService;
import com.fanglin.payment.service.PaytranService;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("paymentService")
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private PaymentDao paymentDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private AdvanceReceiptDao advanceReceiptDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private DecorationAdditionService decorationAdditionService;

	@Autowired
	private PaytranService paytranService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private ConstantDao constantDao;

	@Autowired
	private DingTalkMessageService messageDDService;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

	@Override
	public void pagePayment(Paging paging, List<Filter> filters, PaymentVO payment, int company) throws FLException {

		if (filters.size() == 0) return;

		if (payment != null) payment.filter(filters, company);

		List<PaymentDO> paymentDOs = paymentDao.pagePayment(paging, filters);
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		for (PaymentDO paymentDO : paymentDOs) {
			paymentVOs.add(paymentDO.dtv(new PaymentVO()));
		}

		paging.setData(paymentVOs);

	}

	@Override
	public List<PaymentVO> queryPaymentByOrderId(PaymentVO paymentVO) {

		List<PaymentPO> paymentPOs = paymentDao.queryPaymentByOrderId(paymentVO.getOrderId());
		List<PaymentVO> paymentVOs = new ArrayList<PaymentVO>();

		for (PaymentPO paymentPO : paymentPOs) {
			paymentVOs.add(paymentPO.ptv(new PaymentVO()));
		}

		return paymentVOs;
	}

	@Override
	public PaymentVO queryPaymentByPaymentId(PaymentVO paymentVO) throws FLException {

		PaymentPO paymentPO = paymentDao.get(paymentVO.getPid());

		if (paymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		paymentPO.ptv(paymentVO);

		return paymentVO;
	}

	@Override
	public PaymentVO queryPaymentByArid(PaymentVO paymentVO) throws FLException {

		PaymentDO paymentDO = paymentDao.queryPaymentByReceiptId(paymentVO.getArId());

		if (paymentDO == null) {
			throw new FLException(150003, "款项不存在");
		}

		paymentDO.dtv(paymentVO);

		return paymentVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int collectPayment(PaymentVO paymentVO, String userId, List<Long> ptids) throws FLException {

		long customerId = paymentVO.getCustomer().getCid();

		CustomerPO customerPO = customerDao.get(customerId);

		if (customerPO == null) {
			throw new FLException(230001, "客户信息不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(paymentVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(paymentVO.getOrderId());

		if (advancePaymentPO == null) {
			advancePaymentPO = new AdvancePaymentPO();
			advancePaymentPO.setDecoration(decorationPO);
		}

		long balance = 0;
		long recharge = gatherPayment(paymentVO);
		Short type = paymentVO.getType();
		Short paymentType = paymentVO.getPaymentType();

		// 合同预付款 主材预付款
		List<Short> paymentTypes = Arrays.asList(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT, PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT);

		balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);

		long overBalance = 0;

		if (!paymentTypes.contains(paymentType)) {
			throw new FLException(150028, "预付款类型错误");
		}

		// 如果类型不是收款
		if (PaymentPO.PAYMENT_TYPE_COLLECTION_INT != type) {
			throw new FLException(150016, "预付款操作不正确");
		}

		overBalance = Arith.add(balance, recharge);

		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		// 设置当前款项类型的预付款(advancePayment)的余额
		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status", "type"));

		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setConfirmerName("");

		PaymentPO paymentPO = null;

		if (paymentVO.getPid() != null) {
			paymentPO = paymentDao.get(paymentVO.getPid());
		} else {
			paymentPO = new PaymentPO();
		}

		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser", "company"));

		paymentPO.setBalance(overBalance);
		paymentPO.setCustomer(customerPO);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setCompany(decorationPO.getCompany());
		paymentPO.setCreater(user);
		paymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		paymentPO.setUniqueid(paymentVO.getUniqueid());

		advancePaymentDao.saveOrUpdate(advancePaymentPO);
		advanceReceiptDao.save(advanceReceiptPO);
		paymentDao.saveOrUpdate(paymentPO);

		paymentVO.setPid(paymentPO.getPid());

		if (PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT == paymentType) {

			if (decorationPO.getStatus() == DecorationPO.STATUS_INIT_INT) {
				decorationPO.setStatus(DecorationPO.STATUS_DEPOSIT_INT);
				decorationPO.setDepositTime(DateUtil.getDateToTimestamp(new Date()));
			}

			decorationDao.update(decorationPO);
		}

		String advanceType = "合同";

		if (paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT) {
			decorationService.sendMessage(paymentPO.getOrderId(), "装修单", String.format("合同预付款金额%.3f元", Arith.div(paymentPO.getRecharge(), 1000.0)), String.format("pages/payment/receipt/receipt?orderId=%s&rid=%s&paymentType=0", paymentPO.getOrderId(), paymentPO.getPid()));
		} else if (paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT) {

			decorationAdditionService.updateDecorationForSaleScale(new DecorationVO(decorationPO.getOrderId())); // 更新装修单上的销售比例

			decorationService.sendMessage(paymentPO.getOrderId(), "主材单", String.format("主材预付款金额%.3f元", Arith.div(paymentPO.getRecharge(), 1000.0)), String.format("pages/payment/receipt/receipt?orderId=%s&rid=%s&paymentType=0", paymentPO.getOrderId(), paymentPO.getPid()));

			advanceType = "主材";
		}

		// 更新销售点信息
		if (ptids != null && ptids.size() > 0) {
			paytranService.updatePaytran(ptids, advanceReceiptPO.getArId(), PaytranPO.STATUS_USED_INT, PaytranPO.TYPE_ADVANCE_INT);
		}

		// 发送群通知
		SystemConfigPO key = systemConfigDao.querySystemConfig("MESSAGE_DING_GROUP_ADVANCE_PAYMENT", decorationPO.getCompany());
		ConstantPO status = constantDao.queryConstant("decoration", "decoration", "status", String.valueOf(decorationPO.getStatus()));

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(decorationPO.getProjectStatus());

		String projectStatus = constructionNodePO == null ? "" : constructionNodePO.getName();

		UserPO designer = decorationPO.getDesigner();

		if (key != null) {
			messageDDService.sendMessage(key.getValue(), String.format("装修单: %s, 楼盘地址: %s%s, 设计师工号: %s, 设计师姓名: %s, 状态: %s, 工程状态: %s, %s预付款收款, 金额: %s .", decorationPO.getOrderId(), decorationPO.getHouse().getVillage().getName(), decorationPO.getHouse().getHouseNumber(), designer.getUserId(), designer.getCurrentName(), status.getValue(), projectStatus, advanceType, Arith.div(paymentPO.getRecharge(), 1000.0)));
		}

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(paymentVO.getOrderId(), "collectPayment", "{\"orderId\":\"" + paymentVO.getOrderId() + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmPayment(List<Long> paymentIds, String currentUserId) throws FLException {

		for (Long paymentId : paymentIds) {
			PaymentPO paymentPO = paymentDao.get(paymentId);
			AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();

			if (paymentPO == null || PaymentPO.PAYMENT_STATUS_CONFIRMED_INT == paymentPO.getStatus()) { // 如果是已撤销或已确认不做动作
				continue;
			}

			advanceReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
			UserPO user = userDao.queryUserByUserId(currentUserId);
			advanceReceiptPO.setConfirmer(user);
			advanceReceiptPO.setConfirmerName(user.getUserName());
			paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_CONFIRMED_INT);

			if (advanceReceiptPO.getStatus() != AdvanceReceiptPO.STATUS_CONFIRM_INT) {
				advanceReceiptPO.setStatus(AdvanceReceiptPO.STATUS_CONFIRM_INT);
			}

			advanceReceiptDao.update(advanceReceiptPO);
			paymentDao.update(paymentPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int withdrawPayment(PaymentVO paymentVO, String userId) throws FLException {

		long customerId = paymentVO.getCustomer().getCid();

		CustomerPO customerPO = customerDao.get(customerId);

		if (customerPO == null) {
			throw new FLException(230001, "客户信息不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(paymentVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(paymentVO.getOrderId());

		if (advancePaymentPO == null) {
			throw new FLException(150010, "预付款余额不足");
		}

		long balance = 0;
		long recharge = gatherPayment(paymentVO);
		Short paymentType = paymentVO.getPaymentType();

		balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);

		long overBalance = 0;

		if (balance < recharge) {
			throw new FLException(150010, "预付款余额不足");
		}

		overBalance = Arith.sub(balance, recharge);

		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status", "type"));

		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setConfirmerName("");
		advanceReceiptPO.setRealMoney(paymentVO.getRealMoney());

		advanceReceiptDao.save(advanceReceiptPO);

		PaymentPO paymentPO = new PaymentPO();
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser", "type", "company"));

		paymentPO.setCustomer(customerPO);
		paymentPO.setBalance(overBalance);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setType(PaymentPO.PAYMENT_TYPE_EXTRACT_INT);
		paymentPO.setCompany(decorationPO.getCompany());
		paymentPO.setCreater(user);
		paymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		paymentPO.setUniqueid(paymentVO.getUniqueid());

		paymentDao.save(paymentPO);
		advancePaymentDao.update(advancePaymentPO);

		paymentVO.setPid(paymentPO.getPid());

		String name = "";
		if (paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT) {
			name = "合同预付款";
		} else if (paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT) {
			name = "主材预付款";

			decorationAdditionService.updateDecorationForSaleScale(new DecorationVO(decorationPO.getOrderId())); // 更新装修单上的销售比例
		}

		decorationService.sendMessage(paymentPO.getOrderId(), name, String.format("%s退款金额%.3f元", name, Arith.div(paymentPO.getRecharge(), 1000.0)), String.format("pages/payment/receipt/receipt?orderId=%s&rid=%s&paymentType=0", paymentPO.getOrderId(), paymentPO.getPid()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int payPayment(PaymentVO paymentVO, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(paymentVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		long customerId = decorationPO.getCustomer().getCid();

		CustomerPO customerPO = customerDao.get(customerId);

		if (customerPO == null) {
			throw new FLException(230001, "客户信息不存在");
		}

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(paymentVO.getOrderId());

		if (advancePaymentPO == null) {
			throw new FLException(150010, "预付款余额不足");
		}

		long balance = 0;
		long recharge = gatherPayment(paymentVO);
		Short paymentType = paymentVO.getPaymentType();

		balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);

		long overBalance = 0;

		if (balance < recharge) {
			throw new FLException(150010, "预付款余额不足");
		}

		overBalance = Arith.sub(balance, recharge);

		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status"));

		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setConfirmerName("");
		advanceReceiptPO.setRealMoney(0);

		advanceReceiptDao.save(advanceReceiptPO);

		PaymentPO paymentPO = new PaymentPO();
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser", "type", "company"));

		paymentPO.setCustomer(customerPO);
		paymentPO.setBalance(overBalance);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_INT);
		paymentPO.setCompany(decorationPO.getCompany());
		paymentPO.setCreater(user);
		paymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		paymentPO.setUniqueid(paymentVO.getUniqueid());

		paymentDao.save(paymentPO);
		advancePaymentDao.update(advancePaymentPO);

		paymentVO.setPid(paymentPO.getPid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int returnPayment(PaymentVO paymentVO, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(paymentVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		long customerId = decorationPO.getCustomer().getCid();

		CustomerPO customerPO = customerDao.get(customerId);

		if (customerPO == null) {
			throw new FLException(230001, "客户信息不存在");
		}

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(paymentVO.getOrderId());

		if (advancePaymentPO == null) {
			advancePaymentPO = new AdvancePaymentPO(decorationPO);
			advancePaymentDao.save(advancePaymentPO);
		}

		Short paymentType = paymentVO.getPaymentType();

		long balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);
		long recharge = gatherPayment(paymentVO);

		long overBalance = Arith.add(balance, recharge);

		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);

		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		BeanUtil.copyProperties(paymentVO, advanceReceiptPO, Arrays.asList("collectUser", "confirmUser", "status"));

		UserPO user = userDao.queryUserByUserId(userId);
		advanceReceiptPO.setCollecter(user);
		advanceReceiptPO.setCollecterName(user.getUserName());
		advanceReceiptPO.setConfirmerName("");
		advanceReceiptPO.setRealMoney(0);

		advanceReceiptDao.save(advanceReceiptPO);

		PaymentPO paymentPO = new PaymentPO();
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser", "type", "company"));

		paymentPO.setCustomer(customerPO);
		paymentPO.setBalance(overBalance);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setType(PaymentPO.PAYMENT_TYPE_RETURN_INT);
		paymentPO.setCompany(decorationPO.getCompany());
		paymentPO.setCreater(user);
		paymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		paymentPO.setUniqueid(paymentVO.getUniqueid());

		paymentDao.save(paymentPO);
		advancePaymentDao.update(advancePaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addPayment(PaymentVO paymentVO, String userId) throws FLException {

		String orderId = paymentVO.getOrderId();
		short paymentType = paymentVO.getPaymentType();
		long recharge = paymentVO.getRecharge();

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		if (advancePaymentPO == null) {
			advancePaymentPO = new AdvancePaymentPO();
			advancePaymentPO.setDecoration(decorationPO);
		}

		long oldBalance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);
		long balance = Arith.add(oldBalance, recharge);

		PaymentPO paymentPO = new PaymentPO();
		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("advanceReceipt", "customer", "creater", "company"));
		paymentPO.setCustomer(decorationPO.getCustomer());
		paymentPO.setCreater(creater);
		paymentPO.setType(PaymentPO.PAYMENT_TYPE_COLLECTION_INT);
		paymentPO.setBalance(balance);
		paymentPO.setUniqueid(String.valueOf(new Date().getTime()));
		paymentPO.setCompany(decorationPO.getCompany());

		paymentDao.save(paymentPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePayment(PaymentVO paymentVO) throws FLException {

		long realMoney = 0;

		PaymentPO paymentPO = paymentDao.get(paymentVO.getPid());

		if (paymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		AdvanceReceiptPO advanceReceiptPO = paymentPO.getAdvanceReceipt();

		if (PaymentPO.PAYMENT_STATUS_PAID_INT != paymentPO.getStatus()) {
			throw new FLException(150036, "款项状态不可操作");
		}

		Long cash = paymentVO.getCash();
		Long bank = paymentVO.getBank();
		Long checkv = paymentVO.getCheckv();

		if (cash != null && cash != 0) {
			advanceReceiptPO.setCash(paymentVO.getCash());
			advanceReceiptPO.setCashInfo(paymentVO.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		} else {
			advanceReceiptPO.setCash(0);
			advanceReceiptPO.setCashInfo("");
		}

		if (checkv != null && checkv != 0) {
			advanceReceiptPO.setCheckv(checkv);
			advanceReceiptPO.setCheckvBank(paymentVO.getCheckvBank());
			realMoney = Arith.add(checkv, realMoney);
		} else {
			advanceReceiptPO.setCheckv(0);
			advanceReceiptPO.setCheckvBank("");
		}

		if (bank != null && bank != 0) {
			realMoney = Arith.add(bank, realMoney);
		}

		if (paymentPO.getRecharge() != realMoney) {
			throw new FLException(150025, "款项金额不正确");
		}

		advanceReceiptDao.update(advanceReceiptPO);

		return 0;
	}

	@Override
	public void sendPayment(PaymentVO paymentVO) throws FLException {

		PaymentPO paymentPO = paymentDao.get(paymentVO.getPid());

		if (paymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		String orderId = paymentPO.getOrderId();

		short atttype = paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT ? PaytranPO.ATTTYPE_MATERIAL_INT : PaytranPO.ATTTYPE_DECORATION_INT;

		decorationService.sendMessage(orderId, "装修收款", String.format("装修待付款金额%.3f元", Arith.div(paymentPO.getRecharge(), 1000.0)), String.format("pages/payment/redirect/redirect?orderId=%s&pid=%s&paymentType=0&atttype=%s", paymentPO.getOrderId(), paymentPO.getPid(), atttype));

	}

	// 计算各个付款方式总共的操作金额&实收金额
	public static long gatherPayment(PaymentVO paymentVO) {

		long recharge = 0;

		Long cash = paymentVO.getCash();
		Long bank = paymentVO.getBank();
		Long checkv = paymentVO.getCheckv();
		Long transfer = paymentVO.getTransfer();

		if (cash != null) {
			recharge = Arith.add(cash, recharge);
		}

		if (bank != null) {
			recharge = Arith.add(bank, recharge);
		}

		if (checkv != null) {
			recharge = Arith.add(checkv, recharge);
		}

		if (transfer != null) {
			recharge = Arith.add(transfer, recharge);
		}

		return recharge;
	}

	public static PaymentVO advancePaymentBalance(String paymentName, Long advance, Short _paymentType, Long customerAdvance, String userId, Long customerId, AdvancePaymentPO advancePaymentPO, String orderId) throws FLException {

		PaymentVO paymentVO = new PaymentVO();

		if (customerAdvance < advance) {
			throw new FLException(150010, "预付款余额不足");
		} else {
			paymentVO.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_INT); // 付款
			paymentVO.setTransfer(advance);

			String newPaymentType = "";
			switch (_paymentType) {
				case 0:
					newPaymentType = "合同预付款";
					break;
				case 1:
					newPaymentType = "工程预付款";
					break;
				case 2:
					newPaymentType = "主材预付款";
					break;
				case 3:
					newPaymentType = "正林预付款";
					break;
			}

			if (paymentName.equals(PaymentPO.PAYMENT_DECORETION_PAYMENTNAME_STR)) {
				paymentVO.setComment(String.format("装修订单号:%s,付款类型:%s", orderId, newPaymentType));
			} else if (paymentName.equals(PaymentPO.PAYMENT_MATERIAL_PAYMENTNAME_STR)) {
				paymentVO.setComment(String.format("主材订单号:%s,付款类型:%s", orderId, newPaymentType));
			}

			paymentVO.setCollectUser(new UserBaseVO(userId));
			paymentVO.setCustomer(new CustomerVO(customerId));
			paymentVO.setPaymentType(_paymentType);
			paymentVO.setOrderId(orderId);
			paymentVO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);

			if (PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT == _paymentType) {
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getBalance(), advance));
			} else if (PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_INT == _paymentType) {
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getProjectBalance(), advance));
			} else if (PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT == _paymentType) {
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getMaterialBalance(), advance));
			} else if (PaymentPO.PAYMENT_PAYMENTTYPE_ZATERIAL_INT == _paymentType) {
				paymentVO.setBalance(Arith.sub(advancePaymentPO.getZhenglinBalance(), advance));
			}
		}

		return paymentVO;
	}
}
