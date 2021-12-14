/**
 * @File Name		: advancePayment2KingdeeService.java
 * @Package   	: com.fanglin.kingdee.service.impl
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ReceiptTypeDao;
import com.fanglin.communion.po.ReceiptTypePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.kingdee.handle.Dao;
import com.fanglin.kingdee.ko.BankTransitionBillItemKO;
import com.fanglin.kingdee.ko.BankTransitionBillKO;
import com.fanglin.kingdee.ko.CollectBillItemKO;
import com.fanglin.kingdee.ko.CollectBillKO;
import com.fanglin.kingdee.ko.RefundBillItemKO;
import com.fanglin.kingdee.ko.RefundBillKO;
import com.fanglin.kingdee.service.AdvanceKingdeeService;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.SystemConfig;

@Service("advanceKingdeeService")
@Transactional(readOnly = true)
public class AdvanceKingdeeServiceImpl implements AdvanceKingdeeService {

	@Autowired
	private Dao dao;
	
	@Autowired
	private ReceiptTypeDao receiptTypeDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Autowired
	private CompanyDao companyDao;

	@Override
	public void collect(AdvanceReceiptPO advanceReceiptPO, PaymentPO paymentPO, DecorationPO decorationPO) throws FLException {

		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false"))
			return;

		List<CollectBillItemKO> collectBillItems = new ArrayList<CollectBillItemKO>();
		List<BankTransitionBillItemKO> bankTransitionBillItems = new ArrayList<BankTransitionBillItemKO>();
		
		int company = decorationPO.getCompany();
		String collectTime = advanceReceiptPO.getCollectTime().toString();
		String orderId = decorationPO.getOrderId();
		String decorationGrade = decorationPO.getGrade();
		String grade = decorationGrade.equals("C") ? "A" : "B";
		
		String purposeType = paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT ? "replaceMaterialAdvance" : "decorationCollectPurpose";
		String purpose = systemConfigDao.querySystemConfig(purposeType, company).getValue();; //收款用途 SFKYT02_SYS-装修收款

		long bankTransMoney = 0;
		
		long cash = Arith.div(advanceReceiptPO.getCash(), 1000000);

		if (cash > 0) {
			
			ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(advanceReceiptPO.getCashInfo(), company);
			
			String kibalance = receiptType.getKibalance(); //结算方式 "JSFS01_SYS"
			
			collectBillItems.add(new CollectBillItemKO().ptk(purpose, kibalance, cash, null));
		}

		long checkv = Arith.div(advanceReceiptPO.getCheckv(), 1000000);

		if (checkv > 0) {

			String[] info = advanceReceiptPO.getCheckvBank().split("#");

			for (int i = 1; i < info.length; i++) {
				String[] checkInfo = info[i].split("\\|");

				Long money = Long.parseLong(checkInfo[1]);
				ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(checkInfo[0], company);
				
				String kibalance = receiptType.getKibalance(); //结算方式 "JSFS04_SYS"
				String bankno = receiptType.getBankno(); //银行账号
				
				if (paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT) {
					
					if (receiptType.getFund() == 0) continue;
					
					collectBillItems.add(new CollectBillItemKO().ptk(purpose, kibalance, money, bankno));
					
				} else if (paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT) {
					
					if (receiptType.getFund() == 0) { //非资金  银行过渡单
						
						bankTransMoney = Arith.add(bankTransMoney, money);
						
						bankTransitionBillItems.add(new BankTransitionBillItemKO().ptk(money, kibalance));
						
					} else { //资金 收款单
						
						collectBillItems.add(new CollectBillItemKO().ptk(purpose, kibalance, money, bankno));
						
					};
					
				}
				
			}
		}
		
		CompanyPO companyPO = companyDao.get(company);
		String pcompany = paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT ? companyPO.getSrganization().getNo() : companyPO.getDrganization().getNo();
		
		if (collectBillItems.size() > 0) {

			String paymentType = paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT ? "主材预付款" : "合同预付款";
			String receiptType = systemConfigDao.querySystemConfig("otherCollectBill").getValue(); //单据类型 SKDLX02_SYS-其他业务收款单
			
			CollectBillKO payBillKO = new CollectBillKO().ptk(collectTime, receiptType, orderId, pcompany, pcompany, grade, paymentType, advanceReceiptPO.getComment(), collectBillItems);
			dao.save(payBillKO);
		}

		//银行过渡单
		if (bankTransitionBillItems.size() > 0) {

			BankTransitionBillKO bankTransitionBillKO = new BankTransitionBillKO().ptk(collectTime, pcompany, pcompany, grade, orderId, bankTransMoney, bankTransitionBillItems);

			dao.save(bankTransitionBillKO);
		}
	}

	@Override
	public void refund(AdvanceReceiptPO advanceReceiptPO, PaymentPO paymentPO, DecorationPO decorationPO) throws FLException {

		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false"))
			return;

		List<RefundBillItemKO> refundBillItems = new ArrayList<RefundBillItemKO>();
		List<BankTransitionBillItemKO> bankTransitionBillItems = new ArrayList<BankTransitionBillItemKO>();
		
		int company = decorationPO.getCompany();
		String collectTime = advanceReceiptPO.getCollectTime().toString();
		String orderId = decorationPO.getOrderId();
		String decorationGrade = decorationPO.getGrade();
		String grade = decorationGrade.equals("C") ? "A" : "B";
		
		//TODO这里需要注意下 合同预付款和主材预付款进的是否是同一类型的单据  不同单据类型的收款用途不一样
		String purposeType = paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT ? "replaceMaterialAdvance" : "decorationCollectPurpose";
		String purpose = systemConfigDao.querySystemConfig(purposeType, company).getValue();; //收款用途 SFKYT02_SYS-装修收款

		long bankTransMoney = 0;
		
		long cash = Arith.div(advanceReceiptPO.getCash(), 1000000);

		if (cash > 0) {
			
			ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(advanceReceiptPO.getCashInfo(), company);
			
			String kibalance = receiptType.getKibalance(); //结算方式 "JSFS01_SYS"
			
			refundBillItems.add(new RefundBillItemKO().ptk(kibalance, purpose, cash, null, advanceReceiptPO.getComment()));
		}

		long checkv = Arith.div(advanceReceiptPO.getCheckv(), 1000000);

		if (checkv > 0) {

			String[] info = advanceReceiptPO.getCheckvBank().split("#");

			for (int i = 1; i < info.length; i++) {
				String[] checkInfo = info[i].split("\\|");

				Long money = Long.parseLong(checkInfo[1]);
				ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(checkInfo[0], company);
				
				String kibalance = receiptType.getKibalance(); //结算方式 "JSFS04_SYS"
				String bankno = receiptType.getBankno(); //银行账号
				
				if (paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT) {
					
					if (receiptType.getFund() == 0) continue;
					
					refundBillItems.add(new RefundBillItemKO().ptk(kibalance, purpose, money, bankno, advanceReceiptPO.getComment()));
					
				} else if (paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT) {
					
					if (receiptType.getFund() == 0) { //非资金  银行过渡单
						
						bankTransMoney = Arith.add(bankTransMoney, money);
						
						bankTransitionBillItems.add(new BankTransitionBillItemKO().ptk(money, kibalance));
						
					} else { //资金 收款退款单
						
						refundBillItems.add(new RefundBillItemKO().ptk(kibalance, purpose, money, bankno, advanceReceiptPO.getComment()));
						
					};
					
				}
			}
		}
		
		CompanyPO companyPO = companyDao.get(company);
		String pcompany = paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT ? companyPO.getSrganization().getNo() : companyPO.getDrganization().getNo(); //款型公司

		if (refundBillItems.size() > 0) {

			String paymentType = paymentPO.getPaymentType() == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT ? "主材预付款" : "合同预付款";
			String receiptType = systemConfigDao.querySystemConfig("otherRefundBill").getValue(); //单据类型 "SKTKDLX01_SYS"
			
			RefundBillKO refundBillKO = new RefundBillKO().ptk(collectTime, receiptType, pcompany, orderId, pcompany, grade, paymentType, refundBillItems);
			
			dao.save(refundBillKO);
		}

		//银行过渡单
		if (bankTransitionBillItems.size() > 0) {

			BankTransitionBillKO bankTransitionBillKO = new BankTransitionBillKO().ptk(collectTime, pcompany, pcompany, grade, orderId, bankTransMoney, bankTransitionBillItems);

			dao.save(bankTransitionBillKO);
		}

	}

}
