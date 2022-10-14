/**
 * @File Name		: DecorationPayment2KingdeeService.java
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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ReceiptTypeDao;
import com.fanglin.data.po.ReceiptTypePO;
import com.fanglin.kingdee.handle.Dao;
import com.fanglin.kingdee.ko.CollectBillItemKO;
import com.fanglin.kingdee.ko.CollectBillKO;
import com.fanglin.kingdee.ko.MaterialTransferBillItemKO;
import com.fanglin.kingdee.ko.MaterialTransferBillKO;
import com.fanglin.kingdee.ko.OrganizationKO;
import com.fanglin.kingdee.ko.OtherReceivableBillItemKO;
import com.fanglin.kingdee.ko.OtherReceivableBillKO;
import com.fanglin.kingdee.ko.ReceivableBillItemKO;
import com.fanglin.kingdee.ko.ReceivableBillKO;
import com.fanglin.kingdee.ko.RefundBillItemKO;
import com.fanglin.kingdee.ko.RefundBillKO;
import com.fanglin.kingdee.service.DecorationKingdeeService;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.Arith;
import com.fanglin.utils.SystemConfig;

@Service("decorationKingdeeService")
@Transactional(readOnly = true)
public class DecorationKingdeeServiceImpl implements DecorationKingdeeService {

	@Autowired
	private Dao dao;

	@Autowired
	private ReceiptTypeDao receiptTypeDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	// TODO 质保金还没处理
	public void collect(DecorationReceiptPO decorationReceiptPO, DecorationPaymentPO decorationPaymentPO) throws FLException {

		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false")) return;

		// 收款单单据体&其他应收单单据体
		List<CollectBillItemKO> collectBillItems = new ArrayList<CollectBillItemKO>();
		List<MaterialTransferBillItemKO> materialTransferBillItems = new ArrayList<MaterialTransferBillItemKO>();
		List<ReceivableBillItemKO> receivableBillItems = new ArrayList<ReceivableBillItemKO>(); // 应收单单据体

		int company = decorationPaymentPO.getDecoration().getCompany();
		String collectTime = decorationReceiptPO.getCollectTime().toString();
		String orderId = decorationPaymentPO.getDecoration().getOrderId();
		String grade = decorationPaymentPO.getDecoration().getGrade();

		String purpose = systemConfigDao.querySystemConfig("salesCollectPurpose", company).getValue(); // 收款用途 SFKYT01_SYS-销售收款
		String paymentType = decorationPaymentPO.getPaymentType(); // 款项类型 TODO

		long receivableMoney = 0; // 应收单总额

		long cash = decorationReceiptPO.getCash();

		if (cash > 0) { // 现金---收款单明细

			receivableMoney = Arith.add(receivableMoney, Arith.div(cash, 1000000));

			ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(decorationReceiptPO.getCashInfo(), company);

			String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS01_SYS"

			collectBillItems.add(new CollectBillItemKO().ptk(purpose, kibalance, Arith.div(cash, 1000000), null));
		}

		long checkv = decorationReceiptPO.getCheckv();

		if (checkv > 0) { // 银行---收款单明细

			String[] info = decorationReceiptPO.getCheckvBank().split("#");

			for (int i = 1; i < info.length; i++) {
				String[] checkInfo = info[i].split("\\|");

				Long money = Long.parseLong(checkInfo[1]);
				ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(checkInfo[0], company);

				if (receiptType.getFund() == 0) continue;

				receivableMoney = Arith.add(receivableMoney, money);

				String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS04_SYS"
				String bankno = receiptType.getBankno(); // 银行账号

				collectBillItems.add(new CollectBillItemKO().ptk(purpose, kibalance, money, bankno));
			}

		}

		long advance = decorationReceiptPO.getAdvance();

		if (advance > 0) { // 预付款---其他应收单明细

			long money = Arith.div(advance, 1000000);

			receivableMoney = Arith.add(receivableMoney, money);

			materialTransferBillItems.add(new MaterialTransferBillItemKO().ptk(money, null, null, null, paymentType));

		}

		String pcompany = companyDao.get(company).getDrganization().getNo();

		// 收款单
		if (collectBillItems.size() > 0) {

			String receiptType = systemConfigDao.querySystemConfig("salesCollectBill").getValue(); // 单据类型 SKDLX01_SYS-销售收款单

			CollectBillKO payBillKO = new CollectBillKO().ptk(collectTime, receiptType, orderId, pcompany, pcompany, grade, paymentType, decorationReceiptPO.getComment(), collectBillItems);

			dao.save(payBillKO);
		}

		// 主转单
		if (materialTransferBillItems.size() > 0) {

			MaterialTransferBillKO materialTransferBillKO = new MaterialTransferBillKO().ptk(collectTime, grade, pcompany, pcompany, orderId, Arith.div(advance, 1000000), materialTransferBillItems);

			dao.save(materialTransferBillKO);
		}

		// 应收单
		if (receivableMoney > 0) {

			String receiptType = systemConfigDao.querySystemConfig("costReceivableBill").getValue(); // 单据类型 YSD01_SYS-标准应收单

			String costNO = systemConfigDao.querySystemConfig("decorationCostCode", company).getValue();

			String comment = getAddress(decorationPaymentPO);

			receivableBillItems.add(new ReceivableBillItemKO().ptk(costNO, receivableMoney)); // 应收单单据体

			ReceivableBillKO receivableBillKO = new ReceivableBillKO().ptk(collectTime, receiptType, orderId, pcompany, pcompany, grade, paymentType, comment, receivableBillItems);

			dao.save(receivableBillKO);

		}

	}

	@Override
	public void refund(DecorationReceiptPO decorationReceiptPO, DecorationPaymentPO decorationPaymentPO) throws FLException {

		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false")) return;

		List<RefundBillItemKO> refundBillItems = new ArrayList<RefundBillItemKO>();
		List<MaterialTransferBillItemKO> materialTransferBillItems = new ArrayList<MaterialTransferBillItemKO>();
		List<ReceivableBillItemKO> receivableBillItems = new ArrayList<ReceivableBillItemKO>(); // 应收单单据体

		int company = decorationPaymentPO.getDecoration().getCompany();
		String collectTime = decorationReceiptPO.getCollectTime().toString();
		String orderId = decorationPaymentPO.getDecoration().getOrderId();
		String grade = decorationPaymentPO.getDecoration().getGrade();
		String paymentType = decorationPaymentPO.getPaymentType(); // 款项类型 TODO

		String purpose = systemConfigDao.querySystemConfig("salesCollectPurpose", company).getValue(); // 收款用途 SFKYT01_SYS-销售收款

		long receivableMoney = 0; // 应收单总额

		long cash = decorationReceiptPO.getCash();

		if (cash > 0) { // 现金---收款单明细

			receivableMoney = Arith.add(receivableMoney, -Arith.div(cash, 1000000));

			ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(decorationReceiptPO.getCashInfo(), company);

			String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS01_SYS"

			refundBillItems.add(new RefundBillItemKO().ptk(kibalance, purpose, -Arith.div(cash, 1000000), null, decorationReceiptPO.getComment()));
		}

		long checkv = decorationReceiptPO.getCheckv();

		if (checkv > 0) { // 银行---收款单明细

			String[] info = decorationReceiptPO.getCheckvBank().split("#");

			for (int i = 1; i < info.length; i++) {
				String[] checkInfo = info[i].split("\\|");

				Long money = -Long.parseLong(checkInfo[1]);
				ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(checkInfo[0], company);

				if (receiptType.getFund() == 0) continue;

				receivableMoney = Arith.add(receivableMoney, money);

				String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS04_SYS"
				String bankno = receiptType.getBankno(); // 银行账号

				refundBillItems.add(new RefundBillItemKO().ptk(kibalance, purpose, money, bankno, decorationReceiptPO.getComment()));
			}

		}

		long advance = decorationReceiptPO.getAdvance();

		if (advance > 0) { // 预付款---其他应收单明细

			long money = -Arith.div(advance, 1000000);

			receivableMoney = Arith.add(receivableMoney, money);

			materialTransferBillItems.add(new MaterialTransferBillItemKO().ptk(money, null, null, null, paymentType));

		}

		String pcompany = companyDao.get(company).getDrganization().getNo();

		// 收款退款单
		if (refundBillItems.size() > 0) {

			String receiptType = systemConfigDao.querySystemConfig("salesRefundBill").getValue(); // 单据类型 "SKTKDLX01_SYS"-销售业务退款单
			RefundBillKO refundBillKO = new RefundBillKO().ptk(collectTime, receiptType, pcompany, orderId, pcompany, grade, paymentType, refundBillItems);

			dao.save(refundBillKO);
		}

		// 主转单
		if (materialTransferBillItems.size() > 0) {

			MaterialTransferBillKO materialTransferBillKO = new MaterialTransferBillKO().ptk(collectTime, grade, pcompany, pcompany, orderId, Arith.div(advance, 1000000), materialTransferBillItems);

			dao.save(materialTransferBillKO);
		}

		// 应收单
		if (receivableMoney > 0) {

			String receiptType = systemConfigDao.querySystemConfig("costReceivableBill").getValue(); // 单据类型 YSD01_SYS-标准应收单

			String costNO = systemConfigDao.querySystemConfig("decorationCostCode", company).getValue();

			String comment = getAddress(decorationPaymentPO);

			receivableBillItems.add(new ReceivableBillItemKO().ptk(costNO, receivableMoney)); // 应收单单据体

			ReceivableBillKO receivableBillKO = new ReceivableBillKO().ptk(collectTime, receiptType, orderId, pcompany, pcompany, grade, paymentType, comment, receivableBillItems);

			dao.save(receivableBillKO);

		}
	}

	@Override
	public void confirm(DecorationReceiptPO decorationReceiptPO, DecorationPaymentPO decorationPaymentPO) throws FLException {

		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false")) return;

		int company = decorationPaymentPO.getCompany();
		String collectTime = decorationReceiptPO.getCollectTime().toString();
		String orderId = decorationPaymentPO.getDecoration().getOrderId();
		String grade = decorationPaymentPO.getDecoration().getGrade();
		String paymentType = decorationPaymentPO.getPaymentType(); // TODO

		String costDept = systemConfigDao.querySystemConfig("decorationCostDept", company).getValue(); // 费用承担部门 BM000023-项目定金

		List<OtherReceivableBillItemKO> otherReceivableBillItems = new ArrayList<OtherReceivableBillItemKO>();
		otherReceivableBillItems.add(new OtherReceivableBillItemKO().ptk(costDept, Arith.div(decorationPaymentPO.getReferMoney(), 1000000), 0));

		// 其他应收单
		OtherReceivableBillKO otherReceivableBillKO = new OtherReceivableBillKO().ptk(collectTime, orderId, String.valueOf(company), grade, paymentType, null, otherReceivableBillItems);

		String number = dao.save(otherReceivableBillKO);

		dao.audit(new OtherReceivableBillKO(new OrganizationKO(number)), number);

	}

	public String getAddress(DecorationPaymentPO decorationPaymentPO) {

		String province = decorationPaymentPO.getDecoration().getHouse().getVillage().getCityProper().getCity().getProvince();
		String city = decorationPaymentPO.getDecoration().getHouse().getVillage().getCityProper().getCity().getName();
		String cityProper = decorationPaymentPO.getDecoration().getHouse().getVillage().getCityProper().getName();
		String village = decorationPaymentPO.getDecoration().getHouse().getVillage().getName();
		String houseNum = decorationPaymentPO.getDecoration().getHouse().getHouseNumber();

		String address = province + " " + city + " " + cityProper + " " + village + houseNum;

		return address;
	}

}
