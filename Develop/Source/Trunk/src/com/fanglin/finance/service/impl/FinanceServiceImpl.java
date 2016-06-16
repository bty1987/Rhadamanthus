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

import com.fanglin.common.dao.ReceiptTypeDao;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.po.DecorationOrderPO;
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
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.payment.po.MaterialReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.SubjectInfoUtil;
import com.fanglin.utils.SystemConfig;

@Service("decorationFinanceService")
@Transactional(readOnly=true)
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
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public int buildAdvanceFinance(DecorationOrderPO decorationOrderPO, AdvanceReceiptPO advanceReceiptPO, UserPO poster) throws FLException {
		
		boolean relat = true;
		String word = null;
		String abstracts = null;
		
		int subAccountId = 1;
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		String currentPeriod = DateUtil.current("yyyyMM");
		
		Map<String, SubjectPO> subjectPOs = SubjectInfoUtil.getSubjectInfos();
		Map<String, List<Double>> subjectBalances = new HashMap<String, List<Double>>();
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		String orderId = decorationOrderPO.getOrderId();
		String orderAddr = decorationOrderPO.getVillagePO().getVillageName() + " " + decorationOrderPO.getHouseNumber();
		
		if(advanceReceiptPO.getReceiptType() == DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT){
			relat = false;
		}else{
			relat = true;
		}
		
		VoucherPO voucherPO = new VoucherPO();
		
		voucherPO.setCreateTime(currentTime);
		voucherPO.setPeriod(currentPeriod);
		
		if(relat){
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CC_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
			
			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CC_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));
			
			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CC_STR);
			
			word = VoucherPO.PERIOD_CC_STR;
			abstracts = String.format("收订单%s的预付款", orderId);
		}else{
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CR_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
			
			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CR_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));
			
			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CR_STR);
			
			word = VoucherPO.PERIOD_CR_STR;
			abstracts = String.format("退订单%s的预付款", orderId);
		}
		
		voucherPO.setOriginator(advanceReceiptPO.getCollectUser());
		voucherPO.setPostor(userDao.get(poster.getUserId()));
		voucherPO.setAttachmentNum(0);
		voucherPO.setStatus(VoucherPO.STATUS_TYPE_FORMAL_INT);
		voucherPO.setComment("");
		voucherPO.setReference("");
		
		voucherPO = voucherDao.merge(voucherPO);
		
		float cash = advanceReceiptPO.getCash();
		float bank = advanceReceiptPO.getBank();
		float checkv = advanceReceiptPO.getCheckv();
		float installment = advanceReceiptPO.getInstallment();
		float accounts = advanceReceiptPO.getAccounts();
		
		AccountVO accountVO = new AccountVO(word, abstracts, currentTime, currentPeriod, advanceReceiptPO.getCollectTime());
		
		List<PaymentPO> paymentPOs = paymentDao.queryPaymentByReceiptId(advanceReceiptPO.getArId());
		
		for(PaymentPO paymentPO: paymentPOs){
			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);
			
			String sid = null;
			String paymentType = paymentPO.getPaymentType();
			
			if(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR.equals(paymentType)){
				sid = SystemConfig.getString("balanceSubject");
			}else if(PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_STR.equals(paymentType)){
				sid = SystemConfig.getString("projectBalanceSubject");
			}else if(PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_STR.equals(paymentType)){
				sid = SystemConfig.getString("materialBalanceSubject");
			}else if(PaymentPO.PAYMENT_PAYMENTTYPE_ZATERIAL_STR.equals(paymentType)){
				sid = SystemConfig.getString("zaterialBalanceSubject");
			}
			
			accountVO.setSaId(subAccountId++);
			
			convertPaymentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, sid, paymentPO.getRecharge());
		}
		
		if(cash != 0f){
			accountVO.setSaId(subAccountId++);
			
			convertCashToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, advanceReceiptPO.getCashInfo(), cash);
		}
		
		if(bank != 0f){
			String[] bankInfos = advanceReceiptPO.getBankInfo().split("#");
			
			for(int i=1;i<bankInfos.length;i++){
				
				String[] info = bankInfos[i].split("\\|");
				
				accountVO.setSaId(subAccountId++);
				
				convertBankToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, info[0], Float.valueOf(info[1]));
			}
		}
		
		if(checkv != 0f){
			accountVO.setSaId(subAccountId++);
			
			convertCheckvToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, advanceReceiptPO.getCheckvBankName(), checkv);
		}
		
		if(installment != 0f){
			accountVO.setSaId(subAccountId++);
			
			convertInstallmentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, advanceReceiptPO.getInstallmentBankName(), installment);
		}
		
		if(accounts != 0f){
			accountVO.setSaId(subAccountId++);
			
			convertAccountsToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, advanceReceiptPO.getAccountsBankName(), accounts);
		}
		
		handleSubjectBalance(subjectBalances);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int buildDecorationFinance(DecorationOrderPO decorationOrderPO, DecorationReceiptPO decorationReceiptPO, UserPO poster) throws FLException {
		
		boolean relat = true;
		String word = null;
		String abstracts = null;
		
		int subAccountId = 1;
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		String currentPeriod = DateUtil.current("yyyyMM");
		
		Map<String, SubjectPO> subjectPOs = SubjectInfoUtil.getSubjectInfos();
		Map<String, List<Double>> subjectBalances = new HashMap<String, List<Double>>();
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		String orderId = decorationOrderPO.getOrderId();
		String orderAddr = decorationOrderPO.getVillagePO().getVillageName() + " " + decorationOrderPO.getHouseNumber();
		UserPO designer = decorationOrderPO.getDesignerPO();
		
		if(decorationReceiptPO.getReceiptType() == DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT){
			relat = false;
		}else{
			relat = true;
		}
		
		VoucherPO voucherPO = new VoucherPO();
		
		voucherPO.setCreateTime(currentTime);
		voucherPO.setPeriod(currentPeriod);
		
		if(relat){
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CC_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
			
			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CC_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));
			
			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CC_STR);
			
			word = VoucherPO.PERIOD_CC_STR;
			abstracts = String.format("收订单%s的工程款", orderId);
		}else{
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CR_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
			
			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CR_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));
			
			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CR_STR);
			
			word = VoucherPO.PERIOD_CR_STR;
			abstracts = String.format("退订单%s的工程款", orderId);
		}
		
		voucherPO.setOriginator(decorationReceiptPO.getCollectUserPO());
		voucherPO.setPostor(userDao.get(poster.getUserId()));
		voucherPO.setAttachmentNum(0);
		voucherPO.setStatus(VoucherPO.STATUS_TYPE_FORMAL_INT);
		voucherPO.setComment("");
		voucherPO.setReference("");
		
		voucherPO = voucherDao.merge(voucherPO);
		
		float cash = decorationReceiptPO.getCash();
		float bank = decorationReceiptPO.getBank();
		float checkv = decorationReceiptPO.getCheckv();
		float installment = decorationReceiptPO.getInstallment();
		float accounts = decorationReceiptPO.getAccounts();
		float advance = decorationReceiptPO.getAdvance();
		float coupon = decorationReceiptPO.getCoupon();
		
		AccountVO accountVO = new AccountVO(word, abstracts, currentTime, currentPeriod, decorationReceiptPO.getCollectTime());
		
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByReceiptId(decorationReceiptPO.getDrId());
		
		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){

			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);
			
			if(decorationOrderPO.getSupervisorPO() != null){
				assistantPO.setSupervisor(decorationOrderPO.getSupervisorPO());
			}
			
			String sid = null;
			String paymentType = decorationPaymentPO.getPaymentType();
			
			if(DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(paymentType)){
				sid = SystemConfig.getString("designSubject");
			}else if(DecorationPaymentPO.PAYMENTTYPE_ADD_STR.equals(paymentType)){
				sid = SystemConfig.getString("addSubject");
			}else if(DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR.equals(paymentType)){
				sid = SystemConfig.getString("reduceSubject");
			}else{
				sid = SystemConfig.getString("decorationSubject");
			}
			
			accountVO.setSaId(subAccountId++);

			convertPaymentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, sid, decorationPaymentPO.getReferMoney());
		}
		
		if(cash != 0f){
			accountVO.setSaId(subAccountId++);
			
			convertCashToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, decorationReceiptPO.getCashInfo(), cash);
		}
		
		if(bank != 0f){
			String[] bankInfos = decorationReceiptPO.getBankInfo().split("#");
			
			for(int i=1;i<bankInfos.length;i++){
				
				String[] info = bankInfos[i].split("\\|");
				
				accountVO.setSaId(subAccountId++);
				
				convertBankToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, info[0], Float.valueOf(info[1]));
			}
		}
		
		if(checkv != 0f){
			
			accountVO.setSaId(subAccountId++);
			
			convertCheckvToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, decorationReceiptPO.getCheckvBankName(), checkv);
		}
		
		if(installment != 0f){
			accountVO.setSaId(subAccountId++);
			
			convertInstallmentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, decorationReceiptPO.getInstallmentBankName(), installment);
		}
		
		if(accounts != 0f){
			accountVO.setSaId(subAccountId++);
			
			convertAccountsToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, decorationReceiptPO.getAccountsBankName(), accounts);
		}
		
		if(advance != 0f){
			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);
			
			if(designer != null){
				assistantPO.setDesignInfo(designer, designer.getDept(), designer.getDept().getFatherDept());
			}
			
			accountVO.setSaId(subAccountId++);
			
			convertAdvanceToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, decorationReceiptPO.getAdvanceType(), advance);
		}
		
		if(coupon != 0f){
			
			String[] couponInfos = decorationReceiptPO.getCouponInfo().split("#");
			
			for(int i=1;i<couponInfos.length;i++){
				
				String[] info = couponInfos[i].split(":");
				
				AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);
				
				if(designer != null){
					assistantPO.setDesignInfo(designer, designer.getDept(), designer.getDept().getFatherDept());
				}
				
				accountVO.setSaId(subAccountId++);
				
				convertCouponToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, info[0], Float.valueOf(info[1]));
			}
		}
		
		handleSubjectBalance(subjectBalances);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int buildMaterialFinance(DecorationOrderPO decorationOrderPO, MaterialSubOrderPO materialSubOrderPO, MaterialReceiptPO materialReceiptPO, UserPO poster) throws FLException {
		
		boolean relat = true;
		String word = null;
		String abstracts = null;
		
		int subAccountId = 1;
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
		String currentPeriod = DateUtil.current("yyyyMM");
		
		Map<String, SubjectPO> subjectPOs = SubjectInfoUtil.getSubjectInfos();
		Map<String, List<Double>> subjectBalances = new HashMap<String, List<Double>>();
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		String orderId = materialSubOrderPO.getOrderId();
		String orderAddr = materialSubOrderPO.getOrderAddr();
		String msoNo = materialSubOrderPO.getMsoNo();
		String brandName = materialSubOrderPO.getMaterialBrand();
		
		UserPO designer = decorationOrderPO.getDesignerPO();
		
		if(materialReceiptPO.getReceiptType() == MaterialReceiptPO.RECEIPT_TYPE_REFUND_INT){
			relat = false;
		}else{
			relat = true;
		}
		
		VoucherPO voucherPO = new VoucherPO();
		
		voucherPO.setCreateTime(currentTime);
		voucherPO.setPeriod(currentPeriod);
		
		if(relat){
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CC_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
			
			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CC_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));
			
			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CC_STR);
			
			word = VoucherPO.PERIOD_CC_STR;
			abstracts = String.format("收订单%s子订单%s的主材款", orderId, msoNo);
		}else{
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_FINANCE_CR_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
			
			StringBuffer voucherId = new StringBuffer();
			voucherId.append(VoucherPO.PERIOD_CR_INT);
			voucherId.append(FormatUtil.fillZero(count, "00000000"));
			
			voucherPO.setVoucherId(voucherId.toString());
			voucherPO.setWord(VoucherPO.PERIOD_CR_STR);
			
			word = VoucherPO.PERIOD_CR_STR;
			abstracts = String.format("退订单%s子订单%s的主材款", orderId, msoNo);
		}
		
		voucherPO.setOriginator(userDao.get(materialReceiptPO.getCollectUserId()));
		voucherPO.setPostor(userDao.get(poster.getUserId()));
		voucherPO.setAttachmentNum(0);
		voucherPO.setStatus(VoucherPO.STATUS_TYPE_FORMAL_INT);
		voucherPO.setComment("");
		voucherPO.setReference("");
		
		voucherPO = voucherDao.merge(voucherPO);
		
		float cash = materialReceiptPO.getCash();
		float bank = materialReceiptPO.getBank();
		float checkv = materialReceiptPO.getCheckv();
		float installment = materialReceiptPO.getInstallment();
		float accounts = materialReceiptPO.getAccounts();
		float advance = materialReceiptPO.getAdvance();
		float coupon = materialReceiptPO.getCoupon();
		
		AccountVO accountVO = new AccountVO(word, abstracts, currentTime, currentPeriod, materialReceiptPO.getCollectTime());
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByReceiptId(materialReceiptPO.getMrId());
		
		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);
			
			assistantPO.setMsoNo(materialPaymentPO.getMsoNo());
			assistantPO.setBrandName(brandName);
			
			if(designer != null){
				assistantPO.setDesignInfo(designer, designer.getDept(), designer.getDept().getFatherDept());
			}
			
			String sid = null;
			int paymentType = materialPaymentPO.getPaymentType();
			
			if(MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT == paymentType || MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT == paymentType){
				sid = SystemConfig.getString("depositSubject");
			}else if(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT == paymentType || MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT == paymentType){
				
				boolean _relat = relat ? false : true;
				
				List<MaterialPaymentPO> _materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMsoIdAType(materialPaymentPO.getMsoId(), MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT);
				
				if(_materialPaymentPOs.size() > 1){
					throw new FLException(250007, "主材定金存在多条");
				}else if(_materialPaymentPOs.size() == 1){
					MaterialPaymentPO _materialPaymentPO = _materialPaymentPOs.get(0);
					
					convertPaymentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, _relat, SystemConfig.getString("depositSubject"), _materialPaymentPO.getReferMoney());
					convertPaymentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, SystemConfig.getString("materialSubject"), _materialPaymentPO.getReferMoney());
				}
				
				sid = MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT == paymentType ? SystemConfig.getString("materialSubject") : SystemConfig.getString("fullRefundSubject");
			}else if(MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_INT == paymentType){
				sid = SystemConfig.getString("couponRefundSubject");
			}else if(MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT == paymentType){
				sid = SystemConfig.getString("materialSubject");
			}else{
				sid = SystemConfig.getString("materialSubject");
			}
			
			accountVO.setSaId(subAccountId++);
			
			convertPaymentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, sid, materialPaymentPO.getReferMoney());
		}
		
		if(cash != 0f){
			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);
			
			convertCashToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, materialReceiptPO.getCashInfo(), cash);
		}
		
		if(bank != 0f){
			String[] bankInfos = materialReceiptPO.getBankInfo().split("#");
			
			for(int i=1;i<bankInfos.length;i++){
				
				String[] info = bankInfos[i].split("\\|");
				
				accountVO.setSaId(subAccountId++);
				
				convertBankToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, info[0], Float.valueOf(info[1]));
			}
		}
		
		if(checkv != 0f){
			accountVO.setSaId(subAccountId++);
			
			convertCheckvToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, materialReceiptPO.getCheckvBankName(), checkv);
		}
		
		if(installment != 0f){
			accountVO.setSaId(subAccountId++);
			
			convertInstallmentToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, materialReceiptPO.getInstallmentBankName(), installment);
		}
		
		if(accounts != 0f){
			accountVO.setSaId(subAccountId++);
			
			convertAccountsToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, null, relat, materialReceiptPO.getAccountsBankName(), accounts);
		}
		
		if(advance != 0f){
			AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);
			
			if(designer != null){
				assistantPO.setDesignInfo(designer, designer.getDept(), designer.getDept().getFatherDept());
			}
			
			accountVO.setSaId(subAccountId++);
			
			convertAdvanceToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, 3, advance);
		}
		
		if(coupon != 0f){
			
			String[] couponInfos = materialReceiptPO.getCouponInfo().split("#");
			
			for(int i=1;i<couponInfos.length;i++){
				
				String[] info = couponInfos[i].split(":");
				
				AssistantPO assistantPO = new AssistantPO(orderId, orderAddr);
				
				assistantPO.setBrandName(brandName);
				
				if(designer != null){
					assistantPO.setDesignInfo(designer, designer.getDept(), designer.getDept().getFatherDept());
				}
				
				accountVO.setSaId(subAccountId++);
				
				convertCouponToAccount(subjectPOs, subjectBalances, voucherPO, accountVO, assistantPO, relat, info[0], Float.valueOf(info[1]));
			}
		}
		
		handleSubjectBalance(subjectBalances);
		
		return 0;
	}
	
	@Transactional(rollbackFor=Exception.class)
	private void convertPaymentToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Double>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, float payment){
		
		SubjectPO subjectPO = subjectPOs.get(sId);
		
		if(subjectPO != null){
			
			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, !relat, payment);
			
			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}

	@Transactional(rollbackFor=Exception.class)
	private void convertCashToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Double>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, float cash){
		
		SubjectPO subjectPO = receiptTypeDao.queryReceiptTypeByKey(sId).toSubjectPO();
		
		if(subjectPO != null){
			
			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, cash);
			
			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}
	
	@Transactional(rollbackFor=Exception.class)
	private void convertBankToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Double>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, float bank){
		SubjectPO subjectPO = receiptTypeDao.queryReceiptTypeByKey(sId).toSubjectPO();
		
		if(subjectPO != null){
			
			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, bank);
			
			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}
	
	@Transactional(rollbackFor=Exception.class)
	private void convertCheckvToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Double>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, float checkv){
		SubjectPO subjectPO = receiptTypeDao.queryReceiptTypeByKey(sId).toSubjectPO();
		
		if(subjectPO != null){
			
			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, checkv);
			
			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}
	
	@Transactional(rollbackFor=Exception.class)
	private void convertInstallmentToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Double>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, float installment){
		SubjectPO subjectPO = receiptTypeDao.queryReceiptTypeByKey(sId).toSubjectPO();
		
		if(subjectPO != null){
			
			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, installment);
			
			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}
	
	@Transactional(rollbackFor=Exception.class)
	private void convertAccountsToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Double>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, float accounts){
		SubjectPO subjectPO = receiptTypeDao.queryReceiptTypeByKey(sId).toSubjectPO();
		
		if(subjectPO != null){
			
			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, accounts);
			
			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}
	
	@Transactional(rollbackFor=Exception.class)
	private void convertAdvanceToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Double>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, int advanceType, float advance){
		
		SubjectPO subjectPO = null;
		
		if(advanceType == 1){
			subjectPO = subjectPOs.get(SystemConfig.getString("balanceSubject"));
		}else if(advanceType == 2){
			subjectPO = subjectPOs.get(SystemConfig.getString("projectBalanceSubject"));
		}else if(advanceType == 3){
			subjectPO = subjectPOs.get(SystemConfig.getString("materialBalanceSubject"));
		}
		
		if(subjectPO != null){
			
			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, advance);
			
			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}
	
	@Transactional(rollbackFor=Exception.class)
	private void convertCouponToAccount(Map<String, SubjectPO> subjectPOs, Map<String, List<Double>> subjectBalances, VoucherPO voucherPO, AccountVO accountVO, AssistantPO assistantPO, boolean relat, String sId, float coupon){
		
		SubjectPO subjectPO = receiptTypeDao.queryReceiptTypeByKey(sId).toSubjectPO();
		
		if(subjectPO != null){
			
			AccountPO accountPO = saveAccount(voucherPO, accountVO, subjectPO, assistantPO, relat, coupon);
			
			collectSubjectBalanceMap(subjectBalances, accountPO, voucherPO.getPeriod(), subjectPO.getDirection());
		}
	}
	
	@Transactional(rollbackFor=Exception.class)
	private AccountPO saveAccount(VoucherPO voucherPO, AccountVO accountVO, SubjectPO subjectPO, AssistantPO assistantPO, boolean relat, double money){
		
		AccountPO accountPO = new AccountPO();
		
		BeanUtil.copyProperties(accountVO, accountPO);
		
		if(assistantPO != null){
			assistantPO = assistantDao.merge(assistantPO);
			
			accountPO.setAssistant(assistantPO);
		}
		
		accountPO.setVoucher(voucherPO);
		accountPO.setOneCode(subjectPO.getOneCode());
		accountPO.setTwoCode(subjectPO.getTwoCode());
		accountPO.setThrCode(subjectPO.getThrCode());
		accountPO.setSubjectName(subjectPO.getName());
		
		if(relat){
			accountPO.setDebit(money);
			accountPO.setCredit(0f);
		}else{
			accountPO.setDebit(0f);
			accountPO.setCredit(money);
		}
		
		accountPO.setStatus(AccountPO.STATUS_TYPE_FORMAL_INT);
		
		accountDao.merge(accountPO);
		
		return accountPO;
	}
	
	@Transactional(rollbackFor=Exception.class)
	private int collectSubjectBalanceMap(Map<String, List<Double>> subjectBalances, AccountPO accountPO, String period, short direction){
		
		double debit = accountPO.getDebit();
		double crebit = accountPO.getCredit();
		
		String key = String.format("%s%s%s-%s", accountPO.getOneCode(), accountPO.getTwoCode(), accountPO.getThrCode(), period);
		
		if(subjectBalances.get(key) != null){
			List<Double> balances = subjectBalances.get(key);
			
			balances.set(0, Arith.add(balances.get(0), Arith.mul(debit, direction)));
			balances.set(1, Arith.add(balances.get(1), Arith.mul(crebit, direction)));
		}else{
			List<Double> balances = new ArrayList<Double>();
			
			balances.add(Arith.mul(debit, direction));
			balances.add(Arith.mul(crebit, direction));
			
			subjectBalances.put(key, balances);
		}
		
		return 0;
	}
	
	private int handleSubjectBalance(Map<String, List<Double>> subjectBalances){
		
		SubjectBalanceUpinfoPO subjectBalanceUpinfoPO = null;
		
		for(String key: subjectBalances.keySet()){
			List<Double> balances = subjectBalances.get(key);
			
			String code = key.split("-")[0];
			String period = key.split("-")[1];
			
			// 此处处理的借贷数值为计算过余额方向的金额 , 所以科目余额方向固定为1
			
			subjectBalanceUpinfoPO = new SubjectBalanceUpinfoPO(code, period, balances.get(0), balances.get(1), (short) 1, SubjectBalanceUpinfoPO.STATUS_INIT_INT);
			
			subjectBalanceUpinfoDao.merge(subjectBalanceUpinfoPO);
		}
		
		return 0;
	}

}
