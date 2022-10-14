package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.dao.DecorationMidpackDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.decoration.po.DecorationMidpackPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.vo.DecorationAdditionVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("decorationAdditionService")
@Transactional(readOnly = true)
public class DecorationAdditionServiceImpl implements DecorationAdditionService {

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private DecorationMidpackDao decorationMidpackDao;

	@Autowired
	private DecorationHolonomyDao decorationHolonomyDao;

	@Override
	public DecorationAdditionVO queryDecorationAdditionByOrderId(DecorationAdditionVO decorationAdditionVO) {

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(decorationAdditionVO.getOrderId());
		decorationAdditionVO = new DecorationAdditionVO();

		BeanUtil.copyProperties(decorationAdditionPO, decorationAdditionVO);

		return decorationAdditionVO;
	}

	@Override
	public Map<String, Object> queryDecorationConfig(List<Short> typeness, int company) {

		Map<String, Object> config = new HashMap<String, Object>();

		JSONArray holonomyConfigs = new JSONArray();

		List<SystemConfigPO> systemConfigPOs = new ArrayList<SystemConfigPO>();

		for (short type : typeness) {

			List<SystemConfigPO> _configs = systemConfigDao.obtainSystemConfig(String.format(DecorationPO.CONFIG_KEY_HOLONOMY_STR, type), company);

			systemConfigPOs.addAll(_configs);
		}

		for (SystemConfigPO _config : systemConfigPOs) {
			holonomyConfigs.addAll(JSONArray.parseArray(_config == null ? "[]" : _config.value("[]")));
		}

		config.put("machingType", holonomyConfigs);

		return config;
	}

	@Override
	public short queryDecorationSchedule(DecorationVO decorationVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationVO.getOrderId());

		short status = decorationPO.getStatus();
		long projectStatus = decorationPO.getProjectStatus();

		short schedule = 0;// 默认值 0.订单生成

		if (quotationPO != null && schedule < 1) // 判断报价信息是否存在, 存在 值为1.预算
		schedule = 1;

		if (status == DecorationPO.STATUS_SIGNED_INT && schedule < 2) // 判断装修单状态是否为3, 是 值为 2.合同签单
		schedule = 2;

		if (decorationPO.getSourceStatus() == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT && schedule < 3) // 判断装修确认状态是否为1, 是 值为 3.签单设计方案完成
		schedule = 3;

		if (decorationPO.getSourceStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT && schedule < 4) // 判断装修确认状态是否为2, 是 值为 4.开工设计方案完成
		schedule = 4;

		if (projectStatus >= ConstructionPO.SCHEDULE_TYPE_WATERWAYCIRCUIT_INT && schedule < (short) (projectStatus + 2)) // 判断装修单工程状态是否为3-13, 是 值为5-15.铲大白 - 保洁
		schedule = (short) (projectStatus + 2);

		if (status == DecorationPO.STATUS_FINAL_INT && schedule < 16) // 判断装修单状态是否为7, 是 值为 16.决算
		schedule = 16;

		if (projectStatus == ConstructionPO.SCHEDULE_TYPE_PUTLINE_INT) // 判断装修单工程状态是否为2, 是 值为 17.工程完工
		schedule = 17;

		return schedule;
	}

	@Override
	public void updateDecorationForPayScale(DecorationPO decorationPO) throws FLException {

		long payTotal = 0;
		long factPrice = decorationPO.getFactPrice();

		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT };

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationPO.getOrderId(), paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

		for (DecorationPaymentPO decorationPayment : decorationPaymentPOs) {
			payTotal = Arith.add(payTotal, decorationPayment.getReferMoney());
		}

		short decorationPayScale = (short) (factPrice != 0 ? Arith.mul(Arith.div(payTotal, factPrice), 100) : 0);

		decorationPO.setPaySacle(decorationPayScale > 100 ? (short) 100 : decorationPayScale);

		decorationDao.update(decorationPO);
	}

	@Override
	public void updateDecorationForSaleScale(DecorationPO decorationPO) throws FLException {

		String orderId = decorationPO.getOrderId();

		long saleTotal = 0;
		long priceTotal = 0;

		salesPaymentDao.flush();

		saleTotal = salesPaymentDao.amountSalesPayment(orderId);

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);
		saleTotal = Arith.add(saleTotal, advancePaymentPO != null ? advancePaymentPO.getMaterialBalance() : 0);

		if (decorationPO.getType() == DecorationPO.TYPE_MIDPACK_INT) {

			DecorationMidpackPO decorationMidpackPO = decorationMidpackDao.queryDecorationMidpack(orderId);

			if (decorationMidpackPO != null) {

				priceTotal = decorationMidpackPO.getMaterialPrice();
				decorationMidpackPO.setMaterialPaidup(saleTotal);

				decorationMidpackDao.update(decorationMidpackPO);
			}

		} else if (decorationPO.getType() == DecorationPO.TYPE_HOLONOMY_INT) {

			DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(orderId);

			if (decorationHolonomyPO != null) {

				priceTotal = decorationHolonomyPO.getMaterialPrice();
				decorationHolonomyPO.setMaterialPaidup(saleTotal);

				decorationHolonomyDao.update(decorationHolonomyPO);
			}
		}

		short saleScale = (short) (priceTotal != 0 ? Arith.mul(Arith.div(saleTotal, priceTotal), 100) : DecorationPO.TYPE_INIT_SALESCALE_INT);

		decorationPO.setSaleScale(saleScale);

		decorationDao.update(decorationPO);

	}
}
