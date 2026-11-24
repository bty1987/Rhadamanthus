/**
 * @File Name		: AdvancePaymentServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2015-9-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.AdvanceReceiptDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.service.AdvancePaymentService;
import com.fanglin.payment.vo.AdvancePaymentVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("advancePaymentService")
@Transactional(readOnly = true)
public class AdvancePaymentServiceImpl implements AdvancePaymentService {

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private AdvanceReceiptDao advanceReceiptDao;

	@Autowired
	private PaymentDao paymentDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public void pageAdvancePayment(Paging paging, List<Filter> filters, int company) throws FLException {

		if (filters.size() == 0) return;

		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<AdvancePaymentPO> advancePaymentPOs = advancePaymentDao.pageAdvancePayment(paging, filters);
		List<AdvancePaymentVO> advancePaymentVOs = new ArrayList<AdvancePaymentVO>();

		for (AdvancePaymentPO advancePaymentPO : advancePaymentPOs) {
			advancePaymentVOs.add(advancePaymentPO.ptv(new AdvancePaymentVO(new DecorationVO())));
		}

		paging.setData(advancePaymentVOs);

	}

	@Override
	public List<Long> queryAdvancePaymentByOrderId(AdvancePaymentVO advancePayment) throws FLException {

		List<Long> advances = new ArrayList<Long>();
		String orderId = advancePayment.getDecoration().getOrderId();

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);

		if (advancePaymentPO != null) {
			advances.add(advancePaymentPO.getBalance());
			advances.add(advancePaymentPO.getProjectBalance());
			advances.add(advancePaymentPO.getMaterialBalance());
			advances.add(advancePaymentPO.getZhenglinBalance());
		} else {
			advances = Arrays.asList(new Long[] { 0L, 0L, 0L, 0L });
		}

		return advances;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addAdvancePayment(AdvancePaymentVO advancePayment) throws FLException {

		String orderId = advancePayment.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		AdvancePaymentPO advancePaymentPO = null;

		advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);

		if (advancePaymentPO != null) {
			throw new FLException(150033, "款项类型已存在");
		}

		advancePaymentPO = new AdvancePaymentPO(decorationPO);

		advancePaymentDao.save(advancePaymentPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAdvancePayment(PaymentVO paymentVO, int company) throws FLException {

		long recharge = 0;

		// 留下为了paymentPO中的customer赋值
		CustomerPO customerPO = customerDao.get(paymentVO.getCustomer().getCid());

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(paymentVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(paymentVO.getOrderId());

		if (advancePaymentPO == null) {

			advancePaymentPO = new AdvancePaymentPO();

			advancePaymentPO.setDecoration(decorationPO);

			advancePaymentDao.save(advancePaymentPO);
		}

		// 计算recharge操作金额
		recharge = PaymentServiceImpl.gatherPayment(paymentVO);

		long balance = 0;
		Short type = paymentVO.getType();
		Short paymentType = paymentVO.getPaymentType();

		// 计算当前款项类型的预付款的余额(快照仅用于提前友好报错, 权威判断走条件UPDATE原子增减, 防并发双发互相覆盖)
		balance = getBalance(advancePaymentPO, paymentType);

		List<Short> types = Arrays.asList(PaymentPO.PAYMENT_TYPE_COLLECTION_INT, PaymentPO.PAYMENT_TYPE_RETURN_INT);

		if (!types.contains(type) && balance < recharge) {
			throw new FLException(150010, "预付款余额不足");
		}

		int affected = types.contains(type)
				? advancePaymentDao.increaseAdvancePayment(advancePaymentPO.getApId(), paymentType, recharge)
				: advancePaymentDao.decreaseAdvancePayment(advancePaymentPO.getApId(), paymentType, recharge);

		if (affected == 0) {
			throw new FLException(150010, "预付款余额不足");
		}

		paymentVO.setRecharge(Math.abs(recharge));
		paymentVO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		// 原生SQL绕一级缓存重读真实新余额(供payment流水快照落账), 不走setBalance(避免脏检查覆盖原子结果)
		long overBalance = advancePaymentDao.queryBalanceRaw(advancePaymentPO.getApId(), paymentType);

		UserPO userPO = userDao.queryUserByUserId(paymentVO.getCollectUser().getUserId());

		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();

		advanceReceiptPO.setTransfer(paymentVO.getTransfer());
		advanceReceiptPO.setComment(paymentVO.getComment());
		advanceReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		advanceReceiptPO.setStatus(AdvanceReceiptPO.STATUS_INIT_INT);
		advanceReceiptPO.setCollecter(userPO);
		advanceReceiptPO.setCollecterName(userPO.getUserName());
		advanceReceiptPO.setConfirmerName("");
		advanceReceiptPO.setRealMoney(0);

		advanceReceiptDao.save(advanceReceiptPO);

		PaymentPO paymentPO = new PaymentPO();

		BeanUtil.copyProperties(paymentVO, paymentPO, Arrays.asList("customer", "collectUser", "company"));

		paymentPO.setBalance(overBalance);
		paymentPO.setCustomer(customerPO);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setCompany(company);
		paymentPO.setCreater(userPO);
		paymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		paymentPO.setUniqueid(paymentVO.getUniqueid());

		paymentDao.save(paymentPO);

		paymentVO.setPid(paymentPO.getPid());

		return 0;
	}

	// 计算当前款项类型的预付款的余额
	public static long getBalance(AdvancePaymentPO advancePaymentPO, Short type) {
		long value = 0;

		if (type == CustomerPO.BALANCE_TYPE_BALANCE_INT) {
			value = advancePaymentPO.getBalance();
		} else if (type == CustomerPO.BALANCE_TYPE_MATERIAL_INT) {
			value = advancePaymentPO.getMaterialBalance();
		} else if (type == CustomerPO.BALANCE_TYPE_PROJECT_INT) {
			value = advancePaymentPO.getProjectBalance();
		} else if (type == CustomerPO.BALANCE_TYPE_ZHENGLIN_INT) {
			value = advancePaymentPO.getZhenglinBalance();
		}

		return value;
	}

	// 设置当前款项类型的预付款(advancePayment)的余额
}
