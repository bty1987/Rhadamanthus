package com.fanglin.decoration.service.impl;

import java.util.Arrays;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.decoration.dao.DecorationAccountStatusDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationAccountStatusPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAccountStatusService;
import com.fanglin.decoration.vo.DecorationAccountStatusVO;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationAccountStatusService")
@Transactional(readOnly = true)
public class DecorationAccountStatusServiceImpl implements DecorationAccountStatusService {

	private static final String CONFIG_CHECK_ENABLE_STR = "DECORATION_ACCOUNT_CHECK_ENABLE";

	private static final String CONFIG_CHECK_SIGN_ENABLE_STR = "DECORATION_ACCOUNT_CHECK_SIGN_ENABLE";

	private static final String CONFIG_CHECK_SALES_ENABLE_STR = "DECORATION_ACCOUNT_CHECK_SALES_ENABLE";

	private static final String CONFIG_CHECK_CONSTRUCTION_ENABLE_STR = "DECORATION_ACCOUNT_CHECK_CONSTRUCTION_ENABLE";

	private static final String CONFIG_CHECK_SELECTION_ENABLE_STR = "DECORATION_ACCOUNT_CHECK_SELECTION_ENABLE";

	private static final String CONFIG_CHECK_DECORATION_PAYMENT_ENABLE_STR = "DECORATION_ACCOUNT_CHECK_DECORATION_PAYMENT_ENABLE";

	private static final String CONFIG_CHECK_SALES_PAYMENT_ENABLE_STR = "DECORATION_ACCOUNT_CHECK_SALES_PAYMENT_ENABLE";

	private static final String CONFIG_DECORATION_PAYMENT_SCALE_STR = "DECORATION_ACCOUNT_DECORATION_PAYMENT_SCALE";

	private static final String CONFIG_SALES_PAYMENT_SCALE_STR = "DECORATION_ACCOUNT_SALES_PAYMENT_SCALE";

	@Autowired
	private DecorationAccountStatusDao decorationAccountStatusDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public DecorationAccountStatusVO queryDecorationAccountStatusByOrderId(DecorationAccountStatusVO decorationAccountStatusVO) {

		DecorationAccountStatusPO decorationAccountStatusPO = decorationAccountStatusDao.queryDecorationAccountStatusByOrderId(decorationAccountStatusVO.getOrderId());

		if (decorationAccountStatusPO == null) return null;

		decorationAccountStatusVO = new DecorationAccountStatusVO();

		BeanUtil.copyProperties(decorationAccountStatusPO, decorationAccountStatusVO);

		return decorationAccountStatusVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public DecorationAccountStatusPO makeDecorationAccountStatus(String orderId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		DecorationAccountStatusPO decorationAccountStatusPO = decorationAccountStatusDao.queryDecorationAccountStatusByOrderId(orderId);

		if (decorationAccountStatusPO == null) {
			decorationAccountStatusPO = new DecorationAccountStatusPO();
			decorationAccountStatusPO.setOrderId(orderId);
		}

		int company = decorationPO.getCompany();
		boolean checkEnable = isEnable(CONFIG_CHECK_ENABLE_STR, company);

		decorationAccountStatusPO.setCompany(company);
		decorationAccountStatusPO.setSignStatus(makeStatus(checkEnable, CONFIG_CHECK_SIGN_ENABLE_STR, company, Arrays.asList(DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_FINAL_INT).contains(decorationPO.getStatus())));
		decorationAccountStatusPO.setSalesStatus(makeStatus(checkEnable, CONFIG_CHECK_SALES_ENABLE_STR, company, countSalesUnfinish(orderId) == 0));
		decorationAccountStatusPO.setConstructionStatus(makeConstructionStatus(decorationAccountStatusPO, checkEnable, company, orderId));
		decorationAccountStatusPO.setSelectionStatus(makeStatus(checkEnable, CONFIG_CHECK_SELECTION_ENABLE_STR, company, countSelectionUnfinish(orderId) == 0));
		decorationAccountStatusPO.setDecorationPaymentTarget((short) getInt(CONFIG_DECORATION_PAYMENT_SCALE_STR, company, 99));
		decorationAccountStatusPO.setDecorationPaymentScale(decorationPO.getPaySacle());
		decorationAccountStatusPO.setDecorationPaymentStatus(makeStatus(checkEnable, CONFIG_CHECK_DECORATION_PAYMENT_ENABLE_STR, company, decorationPO.getPaySacle() >= decorationAccountStatusPO.getDecorationPaymentTarget()));
		decorationAccountStatusPO.setSalesPaymentTarget((short) getInt(CONFIG_SALES_PAYMENT_SCALE_STR, company, 99));
		decorationAccountStatusPO.setSalesPaymentScale(decorationPO.getSaleScale());
		decorationAccountStatusPO.setSalesPaymentStatus(makeStatus(checkEnable, CONFIG_CHECK_SALES_PAYMENT_ENABLE_STR, company, decorationPO.getSaleScale() >= decorationAccountStatusPO.getSalesPaymentTarget()));
		decorationAccountStatusPO.setSalesUnfinish(countSalesUnfinish(orderId));
		decorationAccountStatusPO.setSelectionUnfinish(countSelectionUnfinish(orderId));
		decorationAccountStatusPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationAccountStatusPO.setComment("");
		decorationAccountStatusPO.setStatus(makeOverallStatus(decorationAccountStatusPO));

		if (decorationAccountStatusPO.getDasid() == 0) {
			decorationAccountStatusDao.save(decorationAccountStatusPO);
		} else {
			decorationAccountStatusDao.update(decorationAccountStatusPO);
		}

		return decorationAccountStatusPO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationAccountStatus(String orderId) throws FLException {
		makeDecorationAccountStatus(orderId);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkDecorationAccountStatusForMake(String orderId, int company) throws FLException {

		if (!isEnable(CONFIG_CHECK_ENABLE_STR, company)) return;

		DecorationAccountStatusPO decorationAccountStatusPO = makeDecorationAccountStatus(orderId);

		if (decorationAccountStatusPO.getStatus() == DecorationAccountStatusPO.STATUS_FAIL_INT) {
			throw new FLException(140085, "装修决算条件不满足");
		}
	}

	private short makeConstructionStatus(DecorationAccountStatusPO decorationAccountStatusPO, boolean checkEnable, int company, String orderId) {

		if (!checkEnable || !isEnable(CONFIG_CHECK_CONSTRUCTION_ENABLE_STR, company)) {
			decorationAccountStatusPO.setConstructionCnid(0);
			decorationAccountStatusPO.setConstructionName("");
			return DecorationAccountStatusPO.STATUS_UNCHECK_INT;
		}

		boolean hasAccountNode = false;

		for (ConstructionSchedulePO constructionSchedulePO : constructionScheduleDao.queryConstructionScheduleForAccountByOrderId(orderId)) {

			if (constructionSchedulePO.getNode() == null) continue;

			hasAccountNode = true;

			ConstructionNodePO constructionNodePO = constructionSchedulePO.getNode();

			decorationAccountStatusPO.setConstructionCnid(constructionNodePO.getCnid());
			decorationAccountStatusPO.setConstructionName(constructionNodePO.getName());

			if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_FINISH_INT) return DecorationAccountStatusPO.STATUS_FAIL_INT;
		}

		if (!hasAccountNode) {
			decorationAccountStatusPO.setConstructionCnid(0);
			decorationAccountStatusPO.setConstructionName("");
		}

		return hasAccountNode ? DecorationAccountStatusPO.STATUS_PASS_INT : DecorationAccountStatusPO.STATUS_FAIL_INT;
	}

	private short makeStatus(boolean checkEnable, String key, int company, boolean pass) {

		if (!checkEnable || !isEnable(key, company)) return DecorationAccountStatusPO.STATUS_UNCHECK_INT;

		return pass ? DecorationAccountStatusPO.STATUS_PASS_INT : DecorationAccountStatusPO.STATUS_FAIL_INT;
	}

	private short makeOverallStatus(DecorationAccountStatusPO decorationAccountStatusPO) {

		if (Arrays.asList(decorationAccountStatusPO.getSignStatus(), decorationAccountStatusPO.getSalesStatus(), decorationAccountStatusPO.getConstructionStatus(), decorationAccountStatusPO.getSelectionStatus(), decorationAccountStatusPO.getDecorationPaymentStatus(), decorationAccountStatusPO.getSalesPaymentStatus()).contains(DecorationAccountStatusPO.STATUS_FAIL_INT)) {
			return DecorationAccountStatusPO.STATUS_FAIL_INT;
		}

		if (Arrays.asList(decorationAccountStatusPO.getSignStatus(), decorationAccountStatusPO.getSalesStatus(), decorationAccountStatusPO.getConstructionStatus(), decorationAccountStatusPO.getSelectionStatus(), decorationAccountStatusPO.getDecorationPaymentStatus(), decorationAccountStatusPO.getSalesPaymentStatus()).contains(DecorationAccountStatusPO.STATUS_PASS_INT)) {
			return DecorationAccountStatusPO.STATUS_PASS_INT;
		}

		return DecorationAccountStatusPO.STATUS_UNCHECK_INT;
	}

	private int countSalesUnfinish(String orderId) {
		return salesDao.countSalesForUnfinishByOrderId(orderId);
	}

	private int countSelectionUnfinish(String orderId) {
		return selectionItemDao.countSelectionItemForUnfinishByOrderId(orderId);
	}

	private boolean isEnable(String key, int company) {
		return "1".equals(getValue(key, company, "0"));
	}

	private int getInt(String key, int company, int defaultValue) {

		try {
			return Integer.parseInt(getValue(key, company, String.valueOf(defaultValue)));
		} catch (NumberFormatException e) {
			return defaultValue;
		}
	}

	private String getValue(String key, int company, String defaultValue) {

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(key, company);

		if (systemConfigPO == null && company != 0) {
			systemConfigPO = systemConfigDao.querySystemConfig(key, 0);
		}

		return systemConfigPO == null ? defaultValue : systemConfigPO.value(defaultValue);
	}

}
