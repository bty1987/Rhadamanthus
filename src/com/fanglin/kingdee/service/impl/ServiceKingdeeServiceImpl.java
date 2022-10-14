/**
 * @File Name		: ServiceKingdeeServiceImpl.java
 * @Package   	: com.fanglin.kingdee.service.impl
 * @Version		: 1.0
 * @Date			: 2021-10-02
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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ReceiptTypeDao;
import com.fanglin.data.po.ReceiptTypePO;
import com.fanglin.kingdee.handle.Dao;
import com.fanglin.kingdee.ko.CollectBillItemKO;
import com.fanglin.kingdee.ko.CollectBillKO;
import com.fanglin.kingdee.ko.RefundBillItemKO;
import com.fanglin.kingdee.ko.RefundBillKO;
import com.fanglin.kingdee.service.ServiceKingdeeService;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.payment.po.ServiceReceiptPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.Arith;
import com.fanglin.utils.SystemConfig;

@Service("serviceKingdeeService")
@Transactional(readOnly = true)
public class ServiceKingdeeServiceImpl implements ServiceKingdeeService {

	@Autowired
	private Dao dao;

	@Autowired
	private ReceiptTypeDao receiptTypeDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void collect(ServicePaymentPO servicePaymentPO, ServiceReceiptPO serviceReceiptPO) throws FLException {

		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false")) return;

		List<CollectBillItemKO> collectBillItems = new ArrayList<CollectBillItemKO>();

		int company = servicePaymentPO.getDecoration().getCompany();
		String collectTime = serviceReceiptPO.getCollectTime().toString();
		String orderId = servicePaymentPO.getDecoration().getOrderId();
		String grade = servicePaymentPO.getDecoration().getGrade();

		// TODO 确认下服务款进入什么单据类型的收款单
		String purpose = systemConfigDao.querySystemConfig("salesCollectPurpose", company).getValue(); // 收款用途SFKYT01_SYS-销售收款

		long cash = Arith.div(serviceReceiptPO.getCash(), 1000000);

		if (cash > 0) {

			ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(serviceReceiptPO.getCashInfo(), company);

			String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS01_SYS"

			collectBillItems.add(new CollectBillItemKO().ptk(purpose, kibalance, cash, null));
		}

		long checkv = Arith.div(serviceReceiptPO.getCheckv(), 1000000);

		if (checkv > 0) {

			String[] info = serviceReceiptPO.getCheckvBank().split("#");

			for (int i = 1; i < info.length; i++) {
				String[] checkInfo = info[i].split("\\|");

				Long money = Long.parseLong(checkInfo[1]);
				ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(checkInfo[0], company);
				String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS04_SYS"
				String bankno = receiptType.getBankno(); // 银行账号

				collectBillItems.add(new CollectBillItemKO().ptk(purpose, kibalance, money, bankno));
			}
		}

		if (collectBillItems.size() > 0) {

			String pcompany = companyDao.get(company).getSrganization().getNo(); // 款型公司 TODO
			String receiptType = systemConfigDao.querySystemConfig("salesCollectBill").getValue(); // 单据类型 SKDLX01_SYS-销售收款单

			CollectBillKO payBillKO = new CollectBillKO().ptk(collectTime, receiptType, orderId, pcompany, pcompany, grade, "服务费", serviceReceiptPO.getComment(), collectBillItems);
			dao.save(payBillKO);
		}
	}

	@Override
	public void refund(ServicePaymentPO servicePaymentPO, ServiceReceiptPO serviceReceiptPO) throws FLException {

		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false")) return;

		List<RefundBillItemKO> refundBillItems = new ArrayList<RefundBillItemKO>();

		int company = servicePaymentPO.getDecoration().getCompany();
		String collectTime = serviceReceiptPO.getCollectTime().toString();
		String orderId = servicePaymentPO.getDecoration().getOrderId();
		String grade = servicePaymentPO.getDecoration().getGrade();

		String purpose = systemConfigDao.querySystemConfig("salesCollectPurpose", company).getValue(); // 收款用途 SFKYT01_SYS销售收款

		long cash = Arith.div(serviceReceiptPO.getCash(), 1000000);

		if (cash > 0) {

			ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(serviceReceiptPO.getCashInfo(), company);

			String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS01_SYS"

			refundBillItems.add(new RefundBillItemKO().ptk(kibalance, purpose, cash, null, serviceReceiptPO.getComment()));
		}

		long checkv = Arith.div(serviceReceiptPO.getCheckv(), 1000000);

		if (checkv > 0) {

			String[] info = serviceReceiptPO.getCheckvBank().split("#");

			for (int i = 1; i < info.length; i++) {
				String[] checkInfo = info[i].split("\\|");

				Long money = Long.parseLong(checkInfo[1]);
				ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(checkInfo[0], company);

				if (receiptType.getFund() == 0) continue;

				String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS04_SYS"
				String bankno = receiptType.getBankno(); // 银行账号

				refundBillItems.add(new RefundBillItemKO().ptk(kibalance, purpose, money, bankno, serviceReceiptPO.getComment()));
			}
		}

		if (refundBillItems.size() > 0) {

			String pcompany = companyDao.get(company).getSrganization().getNo(); // 款型公司 TODO
			String receiptType = systemConfigDao.querySystemConfig("salesRefundBill").getValue(); // 单据类型 "SKTKDLX01_SYS"

			RefundBillKO refundBillKO = new RefundBillKO().ptk(collectTime, receiptType, pcompany, orderId, pcompany, grade, "服务费", refundBillItems);

			dao.save(refundBillKO);
		}

	}

}
