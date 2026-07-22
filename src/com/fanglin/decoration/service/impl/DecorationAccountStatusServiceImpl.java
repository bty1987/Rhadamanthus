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
	public DecorationAccountStatusPO updateDecorationAccountStatus(String orderId) throws FLException {

		DecorationAccountStatusPO decorationAccountStatusPO = ensureDecorationAccountStatus(orderId);

		updateSignStatus(decorationAccountStatusPO);
		updateSalesStatus(decorationAccountStatusPO);
		updateConstructionStatus(decorationAccountStatusPO);
		updateSelectionStatus(decorationAccountStatusPO);
		updateDecorationPaymentStatus(decorationAccountStatusPO);
		updateSalesPaymentStatus(decorationAccountStatusPO);
		updateStatus(decorationAccountStatusPO);

		return decorationAccountStatusPO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationAccountStatus(String orderId, short type) throws FLException {

		if (decorationAccountStatusDao.queryDecorationAccountStatusByOrderId(orderId) == null) {
			updateDecorationAccountStatus(orderId);
			return;
		}

		DecorationAccountStatusPO decorationAccountStatusPO = ensureDecorationAccountStatus(orderId);

		switch (type) {
			case DecorationAccountStatusPO.TYPE_SIGN_INT:
				updateSignStatus(decorationAccountStatusPO);
				break;
			case DecorationAccountStatusPO.TYPE_SALES_INT:
				updateSalesStatus(decorationAccountStatusPO);
				break;
			case DecorationAccountStatusPO.TYPE_CONSTRUCTION_INT:
				updateConstructionStatus(decorationAccountStatusPO);
				break;
			case DecorationAccountStatusPO.TYPE_SELECTION_INT:
				updateSelectionStatus(decorationAccountStatusPO);
				break;
			case DecorationAccountStatusPO.TYPE_DECORATION_PAYMENT_INT:
				updateDecorationPaymentStatus(decorationAccountStatusPO);
				break;
			case DecorationAccountStatusPO.TYPE_SALES_PAYMENT_INT:
				updateSalesPaymentStatus(decorationAccountStatusPO);
				break;
			default:
				return;
		}

		updateStatus(decorationAccountStatusPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkDecorationAccountStatus(String orderId, int company) throws FLException {

		if (!isEnable(CONFIG_CHECK_ENABLE_STR, company)) return;

		DecorationAccountStatusPO decorationAccountStatusPO = updateDecorationAccountStatus(orderId);

		if (decorationAccountStatusPO.getStatus() == DecorationAccountStatusPO.STATUS_FAIL_INT) {
			throw new FLException(140085, "装修决算条件不满足");
		}
	}

	private void updateSignStatus(DecorationAccountStatusPO decorationAccountStatusPO) throws FLException {

		DecorationPO decorationPO = queryDecoration(decorationAccountStatusPO.getOrderId());
		int company = decorationPO.getCompany();
		boolean checkEnable = isEnable(CONFIG_CHECK_ENABLE_STR, company);

		decorationAccountStatusPO.setCompany(company);
		decorationAccountStatusPO.setSignStatus(makeStatus(checkEnable, CONFIG_CHECK_SIGN_ENABLE_STR, company, Arrays.asList(DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_FINAL_INT).contains(decorationPO.getStatus())));
	}

	private void updateSalesStatus(DecorationAccountStatusPO decorationAccountStatusPO) {

		String orderId = decorationAccountStatusPO.getOrderId();
		int company = decorationAccountStatusPO.getCompany();
		boolean checkEnable = isEnable(CONFIG_CHECK_ENABLE_STR, company);
		int salesUnfinish = salesDao.countSalesForUnfinishByOrderId(orderId);

		decorationAccountStatusPO.setSalesUnfinish(salesUnfinish);
		decorationAccountStatusPO.setSalesStatus(makeStatus(checkEnable, CONFIG_CHECK_SALES_ENABLE_STR, company, salesUnfinish == 0));
	}

	private void updateConstructionStatus(DecorationAccountStatusPO decorationAccountStatusPO) {

		int company = decorationAccountStatusPO.getCompany();
		boolean checkEnable = isEnable(CONFIG_CHECK_ENABLE_STR, company);

		decorationAccountStatusPO.setConstructionStatus(makeConstructionStatus(decorationAccountStatusPO, checkEnable, company));
	}

	private void updateSelectionStatus(DecorationAccountStatusPO decorationAccountStatusPO) {

		String orderId = decorationAccountStatusPO.getOrderId();
		int company = decorationAccountStatusPO.getCompany();
		boolean checkEnable = isEnable(CONFIG_CHECK_ENABLE_STR, company);
		int selectionUnfinish = selectionItemDao.countSelectionItemForUnfinishByOrderId(orderId);

		decorationAccountStatusPO.setSelectionUnfinish(selectionUnfinish);
		decorationAccountStatusPO.setSelectionStatus(makeStatus(checkEnable, CONFIG_CHECK_SELECTION_ENABLE_STR, company, selectionUnfinish == 0));
	}

	private void updateDecorationPaymentStatus(DecorationAccountStatusPO decorationAccountStatusPO) throws FLException {

		DecorationPO decorationPO = queryDecoration(decorationAccountStatusPO.getOrderId());
		int company = decorationPO.getCompany();
		boolean checkEnable = isEnable(CONFIG_CHECK_ENABLE_STR, company);

		decorationAccountStatusPO.setCompany(company);
		decorationAccountStatusPO.setDecorationPaymentTarget((short) getInt(CONFIG_DECORATION_PAYMENT_SCALE_STR, company, 99));
		decorationAccountStatusPO.setDecorationPaymentScale(decorationPO.getPaySacle());
		decorationAccountStatusPO.setDecorationPaymentStatus(makeStatus(checkEnable, CONFIG_CHECK_DECORATION_PAYMENT_ENABLE_STR, company, decorationPO.getPaySacle() >= decorationAccountStatusPO.getDecorationPaymentTarget()));
	}

	private void updateSalesPaymentStatus(DecorationAccountStatusPO decorationAccountStatusPO) throws FLException {

		DecorationPO decorationPO = queryDecoration(decorationAccountStatusPO.getOrderId());
		int company = decorationPO.getCompany();
		boolean checkEnable = isEnable(CONFIG_CHECK_ENABLE_STR, company);

		decorationAccountStatusPO.setCompany(company);
		decorationAccountStatusPO.setSalesPaymentTarget((short) getInt(CONFIG_SALES_PAYMENT_SCALE_STR, company, 99));
		decorationAccountStatusPO.setSalesPaymentScale(decorationPO.getSaleScale());
		decorationAccountStatusPO.setSalesPaymentStatus(makeStatus(checkEnable, CONFIG_CHECK_SALES_PAYMENT_ENABLE_STR, company, decorationPO.getSaleScale() >= decorationAccountStatusPO.getSalesPaymentTarget()));
	}

	private DecorationAccountStatusPO ensureDecorationAccountStatus(String orderId) throws FLException {

		DecorationPO decorationPO = queryDecoration(orderId);
		DecorationAccountStatusPO decorationAccountStatusPO = decorationAccountStatusDao.queryDecorationAccountStatusByOrderId(orderId);

		if (decorationAccountStatusPO == null) {
			decorationAccountStatusPO = new DecorationAccountStatusPO();
			decorationAccountStatusPO.setOrderId(orderId);
			decorationAccountStatusPO.setCompany(decorationPO.getCompany());
			decorationAccountStatusPO.setStatus(DecorationAccountStatusPO.STATUS_UNCHECK_INT);
			decorationAccountStatusPO.setSignStatus(DecorationAccountStatusPO.STATUS_UNCHECK_INT);
			decorationAccountStatusPO.setSalesStatus(DecorationAccountStatusPO.STATUS_UNCHECK_INT);
			decorationAccountStatusPO.setConstructionStatus(DecorationAccountStatusPO.STATUS_UNCHECK_INT);
			decorationAccountStatusPO.setSelectionStatus(DecorationAccountStatusPO.STATUS_UNCHECK_INT);
			decorationAccountStatusPO.setDecorationPaymentStatus(DecorationAccountStatusPO.STATUS_UNCHECK_INT);
			decorationAccountStatusPO.setSalesPaymentStatus(DecorationAccountStatusPO.STATUS_UNCHECK_INT);
			decorationAccountStatusPO.setDecorationPaymentTarget((short) getInt(CONFIG_DECORATION_PAYMENT_SCALE_STR, decorationPO.getCompany(), 99));
			decorationAccountStatusPO.setSalesPaymentTarget((short) getInt(CONFIG_SALES_PAYMENT_SCALE_STR, decorationPO.getCompany(), 99));
			decorationAccountStatusPO.setConstructionName("");
			decorationAccountStatusPO.setComment("");
			decorationAccountStatusDao.save(decorationAccountStatusPO);
		} else {
			decorationAccountStatusPO.setCompany(decorationPO.getCompany());
		}

		return decorationAccountStatusPO;
	}

	private DecorationPO queryDecoration(String orderId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		return decorationPO;
	}

	private short makeConstructionStatus(DecorationAccountStatusPO decorationAccountStatusPO, boolean checkEnable, int company) {

		if (!checkEnable || !isEnable(CONFIG_CHECK_CONSTRUCTION_ENABLE_STR, company)) {
			decorationAccountStatusPO.setConstructionCnid(0);
			decorationAccountStatusPO.setConstructionName("");
			return DecorationAccountStatusPO.STATUS_UNCHECK_INT;
		}

		boolean hasAccountNode = false;

		for (ConstructionSchedulePO constructionSchedulePO : constructionScheduleDao.queryConstructionScheduleByOrderId(decorationAccountStatusPO.getOrderId())) {

			if (constructionSchedulePO.getNode() == null) continue;

			if (constructionSchedulePO.getNode().getAccount() != ConstructionNodePO.ACCOUNT_VALID_INT) continue;

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

	private void updateStatus(DecorationAccountStatusPO decorationAccountStatusPO) {

		decorationAccountStatusPO.setStatus(makeOverallStatus(decorationAccountStatusPO));
		decorationAccountStatusPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationAccountStatusDao.update(decorationAccountStatusPO);
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
