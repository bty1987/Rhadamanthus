/**
 * @File Name		: QuotationServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.AddReduceItemDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.QuotetionDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaItemDao;
import com.fanglin.quotation.dao.SelectionDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.QuotationDO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaPO;
import com.fanglin.quotation.po.QuotetionPO;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.quotation.service.QuotationService;
import com.fanglin.quotation.service.SelectionService;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("quotationService")
@Transactional(readOnly = true)
public class QuotationServiceImpl implements QuotationService {

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private ServiceRecordDao serviceRecordDao;

	@Autowired
	private ExtensionItemDao extensionItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private QuotetionDao quotetionDao;

	@Autowired
	private QuotetionFunctionAreaDao quotetionFunctionAreaDao;

	@Autowired
	private QuotetionFunctionAreaItemDao quotetionFunctionAreaItemDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Autowired
	private AddReduceItemDao addReduceItemDao;

	@Autowired
	private SelectionDao selectionDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Autowired
	private SelectionService selectionService;

	@Override
	public void pageQuotation(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<QuotationDO> quotationDOs = quotationDao.pageQuotation(paging, filters, company);

		List<QuotationVO> quotationVOs = new ArrayList<QuotationVO>();

		for (QuotationDO quotationDO : quotationDOs) {

			QuotationVO quotationVO = new QuotationVO(new DecorationVO(), new UserBaseVO());

			quotationVO.getDecoration().setSupervisor(new UserBaseVO());

			BeanUtil.copyPropertie(quotationDO, quotationVO, Arrays.asList("decoration", "creater"));

			BeanUtil.copyProperties(quotationDO.getCreater(), quotationVO.getCreater(), Arrays.asList("duty", "dept", "role"));

			quotationDO.getDecoration().ptvcascade(quotationVO.getDecoration());

			quotationVOs.add(quotationVO);
		}
		paging.setData(quotationVOs);

	}

	@Override
	public QuotationVO queryQuotationByQid(long qId) {

		QuotationPO quotationPO = quotationDao.get(qId);

		QuotationVO quotationVO = new QuotationVO();

		if (quotationPO != null) {
			handleQuotation(quotationVO, quotationPO);
		}

		return quotationVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationVO queryQuotationForDefaultByOrderId(QuotationVO quotationVO) {

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(quotationVO.getOrderId());

		if (quotationPO != null) {
			handleQuotation(quotationVO, quotationPO);
		}

		return quotationVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationVO> queryQuotationByOrderId(QuotationVO quotationVO) {

		List<QuotationVO> quotationVOs = new ArrayList<QuotationVO>();
		List<QuotationPO> quotationPOs = quotationDao.queryQuotationByOrderId(quotationVO.getOrderId());

		handleListQuotation(quotationVOs, quotationPOs, quotationVO.getOrderId());

		return quotationVOs;
	}

	@Override
	public Map<String, List<String>> queryQuotationForConfig(int company) {

		Map<String, List<String>> config = new HashMap<String, List<String>>();

		config.put("manageRates", Arrays.asList(systemConfigDao.querySystemConfig("manageRate", company).getValue().split(",")));
		config.put("trafficRates", Arrays.asList(systemConfigDao.querySystemConfig("trafficRate", company).getValue().split(",")));

		return config;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotation(QuotationVO quotationVO, String userId, int company) throws FLException {

		SystemConfigPO quotationlimit = systemConfigDao.querySystemConfig("quotationlimit", company);

		String orderId = quotationVO.getOrderId();

		QuotationPO quotationPO = new QuotationPO();

		if (quotationDao.countQuotationByOrderId(orderId) >= (quotationlimit == null ? 3 : Integer.parseInt(quotationlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(orderId);

		BeanUtil.copyProperties(quotationVO, quotationPO, Arrays.asList("creater"));

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		QuotationVersionPO quotationVersionPO = decorationPO.getVersion();

		if (quotationVersionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		quotationPO.setOrderId(orderId);
		quotationPO.setCreater(userDao.queryUserByUserId(userId));
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationPO.setManageRate(quotationVersionPO.getManageRate());
		quotationPO.setManageDiscount(quotationVersionPO.getManageDiscount());
		quotationPO.setTrafficRate(quotationVersionPO.getTrafficRate());
		quotationPO.setTrafficDiscount(quotationVersionPO.getTrafficDiscount());
		quotationPO.setTaxRate(quotationVersionPO.getTaxRate());
		quotationPO.setTaxDiscount(quotationVersionPO.getTaxDiscount());
		quotationPO.setDiscount(10000);
		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (defaultQuotationPO == null) {
			quotationPO.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT);
		} else {
			quotationPO.setDefaults(QuotationPO.DEFAULTS_NONDEFAULT_INT);
		}

		quotationDao.save(quotationPO);

		selectionService.addSelection(quotationPO.getQid(), userId);

		BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater"));

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotationFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		QuotationFunctionAreaPO autogeneration = new QuotationFunctionAreaPO(quotationPO, "生成项目", 9999, QuotationFunctionAreaPO.TYPE_MANAGEMENT_INT, index);

		quotationFunctionAreaDao.save(autogeneration);

		QuotationFunctionAreaItemPO trafficPrice = QuotationFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index);
		convertQuotationPOForAdvance(trafficPrice, "车运费", "", "其他", quotationVersionPO.getTrafficRate(), "0", 0, QuotationFunctionAreaItemPO.TYPE_TRAFFIC_INT, quotationVersionPO.getTrafficDiscount(), autogeneration, "", QuotationFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);

		QuotationFunctionAreaItemPO managePrice = QuotationFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index);
		convertQuotationPOForAdvance(managePrice, "管理费", "", "其他", quotationVersionPO.getManageRate(), "0", 0, QuotationFunctionAreaItemPO.TYPE_MANAGE_INT, quotationVersionPO.getManageDiscount(), autogeneration, "", QuotationFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);

		QuotationFunctionAreaItemPO taxPrice = QuotationFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index);
		convertQuotationPOForAdvance(taxPrice, "税金", "", "其他", quotationVersionPO.getTaxRate(), "0", 0, QuotationFunctionAreaItemPO.TYPE_TAX_INT, quotationVersionPO.getTaxDiscount(), autogeneration, "", QuotationFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);

		quotationFunctionAreaItemDao.save(trafficPrice);
		quotationFunctionAreaItemDao.save(managePrice);

		if (quotationVersionPO.getTaxDiscount() != QuotationVersionPO.TAX_NOTTAXDISCOUNT_INT) {
			quotationFunctionAreaItemDao.save(taxPrice);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotation(QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		checkQuotationForDefaultByOrderId(quotationPO.getOrderId());

		quotationPO.setStyle(quotationVO.getStyle());
		quotationPO.setName(quotationVO.getName());
		quotationPO.setContent(quotationVO.getContent());

		quotationDao.update(quotationPO);

		BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int changeQuotationForDefault(QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(quotationPO.getOrderId());

		if (quotationPO.getDefaults() == QuotationPO.DEFAULTS_NONDEFAULT_INT) {

			decorationPO.setQuotationPrice(quotationPO.getTotalPrice());
			decorationPO.setDiscount(quotationPO.getDiscount());

			quotationPO.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT);

			quotationDao.clearQuotationForDefaultByOrderId(quotationVO.getOrderId());

			quotationDao.update(quotationPO);
			decorationDao.update(decorationPO);
		}

		BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationForAdvance(QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		checkQuotationForDefaultByOrderId(quotationPO.getOrderId());

		convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		if (quotationPO.getDefaults() == QuotationPO.DEFAULTS_DEFAULT_INT) {

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());

			decorationPO.setQuotationPrice(quotationPO.getTotalPrice());
			decorationPO.setDiscount(quotationPO.getDiscount());

			decorationDao.update(decorationPO);
		}

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.queryQuotationFunctionAreaForTypeByQuotationId(quotationVO.getQid(), QuotationFunctionAreaPO.TYPE_MANAGEMENT_INT);

		if (quotationVO.getTrafficDiscount() != null) {
			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemForTypeByQuotationFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaPO.getQfaId(), QuotationFunctionAreaItemPO.TYPE_TRAFFIC_INT);
			quotationFunctionAreaItemPO.setDiscount((quotationVO.getTrafficDiscount()));
			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		}

		if (quotationVO.getManageDiscount() != null) {
			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemForTypeByQuotationFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaPO.getQfaId(), QuotationFunctionAreaItemPO.TYPE_MANAGE_INT);
			quotationFunctionAreaItemPO.setDiscount((quotationVO.getManageDiscount()));
			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		}

		if (quotationVO.getTaxDiscount() != null) {

			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemForTypeByQuotationFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaPO.getQfaId(), QuotationFunctionAreaItemPO.TYPE_TAX_INT);

			if (quotationFunctionAreaItemPO != null) {
				quotationFunctionAreaItemPO.setDiscount((quotationVO.getTaxDiscount()));
				quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
			}
		}

		quotationDao.update(quotationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationForStatus(QuotationVO quotationVO, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		quotationPO.setStatus(quotationVO.getStatus());

		quotationDao.update(quotationPO);

		ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
		serviceRecordPO.setType(ServiceRecordPO.TYPE_CHANGE_QUOTATION_INT);
		serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		serviceRecordPO.setOperateUserId(userId);
		serviceRecordPO.setInfo(String.format("装修单:%s,报价ID%d,更新状态", quotationPO.getOrderId(), quotationPO.getQid()));

		serviceRecordDao.save(serviceRecordPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lockQuotation(QuotationVO quotationVO, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (selectionItemDao.countSelectionItem(quotationPO.getOrderId(), SelectionItemPO.TYPE_ALONE_SHORT) != 0) {
			throw new FLException(200041, "存在未关联选材项");
		}

		quotationPO.setStatus(QuotationPO.STATUS_LOCK_INT);

		quotationDao.update(quotationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unlockQuotation(QuotationVO quotationVO, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		quotationPO.setStatus(QuotationPO.STATUS_INIT_INT);

		quotationDao.update(quotationPO);

		ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
		serviceRecordPO.setType(ServiceRecordPO.TYPE_CHANGE_QUOTATION_INT);
		serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		serviceRecordPO.setOperateUserId(userId);
		serviceRecordPO.setInfo(String.format("装修单:%s,报价ID%d,解锁", quotationPO.getOrderId(), quotationPO.getQid()));

		serviceRecordDao.save(serviceRecordPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cloneQuotation(QuotationVO quotationVO, String no, String userId, int company) throws FLException {

		String orderId = quotationVO.getOrderId();

		UserPO userPO = userDao.queryUserByUserId(userId);

		QuotationPO quotationPO = new QuotationPO();

		QuotetionPO copyQuotetionPO = quotetionDao.queryQuotetionByNo(no);

		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(orderId);

		if (copyQuotetionPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		SystemConfigPO quotetionlimit = systemConfigDao.querySystemConfig("quotetionlimit", company);

		if (quotetionDao.countQuotetionByCuid(userPO.getUid()) >= (quotetionlimit == null ? 10 : Integer.parseInt(quotetionlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		SystemConfigPO quotationtimelimit = systemConfigDao.querySystemConfig("quotationtimelimit", company);

		if (decorationPO.getQuotationTimeLimit() >= (quotationtimelimit == null ? 3 : Integer.parseInt(quotationtimelimit.getValue()))) {
			throw new FLException(200018, "报价复制次数达到上线");
		} else {
			decorationPO.setQuotationTimeLimit(decorationPO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationPO);
		}

		quotationPO.ptp(orderId, userPO, copyQuotetionPO.getName(), "其他");

		if (!decorationPO.getVersion().getNo().equals(copyQuotetionPO.getVersion())) {
			throw new FLException(200002, "复制报价与当前报价版本不同,不能拷贝");
		}

		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (defaultQuotationPO != null) {// 不是第一个报价, 把默认删除
			deleteQuotationByQId(defaultQuotationPO.getQid(), defaultQuotationPO.getOrderId());
		}

		quotationDao.save(quotationPO);

		selectionService.addSelection(quotationPO.getQid(), userId);

		copyQuotetion(quotationPO.getQid(), copyQuotetionPO.getQid());

		BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int replicaQuotation(QuotationVO quotationVO, String userId, int company) throws FLException {

		long replicaQId = quotationVO.getQid();

		QuotationPO quotationPO = new QuotationPO();

		String orderId = quotationVO.getOrderId();

		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(orderId);

		QuotationPO copyQuotationPO = quotationDao.get(replicaQId);

		if (copyQuotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		DecorationPO _decorationPO = decorationDao.queryDecorationByOrderId(copyQuotationPO.getOrderId());

		SystemConfigPO quotationlimit = systemConfigDao.querySystemConfig("quotationlimit", company);

		if (quotationDao.countQuotationByOrderId(orderId) >= (quotationlimit == null ? 3 : Integer.parseInt(quotationlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		if (quotationDao.countQuotationByOrderId(orderId, QuotationPO.STATUS_LOCK_INT) > 0) {
			throw new FLException(200033, "报价已锁定");
		}

		SystemConfigPO quotationtimelimit = systemConfigDao.querySystemConfig("quotationtimelimit", company);

		if (decorationPO.getQuotationTimeLimit() >= (quotationtimelimit == null ? 3 : Integer.parseInt(quotationtimelimit.getValue()))) {
			throw new FLException(200018, "报价复制次数达到上线");
		} else {
			decorationPO.setQuotationTimeLimit(decorationPO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationPO);
		}

		BeanUtil.copyProperties(quotationVO, quotationPO, Arrays.asList("qid", "creater"));

		quotationPO.ptp(orderId, userDao.queryUserByUserId(userId), copyQuotationPO.getName(), copyQuotationPO.getStyle());

		if (orderId.equals(copyQuotationPO.getOrderId())) {
			throw new FLException(200019, "拷贝报价不能在订单内完成");
		}

		if (!decorationPO.getVersion().getNo().equals(_decorationPO.getVersion().getNo())) {
			throw new FLException(200002, "复制报价与当前报价版本不同,不能拷贝");
		}

		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (defaultQuotationPO != null) {
			deleteQuotationByQId(defaultQuotationPO.getQid(), defaultQuotationPO.getOrderId());
		}

		quotationDao.save(quotationPO);

		selectionService.addSelection(quotationPO.getQid(), userId);

		copyQuotation(replicaQId, quotationPO.getQid());

		BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int copyQuotation(QuotationVO quotationVO, String userId, int company) throws FLException {

		Long copyQId = quotationVO.getQid();
		String orderId = quotationVO.getOrderId();

		QuotationPO quotationPO = new QuotationPO();

		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(orderId);

		checkQuotationForStatusByEnabled(copyQId);

		SystemConfigPO quotationlimit = systemConfigDao.querySystemConfig("quotationlimit", company); // 报价数量限制

		if (quotationDao.countQuotationByOrderId(orderId) >= (quotationlimit == null ? 3 : Integer.parseInt(quotationlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		if (quotationDao.countQuotationByOrderId(orderId, QuotationPO.STATUS_LOCK_INT) > 0) {
			throw new FLException(200033, "报价已锁定");
		}

		SystemConfigPO quotationtimelimit = systemConfigDao.querySystemConfig("quotationtimelimit", company); // 报价复制/拷贝次数限制

		if (decorationPO.getQuotationTimeLimit() >= (quotationtimelimit == null ? 3 : Integer.parseInt(quotationtimelimit.getValue()))) {
			throw new FLException(200018, "报价复制次数达到上线");
		} else {
			decorationPO.setQuotationTimeLimit(decorationPO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationPO);
		}

		BeanUtil.copyProperties(quotationVO, quotationPO, Arrays.asList("qid", "creater"));

		quotationPO.setOrderId(orderId);
		quotationPO.setCreater(userDao.queryUserByUserId(userId));
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		QuotationPO copyPO = quotationDao.get(copyQId);
		quotationPO.setDiscount(copyPO.getDiscount());
		quotationPO.setTotalPrice(copyPO.getTotalPrice());

		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (defaultQuotationPO == null) {
			quotationPO.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT);
		} else {
			quotationPO.setDefaults(QuotationPO.DEFAULTS_NONDEFAULT_INT);
		}
		quotationDao.save(quotationPO);

		selectionService.addSelection(quotationPO.getQid(), userId);

		copyQuotation(copyQId, quotationPO.getQid());

		BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationById(QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		checkQuotationForDefaultByOrderId(quotationPO.getOrderId());

		if (quotationPO.getDefaults() == QuotationPO.DEFAULTS_DEFAULT_INT) {
			throw new FLException(200014, "默认报价不能删除");
		}

		deleteQuotationByQId(quotationVO.getQid(), quotationPO.getOrderId());

		return 0;
	}

	public static void convertQuotationVOToPOForAdvance(QuotationVO quotationVO, QuotationPO quotationPO) {

		quotationPO.setBasePrice(quotationVO.getBasePrice());
		quotationPO.setUndisPrice(quotationVO.getUndisPrice());
		quotationPO.setDisPrice(quotationVO.getDisPrice());

		quotationPO.setDiscount(quotationVO.getDiscount());
		quotationPO.setTotalPrice(quotationVO.getTotalPrice());

		quotationPO.setTrafficPrice(quotationVO.getTrafficPrice());
		quotationPO.setTrafficRate(quotationVO.getTrafficRate());
		quotationPO.setManagePrice(quotationVO.getManagePrice());
		quotationPO.setManageRate(quotationVO.getManageRate());
		quotationPO.setTaxPrice(quotationVO.getTaxPrice());
		quotationPO.setTaxRate(quotationVO.getTaxRate());

		quotationPO.setCostPrice(quotationVO.getCostPrice());
		quotationPO.setUnachePrice(quotationVO.getUnachePrice());

		if (quotationVO.getTrafficDiscount() != null) quotationPO.setTrafficDiscount(quotationVO.getTrafficDiscount());
		if (quotationVO.getManageDiscount() != null) quotationPO.setManageDiscount(quotationVO.getManageDiscount());
		if (quotationVO.getTaxDiscount() != null) quotationPO.setTaxDiscount(quotationVO.getTaxDiscount());
	}

	@Transactional(rollbackFor = Exception.class)
	private int copyQuotation(long quotationId, long newQuotationId) throws FLException {

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationId);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotationFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {

			QuotationFunctionAreaPO _quotationFunctionAreaPO = new QuotationFunctionAreaPO();
			BeanUtil.copyProperties(quotationFunctionAreaPO, _quotationFunctionAreaPO, Arrays.asList("qfaId"));
			_quotationFunctionAreaPO.setQuotation(new QuotationPO(newQuotationId));
			_quotationFunctionAreaPO.setIndex(index);

			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaPO.getQfaId());

			quotationFunctionAreaDao.save(_quotationFunctionAreaPO);

			for (QuotationFunctionAreaItemPO quotationFunctionAreaItemPO : quotationFunctionAreaItemPOs) {

				QuotationFunctionAreaItemPO clazz = QuotationFunctionAreaItemPO.factoryToInstance(_quotationFunctionAreaPO.getQfaId(), index);

				BeanUtil.copyProperties(quotationFunctionAreaItemPO, clazz, Arrays.asList("qfaiId"));
				clazz.setQuotationFunctionArea(_quotationFunctionAreaPO);
				quotationFunctionAreaItemDao.save(clazz);
			}
		}

		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	private int copyQuotetion(long quotationId, long quotetionId) throws FLException {

		List<QuotetionFunctionAreaPO> quotetionFunctionAreaPOs = quotetionFunctionAreaDao.queryQuotetionFunctionAreaByQuotetionId(quotetionId);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotationFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (QuotetionFunctionAreaPO quotetionFunctionAreaPO : quotetionFunctionAreaPOs) {

			QuotationFunctionAreaPO quotationFunctionAreaPO = new QuotationFunctionAreaPO();
			quotationFunctionAreaPO.setFunctionAreaName(quotetionFunctionAreaPO.getName());
			quotationFunctionAreaPO.setFunctionAreaOrder(quotetionFunctionAreaPO.getFunctionAreaOrder());
			quotationFunctionAreaPO.setType(quotetionFunctionAreaPO.getType());
			quotationFunctionAreaPO.setQuotation(new QuotationPO(quotationId));
			quotationFunctionAreaPO.setTotal(0);
			quotationFunctionAreaPO.setQfaId(quotationId);
			quotationFunctionAreaPO.setIndex(index);

			quotationFunctionAreaDao.save(quotationFunctionAreaPO);

			List<QuotetionFunctionAreaItemPO> quotetionFunctionAreaItemPOs = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex()), quotetionFunctionAreaPO.getQfaId());

			for (QuotetionFunctionAreaItemPO quotetionFunctionAreaItem : quotetionFunctionAreaItemPOs) {

				QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = QuotationFunctionAreaItemPO.factoryToInstance(quotationFunctionAreaPO.getQfaId(), index);

				quotationFunctionAreaItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);

				if (quotetionFunctionAreaItem.getQiid() != 0) {
					quotationFunctionAreaItemPO.setQuotationItem(quotationItemDao.get(quotetionFunctionAreaItem.getQiid()));
				}

				quotationFunctionAreaItemPO.ptp(quotetionFunctionAreaItem);

				quotationFunctionAreaItemPO.setIndex(index);

				quotationFunctionAreaItemDao.save(quotationFunctionAreaItemPO);
			}
		}
		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	private int deleteQuotationByQId(long qId, String orderId) throws FLException {

		List<QuotationFunctionAreaPO> quotationFunctionAreas = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(qId);

		if (extensionItemDao.countExtensionItem(quotationFunctionAreas) > 0) {
			throw new FLException(200028, "功能区存在拓展项");
		}

		if (addReduceItemDao.countAddReduceItem(quotationFunctionAreas) > 0) {
			throw new FLException(200032, "功能区存在增减项");
		}

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreas) {

			long quotatoinFunctionAreaId = quotationFunctionAreaPO.getQfaId();

			if (selectionItemDao.countSelectionItem(orderId, quotatoinFunctionAreaId) > 0) {
				throw new FLException(200037, "存在关联选材项");
			}

			String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex());

			quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(tableName, quotatoinFunctionAreaId); // 删除报价项
			quotationFunctionAreaDao.deleteById(quotatoinFunctionAreaId); // 删除功能区
		}

		quotationDao.deleteById(qId); // 删除报价

		selectionDao.deleteSelectionByQid(qId);// 删除选材

		return 0;
	}

	private void convertQuotationPOForAdvance(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO, String itemName, String measurementUnit, String workType, int unitPrice, String formula, int num, short type, short discount, QuotationFunctionAreaPO quotationFunctionArea, String content, short subtype) {
		quotationFunctionAreaItemPO.setItemName(itemName);
		quotationFunctionAreaItemPO.setMeasurementUnit(measurementUnit);
		quotationFunctionAreaItemPO.setWorkType(workType);
		quotationFunctionAreaItemPO.setUnitPrice(unitPrice);
		quotationFunctionAreaItemPO.setFormula(formula);
		quotationFunctionAreaItemPO.setNum(num);
		quotationFunctionAreaItemPO.setType(type);
		quotationFunctionAreaItemPO.setDiscount(discount);
		quotationFunctionAreaItemPO.setQuotationFunctionArea(quotationFunctionArea);
		quotationFunctionAreaItemPO.setContent(content);
		quotationFunctionAreaItemPO.setSubtype(subtype);
	}

	private void handleQuotation(QuotationVO quotationVO, QuotationPO quotationPO) {

		BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater"));

	}

	private void handleListQuotation(List<QuotationVO> quotationVOs, List<QuotationPO> quotationPOs, String orderId) {

		if (quotationPOs.isEmpty() || quotationPOs == null) {
			return;
		}

		QuotationVO quotationVO;

		for (QuotationPO quotationPO : quotationPOs) {
			quotationVO = new QuotationVO();

			BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater"));

			quotationVOs.add(quotationVO);
		}
	};

	private DecorationPO checkQuotationForDefaultByOrderId(String orderId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(200005, "报价不能修改");
		}

		return decorationPO;
	}

	private QuotationPO checkQuotationForStatusByEnabled(long qid) throws FLException {
		QuotationPO quotationPO = quotationDao.get(qid);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() == QuotationPO.STATUS_LOCK_INT) {
			throw new FLException(200030, "报价状态不可操作");
		}

		return quotationPO;
	}
}
