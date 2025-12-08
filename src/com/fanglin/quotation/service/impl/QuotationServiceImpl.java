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

import java.sql.Timestamp;
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
import com.fanglin.data.po.PresignPricePO;
import com.fanglin.data.po.PresignProducePO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationPricePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.PresignPriceDao;
import com.fanglin.data.quotation.dao.PresignProduceDao;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.dao.QuotationPriceDao;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.AddReduceItemDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.ProtationDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaParamDao;
import com.fanglin.quotation.dao.QuotationPreferDao;
import com.fanglin.quotation.dao.QuotetionDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaItemDao;
import com.fanglin.quotation.dao.SelectionDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.ProtationPO;
import com.fanglin.quotation.po.QuotationDO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationFunctionAreaParamPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.QuotationPreferPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaPO;
import com.fanglin.quotation.po.QuotetionPO;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.quotation.service.NormtionService;
import com.fanglin.quotation.service.QuotationService;
import com.fanglin.quotation.service.SelectionService;
import com.fanglin.quotation.vo.NormtionVO;
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
	private QuotationFunctionAreaParamDao quotationFunctionAreaParamDao;

	@Autowired
	private QuotetionFunctionAreaItemDao quotetionFunctionAreaItemDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Autowired
	private QuotationPreferDao quotationPreferDao;

	@Autowired
	private AddReduceItemDao addReduceItemDao;

	@Autowired
	private QuotationPriceDao quotationPriceDao;

	@Autowired
	private PresignProduceDao presignProduceDao;

	@Autowired
	private PresignPriceDao presignPriceDao;

	@Autowired
	private ProtationDao protationDao;

	@Autowired
	private SelectionDao selectionDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Autowired
	private SelectionService selectionService;

	@Autowired
	private NormtionService normtionService;

	@Autowired
	private MessageService messageService;

	@Override
	public void pageQuotation(Paging paging, List<Filter> filters, Integer company) throws FLException {

		if (filters.size() == 0) return;

		List<QuotationDO> quotationDOs = quotationDao.pageQuotation(paging, filters, company);

		List<QuotationVO> quotationVOs = new ArrayList<QuotationVO>();

		for (QuotationDO quotationDO : quotationDOs) {

			QuotationVO quotationVO = new QuotationVO(new DecorationVO(), new UserBaseVO(), new QuotationVersionVO());

			quotationVO.getDecoration().setSupervisor(new UserBaseVO());

			BeanUtil.copyPropertie(quotationDO, quotationVO, Arrays.asList("decoration", "creater", "version"));
			BeanUtil.copyProperties(quotationDO.getCreater(), quotationVO.getCreater(), Arrays.asList("duty", "dept", "role"));
			BeanUtil.copyProperties(quotationDO.getVersion(), quotationVO.getVersion());

			quotationDO.getDecoration().ptvcascade(quotationVO.getDecoration());

			quotationVOs.add(quotationVO);
		}
		paging.setData(quotationVOs);

	}

	@Override
	public QuotationVO queryQuotationByQid(QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotationPO.ptv(new QuotationVO(new QuotationVersionVO()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationVO queryQuotationForDefaultByOrderId(QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(quotationVO.getOrderId());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotationPO.ptv(new QuotationVO(new QuotationVersionVO()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationVO> queryQuotationByOrderId(QuotationVO quotationVO) {

		List<QuotationVO> quotationVOs = new ArrayList<QuotationVO>();
		List<QuotationPO> quotationPOs = quotationDao.queryQuotationByOrderId(quotationVO.getOrderId());

		for (QuotationPO quotationPO : quotationPOs) {
			quotationVOs.add(quotationPO.ptv(new QuotationVO(new QuotationVersionVO())));
		}

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

		BeanUtil.copyProperties(quotationVO, quotationPO, Arrays.asList("creater", "version"));

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		QuotationVersionPO versionPO = decorationPO.getVersion();

		SystemConfigPO keeprice = systemConfigDao.querySystemConfig("PROTATION_KEEPRICE_DAYS_INT", company);

		PresignProducePO presignPO = null;
		ProtationPO protationPO = protationDao.queryProtationForDefaultByOrderId(orderId);

		if (protationPO != null) {
			presignPO = presignProduceDao.get(protationPO.getPpid());
		}

		if (protationPO != null && protationPO.getVersion() != null && DateUtil.diffDay(decorationPO.getPrecontractTime(), DateUtil.getDateToTimestamp(new Date())) <= (keeprice == null ? 365 : Integer.parseInt(keeprice.value("365")))) {
			versionPO = protationPO.getVersion();
		}

		if (presignPO != null && protationPO.getVersion() != null && DateUtil.diffDay(decorationPO.getPrecontractTime(), DateUtil.getDateToTimestamp(new Date())) > (keeprice == null ? 365 : Integer.parseInt(keeprice.value("365")))) {
			versionPO = presignPO.getVersion();
		}

		if (versionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		quotationPO.setOrderId(orderId);
		quotationPO.setCreater(userDao.queryUserByUserId(userId));
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		Timestamp updateTime = DateUtil.getDateToTimestamp(new Date());

		SystemConfigPO keepdays = systemConfigDao.querySystemConfig("KEEPRICE_DAYS_INT", company);

		if (decorationPO.getContractTime() != null && DateUtil.diffDay(decorationPO.getContractTime(), updateTime) < (keepdays == null ? 365 : Integer.parseInt(keepdays.getValue()))) {
			updateTime = decorationPO.getContractTime();
		}

		quotationPO.setUpdateTime(updateTime);

		quotationPO.setVersion(versionPO);
		quotationPO.setManageRate(versionPO.getManageRate());
		quotationPO.setManageDiscount(versionPO.getManageDiscount());
		quotationPO.setTrafficRate(versionPO.getTrafficRate());
		quotationPO.setTrafficDiscount(versionPO.getTrafficDiscount());
		quotationPO.setTaxRate(versionPO.getTaxRate());
		quotationPO.setTaxDiscount(versionPO.getTaxDiscount());
		quotationPO.setDiscount(10000);

		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (defaultQuotationPO == null) {
			quotationPO.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT);
		} else {
			quotationPO.setDefaults(QuotationPO.DEFAULTS_NONDEFAULT_INT);
		}

		quotationDao.save(quotationPO);

		selectionService.addSelection(quotationPO.getQid(), userId);
		normtionService.addNormtion(new NormtionVO(orderId, quotationPO.getQid()), userId);

		BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater", "version"));

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotationFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		SystemConfigPO cmprehConfigPO = systemConfigDao.querySystemConfig("QUOTATION_CMPREH_CONFIG", company);

		if (cmprehConfigPO != null) {
			quotationFunctionAreaDao.save(new QuotationFunctionAreaPO(quotationPO, "综合项目", 9998, decorationPO.getType() != DecorationPO.TYPE_INCLUSIVE_INT ? QuotationFunctionAreaPO.TYPE_CMPREH_INT : QuotationFunctionAreaPO.TYPE_NOT_COUNT_INT, index));
		}

		QuotationFunctionAreaPO autogeneration = new QuotationFunctionAreaPO(quotationPO, "生成项目", 9999, QuotationFunctionAreaPO.TYPE_MANAGEMENT_INT, index);

		quotationFunctionAreaDao.save(autogeneration);

		QuotationFunctionAreaItemPO trafficPrice = QuotationFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index).toTraffic(versionPO, autogeneration);

		QuotationFunctionAreaItemPO managePrice = QuotationFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index).toManage(versionPO, autogeneration);

		quotationFunctionAreaItemDao.save(trafficPrice);
		quotationFunctionAreaItemDao.save(managePrice);

		if (versionPO.getTaxDiscount() != QuotationVersionPO.TAX_NOTTAXDISCOUNT_INT) {

			QuotationFunctionAreaItemPO taxPrice = QuotationFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index).toTax(versionPO, autogeneration);
			quotationFunctionAreaItemDao.save(taxPrice);
		}

		QuotationPreferPO quotationPreferPO = new QuotationPreferPO();

		quotationPreferPO.setOrderId(orderId);
		quotationPreferPO.setQid(quotationPO.getQid());
		quotationPreferPO.setQuoteArea(decorationPO.getHouse().getInnerArea());

		if (presignPO != null) {
			quotationPreferPO.setPresignProduce(presignPO);
			quotationPreferPO.setDiscount(presignPO.getDiscount());
			quotationPreferPO.setManageDiscount(presignPO.getManageDiscount());

			PresignPricePO presignPricePO = presignPriceDao.queryPresignPrice(presignPO.getPpid(), decorationPO.getHouse().getInnerArea());

			if (presignPricePO != null) {
				quotationPreferPO.setQuotePrice(presignPricePO.getPrice());
			} else {
				quotationPreferPO.setQuotePrice(presignPO.getQuotePrice());
			}
		}

		quotationPreferDao.save(quotationPreferPO);

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

		BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater", "version"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int changeQuotationForDefault(QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(quotationPO.getOrderId());

		QuotationPO defaultPO = quotationDao.queryQuotationForDefaultByOrderId(quotationPO.getOrderId());

		List<QuotationFunctionAreaPO> quotationFunctionAreas = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(defaultPO.getQid());

		if (extensionItemDao.countExtensionItem(quotationFunctionAreas) > 0) {
			throw new FLException(200028, "功能区存在拓展项");
		}

		if (addReduceItemDao.countAddReduceItem(quotationFunctionAreas) > 0) {
			throw new FLException(200032, "功能区存在增减项");
		}

		if (quotationPO.getDefaults() == QuotationPO.DEFAULTS_NONDEFAULT_INT) {

			decorationPO.setQuotationPrice(quotationPO.getTotalPrice());
			decorationPO.setDiscount(quotationPO.getDiscount());

			decorationDao.update(decorationPO);

			quotationPO.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT);

			quotationDao.clearQuotationForDefaultByOrderId(quotationVO.getOrderId());

			quotationDao.update(quotationPO);
		}

		BeanUtil.copyProperties(quotationPO, quotationVO, Arrays.asList("creater", "version"));

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
	public int updateQuotationForPrice(QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		checkQuotationForDefaultByOrderId(quotationPO.getOrderId());

		Timestamp updateTime = DateUtil.getDateToTimestamp(new Date());

		if (quotationVO.getUpdateTime() != null) {
			updateTime = quotationVO.getUpdateTime();
		}

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {

			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaPO.getQfaId());

			for (QuotationFunctionAreaItemPO quotationFunctionAreaItemPO : quotationFunctionAreaItemPOs) {

				QuotationItemPO quotationItemPO = quotationFunctionAreaItemPO.getQuotationItem();

				if (quotationItemPO == null) continue;

				QuotationPricePO quotationPricePO = quotationPriceDao.queryQuotationPriceLast(quotationItemPO.getQiid(), quotationVO.getUpdateTime());

				if (quotationPricePO == null) continue;

				quotationFunctionAreaItemPO.setAddPrice(quotationPricePO.getAddPrice());
				quotationFunctionAreaItemPO.setUnitPrice(quotationPricePO.getUnitPrice());
				quotationFunctionAreaItemPO.setSubPrice(quotationPricePO.getSubPrice());

				quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
			}
		}

		quotationPO.setUpdateTime(updateTime);

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
	public int updateQuotationForTime(QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationVO.getWorkTime() != null) quotationPO.setWorkTime(quotationVO.getWorkTime());
		if (quotationVO.getAuditTime() != null) quotationPO.setAuditTime(quotationVO.getAuditTime());

		quotationDao.update(quotationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lockQuotation(QuotationVO quotationVO, String userId) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (selectionItemDao.countSelectionItem(quotationPO.getOrderId(), SelectionItemPO.TYPE_ALONE_SHORT) != 0) {
			throw new FLException(200041, "存在未关联选材项");
		}

		quotationPO.setStatus(QuotationPO.STATUS_LOCK_INT);

		if (quotationPO.getLockTime() == null) quotationPO.setLockTime(DateUtil.getDateToTimestamp(new Date()));

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

		if (quotationPO.getStatus() != QuotationPO.STATUS_LOCK_INT) {
			throw new FLException(200030, "报价状态不可操作");
		}

		checkQuotationForDefaultByOrderId(quotationPO.getOrderId());

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
	public int submitQuotation(QuotationVO quotationVO, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		quotationPO.setAttstatus(QuotationPO.ATTSTATUS_SUBMIT_INT);

		quotationDao.update(quotationPO);

		UserPO creater = quotationPO.getCreater();
		UserPO designer = decorationPO.getDesigner();

		String content = String.format("装修单号：%s,报价单:%s,已提交", decorationPO.getOrderId(), quotationPO.getName());

		if (creater.getDept() != null && creater.getDept().getManager() != null) messageService.sendMessage(creater.getDept().getManager().getUserId(), null, content, MessagePO.TYPE_SEND_PERSONEL_INT, creater.getCompany());

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int auditQuotation(QuotationVO quotationVO, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		quotationPO.setAttstatus(QuotationPO.ATTSTATUS_AUDI_INT);

		quotationDao.update(quotationPO);

		UserPO designer = decorationPO.getDesigner();

		String content = String.format("装修单号：%s,报价单:%s,已审核", decorationPO.getOrderId(), quotationPO.getName());

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishQuotation(QuotationVO quotationVO, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		quotationPO.setAttstatus(QuotationPO.ATTSTATUS_FINISH_INT);
		quotationPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		quotationDao.update(quotationPO);

		UserPO designer = decorationPO.getDesigner();

		String content = String.format("装修单号：%s,报价单:%s,已完成", decorationPO.getOrderId(), quotationPO.getName());

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cloneQuotation(QuotationVO quotationVO, String no, String userId, int company) throws FLException {

		String orderId = quotationVO.getOrderId();

		QuotetionPO quotetionSO = quotetionDao.queryQuotetionByNo(no);

		if (quotetionSO == null) {
			throw new FLException(200003, "报价不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		SystemConfigPO quotationlimit = systemConfigDao.querySystemConfig("quotationlimit", company);

		if (quotationDao.countQuotationByOrderId(orderId) >= (quotationlimit == null ? 3 : Integer.parseInt(quotationlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		DecorationPO decorationTO = checkQuotationForDefaultByOrderId(orderId);

		SystemConfigPO quotationtimelimit = systemConfigDao.querySystemConfig("quotationtimelimit", company);

		if (decorationTO.getQuotationTimeLimit() >= (quotationtimelimit == null ? 3 : Integer.parseInt(quotationtimelimit.getValue()))) {
			throw new FLException(200018, "报价复制次数达到上线");
		} else {
			decorationTO.setQuotationTimeLimit(decorationTO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationTO);
		}

		short keeprice = quotationVO.getKeeprice();

		Timestamp updateTime = DateUtil.getDateToTimestamp(new Date());

		SystemConfigPO keepdays = systemConfigDao.querySystemConfig("KEEPRICE_DAYS_INT", company);

		if (decorationTO.getContractTime() != null && DateUtil.diffDay(decorationTO.getContractTime(), updateTime) < (keepdays == null ? 365 : Integer.parseInt(keepdays.getValue()))) {
			updateTime = decorationTO.getContractTime();
		}

		if ((keeprice & QuotationPO.KEEPRICE_TIMEKEEP_INT) == QuotationPO.KEEPRICE_TIMEKEEP_INT && quotetionSO.getUpdateTime() != null) {
			updateTime = quotetionSO.getUpdateTime();
		}

		QuotationPO quotationTO = new QuotationPO();

		quotationTO.ptp(orderId, userPO, quotetionSO.getName(), "其他", updateTime);

		if (decorationTO.getVersion().getQvId() != quotetionSO.getVersion().getQvId()) {
			throw new FLException(200002, "复制报价与当前报价版本不同,不能拷贝");
		}

		quotationTO.setVersion(decorationTO.getVersion());
		quotationTO.setTaxDiscount(quotetionSO.getTaxDiscount());

		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		quotationTO.setDefaults(defaultQuotationPO != null ? QuotationPO.DEFAULTS_NONDEFAULT_INT : QuotationPO.DEFAULTS_DEFAULT_INT);

		quotationDao.save(quotationTO);

		selectionService.addSelection(quotationTO.getQid(), userId);

		copyQuotetion(quotationTO.getQid(), quotetionSO.getQid(), keeprice, updateTime);

		BeanUtil.copyProperties(quotationTO, quotationVO, Arrays.asList("creater", "version"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int replicaQuotation(QuotationVO quotationVO, String userId, int company) throws FLException {

		long replicaQId = quotationVO.getQid();
		String orderId = quotationVO.getOrderId();

		QuotationPO quotationSO = quotationDao.get(replicaQId);

		if (quotationSO == null) {
			throw new FLException(200003, "报价不存在");
		}

		DecorationPO decorationTO = checkQuotationForDefaultByOrderId(orderId);
		DecorationPO decorationSO = decorationDao.queryDecorationByOrderId(quotationSO.getOrderId());

		SystemConfigPO quotationlimit = systemConfigDao.querySystemConfig("quotationlimit", company);

		if (quotationDao.countQuotationByOrderId(orderId) >= (quotationlimit == null ? 3 : Integer.parseInt(quotationlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		if (quotationDao.countQuotationByOrderId(orderId, QuotationPO.STATUS_LOCK_INT) > 0) {
			throw new FLException(200033, "报价已锁定");
		}

		if (orderId.equals(quotationSO.getOrderId())) {
			throw new FLException(200019, "拷贝报价不能在订单内完成");
		}

		if (!decorationTO.getVersion().getNo().equals(decorationSO.getVersion().getNo())) {
			throw new FLException(200002, "复制报价与当前报价版本不同,不能拷贝");
		}

		SystemConfigPO quotationtimelimit = systemConfigDao.querySystemConfig("quotationtimelimit", company);

		if (decorationTO.getQuotationTimeLimit() >= (quotationtimelimit == null ? 3 : Integer.parseInt(quotationtimelimit.getValue()))) {
			throw new FLException(200018, "报价复制次数达到上线");
		} else {
			decorationTO.setQuotationTimeLimit(decorationTO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationTO);
		}

		QuotationPO quotationTO = new QuotationPO();

		short keeprice = quotationVO.getKeeprice();

		Timestamp updateTime = DateUtil.getDateToTimestamp(new Date());

		SystemConfigPO keepdays = systemConfigDao.querySystemConfig("KEEPRICE_DAYS_INT", company);

		if (decorationTO.getContractTime() != null && DateUtil.diffDay(decorationTO.getContractTime(), updateTime) < (keepdays == null ? 365 : Integer.parseInt(keepdays.getValue()))) {
			updateTime = decorationTO.getContractTime();
		}

		if ((keeprice & QuotationPO.KEEPRICE_TIMEKEEP_INT) == QuotationPO.KEEPRICE_TIMEKEEP_INT && quotationSO.getUpdateTime() != null) {
			updateTime = quotationSO.getUpdateTime();
		}

		BeanUtil.copyProperties(quotationVO, quotationTO, Arrays.asList("qid", "creater", "version"));

		quotationTO.ptp(orderId, userDao.queryUserByUserId(userId), quotationSO.getName(), quotationSO.getStyle(), updateTime);

		quotationTO.setVersion(quotationSO.getVersion());
		quotationTO.setTaxDiscount(quotationSO.getTaxDiscount());

		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		quotationTO.setDefaults(defaultQuotationPO != null ? QuotationPO.DEFAULTS_NONDEFAULT_INT : QuotationPO.DEFAULTS_DEFAULT_INT);

		quotationDao.save(quotationTO);

		selectionService.addSelection(quotationTO.getQid(), userId);

		copyQuotation(replicaQId, quotationTO.getQid(), keeprice, updateTime);

		BeanUtil.copyProperties(quotationTO, quotationVO, Arrays.asList("creater", "version"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int copyQuotation(QuotationVO quotationVO, String userId, int company) throws FLException {

		String orderId = quotationVO.getOrderId();

		QuotationPO quotationSO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		SystemConfigPO quotationlimit = systemConfigDao.querySystemConfig("quotationlimit", company); // 报价数量限制

		if (quotationDao.countQuotationByOrderId(orderId) >= (quotationlimit == null ? 3 : Integer.parseInt(quotationlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		if (quotationDao.countQuotationByOrderId(orderId, QuotationPO.STATUS_LOCK_INT) > 0) {
			throw new FLException(200033, "报价已锁定");
		}

		DecorationPO decorationTO = checkQuotationForDefaultByOrderId(orderId);

		SystemConfigPO quotationtimelimit = systemConfigDao.querySystemConfig("quotationtimelimit", company); // 报价复制/拷贝次数限制

		if (decorationTO.getQuotationTimeLimit() >= (quotationtimelimit == null ? 3 : Integer.parseInt(quotationtimelimit.getValue()))) {
			throw new FLException(200018, "报价复制次数达到上线");
		} else {
			decorationTO.setQuotationTimeLimit(decorationTO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationTO);
		}

		QuotationPO quotationTO = new QuotationPO();

		short keeprice = quotationVO.getKeeprice();

		Timestamp updateTime = DateUtil.getDateToTimestamp(new Date());

		SystemConfigPO keepdays = systemConfigDao.querySystemConfig("KEEPRICE_DAYS_INT", company);

		if (decorationTO.getContractTime() != null && DateUtil.diffDay(decorationTO.getContractTime(), updateTime) < (keepdays == null ? 365 : Integer.parseInt(keepdays.getValue()))) {
			updateTime = decorationTO.getContractTime();
		}

		if ((keeprice & QuotationPO.KEEPRICE_TIMEKEEP_INT) == QuotationPO.KEEPRICE_TIMEKEEP_INT && quotationSO.getUpdateTime() != null) {
			updateTime = quotationSO.getUpdateTime();
		}

		BeanUtil.copyProperties(quotationVO, quotationTO, Arrays.asList("qid", "creater", "version"));

		quotationTO.setOrderId(orderId);
		quotationTO.setCreater(userDao.queryUserByUserId(userId));
		quotationTO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationTO.setUpdateTime(updateTime);

		quotationTO.setDiscount(quotationSO.getDiscount());
		quotationTO.setVersion(quotationSO.getVersion());
		quotationTO.setTaxDiscount(quotationSO.getTaxDiscount());

		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (defaultQuotationPO == null) {
			quotationTO.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT);
		} else {
			quotationTO.setDefaults(QuotationPO.DEFAULTS_NONDEFAULT_INT);
		}

		quotationDao.save(quotationTO);

		selectionService.addSelection(quotationTO.getQid(), userId);

		copyQuotation(quotationVO.getQid(), quotationTO.getQid(), keeprice, updateTime);

		BeanUtil.copyProperties(quotationTO, quotationVO, Arrays.asList("creater", "version"));

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
		quotationPO.setConsPrice(quotationVO.getConsPrice());
		quotationPO.setComsPrice(quotationVO.getComsPrice());
		quotationPO.setUndisComPrice(quotationVO.getUndisComPrice());
		quotationPO.setDisComPrice(quotationVO.getDisComPrice());

		if (quotationVO.getWorkTime() != null) quotationPO.setWorkTime(quotationVO.getWorkTime());
		if (quotationVO.getAuditTime() != null) quotationPO.setAuditTime(quotationVO.getAuditTime());
		if (quotationVO.getTrafficDiscount() != null) quotationPO.setTrafficDiscount(quotationVO.getTrafficDiscount());
		if (quotationVO.getManageDiscount() != null) quotationPO.setManageDiscount(quotationVO.getManageDiscount());
		if (quotationVO.getTaxDiscount() != null) quotationPO.setTaxDiscount(quotationVO.getTaxDiscount());
	}

	@Transactional(rollbackFor = Exception.class)
	private int copyQuotation(long quotationId, long newQuotationId, short keeprice, Timestamp updateTime) throws FLException {

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationId);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotationFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (QuotationFunctionAreaPO quotationFunctionAreaSO : quotationFunctionAreaPOs) {

			QuotationFunctionAreaPO quotationFunctionAreaTO = new QuotationFunctionAreaPO();

			BeanUtil.copyProperties(quotationFunctionAreaSO, quotationFunctionAreaTO, Arrays.asList("qfaId"));

			quotationFunctionAreaTO.setQuotation(new QuotationPO(newQuotationId));
			quotationFunctionAreaTO.setIndex(index);

			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaSO.getQfaId(), quotationFunctionAreaSO.getIndex()), quotationFunctionAreaSO.getQfaId());

			quotationFunctionAreaDao.save(quotationFunctionAreaTO);

			for (QuotationFunctionAreaItemPO quotationFunctionAreaItemSO : quotationFunctionAreaItemPOs) {

				QuotationFunctionAreaItemPO quotationFunctionAreaItemTO = QuotationFunctionAreaItemPO.factoryToInstance(quotationFunctionAreaTO.getQfaId(), index);

				BeanUtil.copyProperties(quotationFunctionAreaItemSO, quotationFunctionAreaItemTO, Arrays.asList("qfaiId"));

				quotationFunctionAreaItemTO.setQuotationFunctionArea(quotationFunctionAreaTO);

				QuotationItemPO quotationItemPO = quotationFunctionAreaItemSO.getQuotationItem();

				if (quotationItemPO != null && (keeprice & QuotationPO.KEEPRICE_PRICEKEEP_INT) != QuotationPO.KEEPRICE_PRICEKEEP_INT) {

					QuotationPricePO quotationPricePO = quotationPriceDao.queryQuotationPriceLast(quotationItemPO.getQiid(), updateTime);

					if (quotationPricePO != null) {
						quotationFunctionAreaItemTO.setAddPrice(quotationPricePO.getAddPrice());
						quotationFunctionAreaItemTO.setUnitPrice(quotationPricePO.getUnitPrice());
						quotationFunctionAreaItemTO.setSubPrice(quotationPricePO.getSubPrice());
					}
				}

				quotationFunctionAreaItemDao.save(quotationFunctionAreaItemTO);
			}

			List<QuotationFunctionAreaParamPO> quotationFunctionAreaParamPOs = quotationFunctionAreaParamDao.queryQuotationFunctionAreaParamByQfaid(quotationFunctionAreaSO.getQfaId());

			for (QuotationFunctionAreaParamPO quotationFunctionAreaParamSO : quotationFunctionAreaParamPOs) {

				QuotationFunctionAreaParamPO quotationFunctionAreaParamTO = new QuotationFunctionAreaParamPO();

				BeanUtil.copyProperties(quotationFunctionAreaParamSO, quotationFunctionAreaParamTO, Arrays.asList("qfapid"));

				quotationFunctionAreaParamTO.setQfaid(quotationFunctionAreaTO.getQfaId());

				quotationFunctionAreaParamDao.save(quotationFunctionAreaParamTO);
			}
		}

		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	private int copyQuotetion(long quotationId, long quotetionId, short keeprice, Timestamp updateTime) throws FLException {

		List<QuotetionFunctionAreaPO> quotetionFunctionAreaPOs = quotetionFunctionAreaDao.queryQuotetionFunctionAreaByQuotetionId(quotetionId);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotationFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (QuotetionFunctionAreaPO quotetionFunctionAreaSO : quotetionFunctionAreaPOs) {

			QuotationFunctionAreaPO quotationFunctionAreaTO = new QuotationFunctionAreaPO();

			quotationFunctionAreaTO.setFunctionAreaName(quotetionFunctionAreaSO.getName());
			quotationFunctionAreaTO.setFunctionAreaOrder(quotetionFunctionAreaSO.getFunctionAreaOrder());
			quotationFunctionAreaTO.setType(quotetionFunctionAreaSO.getType());
			quotationFunctionAreaTO.setQuotation(new QuotationPO(quotationId));
			quotationFunctionAreaTO.setTotal(0);
			quotationFunctionAreaTO.setQfaId(quotationId);
			quotationFunctionAreaTO.setIndex(index);

			quotationFunctionAreaDao.save(quotationFunctionAreaTO);

			List<QuotetionFunctionAreaItemPO> quotetionFunctionAreaItemPOs = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaSO.getQfaId(), quotetionFunctionAreaSO.getIndex()), quotetionFunctionAreaSO.getQfaId());

			for (QuotetionFunctionAreaItemPO quotetionFunctionAreaItemSO : quotetionFunctionAreaItemPOs) {

				if (quotetionFunctionAreaItemSO.getType() == QuotetionFunctionAreaItemPO.TYPE_CUSTOM_INT) continue;

				QuotationFunctionAreaItemPO quotationFunctionAreaItemTO = QuotationFunctionAreaItemPO.factoryToInstance(quotationFunctionAreaTO.getQfaId(), index);

				quotationFunctionAreaItemTO.ptp(quotetionFunctionAreaItemSO);

				quotationFunctionAreaItemTO.setQuotationFunctionArea(quotationFunctionAreaTO);
				quotationFunctionAreaItemTO.setIndex(index);

				if (quotetionFunctionAreaItemSO.getQiid() != 0 && (keeprice & QuotationPO.KEEPRICE_PRICEKEEP_INT) != QuotationPO.KEEPRICE_PRICEKEEP_INT) {

					quotationFunctionAreaItemTO.setQuotationItem(quotationItemDao.get(quotetionFunctionAreaItemSO.getQiid()));

					QuotationPricePO quotationPricePO = quotationPriceDao.queryQuotationPriceLast(quotetionFunctionAreaItemSO.getQiid(), updateTime);

					if (quotationPricePO != null) {

						quotationFunctionAreaItemTO.setAddPrice(quotationPricePO.getAddPrice());
						quotationFunctionAreaItemTO.setUnitPrice(quotationPricePO.getUnitPrice());
						quotationFunctionAreaItemTO.setSubPrice(quotationPricePO.getSubPrice());
					}
				}

				quotationFunctionAreaItemDao.save(quotationFunctionAreaItemTO);
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

		if (quotationPO.getStatus() != QuotationPO.STATUS_INIT_INT) {
			throw new FLException(200030, "报价状态不可操作");
		}

		return quotationPO;
	}
}
