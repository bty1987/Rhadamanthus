package com.fanglin.quotation.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationPricePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationPriceDao;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
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
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private QuotationPriceDao quotationPriceDao;

	@Override
	public List<QuotetionVO> queryQuotetion(String userId) {

		UserPO userPO = userDao.queryUserByUserId(userId);

		List<QuotetionVO> quotetionVOs = new ArrayList<QuotetionVO>();
		List<QuotetionPO> quotetionPOs = quotetionDao.queryQuotetionByCuid(userPO.getUid());

		for (QuotetionPO quotetionPO : quotetionPOs) {

			quotetionVOs.add(quotetionPO.ptv(new QuotetionVO(new QuotationVersionVO())));
		}

		return quotetionVOs;
	}

	@Override
	public QuotetionVO queryQuotetionByQid(QuotetionVO quotetion) throws FLException {

		QuotetionPO quotetionPO = quotetionDao.get(quotetion.getQid());

		if (quotetionPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotetionPO.ptv(new QuotetionVO(new QuotationVersionVO()));
	}

	@Override
	public QuotetionVO queryQuotetionByNo(QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = quotetionDao.queryQuotetionByNo(quotetionVO.getNo());

		if (quotetionPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotetionPO.ptv(new QuotetionVO(new QuotationVersionVO()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException {

		SystemConfigPO quotetionlimit = systemConfigDao.querySystemConfig("quotetionlimit", company);

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (quotetionDao.countQuotetionByCuid(userPO.getUid()) >= (quotetionlimit == null ? 20 : Integer.parseInt(quotetionlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		QuotationVersionPO quotationVersionPO = quotationVersionDao.get(quotetionVO.getVersion().getQvId());

		if (quotationVersionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		QuotetionPO quotetionPO = new QuotetionPO();

		BeanUtil.copyProperties(quotetionVO, quotetionPO, Arrays.asList("version"));

		quotetionPO.setVersion(quotationVersionPO);

		quotetionPO.setCuid(userPO.getUid());
		quotetionPO.setNo(UUIDUtil.getUuid().substring(0, 15));
		quotetionPO.setDiscount(10000);
		quotetionPO.setManageRate(quotationVersionPO.getManageRate());
		quotetionPO.setManageDiscount(quotationVersionPO.getManageDiscount());
		quotetionPO.setTrafficRate(quotationVersionPO.getTrafficRate());
		quotetionPO.setTrafficDiscount(quotationVersionPO.getTrafficDiscount());
		quotetionPO.setTaxRate(quotationVersionPO.getTaxRate());
		quotetionPO.setTaxDiscount(quotationVersionPO.getTaxDiscount());

		quotetionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotetionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		quotetionDao.save(quotetionPO);

		BeanUtil.copyProperties(quotetionPO, quotetionVO, Arrays.asList("version"));

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotetionFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		QuotetionFunctionAreaPO autogeneration = new QuotetionFunctionAreaPO(quotetionPO.getQid(), "生成项目", 9999, QuotetionFunctionAreaPO.TYPE_MANAGEMENT_INT, index);

		quotetionFunctionAreaDao.save(autogeneration);

		QuotetionFunctionAreaItemPO trafficPrice = QuotetionFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index);
		trafficPrice.ptp("车运费", "", "其他", quotationVersionPO.getTrafficRate(), 0, 0, "0", 0, QuotetionFunctionAreaItemPO.TYPE_TRAFFIC_INT, quotationVersionPO.getTrafficDiscount(), autogeneration, "", QuotetionFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);

		QuotetionFunctionAreaItemPO managePrice = QuotetionFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index);
		managePrice.ptp("管理费", "", "其他", quotationVersionPO.getManageRate(), 0, 0, "0", 0, QuotetionFunctionAreaItemPO.TYPE_MANAGE_INT, quotationVersionPO.getManageDiscount(), autogeneration, "", QuotetionFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);

		QuotetionFunctionAreaItemPO taxPrice = QuotetionFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), index);
		taxPrice.ptp("税金", "", "其他", quotationVersionPO.getTaxRate(), 0, 0, "0", 0, QuotetionFunctionAreaItemPO.TYPE_TAX_INT, quotationVersionPO.getTaxDiscount(), autogeneration, "", QuotetionFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);

		quotetionFunctionAreaItemDao.save(trafficPrice);
		quotetionFunctionAreaItemDao.save(managePrice);

		if (quotationVersionPO.getTaxDiscount() != QuotationVersionPO.TAX_NOTTAXDISCOUNT_INT) {
			quotetionFunctionAreaItemDao.save(taxPrice);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotetion(QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		quotetionPO.setName(quotetionVO.getName());
		quotetionPO.setContent(quotetionVO.getContent());

		quotetionDao.update(quotetionPO);

		BeanUtil.copyProperties(quotetionPO, quotetionVO, Arrays.asList("version"));

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

		QuotationPO quotationSO = quotationDao.get(quotetionVO.getQid());

		if (quotationSO == null) {
			throw new FLException(200003, "报价不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		SystemConfigPO quotetionlimit = systemConfigDao.querySystemConfig("quotetionlimit", company);

		if (quotetionDao.countQuotetionByCuid(userPO.getUid()) >= (quotetionlimit == null ? 20 : Integer.parseInt(quotetionlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		short keeprice = quotetionVO.getKeeprice();

		Timestamp updateTime = DateUtil.getDateToTimestamp(new Date());

		if ((keeprice & QuotetionPO.KEEPRICE_TIMEKEEP_INT) == QuotetionPO.KEEPRICE_TIMEKEEP_INT && quotationSO.getUpdateTime() != null) {
			updateTime = quotationSO.getUpdateTime();
		}

		QuotetionPO quotetionTO = new QuotetionPO();

		quotetionTO.ptp(quotationSO.getVersion(), quotationSO.getName(), userPO.getUid(), updateTime);

		quotetionDao.save(quotetionTO);

		copyQuotation(quotetionVO.getQid(), quotetionTO.getQid(), keeprice, updateTime);

		BeanUtil.copyProperties(quotetionTO, quotetionVO, Arrays.asList("version"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cloneQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException {

		QuotetionPO quotetionSO = quotetionDao.queryQuotetionByNo(quotetionVO.getNo());

		if (quotetionSO == null) {
			throw new FLException(200003, "报价不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		SystemConfigPO quotetionlimit = systemConfigDao.querySystemConfig("quotetionlimit", company);

		if (quotetionDao.countQuotetionByCuid(userPO.getUid()) >= (quotetionlimit == null ? 20 : Integer.parseInt(quotetionlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		short keeprice = quotetionVO.getKeeprice();

		Timestamp updateTime = DateUtil.getDateToTimestamp(new Date());

		if ((keeprice & QuotetionPO.KEEPRICE_TIMEKEEP_INT) == QuotetionPO.KEEPRICE_TIMEKEEP_INT && quotetionSO.getUpdateTime() != null) {
			updateTime = quotetionSO.getUpdateTime();
		}

		QuotetionPO quotetionTO = new QuotetionPO();

		quotetionTO.ptp(quotetionSO.getVersion(), quotetionSO.getName(), userPO.getUid(), updateTime);

		quotetionDao.save(quotetionTO);

		copyQuotetion(quotetionSO.getQid(), quotetionTO.getQid(), keeprice, updateTime);

		BeanUtil.copyProperties(quotetionTO, quotetionVO, Arrays.asList("version"));

		return 0;
	};

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int copyQuotetion(QuotetionVO quotetionVO, String userId, int company) throws FLException {

		QuotetionPO quotetionSO = quotetionDao.get(quotetionVO.getQid());

		if (quotetionSO == null) {
			throw new FLException(200003, "报价不存在");
		}

		QuotetionPO quotetionPO = new QuotetionPO();

		UserPO userPO = userDao.queryUserByUserId(userId);

		SystemConfigPO quotetionlimit = systemConfigDao.querySystemConfig("quotetionlimit", company);

		if (quotetionDao.countQuotetionByCuid(userPO.getUid()) >= (quotetionlimit == null ? 20 : Integer.parseInt(quotetionlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		BeanUtil.copyProperties(quotetionVO, quotetionPO, Arrays.asList("qid", "cuid", "version"));

		quotetionPO.setCuid(userPO.getUid());
		quotetionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotetionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		quotetionPO.setNo(UUIDUtil.getUuid().substring(0, 15));

		quotetionPO.setVersion(quotetionSO.getVersion());
		quotetionPO.setDiscount(quotetionSO.getDiscount());
		quotetionPO.setTotalPrice(quotetionSO.getTotalPrice());

		quotetionDao.save(quotetionPO);

		copyQuotetion(quotetionVO.getQid(), quotetionPO.getQid(), quotetionVO.getKeeprice(), DateUtil.getDateToTimestamp(new Date()));

		BeanUtil.copyProperties(quotetionPO, quotetionVO, Arrays.asList("version"));

		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	private int copyQuotation(long quotationId, long quotetionId, short keeprice, Timestamp updateTime) throws FLException {

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationId);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotetionFunctionAreaIndex");

		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (QuotationFunctionAreaPO quotationFunctionAreaSO : quotationFunctionAreaPOs) {

			QuotetionFunctionAreaPO quotetionFunctionAreaPO = new QuotetionFunctionAreaPO();

			quotetionFunctionAreaPO.setName(quotationFunctionAreaSO.getFunctionAreaName());

			quotetionFunctionAreaPO.setFunctionAreaOrder(quotationFunctionAreaSO.getFunctionAreaOrder());
			quotetionFunctionAreaPO.setType(quotationFunctionAreaSO.getType());
			quotetionFunctionAreaPO.setQid(quotetionId);
			quotetionFunctionAreaPO.setIndex(index);

			quotetionFunctionAreaDao.save(quotetionFunctionAreaPO);

			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaSO.getQfaId(), quotationFunctionAreaSO.getIndex()), quotationFunctionAreaSO.getQfaId());

			for (QuotationFunctionAreaItemPO quotationFunctionAreaItemSO : quotationFunctionAreaItemPOs) {

				QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = QuotetionFunctionAreaItemPO.factoryToInstance(quotetionFunctionAreaPO.getQfaId(), index);

				quotetionFunctionAreaItemPO.setQfaid(quotetionFunctionAreaPO.getQfaId());

				quotetionFunctionAreaItemPO.ptp(quotationFunctionAreaItemSO);

				if (quotationFunctionAreaItemSO.getQuotationItem() != null && (keeprice & QuotetionPO.KEEPRICE_PRICEKEEP_INT) != QuotetionPO.KEEPRICE_PRICEKEEP_INT) {

					quotetionFunctionAreaItemPO.setQiid(quotationFunctionAreaItemSO.getQuotationItem().getQiid());

					QuotationPricePO quotationPricePO = quotationPriceDao.queryQuotationPriceLast(quotationFunctionAreaItemSO.getQuotationItem().getQiid(), updateTime);

					if (quotationPricePO != null) {

						quotetionFunctionAreaItemPO.setAddPrice(quotationPricePO.getAddPrice());
						quotetionFunctionAreaItemPO.setUnitPrice(quotationPricePO.getUnitPrice());
						quotetionFunctionAreaItemPO.setSubPrice(quotationPricePO.getSubPrice());
					}
				}

				quotetionFunctionAreaItemDao.save(quotetionFunctionAreaItemPO);
			}
		}
		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	private int copyQuotetion(long quotetionId, long newQuotetionId, short keeprice, Timestamp updateTime) throws FLException {

		List<QuotetionFunctionAreaPO> quotetionFunctionAreaPOs = quotetionFunctionAreaDao.queryQuotetionFunctionAreaByQuotetionId(quotetionId);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotetionFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (QuotetionFunctionAreaPO quotetionFunctionAreaSO : quotetionFunctionAreaPOs) {

			QuotetionFunctionAreaPO quotetionFunctionAreaPO = new QuotetionFunctionAreaPO();

			BeanUtil.copyProperties(quotetionFunctionAreaSO, quotetionFunctionAreaPO, Arrays.asList("qfaId"));

			quotetionFunctionAreaPO.setQid(newQuotetionId);
			quotetionFunctionAreaPO.setIndex(index);

			quotetionFunctionAreaDao.save(quotetionFunctionAreaPO);

			List<QuotetionFunctionAreaItemPO> quotetionFunctionAreaItemPOs = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaSO.getQfaId(), quotetionFunctionAreaSO.getIndex()), quotetionFunctionAreaSO.getQfaId());

			for (QuotetionFunctionAreaItemPO quotetionFunctionAreaItemSO : quotetionFunctionAreaItemPOs) {

				QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = QuotetionFunctionAreaItemPO.factoryToInstance(quotetionFunctionAreaPO.getQfaId(), index);

				BeanUtil.copyProperties(quotetionFunctionAreaItemSO, quotetionFunctionAreaItemPO, Arrays.asList("qfaiId"));

				quotetionFunctionAreaItemPO.setQfaid(quotetionFunctionAreaPO.getQfaId());

				if (quotetionFunctionAreaItemSO.getQiid() != 0 && (keeprice & QuotetionPO.KEEPRICE_PRICEKEEP_INT) != QuotetionPO.KEEPRICE_PRICEKEEP_INT) {

					QuotationPricePO quotationPricePO = quotationPriceDao.queryQuotationPriceLast(quotetionFunctionAreaItemSO.getQiid(), updateTime);

					if (quotationPricePO != null) {

						quotetionFunctionAreaItemPO.setAddPrice(quotationPricePO.getAddPrice());
						quotetionFunctionAreaItemPO.setUnitPrice(quotationPricePO.getUnitPrice());
						quotetionFunctionAreaItemPO.setSubPrice(quotationPricePO.getSubPrice());
					}
				}

				quotetionFunctionAreaItemDao.save(quotetionFunctionAreaItemPO);
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
		quotetionPO.setUnachePrice(quotetionVO.getUnachePrice());
		quotetionPO.setConsPrice(quotetionVO.getConsPrice());
		quotetionPO.setComsPrice(quotetionVO.getComsPrice());

	}

}
