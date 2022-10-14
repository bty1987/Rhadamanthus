package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.QuotetionDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaPO;
import com.fanglin.quotation.po.QuotetionPO;
import com.fanglin.quotation.service.QuotetionService;
import com.fanglin.quotation.vo.QuotetionVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.UUIDUtil;

@Service("quotetionService")
@Transactional(readOnly = true)
public class QuotetionServiceImpl implements QuotetionService {

	@Autowired
	private QuotetionDao quotetionDao;

	@Autowired
	private QuotetionFunctionAreaItemDao quotetionFunctionAreaItemDao;

	@Autowired
	private QuotetionFunctionAreaDao quotetionFunctionAreaDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private QuotationVersionDao quotationVersionDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Override
	public List<QuotetionVO> queryQuotetion(String userId) {

		UserPO userPO = userDao.queryUserByUserId(userId);

		List<QuotetionVO> quotetionVOs = new ArrayList<QuotetionVO>();
		List<QuotetionPO> quotetionPOs = quotetionDao.queryQuotetionByCuid(userPO.getUid());

		handleListQuotetion(quotetionVOs, quotetionPOs);

		return quotetionVOs;
	}

	@Override
	public QuotetionVO queryQuotetionByQid(QuotetionVO quotetion) {

		QuotetionPO quotetionPO = quotetionDao.get(quotetion.getQid());
		QuotetionVO quotetionVO = new QuotetionVO();

		handleQuotetion(quotetionVO, quotetionPO);

		return quotetionVO;
	}

	@Override
	public QuotetionVO queryQuotetionByNo(QuotetionVO quotetionVO) {

		QuotetionPO quotetionPO = quotetionDao.queryQuotetionByNo(quotetionVO.getNo());

		handleQuotetion(quotetionVO, quotetionPO);

		return quotetionVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException {

		SystemConfigPO quotetionlimit = systemConfigDao.querySystemConfig("quotetionlimit", company);

		QuotetionPO quotetionPO = new QuotetionPO();

		UserPO userPO = userDao.queryUserByUserId(userId);

		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionByVersionId(quotetionVO.getVersion());

		if (quotetionDao.countQuotetionByCuid(userPO.getUid()) >= (quotetionlimit == null ? 10 : Integer.parseInt(quotetionlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		BeanUtil.copyProperties(quotetionVO, quotetionPO);

		quotetionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotetionPO.setCuid(userPO.getUid());
		quotetionPO.setNo(UUIDUtil.getUuid().substring(0, 15));
		quotetionPO.setDiscount(10000);
		quotetionPO.setManageRate(quotationVersionPO.getManageRate());
		quotetionPO.setManageDiscount(quotationVersionPO.getManageDiscount());
		quotetionPO.setTrafficRate(quotationVersionPO.getTrafficRate());
		quotetionPO.setTrafficDiscount(quotationVersionPO.getTrafficDiscount());
		quotetionPO.setTaxRate(quotationVersionPO.getTaxRate());
		quotetionPO.setTaxDiscount(quotationVersionPO.getTaxDiscount());

		quotetionDao.save(quotetionPO);

		BeanUtil.copyProperties(quotetionPO, quotetionVO);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotetionFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		QuotetionFunctionAreaPO autogeneration = new QuotetionFunctionAreaPO(quotetionPO.getQid(), "生成项目", 9999, QuotetionFunctionAreaPO.TYPE_MANAGEMENT_INT, index);

		quotetionFunctionAreaDao.save(autogeneration);

		QuotetionFunctionAreaItemPO trafficPrice = QuotetionFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index);
		convertQuotetionPOForAdvance(trafficPrice, "车运费", "", "其他", quotationVersionPO.getTrafficRate(), "0", 0, QuotetionFunctionAreaItemPO.TYPE_TRAFFIC_INT, quotationVersionPO.getTrafficDiscount(), autogeneration, "", QuotetionFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);

		QuotetionFunctionAreaItemPO managePrice = QuotetionFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index);
		convertQuotetionPOForAdvance(managePrice, "管理费", "", "其他", quotationVersionPO.getManageRate(), "0", 0, QuotetionFunctionAreaItemPO.TYPE_MANAGE_INT, quotationVersionPO.getManageDiscount(), autogeneration, "", QuotetionFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);

		QuotetionFunctionAreaItemPO taxPrice = QuotetionFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index);
		convertQuotetionPOForAdvance(taxPrice, "税金", "", "其他", quotationVersionPO.getTaxRate(), "0", 0, QuotetionFunctionAreaItemPO.TYPE_TAX_INT, quotationVersionPO.getTaxDiscount(), autogeneration, "", QuotetionFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);

		quotetionFunctionAreaItemDao.save(trafficPrice);
		quotetionFunctionAreaItemDao.save(managePrice);
		quotetionFunctionAreaItemDao.save(taxPrice);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotetion(QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		quotetionPO.setVersion(quotetionVO.getVersion());
		quotetionPO.setName(quotetionVO.getName());
		quotetionPO.setContent(quotetionVO.getContent());

		quotetionDao.update(quotetionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotetionForAdvance(QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);

		QuotetionFunctionAreaPO quotetionFunctionAreaPO = quotetionFunctionAreaDao.queryQuotetionFunctionAreaForTypeByQuotetionId(quotetionVO.getQid(), QuotetionFunctionAreaPO.TYPE_MANAGEMENT_INT);

		if (quotetionVO.getTrafficDiscount() != null) {
			QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemForTypeByQuotetionFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex()), quotetionFunctionAreaPO.getQfaId(), QuotetionFunctionAreaItemPO.TYPE_TRAFFIC_INT);
			quotetionFunctionAreaItemPO.setDiscount(quotetionVO.getTrafficDiscount());
			quotetionFunctionAreaItemDao.update(quotetionFunctionAreaItemPO);
		}

		if (quotetionVO.getManageDiscount() != null) {
			QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemForTypeByQuotetionFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex()), quotetionFunctionAreaPO.getQfaId(), QuotetionFunctionAreaItemPO.TYPE_MANAGE_INT);
			quotetionFunctionAreaItemPO.setDiscount(quotetionVO.getManageDiscount());
			quotetionFunctionAreaItemDao.update(quotetionFunctionAreaItemPO);
		}

		if (quotetionVO.getTaxDiscount() != null) {
			QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemForTypeByQuotetionFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex()), quotetionFunctionAreaPO.getQfaId(), QuotetionFunctionAreaItemPO.TYPE_TAX_INT);
			quotetionFunctionAreaItemPO.setDiscount(quotetionVO.getTaxDiscount());
			quotetionFunctionAreaItemDao.update(quotetionFunctionAreaItemPO);
		}

		quotetionDao.update(quotetionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotetion(QuotetionVO quotetionVO) throws FLException {

		checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		deleteQuotetionByQId(quotetionVO.getQid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int replicaQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		QuotetionPO quotetionPO = new QuotetionPO();

		QuotationPO copyQuotationPO = quotationDao.get(quotetionVO.getQid());

		if (copyQuotationPO.getCreateTime() == null) {
			throw new FLException(200003, "报价不存在");
		}

		SystemConfigPO quotetionlimit = systemConfigDao.querySystemConfig("quotetionlimit", company);

		if (quotetionDao.countQuotetionByCuid(userPO.getUid()) >= (quotetionlimit == null ? 10 : Integer.parseInt(quotetionlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		quotetionPO.ptp(copyQuotationPO.getName(), decorationDao.queryDecorationByOrderId(copyQuotationPO.getOrderId()).getVersion().getNo(), userPO.getUid());

		quotetionDao.save(quotetionPO);

		copyQuotationToQuotetion(quotetionVO.getQid(), quotetionPO.getQid());

		BeanUtil.copyProperties(quotetionPO, quotetionVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cloneQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		QuotetionPO quotetionPO = new QuotetionPO();

		QuotetionPO copyQuotetionPO = quotetionDao.queryQuotetionByNo(quotetionVO.getNo());

		if (copyQuotetionPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		SystemConfigPO quotetionlimit = systemConfigDao.querySystemConfig("quotetionlimit", company);

		if (quotetionDao.countQuotetionByCuid(userPO.getUid()) >= (quotetionlimit == null ? 10 : Integer.parseInt(quotetionlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		quotetionPO.ptp(copyQuotetionPO.getName(), copyQuotetionPO.getVersion(), userPO.getUid());

		quotetionDao.save(quotetionPO);

		copyQuotetion(copyQuotetionPO.getQid(), quotetionPO.getQid());

		BeanUtil.copyProperties(quotetionPO, quotetionVO);

		return 0;
	};

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int copyQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		QuotetionPO quotetionPO = new QuotetionPO();

		SystemConfigPO quotetionlimit = systemConfigDao.querySystemConfig("quotetionlimit", company);

		if (quotetionDao.countQuotetionByCuid(userPO.getUid()) >= (quotetionlimit == null ? 10 : Integer.parseInt(quotetionlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		BeanUtil.copyProperties(quotetionVO, quotetionPO, Arrays.asList("qid", "cuid"));

		quotetionPO.setCuid(userPO.getUid());
		quotetionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotetionPO.setNo(UUIDUtil.getUuid().substring(0, 15));

		QuotetionPO copyPO = quotetionDao.get(quotetionVO.getQid());
		quotetionPO.setVersion(copyPO.getVersion());
		quotetionPO.setDiscount(copyPO.getDiscount());
		quotetionPO.setTotalPrice(copyPO.getTotalPrice());

		quotetionDao.save(quotetionPO);

		copyQuotetion(quotetionVO.getQid(), quotetionPO.getQid());

		BeanUtil.copyProperties(quotetionPO, quotetionVO);

		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	private int copyQuotationToQuotetion(long quotationId, long quotetionId) throws FLException {

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationId);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotetionFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {

			QuotetionFunctionAreaPO _quotetionFunctionAreaPO = new QuotetionFunctionAreaPO();

			_quotetionFunctionAreaPO.setName(quotationFunctionAreaPO.getFunctionAreaName());

			_quotetionFunctionAreaPO.setFunctionAreaOrder(quotationFunctionAreaPO.getFunctionAreaOrder());
			_quotetionFunctionAreaPO.setType(quotationFunctionAreaPO.getType());
			_quotetionFunctionAreaPO.setQid(quotetionId);
			_quotetionFunctionAreaPO.setIndex(index);

			quotetionFunctionAreaDao.save(_quotetionFunctionAreaPO);

			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaPO.getQfaId());

			for (QuotationFunctionAreaItemPO quotationFunctionAreaItem : quotationFunctionAreaItemPOs) {

				QuotetionFunctionAreaItemPO clazz = QuotetionFunctionAreaItemPO.factoryToInstance(_quotetionFunctionAreaPO.getQfaId(), index);

				clazz.setQfaid(_quotetionFunctionAreaPO.getQfaId());

				if (quotationFunctionAreaItem.getQuotationItem() != null) {
					clazz.setQiid(quotationFunctionAreaItem.getQuotationItem().getQiid());
				}

				clazz.ptp(quotationFunctionAreaItem);

				quotetionFunctionAreaItemDao.save(clazz);
			}
		}
		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	private int copyQuotetion(long quotetionId, long newQuotetionId) throws FLException {

		List<QuotetionFunctionAreaPO> quotetionFunctionAreaPOs = quotetionFunctionAreaDao.queryQuotetionFunctionAreaByQuotetionId(quotetionId);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotetionFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (QuotetionFunctionAreaPO quotetionFunctionAreaPO : quotetionFunctionAreaPOs) {

			QuotetionFunctionAreaPO _quotetionFunctionAreaPO = new QuotetionFunctionAreaPO();
			BeanUtil.copyProperties(quotetionFunctionAreaPO, _quotetionFunctionAreaPO, Arrays.asList("qfaId"));
			_quotetionFunctionAreaPO.setQid(newQuotetionId);
			_quotetionFunctionAreaPO.setIndex(index);

			quotetionFunctionAreaDao.save(_quotetionFunctionAreaPO);

			List<QuotetionFunctionAreaItemPO> quotetionFunctionAreaItemPOs = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex()), quotetionFunctionAreaPO.getQfaId());

			for (QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO : quotetionFunctionAreaItemPOs) {

				QuotetionFunctionAreaItemPO clazz = QuotetionFunctionAreaItemPO.factoryToInstance(_quotetionFunctionAreaPO.getQfaId(), index);

				BeanUtil.copyProperties(quotetionFunctionAreaItemPO, clazz, Arrays.asList("qfaiId"));
				clazz.setQfaid(_quotetionFunctionAreaPO.getQfaId());

				quotetionFunctionAreaItemDao.save(clazz);
			}
		}

		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	private int deleteQuotetionByQId(long qId) throws FLException {

		List<QuotetionFunctionAreaPO> quotetionFunctionAreas = quotetionFunctionAreaDao.queryQuotetionFunctionAreaByQuotetionId(qId);

		for (QuotetionFunctionAreaPO quotetionFunctionAreaPO : quotetionFunctionAreas) {

			String tableName = QuotetionFunctionAreaItemPO.quotetionFunctionAreaItemTable(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex());
			quotetionFunctionAreaItemDao.deleteQuotetionFunctionAreaItemByFunctionAreaId(tableName, quotetionFunctionAreaPO.getQfaId()); // 删除报价项
			quotetionFunctionAreaDao.deleteById(quotetionFunctionAreaPO.getQfaId()); // 删除功能区
		}

		quotetionDao.deleteById(qId);

		return 0;
	}

	private QuotetionPO checkQuotetionForStatusByEnabled(long qid) throws FLException {

		QuotetionPO quotetionPO = quotetionDao.get(qid);

		if (quotetionPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotetionPO;
	}

	public static void convertQuotetionVOToPOForAdvance(QuotetionVO quotetionVO, QuotetionPO quotetionPO) {

		quotetionPO.setDiscount(quotetionVO.getDiscount());
		quotetionPO.setBasePrice(quotetionVO.getBasePrice());
		quotetionPO.setTotalPrice(quotetionVO.getTotalPrice());
		quotetionPO.setUndisPrice(quotetionVO.getUndisPrice());
		quotetionPO.setDisPrice(quotetionVO.getDisPrice());

		quotetionPO.setManagePrice(quotetionVO.getManagePrice());
		quotetionPO.setManageRate(quotetionVO.getManageRate());
		quotetionPO.setTrafficPrice(quotetionVO.getTrafficPrice());
		quotetionPO.setTrafficRate(quotetionVO.getTrafficRate());
		quotetionPO.setTaxPrice(quotetionVO.getTaxPrice());
		quotetionPO.setTaxRate(quotetionVO.getTaxRate());

		if (quotetionVO.getTrafficDiscount() != null) quotetionPO.setTrafficDiscount(quotetionVO.getTrafficDiscount());
		if (quotetionVO.getManageDiscount() != null) quotetionPO.setManageDiscount(quotetionVO.getManageDiscount());
		if (quotetionVO.getTaxDiscount() != null) quotetionPO.setTaxDiscount(quotetionVO.getTaxDiscount());

		quotetionPO.setCostPrice(quotetionVO.getCostPrice());

	}

	private void convertQuotetionPOForAdvance(QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO, String name, String measurementUnit, String workType, int unitPrice, String formula, int num, short type, short discount, QuotetionFunctionAreaPO quotetionFunctionArea, String content, short subtype) {

		quotetionFunctionAreaItemPO.setName(name);
		quotetionFunctionAreaItemPO.setMeasurementUnit(measurementUnit);
		quotetionFunctionAreaItemPO.setWorkType(workType);
		quotetionFunctionAreaItemPO.setUnitPrice(unitPrice);
		quotetionFunctionAreaItemPO.setFormula(formula);
		quotetionFunctionAreaItemPO.setNum(num);
		quotetionFunctionAreaItemPO.setType(type);
		quotetionFunctionAreaItemPO.setDiscount(discount);
		quotetionFunctionAreaItemPO.setQfaid(quotetionFunctionArea.getQfaId());
		quotetionFunctionAreaItemPO.setContent(content);
		quotetionFunctionAreaItemPO.setSubtype(subtype);
	}

	private void handleQuotetion(QuotetionVO quotetionVO, QuotetionPO quotetionPO) {

		if (quotetionPO != null) {
			BeanUtil.copyProperties(quotetionPO, quotetionVO);
		}
	}

	private void handleListQuotetion(List<QuotetionVO> quotationVOs, List<QuotetionPO> quotetionPOs) {

		if (quotetionPOs.isEmpty() || quotetionPOs == null) {
			return;
		}

		for (QuotetionPO quotetionPO : quotetionPOs) {

			QuotetionVO _quotetionVO = new QuotetionVO();

			BeanUtil.copyProperties(quotetionPO, _quotetionVO);

			quotationVOs.add(_quotetionVO);
		}
	}

}
