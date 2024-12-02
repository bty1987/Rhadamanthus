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
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.po.ConstructionNodePO;
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
import com.fanglin.sales.dao.OalesDao;
import com.fanglin.sales.po.OalesPO;
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
	private OalesDao oalesDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private DecorationMidpackDao decorationMidpackDao;

	@Autowired
	private DecorationHolonomyDao decorationHolonomyDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

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

		if (quotationPO == null) {
			throw new FLException(200017, "默认报价不存在");
		}

		ConstructionNodePO constructionNoderPO = constructionNodeDao.get(decorationPO.getProjectStatus());

		if (constructionNoderPO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		short status = decorationPO.getStatus();
		long projectStatus = constructionNoderPO.getSort();

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
	public void updateDecorationForPayScale(DecorationVO decorationVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		long payTotal = 0;
		long factPrice = 0;

		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT, DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT };

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationPO.getOrderId(), paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

		for (DecorationPaymentPO decorationPayment : decorationPaymentPOs) {

			if (decorationPayment.getSort() == 0) continue;

			if (decorationPayment.getPaymentStatus() != DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT) {
				payTotal = Arith.add(payTotal, decorationPayment.getReferMoney());
			}

			factPrice = Arith.add(factPrice, decorationPayment.getReferMoney());
		}

		long payScale = factPrice != 0 ? Arith.mul(Arith.div(payTotal, factPrice), 100) : 0;

		decorationPO.setPaySacle((short) (payScale > 100 ? 100 : payScale));

		decorationDao.update(decorationPO);
	}

	@Override
	public void updateDecorationForSaleScale(DecorationVO decorationVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		String orderId = decorationPO.getOrderId();

		long saleTotal = 0;
		long priceTotal = 0;

		salesPaymentDao.flush();

		saleTotal = salesPaymentDao.amountSalesPayment(orderId);

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);
		saleTotal = Arith.add(saleTotal, advancePaymentPO != null ? advancePaymentPO.getMaterialBalance() : 0);

		saleTotal = Arith.add(saleTotal, oalesDao.amountOales(orderId, OalesPO.ISSCALE_MATCH_INT));

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
