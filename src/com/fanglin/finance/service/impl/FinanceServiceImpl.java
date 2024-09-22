/**
 * @File Name		: DecorationFinanceServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2015-12-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ReceiptTypeDao;
import com.fanglin.data.po.ReceiptTypePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.finance.dao.AccountDao;
import com.fanglin.finance.dao.AssistantDao;
import com.fanglin.finance.dao.SubjectBalanceUpinfoDao;
import com.fanglin.finance.dao.VoucherDao;
import com.fanglin.finance.po.AccountPO;
import com.fanglin.finance.po.AssistantPO;
import com.fanglin.finance.po.SubjectBalanceUpinfoPO;
import com.fanglin.finance.po.SubjectPO;
import com.fanglin.finance.po.VoucherPO;
import com.fanglin.finance.service.FinanceService;
import com.fanglin.finance.vo.AccountVO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.payment.po.MaterialReceiptPO;
import com.fanglin.payment.po.PaymentDO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.SubjectInfoUtil;
import com.fanglin.utils.SystemConfig;

@Service("decorationFinanceService")
@Transactional(readOnly = true)
public class FinanceServiceImpl implements FinanceService {

	@Autowired
	private CountingService countingService;

	@Autowired
	private VoucherDao voucherDao;

	@Autowired
	private AccountDao accountDao;

	@Autowired
	private AssistantDao assistantDao;

	@Autowired
	private SubjectBalanceUpinfoDao subjectBalanceUpinfoDao;

	@Autowired
	private PaymentDao paymentDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private MaterialPaymentDao materialPaymentDao;

	@Autowired
	private ReceiptTypeDao receiptTypeDao;

	@Override
	public int buildAdvanceFinance(DecorationPO decorationPO, AdvanceReceiptPO advanceReceiptPO, UserPO poster) throws FLException {

		boolean relat = true;
		String word = null;
		String abstracts = null;

		int subAccountId = 1;
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		String currentPeriod = DateUtil.current("yyyyMM");

		Map<String, SubjectPO> subjectPOs = SubjectInfoUtil.getSubjectInfos();
		Map<String, List<Long>> subjectBalances = new HashMap<String, List<Long>>();

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		int company = decorationPO.getCompany();

		String orderId = decorationPO.getOrderId();
		String orderAddr = decorationPO.getHouse().getVillage().getName() + " " + decorationPO.getHouse().getHouseNumber();

		if (advanceReceiptPO.getType() == DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT) {
			relat = false;
		} else {
			relat = true;
		}

		VoucherPO voucherPO = new VoucherPO();

		voucherPO.setCreateTime(currentTime);
		voucherPO.setPeriod(currentPeriod);

		if (relat) {
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CC_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CC_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));

			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CC_STR);

			word = VoucherPO.PERIOD_CC_STR;
			abstracts = String.format("收订单%s的预付款", orderId);
		} else {
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CR_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CR_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));

			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CR_STR);

			word = VoucherPO.PERIOD_CR_STR;
			abstracts = String.format("退订单%s的预付款", orderId);
		}

		voucherPO.setOriginator(advanceReceiptPO.getCollecter());
		voucherPO.setPostor(poster);
		voucherPO.setAttachmentNum(0);
		voucherPO.setStatus(VoucherPO.STATUS_TYPE_FORMAL_INT);
		voucherPO.setComment("");
		voucherPO.setReference("");

		voucherPO = voucherDao.merge(voucherPO);

		long cash = advanceReceiptPO.getCash();
		long bank = advanceReceiptPO.getBank();
		long checkv = advanceReceiptPO.getCheckv();
		long installment = advanceReceiptPO.getInstallment();
		long accounts = advanceReceiptPO.getAccounts();

		AccountVO accountVO = new AccountVO(word, abstracts, currentTime, currentPeriod, advanceReceiptPO.getCollectTime());

		PaymentDO paymentDO = paymentDao.queryPaymentByReceiptId(advanceReceiptPO.getArId());

		AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);

		String sid = null;
		Short paymentType = paymentDO.getPaymentType();

		if (PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT == paymentType) {
			sid = SystemConfig.getString("balanceSubject");
		} else if (PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_INT == paymentType) {
			sid = SystemConfig.getString("projectBalanceSubject");
		} else if (PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT == paymentType) {
			sid = SystemConfig.getString("materialBalanceSubject");
		} else if (PaymentPO.PAYMENT_PAYMENTTYPE_ZATERIAL_INT == paymentType) {
			sid = SystemConfig.getString("zaterialBalanceSubject");
		}

		accountVO.setSaId(subAccountId++);

		convertPaymentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, sid, paymentDO.getRecharge());

		if (cash != 0) {
			accountVO.setSaId(subAccountId++);

			convertCashToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, advanceReceiptPO.getCashInfo(), cash, company);
		}

		if (bank != 0) {
			String[] bankInfos = advanceReceiptPO.getBankInfo().split("#");

			for (int i = 1; i < bankInfos.length; i++) {

				String[] info = bankInfos[i].split("\\|");

				accountVO.setSaId(subAccountId++);

				int _coupon = (int) Arith.mul(Float.valueOf(info[1]), 1000f);

				convertBankToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, info[0], _coupon, company);
			}
		}

		if (checkv != 0) {
			accountVO.setSaId(subAccountId++);

			convertCheckvToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, advanceReceiptPO.getCheckvBank(), checkv, company);
		}

		if (installment != 0) {
			accountVO.setSaId(subAccountId++);

			convertInstallmentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, advanceReceiptPO.getInstallmentBank(), installment, company);
		}

		if (accounts != 0) {
			accountVO.setSaId(subAccountId++);

			convertAccountsToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, advanceReceiptPO.getAccountsBank(), accounts, company);
		}

		handleSubjectBalance(subjectBalances);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int buildDecorationFinance(DecorationPO decorationPO, DecorationReceiptPO decorationReceiptPO, UserPO poster) throws FLException {

		boolean relat = true;
		String word = null;
		String abstracts = null;

		int subAccountId = 1;
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		String currentPeriod = DateUtil.current("yyyyMM");

		Map<String, SubjectPO> subjectPOs = SubjectInfoUtil.getSubjectInfos();
		Map<String, List<Long>> subjectBalances = new HashMap<String, List<Long>>();

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		int company = decorationPO.getCompany();

		String orderId = decorationPO.getOrderId();
		String orderAddr = decorationPO.getHouse().getVillage().getName() + " " + decorationPO.getHouse().getHouseNumber();
		UserPO designer = decorationPO.getDesigner();

		if (decorationReceiptPO.getType() == DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT) {
			relat = false;
		} else {
			relat = true;
		}

		VoucherPO voucherPO = new VoucherPO();

		voucherPO.setCreateTime(currentTime);
		voucherPO.setPeriod(currentPeriod);

		if (relat) {
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CC_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CC_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));

			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CC_STR);

			word = VoucherPO.PERIOD_CC_STR;
			abstracts = String.format("收订单%s的工程款", orderId);
		} else {
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CR_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CR_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));

			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CR_STR);

			word = VoucherPO.PERIOD_CR_STR;
			abstracts = String.format("退订单%s的工程款", orderId);
		}

		voucherPO.setOriginator(decorationReceiptPO.getCollecter());
		voucherPO.setPostor(poster);
		voucherPO.setAttachmentNum(0);
		voucherPO.setStatus(VoucherPO.STATUS_TYPE_FORMAL_INT);
		voucherPO.setComment("");
		voucherPO.setReference("");

		voucherPO = voucherDao.merge(voucherPO);

		long cash = decorationReceiptPO.getCash();
		long bank = decorationReceiptPO.getBank();
		long checkv = decorationReceiptPO.getCheckv();
		long installment = decorationReceiptPO.getInstallment();
		long accounts = decorationReceiptPO.getAccounts();
		long advance = decorationReceiptPO.getAdvance();
		long coupon = decorationReceiptPO.getCoupon();

		AccountVO accountVO = new AccountVO(word, abstracts, currentTime, currentPeriod, decorationReceiptPO.getCollectTime());

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByDrid(decorationReceiptPO.getDrId());

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {

			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);

			if (decorationPO.getSupervisor() != null) {
				assistantPO.setSupervisor(decorationPO.getSupervisor());
			}

			String sid = null;
			String paymentType = decorationPaymentPO.getPaymentType();

			if (DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(paymentType)) {
				sid = SystemConfig.getString("designSubject");
			} else if (DecorationPaymentPO.PAYMENTTYPE_ADD_STR.equals(paymentType)) {
				sid = SystemConfig.getString("addSubject");
			} else if (DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR.equals(paymentType)) {
				sid = SystemConfig.getString("reduceSubject");
			} else {
				sid = SystemConfig.getString("decorationSubject");
			}

			accountVO.setSaId(subAccountId++);

			convertPaymentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, sid, decorationPaymentPO.getReferMoney());
		}

		if (cash != 0) {
			accountVO.setSaId(subAccountId++);

			convertCashToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, decorationReceiptPO.getCashInfo(), cash, company);
		}

		if (bank != 0) {
			String[] bankInfos = decorationReceiptPO.getBankInfo().split("#");

			for (int i = 1; i < bankInfos.length; i++) {

				String[] info = bankInfos[i].split("\\|");

				accountVO.setSaId(subAccountId++);

				int _coupon = (int) Arith.mul(Float.valueOf(info[1]), 1000f);

				convertBankToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, info[0], _coupon, company);
			}
		}

		if (checkv != 0) {

			accountVO.setSaId(subAccountId++);

			convertCheckvToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, decorationReceiptPO.getCheckvBank(), checkv, company);
		}

		if (installment != 0) {
			accountVO.setSaId(subAccountId++);

			convertInstallmentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, decorationReceiptPO.getInstallmentBank(), installment, company);
		}

		if (accounts != 0) {
			accountVO.setSaId(subAccountId++);

			convertAccountsToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, decorationReceiptPO.getAccountsBank(), accounts, company);
		}

		if (advance != 0) {
			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);

			if (designer != null) {
				assistantPO.setDesignInfo(designer, designer.getDept(), designer.getDept().getFatherDept());
			}

			accountVO.setSaId(subAccountId++);

			convertAdvanceToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, decorationReceiptPO.getAdvanceType(), advance);
		}

		if (coupon != 0) {

			String[] couponInfos = decorationReceiptPO.getCouponInfo().split("#");

			for (int i = 1; i < couponInfos.length; i++) {

				String[] info = couponInfos[i].split(":");

				AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);

				if (designer != null) {
					assistantPO.setDesignInfo(designer, designer.getDept(), designer.getDept().getFatherDept());
				}

				accountVO.setSaId(subAccountId++);

				int _coupon = (int) Arith.mul(Float.valueOf(info[1]), 1000f);

				convertCouponToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, info[0], _coupon, company);
			}
		}

		handleSubjectBalance(subjectBalances);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int buildMaterialFinance(DecorationPO decorationPO, MaterialPO materialPO, MaterialReceiptPO materialReceiptPO, UserPO poster) throws FLException {

		boolean relat = true;
		String word = null;
		String abstracts = null;

		int subAccountId = 1;
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		String currentPeriod = DateUtil.current("yyyyMM");

		Map<String, SubjectPO> subjectPOs = SubjectInfoUtil.getSubjectInfos();
		Map<String, List<Long>> subjectBalances = new HashMap<String, List<Long>>();

		if (materialPO == null) {
			throw new FLException(180001, "主材订单不存在");
		}

		int company = materialPO.getCompany();

		String orderId = materialPO.getOrderId();
		String orderAddr = decorationPO.getHouse().getVillage().getName() + " " + decorationPO.getHouse().getHouseNumber();
		String no = materialPO.getNo();
		String brand = materialPO.getBrand();

		UserPO designer = decorationPO.getDesigner();

		if (materialReceiptPO.getType() == MaterialReceiptPO.RECEIPT_TYPE_REFUND_INT) {
			relat = false;
		} else {
			relat = true;
		}

		VoucherPO voucherPO = new VoucherPO();

		voucherPO.setCreateTime(currentTime);
		voucherPO.setPeriod(currentPeriod);

		if (relat) {
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CC_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CC_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));

			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CC_STR);

			word = VoucherPO.PERIOD_CC_STR;
			abstracts = String.format("收订单%s子订单%s的主材款", orderId, no);
		} else {
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CR_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CR_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));

			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CR_STR);

			word = VoucherPO.PERIOD_CR_STR;
			abstracts = String.format("退订单%s子订单%s的主材款", orderId, no);
		}

		voucherPO.setOriginator(materialReceiptPO.getCollecter());
		voucherPO.setPostor(poster);
		voucherPO.setAttachmentNum(0);
		voucherPO.setStatus(VoucherPO.STATUS_TYPE_FORMAL_INT);
		voucherPO.setComment("");
		voucherPO.setReference("");

		voucherPO = voucherDao.merge(voucherPO);

		long cash = materialReceiptPO.getCash();
		long bank = materialReceiptPO.getBank();
		long checkv = materialReceiptPO.getCheckv();
		long installment = materialReceiptPO.getInstallment();
		long accounts = materialReceiptPO.getAccounts();
		long advance = materialReceiptPO.getAdvance();
		long coupon = materialReceiptPO.getCoupon();

		AccountVO accountVO = new AccountVO(word, abstracts, currentTime, currentPeriod, materialReceiptPO.getCollectTime());

		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByReceiptId(materialReceiptPO.getMrId());

		for (MaterialPaymentPO materialPaymentPO : materialPaymentPOs) {
			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);

			assistantPO.setNo(materialPaymentPO.getMaterial().getNo());
			assistantPO.setBrand(brand);

			if (designer != null) {
				assistantPO.setDesignInfo(designer, designer.getDept(), designer.getDept().getFatherDept());
			}

			String sid = null;
			int paymentType = materialPaymentPO.getPaymentType();

			if (MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT == paymentType || MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT == paymentType) {
				sid = SystemConfig.getString("depositSubject");
			} else if (MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT == paymentType || MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT == paymentType) {

				boolean _relat = relat ? false : true;

				List<MaterialPaymentPO> _materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMidAType(materialPaymentPO.getMaterial().getMid(), MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT);

				if (_materialPaymentPOs.size() > 1) {
					throw new FLException(250007, "主材定金存在多条");
				} else if (_materialPaymentPOs.size() == 1) {
					MaterialPaymentPO _materialPaymentPO = _materialPaymentPOs.get(0);

					convertPaymentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, _relat, SystemConfig.getString("depositSubject"), _materialPaymentPO.getReferMoney());
					convertPaymentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, SystemConfig.getString("materialSubject"), _materialPaymentPO.getReferMoney());
				}

				sid = MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT == paymentType ? SystemConfig.getString("materialSubject") : SystemConfig.getString("fullRefundSubject");
			} else if (MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_INT == paymentType) {
				sid = SystemConfig.getString("couponRefundSubject");
			} else if (MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT == paymentType) {
				sid = SystemConfig.getString("materialSubject");
			} else {
				sid = SystemConfig.getString("materialSubject");
			}

			accountVO.setSaId(subAccountId++);

			convertPaymentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, sid, materialPaymentPO.getReferMoney());
		}

		if (cash != 0) {
			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);

			convertCashToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, materialReceiptPO.getCashInfo(), cash, company);
		}

		if (bank != 0) {
			String[] bankInfos = materialReceiptPO.getBankInfo().split("#");

			for (int i = 1; i < bankInfos.length; i++) {

				String[] info = bankInfos[i].split("\\|");

				accountVO.setSaId(subAccountId++);

				int _money = (int) Arith.mul(Float.valueOf(info[1]), 1000f);

				convertBankToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, info[0], _money, company);
			}
		}

		if (checkv != 0) {
			accountVO.setSaId(subAccountId++);

			convertCheckvToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, materialReceiptPO.getCheckvBank(), checkv, company);
		}

		if (installment != 0) {
			accountVO.setSaId(subAccountId++);

			convertInstallmentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, materialReceiptPO.getInstallmentBank(), installment, company);
		}

		if (accounts != 0) {
			accountVO.setSaId(subAccountId++);

			convertAccountsToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, materialReceiptPO.getAccountsBank(), accounts, company);
		}

		if (advance != 0) {
			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);

			if (designer != null) {
				assistantPO.setDesignInfo(designer, designer.getDept(), designer.getDept().getFatherDept());
			}

			accountVO.setSaId(subAccountId++);

			convertAdvanceToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, 3, advance);
		}

		if (coupon != 0) {

			String[] couponInfos = materialReceiptPO.getCouponInfo().split("#");

			for (int i = 1; i < couponInfos.length; i++) {

				String[] info = couponInfos[i].split(":");

				AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);

				assistantPO.setBrand(brand);

				if (designer != null) {
					assistantPO.setDesignInfo(designer, designer.getDept(), designer.getDept().getFatherDept());
				}

				accountVO.setSaId(subAccountId++);

				int _coupon = (int) Arith.mul(Float.valueOf(info[1]), 1000f);

				convertCouponToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, info[0], _coupon, company);
			}
		}

		handleSubjectBalance(subjectBalances);

		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	private void convertPaymentToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Long>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, long payment) {

		SubjectPO subjectPO = subjectPOs.get(sId);

		if (subjectPO != null) {

			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, !relat, payment);

			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}

	@Transactional(rollbackFor = Exception.class)
	private void convertCashToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Long>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, long cash, int company) {

		ReceiptTypePO receiptTypePO = receiptTypeDao.queryReceiptTypeByNo(sId, company);

		if (receiptTypePO != null) {

			SubjectPO subjectPO = new SubjectPO().toSubjectPO(receiptTypePO);

			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, cash);

			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}

	@Transactional(rollbackFor = Exception.class)
	private void convertBankToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Long>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, long bank, int company) {

		ReceiptTypePO receiptTypePO = receiptTypeDao.queryReceiptTypeByNo(sId, company);

		if (receiptTypePO != null) {

			SubjectPO subjectPO = new SubjectPO().toSubjectPO(receiptTypePO);

			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, bank);

			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}

	@Transactional(rollbackFor = Exception.class)
	private void convertCheckvToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Long>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, long checkv, int company) {

		ReceiptTypePO receiptTypePO = receiptTypeDao.queryReceiptTypeByNo(sId, company);

		if (receiptTypePO != null) {

			SubjectPO subjectPO = new SubjectPO().toSubjectPO(receiptTypePO);

			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, checkv);

			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}

	@Transactional(rollbackFor = Exception.class)
	private void convertInstallmentToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Long>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, long installment, int company) {

		ReceiptTypePO receiptTypePO = receiptTypeDao.queryReceiptTypeByNo(sId, company);

		if (receiptTypePO != null) {

			SubjectPO subjectPO = new SubjectPO().toSubjectPO(receiptTypePO);

			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, installment);

			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}

	@Transactional(rollbackFor = Exception.class)
	private void convertAccountsToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Long>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, long accounts, int company) {

		ReceiptTypePO receiptTypePO = receiptTypeDao.queryReceiptTypeByNo(sId, company);

		if (receiptTypePO != null) {

			SubjectPO subjectPO = new SubjectPO().toSubjectPO(receiptTypePO);

			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, accounts);

			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}

	@Transactional(rollbackFor = Exception.class)
	private void convertAdvanceToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Long>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, int advanceType, long advance) {

		SubjectPO subjectPO = null;

		if (advanceType == 1) {
			subjectPO = subjectPOs.get(SystemConfig.getString("balanceSubject"));
		} else if (advanceType == 2) {
			subjectPO = subjectPOs.get(SystemConfig.getString("projectBalanceSubject"));
		} else if (advanceType == 3) {
			subjectPO = subjectPOs.get(SystemConfig.getString("materialBalanceSubject"));
		}

		if (subjectPO != null) {

			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, advance);

			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}

	@Transactional(rollbackFor = Exception.class)
	private void convertCouponToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Long>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, long coupon, int company) {

		ReceiptTypePO receiptTypePO = receiptTypeDao.queryReceiptTypeByNo(sId, company);

		if (receiptTypePO != null) {

			SubjectPO subjectPO = new SubjectPO().toSubjectPO(receiptTypePO);

			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, coupon);

			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}

	@Transactional(rollbackFor = Exception.class)
	private AccountPO saveAccount(VoucherPO voucherPO, AccountVO accountVO, SubjectPO subjectPO, AssistantPO assistantPO, boolean relat, long money) {

		AccountPO accountPO = new AccountPO();

		BeanUtil.copyProperties(accountVO, accountPO);

		if (assistantPO != null) {
			assistantPO = assistantDao.merge(assistantPO);

			accountPO.setAssistant(assistantPO);
		}

		accountPO.setVoucher(voucherPO);
		accountPO.setOneCode(subjectPO.getOneCode());
		accountPO.setTwoCode(subjectPO.getTwoCode());
		accountPO.setThrCode(subjectPO.getThrCode());
		accountPO.setSubjectName(subjectPO.getName());

		if (relat) {
			accountPO.setDebit(money);
			accountPO.setCredit(0);
		} else {
			accountPO.setDebit(0);
			accountPO.setCredit(money);
		}

		accountPO.setStatus(AccountPO.STATUS_TYPE_FORMAL_INT);

		accountDao.merge(accountPO);

		return accountPO;
	}

	@Transactional(rollbackFor = Exception.class)
	private int collectSubjectBalanceMap(Map<String, List<Long>> subjectBalances, AccountPO accountPO, String period, short direction) {

		long debit = accountPO.getDebit();
		long crebit = accountPO.getCredit();

		String key = String.format("%s%s%s-%s", accountPO.getOneCode(), accountPO.getTwoCode(), accountPO.getThrCode(), period);

		if (subjectBalances.get(key) != null) {
			List<Long> balances = subjectBalances.get(key);

			balances.set(0, Arith.add(balances.get(0), Arith.mul(debit, direction)));
			balances.set(1, Arith.add(balances.get(1), Arith.mul(crebit, direction)));
		} else {
			List<Long> balances = new ArrayList<Long>();

			balances.add(Arith.mul(debit, direction));
			balances.add(Arith.mul(crebit, direction));

			subjectBalances.put(key, balances);
		}

		return 0;
	}

	private int handleSubjectBalance(Map<String, List<Long>> subjectBalances) {

		SubjectBalanceUpinfoPO subjectBalanceUpinfoPO = null;

		for (String key : subjectBalances.keySet()) {
			List<Long> balances = subjectBalances.get(key);

			String code = key.split("-")[0];
			String period = key.split("-")[1];

			// 此处处理的借贷数值为计算过余额方向的金额 , 所以科目余额方向固定为1

			subjectBalanceUpinfoPO = new SubjectBalanceUpinfoPO(code, period, balances.get(0), balances.get(1), (short) 1, SubjectBalanceUpinfoPO.STATUS_INIT_INT);

			subjectBalanceUpinfoDao.merge(subjectBalanceUpinfoPO);
		}

		return 0;
	}

}
