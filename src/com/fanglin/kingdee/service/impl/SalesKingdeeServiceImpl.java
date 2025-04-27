/**
 * @File Name		: salesPayment2KingdeeService.java
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

import com.alibaba.fastjson.JSONObject;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ReceiptTypeDao;
import com.fanglin.data.po.ReceiptTypePO;
import com.fanglin.kingdee.handle.Dao;
import com.fanglin.kingdee.ko.BankTransitionBillItemKO;
import com.fanglin.kingdee.ko.BankTransitionBillKO;
import com.fanglin.kingdee.ko.CollectBillItemKO;
import com.fanglin.kingdee.ko.CollectBillKO;
import com.fanglin.kingdee.ko.MaterialTransferBillItemKO;
import com.fanglin.kingdee.ko.MaterialTransferBillKO;
import com.fanglin.kingdee.ko.RefundBillItemKO;
import com.fanglin.kingdee.ko.RefundBillKO;
import com.fanglin.kingdee.service.SalesKingdeeService;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.payment.po.SalesReceiptPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.Arith;
import com.fanglin.utils.SystemConfig;

@Service("salesKingdeeService")
@Transactional(readOnly = true)
public class SalesKingdeeServiceImpl implements SalesKingdeeService {

	@Autowired
	private Dao dao;

	@Autowired
	private ReceiptTypeDao receiptTypeDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	/**
	 * 
	 * 公司/款项/收据类型
	 * 
	 * 组织/结算方式/银行卡号/部门编号
	 * 
	 * 收款单/银行过渡单/主材转款单/其他应付单
	 * 
	 */

	@Override
	public void collect(SalesPO salesPO, SalesReceiptPO salesReceiptPO, List<SalesPaymentPO> salesPaymentPOs) throws FLException {

		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false")) return;

		List<CollectBillItemKO> collectBillItems = new ArrayList<CollectBillItemKO>();
		List<MaterialTransferBillItemKO> materialTransferBillItems = new ArrayList<MaterialTransferBillItemKO>();
		List<BankTransitionBillItemKO> bankTransitionBillItems = new ArrayList<BankTransitionBillItemKO>();

		String types = "{\"2\": \"定金\", \"3\": \"补款\", \"4\": \"退款\", \"5\": \"补款退款\", \"6\": \"券退款\", \"7\": \"定金退款\", \"8\": \"不可退定金\"}";
		JSONObject jsonObject = JSONObject.parseObject(types);

		String orderId = salesPO.getOrderId();
		String salesGrade = salesPO.getGrade();
		String grade = salesGrade.equals("B") ? "A" : "B";

		String collectTime = salesReceiptPO.getCollectTime().toString();

		long bankTransMoney = 0; // 银转总额
		long materialTransMoney = 0; // 主转总额

		String purpose = systemConfigDao.querySystemConfig("replaceMaterial", salesPO.getPompany()).getValue(); // 收款用途

		long cash = salesReceiptPO.getCash();

		if (cash > 0) { // 现金 -- 收款单明细

			ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(salesReceiptPO.getCashInfo(), salesPO.getPompany());

			String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS01_SYS"

			collectBillItems.add(new CollectBillItemKO().ptk(purpose, kibalance, Arith.div(cash, 1000000), null));

		}

		long checkv = salesReceiptPO.getCheckv();

		if (checkv > 0) { // 转账 -- 收款单明细

			String[] info = salesReceiptPO.getCheckvBank().split("#");

			for (int i = 1; i < info.length; i++) {
				String[] checkInfo = info[i].split("\\|");

				Long money = Long.parseLong(checkInfo[1]);
				ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(checkInfo[0], salesPO.getPompany());

				String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS04_SYS"
				String bankno = receiptType.getBankno(); // 银行账号

				if (receiptType.getFund() == 0) { // 非资金 银行过渡单
					bankTransMoney = Arith.add(bankTransMoney, money);
					bankTransitionBillItems.add(new BankTransitionBillItemKO().ptk(money, kibalance));
				} else { // 资金 收款单
					collectBillItems.add(new CollectBillItemKO().ptk(purpose, kibalance, money, bankno));
				}
			}
		}

		long coupon = salesReceiptPO.getCoupon();

		if (coupon > 0) { // 优惠 -- 银过单明细

			String[] couponInfo = salesReceiptPO.getCouponInfo().split("#");

			for (int i = 1; i < couponInfo.length; i++) {

				String[] infos = couponInfo[i].split(":");

				bankTransMoney = Arith.add(bankTransMoney, Long.valueOf(infos[1]));

				bankTransitionBillItems.add(new BankTransitionBillItemKO().ptk(Long.valueOf(infos[1]), infos[0]));

			}

		}

		long advance = salesReceiptPO.getAdvance();

		if (advance > 0) { // 预付款 -- 银过单明细

			long money = Arith.div(advance, 1000000);

			bankTransMoney = Arith.add(bankTransMoney, money);

			bankTransitionBillItems.add(new BankTransitionBillItemKO().ptk(money, "主材预付款")); // TODO 主材预付款文字有可能需要换成编号
		}

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) { // 各款项 -- 主转单明细

			SalesPO sales = salesPaymentPO.getSales();

			BrandPO brands = sales.getBrand();
			String brandBatch = brands.getKino(); // 品牌
			String supplierBatch = brands.getSupplier().getOldUserId(); // 厂商 TODO

			// 如果是补款并且之前交过定金 需要将之前的定金也存入到主材转款单中
			if (salesPaymentPO.getType() == SalesPaymentPO.TYPE_REPLENISHMENT_INT && sales.getDepositpayStatus() > SalesPaymentPO.STATUS_INITIAL_INT) {

				long depositpay = Arith.div(sales.getDepositpay(), 1000000);

				materialTransferBillItems.add(new MaterialTransferBillItemKO().ptk(-depositpay, brandBatch, supplierBatch, sales.getNo(), "定金出"));
				materialTransferBillItems.add(new MaterialTransferBillItemKO().ptk(depositpay, brandBatch, supplierBatch, sales.getNo(), "定金转全款"));
			}

			long money = Arith.div(salesPaymentPO.getReferMoney(), 1000000);

			materialTransMoney = Arith.add(materialTransMoney, money);

			materialTransferBillItems.add(new MaterialTransferBillItemKO().ptk(money, brandBatch, supplierBatch, sales.getNo(), jsonObject.getString(String.valueOf(salesPaymentPO.getType()))));
		}

		String pcompany = companyDao.get(salesPO.getPompany()).getSrganization().getNo(); // 款型公司 TODO

		// 收款单
		if (collectBillItems.size() > 0) {

			String receiptType = systemConfigDao.querySystemConfig("otherCollectBill").getValue(); // 单据类型 "SKDLX02_SYS" 其他业务收款单

			CollectBillKO payBillKO = new CollectBillKO().ptk(collectTime, receiptType, orderId, pcompany, pcompany, grade, null, salesReceiptPO.getComment(), collectBillItems);

			dao.save(payBillKO);
		}

		// 主转单
		if (materialTransferBillItems.size() > 0) {

			MaterialTransferBillKO materialTransferBillKO = new MaterialTransferBillKO().ptk(collectTime, grade, pcompany, pcompany, orderId, materialTransMoney, materialTransferBillItems);

			dao.save(materialTransferBillKO);
		}

		// 银过单
		if (bankTransitionBillItems.size() > 0) {

			BankTransitionBillKO bankTransitionBillKO = new BankTransitionBillKO().ptk(collectTime, pcompany, pcompany, grade, orderId, bankTransMoney, bankTransitionBillItems);

			dao.save(bankTransitionBillKO);
		}
	}

	@Override
	public void refund(SalesPO salesPO, SalesReceiptPO salesReceiptPO, SalesPaymentPO salesPaymentPO) throws FLException {

		if (SystemConfig.getString("KINGDEEENABLE") == null || SystemConfig.getString("KINGDEEENABLE").equals("false")) return;

		String types = "{\"2\": \"定金\", \"3\": \"补款\", \"4\": \"退款\", \"5\": \"补款退款\", \"6\": \"券退款\", \"7\": \"定金退款\", \"8\": \"不可退定金\"}";
		JSONObject jsonObject = JSONObject.parseObject(types);

		List<BankTransitionBillItemKO> bankTransitionBillItems = new ArrayList<BankTransitionBillItemKO>();
		List<RefundBillItemKO> refundBillItems = new ArrayList<RefundBillItemKO>();
		List<MaterialTransferBillItemKO> materialTransferBillItems = new ArrayList<MaterialTransferBillItemKO>();

		String orderId = salesPO.getOrderId();
		String salesGrade = salesPO.getGrade();
		String grade = salesGrade.equals("B") ? "A" : "B";

		String collectTime = salesReceiptPO.getCollectTime().toString();

		String purpose = systemConfigDao.querySystemConfig("replaceMaterial", salesPO.getPompany()).getValue(); // 收款用途 1004-代收主材款

		BrandPO brands = salesPO.getBrand();
		String brand = brands.getKino(); // 品牌
		String supplier = brands.getSupplier().getOldUserId(); // 厂商 TODO

		long bankTransMoney = 0; // 银转总额

		// 现金
		long cash = salesReceiptPO.getCash();

		if (cash > 0) {

			long money = Arith.div(cash, 1000000);

			ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(salesReceiptPO.getCashInfo(), salesPO.getPompany());

			String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS01_SYS"

			refundBillItems.add(new RefundBillItemKO().ptk(kibalance, purpose, money, null, salesReceiptPO.getComment()));

		}

		// 银行
		long checkv = salesReceiptPO.getCheckv();

		if (checkv > 0) { // 转账 -- 普通: 收款单明细 , 特殊:他付单明细/银过单明细

			String[] info = salesReceiptPO.getCheckvBank().split("#");

			for (int i = 1; i < info.length; i++) {

				String[] checkInfo = info[i].split("\\|");

				Long money = Long.parseLong(checkInfo[1]);
				ReceiptTypePO receiptType = receiptTypeDao.queryReceiptTypeByNo(checkInfo[0], salesPO.getPompany());

				String kibalance = receiptType.getKibalance(); // 结算方式 "JSFS04_SYS"
				String bankno = receiptType.getBankno(); // 银行账号

				if (receiptType.getFund() == 0) { // 非资金 银行过渡单
					bankTransMoney = Arith.add(bankTransMoney, money);
					bankTransitionBillItems.add(new BankTransitionBillItemKO().ptk(money, kibalance));
				} else { // 资金 收款退款单
					refundBillItems.add(new RefundBillItemKO().ptk(kibalance, purpose, money, bankno, salesReceiptPO.getComment()));
				}

			}
		}

		// 预付款
		long advance = salesReceiptPO.getAdvance();

		if (advance > 0) {

			long money = Arith.div(advance, 1000000);

			bankTransMoney = Arith.add(bankTransMoney, money);
			bankTransitionBillItems.add(new BankTransitionBillItemKO().ptk(money, "转回主材预付款")); // TODO paymentype可能要换成编号
		}

		// 优惠券
		long coupon = salesReceiptPO.getCoupon();

		if (coupon > 0) { // 优惠 -- 银过单明细

			String[] couponInfo = salesReceiptPO.getCouponInfo().split("#");

			for (int i = 1; i < couponInfo.length; i++) {

				String[] infos = couponInfo[i].split(":");

				bankTransMoney = Arith.add(bankTransMoney, -Long.valueOf(infos[1]));

				bankTransitionBillItems.add(new BankTransitionBillItemKO().ptk(-Long.valueOf(infos[1]), infos[0]));

			}

		}

		// 主材转款单单据体 如果是补款退款 需要生成两条定金的数据(一正一负)存入到主材转款单中
		if (salesPaymentPO.getType() == SalesPaymentPO.TYPE_MAKEAREFUND_INT) {

			long depositpay = Arith.div(salesPO.getDepositpay(), 1000000);

			materialTransferBillItems.add(new MaterialTransferBillItemKO().ptk(-depositpay, brand, supplier, salesPO.getNo(), "定金出"));
			materialTransferBillItems.add(new MaterialTransferBillItemKO().ptk(depositpay, brand, supplier, salesPO.getNo(), "定金转全款"));
		}

		long refundMoney = Arith.div(salesPaymentPO.getReferMoney(), 1000000);

		materialTransferBillItems.add(new MaterialTransferBillItemKO().ptk(-refundMoney, brand, supplier, salesPO.getNo(), jsonObject.getString(String.valueOf(salesPaymentPO.getType()))));

		String pcompany = companyDao.get(salesPO.getPompany()).getSrganization().getNo(); // 款型公司 TODO

		// 收款退款单
		if (refundBillItems.size() > 0) {

			String receiptType = systemConfigDao.querySystemConfig("otherRefundBill").getValue(); // 单据类型 "SKTKDLX02_SYS"-其他业务退款单
			RefundBillKO refundBillKO = new RefundBillKO().ptk(collectTime, receiptType, pcompany, orderId, pcompany, grade, null, refundBillItems);

			dao.save(refundBillKO);
		}

		// 银行过渡单
		if (bankTransitionBillItems.size() > 0) {

			BankTransitionBillKO bankTransitionBillKO = new BankTransitionBillKO().ptk(collectTime, pcompany, pcompany, grade, orderId, bankTransMoney, bankTransitionBillItems);

			dao.save(bankTransitionBillKO);
		}

		// 主转单
		if (materialTransferBillItems.size() > 0) {

			MaterialTransferBillKO materialTransferBillKO = new MaterialTransferBillKO().ptk(collectTime, grade, pcompany, pcompany, orderId, -refundMoney, materialTransferBillItems);

			dao.save(materialTransferBillKO);
		}

	}

}
