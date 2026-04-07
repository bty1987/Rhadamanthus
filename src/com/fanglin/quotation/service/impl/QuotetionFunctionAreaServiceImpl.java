package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationPricePO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.dao.QuotationPriceDao;
import com.fanglin.quotation.dao.QuotetionDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaItemDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaParamDao;
import com.fanglin.quotation.po.QuotetionFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaParamPO;
import com.fanglin.quotation.po.QuotetionPO;
import com.fanglin.quotation.service.QuotetionFunctionAreaService;
import com.fanglin.quotation.vo.QuotetionFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotetionFunctionAreaParamVO;
import com.fanglin.quotation.vo.QuotetionFunctionAreaVO;
import com.fanglin.quotation.vo.QuotetionVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;

@Service("quotetionFunctionAreaService")
@Transactional(readOnly = true)
public class QuotetionFunctionAreaServiceImpl implements QuotetionFunctionAreaService {

	@Autowired
	private FunctionAreaDao functionAreaDao;

	@Autowired
	private QuotationPriceDao quotationPriceDao;

	@Autowired
	private QuotetionDao quotetionDao;

	@Autowired
	private QuotetionFunctionAreaDao quotetionFunctionAreaDao;

	@Autowired
	private QuotetionFunctionAreaItemDao quotetionFunctionAreaItemDao;

	@Autowired
	private QuotetionFunctionAreaParamDao quotetionFunctionAreaParamDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Override
	public List<QuotetionFunctionAreaVO> queryQuotetionFunctionAreaByQid(QuotetionVO quotetionVO) throws FLException {

		QuotetionFunctionAreaVO autogeneration = null;

		List<QuotetionFunctionAreaVO> quotetionFunctionAreaVOs = new ArrayList<QuotetionFunctionAreaVO>();

		List<QuotetionFunctionAreaPO> quotetionFunctionAreaPOs = quotetionFunctionAreaDao.queryQuotetionFunctionAreaByQuotetionId(quotetionVO.getQid());

		for (QuotetionFunctionAreaPO quotetionFunctionAreaPO : quotetionFunctionAreaPOs) {

			QuotetionFunctionAreaVO quotetionFunctionAreaVO = new QuotetionFunctionAreaVO();

			BeanUtil.copyProperties(quotetionFunctionAreaPO, quotetionFunctionAreaVO);

			QuotetionFunctionAreaParamPO quotetionFunctionAreaParamPO = quotetionFunctionAreaParamDao.queryQuotetionFunctionAreaParam(quotetionFunctionAreaPO.getQfaId());

			if (quotetionFunctionAreaParamPO != null) {
				QuotetionFunctionAreaParamVO quotetionFunctionAreaParamVO = new com.fanglin.quotation.vo.QuotetionFunctionAreaParamVO();

				BeanUtil.copyProperties(quotetionFunctionAreaParamPO, quotetionFunctionAreaParamVO);

				quotetionFunctionAreaVO.setQuotetionFunctionAreaParam(quotetionFunctionAreaParamVO);
			}

			List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItemVOs = new ArrayList<QuotetionFunctionAreaItemVO>();

			List<QuotetionFunctionAreaItemPO> quotetionFunctionAreaItemPOs = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex()), quotetionFunctionAreaPO.getQfaId());

			for (QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO : quotetionFunctionAreaItemPOs) {

				QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO = new QuotetionFunctionAreaItemVO();

				BeanUtil.copyProperties(quotetionFunctionAreaItemPO, quotetionFunctionAreaItemVO);

				QuotationItemPO quotationItemPO = quotationItemDao.get(quotetionFunctionAreaItemPO.getQiid());

				if (quotationItemPO != null) {
					quotetionFunctionAreaItemVO.setQiid(quotetionFunctionAreaItemPO.getQiid());
					quotetionFunctionAreaItemVO.setIsRtem(quotationItemPO.getIsRtem());
					quotetionFunctionAreaItemVO.setQuotationRtemId(quotationItemPO.getRtemFlag());
					// 复制公式表达式用于功能区参数更新后计算工程量
					quotetionFunctionAreaItemVO.setExpres(quotationItemPO.getFormula());
				}

				quotetionFunctionAreaItemVOs.add(quotetionFunctionAreaItemVO);
			}

			quotetionFunctionAreaVO.setQuotetionFunctionAreaItems(quotetionFunctionAreaItemVOs);

			if ("0".equals(quotetionFunctionAreaVO.getType())) {
				autogeneration = quotetionFunctionAreaVO;
			} else {
				quotetionFunctionAreaVOs.add(quotetionFunctionAreaVO);
			}
		}

		if (autogeneration != null) {
			quotetionFunctionAreaVOs.add(autogeneration);
		}

		return quotetionFunctionAreaVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotetionFunctionAreaVO> addQuotetionFuctionArea(List<QuotetionFunctionAreaVO> quotetionFunctionAreas, QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);

		List<QuotetionFunctionAreaVO> resultQuotetionFunctionAreaVOs = new ArrayList<QuotetionFunctionAreaVO>();

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotetionFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (QuotetionFunctionAreaVO inputVO : quotetionFunctionAreas) {

			Long functionAreaId = inputVO.getId();

			FunctionAreaPO functionAreaPO = functionAreaDao.get(functionAreaId);

			if (functionAreaPO == null) continue;

			QuotetionFunctionAreaVO quotetionFunctionAreaVO = new QuotetionFunctionAreaVO();

			quotetionFunctionAreaVO.setQid(quotetionVO.getQid());
			quotetionFunctionAreaVO.setName(functionAreaPO.getName());

			quotetionFunctionAreaVO.setFunctionAreaOrder(functionAreaPO.getFunctionAreaOrder());
			quotetionFunctionAreaVO.setType(functionAreaPO.getType());

			QuotetionFunctionAreaPO quotetionFunctionAreaPO = new QuotetionFunctionAreaPO();

			BeanUtil.copyProperties(quotetionFunctionAreaVO, quotetionFunctionAreaPO);

			quotetionFunctionAreaPO.setIndex(index);

			quotetionFunctionAreaDao.saveOrUpdate(quotetionFunctionAreaPO);

			// 保存功能区参数（从 inputVO 中获取 quotetionFunctionAreaParam）
			QuotetionFunctionAreaParamVO paramVO = inputVO.getQuotetionFunctionAreaParam();
			if (paramVO != null) {
				com.fanglin.quotation.po.QuotetionFunctionAreaParamPO paramPO = new com.fanglin.quotation.po.QuotetionFunctionAreaParamPO();
				BeanUtil.copyProperties(paramVO, paramPO);
				paramPO.setQfaId(quotetionFunctionAreaPO.getQfaId());
				quotetionFunctionAreaParamDao.saveOrUpdate(paramPO);
				// 将 paramPO 复制回 paramVO，以便返回给前端
				BeanUtil.copyProperties(paramPO, paramVO);
				quotetionFunctionAreaVO.setQuotetionFunctionAreaParam(paramVO);
			}

			List<QuotationPricePO> quotationPricePOs = quotationPriceDao.queryQuotationPrice(functionAreaPO.getFaid(), quotetionPO.getUpdateTime());

			List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItemVOs = new ArrayList<QuotetionFunctionAreaItemVO>();

			int sort = 1;

			for (QuotationPricePO quotationPricePO : quotationPricePOs) {

				short itemType = QuotetionFunctionAreaItemPO.TYPE_COMMON_INT;

				QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO = new QuotetionFunctionAreaItemVO();

				QuotationItemPO quotationItemPO = quotationPricePO.getQuotationItem();

				if (functionAreaPO.getType() == FunctionAreaPO.TYPE_IGNORE_INT) {
					itemType = QuotetionFunctionAreaItemPO.TYPE_IGNORE_INT;
				}

				if (functionAreaPO.getType() == FunctionAreaPO.TYPE_COST_INT) {
					itemType = QuotetionFunctionAreaItemPO.TYPE_COST_INT;
				}

				if (functionAreaPO.getType() == FunctionAreaPO.TYPE_UNACHE_INT) {
					itemType = QuotetionFunctionAreaItemPO.TYPE_UNACHE_INT;
				}

				if (quotationItemPO.getType() == QuotationItemPO.TYPE_COST_INT) {
					itemType = QuotetionFunctionAreaItemPO.TYPE_COST_INT;
				}

				if (quotationItemPO.getType() == QuotationItemPO.TYPE_UNACHE_INT) {
					itemType = QuotetionFunctionAreaItemPO.TYPE_UNACHE_INT;
				}

				quotetionFunctionAreaItemVO.setQiid(quotationItemPO.getQiid());
				quotetionFunctionAreaItemVO.setQfaid(quotetionFunctionAreaPO.getQfaId());

				quotetionFunctionAreaItemVO.setName(quotationItemPO.getName());
				quotetionFunctionAreaItemVO.setMeasurementUnit(quotationItemPO.getMeasurementUnit().getName());
				quotetionFunctionAreaItemVO.setWorkType(quotationItemPO.getWorkType().getName());

				quotetionFunctionAreaItemVO.setNum(0);
				quotetionFunctionAreaItemVO.setDiscount(quotationItemPO.getDiscount());
				quotetionFunctionAreaItemVO.setUnitPrice(quotationPricePO.getUnitPrice());
				quotetionFunctionAreaItemVO.setAddPrice(quotationPricePO.getAddPrice());
				quotetionFunctionAreaItemVO.setSubPrice(quotationPricePO.getSubPrice());

				quotetionFunctionAreaItemVO.setType(itemType);
				quotetionFunctionAreaItemVO.setSubtype((short) quotationPricePO.getQuotationItem().getQuotationType().getId());

				quotetionFunctionAreaItemVO.setIndex(sort++);
				quotetionFunctionAreaItemVO.setContent(quotationItemPO.getComment());
				quotetionFunctionAreaItemVO.setIsRtem(quotationItemPO.getIsRtem());

				quotetionFunctionAreaItemVOs.add(quotetionFunctionAreaItemVO);
			}

			quotetionFunctionAreaVO.setQfaId(quotetionFunctionAreaPO.getQfaId());
			quotetionFunctionAreaVO.setQuotetionFunctionAreaItems(quotetionFunctionAreaItemVOs);

			resultQuotetionFunctionAreaVOs.add(quotetionFunctionAreaVO);
		}

		quotetionDao.update(quotetionPO);

		return resultQuotetionFunctionAreaVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotetionFunctionArea(QuotetionFunctionAreaVO quotetionFunctionAreaVO, QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);

		QuotetionFunctionAreaPO quotetionFunctionAreaPO = quotetionFunctionAreaDao.get(quotetionFunctionAreaVO.getQfaId());

		if (quotetionFunctionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		quotetionFunctionAreaPO.setName(quotetionFunctionAreaVO.getName());

		quotetionFunctionAreaPO.setFunctionAreaOrder(quotetionFunctionAreaVO.getFunctionAreaOrder());

		quotetionFunctionAreaDao.update(quotetionFunctionAreaPO);

		// 保存功能区参数
		if (quotetionFunctionAreaVO.getQuotetionFunctionAreaParam() != null) {

			QuotetionFunctionAreaParamPO quotetionFunctionAreaParamPO = quotetionFunctionAreaParamDao.queryQuotetionFunctionAreaParam(quotetionFunctionAreaPO.getQfaId());

			if (quotetionFunctionAreaParamPO == null) {
				quotetionFunctionAreaParamPO = new com.fanglin.quotation.po.QuotetionFunctionAreaParamPO();
				quotetionFunctionAreaParamPO.setQfaId(quotetionFunctionAreaPO.getQfaId());
			}

			BeanUtil.copyProperties(quotetionFunctionAreaVO.getQuotetionFunctionAreaParam(), quotetionFunctionAreaParamPO);

			quotetionFunctionAreaParamDao.saveOrUpdate(quotetionFunctionAreaParamPO);
		}

		quotetionDao.update(quotetionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotetionFunctionArea(QuotetionFunctionAreaVO quotetionFunctionAreaVO, QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);

		QuotetionFunctionAreaPO quotetionFunctionAreaPO = quotetionFunctionAreaDao.get(quotetionFunctionAreaVO.getQfaId());

		Long qfaId = quotetionFunctionAreaPO.getQfaId();
		Short index = quotetionFunctionAreaPO.getIndex();

		List<Long> qfaIds = Arrays.asList(new Long[] { quotetionFunctionAreaVO.getQfaId() });

		quotetionFunctionAreaDao.deleteQuotetionFunctionAreaByIds(qfaIds);

		String tableName = QuotetionFunctionAreaItemPO.quotetionFunctionAreaItemTable(qfaId, index);

		quotetionFunctionAreaItemDao.deleteQuotetionFunctionAreaItemByFunctionAreaId(tableName, qfaId);

		quotetionDao.update(quotetionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotetionFunctionAreaVO copyQuotetionFunctionArea(QuotetionFunctionAreaVO quotetionFunctionAreaVO, QuotetionVO quotetionVO) throws FLException {

		// 检查报价状态
		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());
		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);

		// 查询原功能区
		QuotetionFunctionAreaPO quotetionFunctionAreaSO = quotetionFunctionAreaDao.get(quotetionFunctionAreaVO.getQfaId());

		if (quotetionFunctionAreaSO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		// 创建新功能区
		QuotetionFunctionAreaPO quotetionFunctionAreaTO = new QuotetionFunctionAreaPO();
		BeanUtil.copyProperties(quotetionFunctionAreaSO, quotetionFunctionAreaTO);

		// 设置新功能区的名称（原名称_副本）
		String newName = quotetionFunctionAreaSO.getName() + "_副本";
		quotetionFunctionAreaTO.setName(newName);

		// 保存新功能区
		quotetionFunctionAreaDao.save(quotetionFunctionAreaTO);
		// 立即刷新以确保主键回填（用于后续参数复制）
		quotetionFunctionAreaDao.flush();

		// 更新报价
		quotetionDao.update(quotetionPO);

		quotetionFunctionAreaParamDao.copyQuotetionFunctionAreaParam(quotetionFunctionAreaSO.getQfaId(), quotetionFunctionAreaTO.getQfaId());

		// 复制报价项（使用 SQL 方式）
		String tableName = QuotetionFunctionAreaItemPO.quotetionFunctionAreaItemTableName(quotetionFunctionAreaTO.getQfaId(), quotetionFunctionAreaTO.getIndex());
		quotetionFunctionAreaItemDao.copyQuotetionFunctionAreaItem(tableName, quotetionFunctionAreaSO.getQfaId(), quotetionFunctionAreaTO.getQfaId());

		// 查询新功能区的所有报价项，用于返回给前端
		List<QuotetionFunctionAreaItemPO> quotetionFunctionAreaItemPOs = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaTO.getQfaId(), quotetionFunctionAreaTO.getIndex()), quotetionFunctionAreaTO.getQfaId());
		List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItemVOs = new ArrayList<QuotetionFunctionAreaItemVO>();

		if (quotetionFunctionAreaItemPOs != null && !quotetionFunctionAreaItemPOs.isEmpty()) {
			for (QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO : quotetionFunctionAreaItemPOs) {
				QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO = new QuotetionFunctionAreaItemVO();
				BeanUtil.copyProperties(quotetionFunctionAreaItemPO, quotetionFunctionAreaItemVO, "");
				quotetionFunctionAreaItemVOs.add(quotetionFunctionAreaItemVO);
			}
		}

		// 设置返回字段
		quotetionFunctionAreaVO.setQfaId(quotetionFunctionAreaTO.getQfaId());
		quotetionFunctionAreaVO.setQid(quotetionFunctionAreaTO.getQid());
		quotetionFunctionAreaVO.setFunctionAreaOrder(quotetionFunctionAreaTO.getFunctionAreaOrder());
		quotetionFunctionAreaVO.setType(quotetionFunctionAreaTO.getType());
		quotetionFunctionAreaVO.setName(quotetionFunctionAreaTO.getName());

		// 查询并返回功能区参数
		QuotetionFunctionAreaParamPO quotetionFunctionAreaParamPO = quotetionFunctionAreaParamDao.queryQuotetionFunctionAreaParam(quotetionFunctionAreaTO.getQfaId());

		if (quotetionFunctionAreaParamPO != null) {

			QuotetionFunctionAreaParamVO quotetionFunctionAreaParamVO = new com.fanglin.quotation.vo.QuotetionFunctionAreaParamVO();

			BeanUtil.copyProperties(quotetionFunctionAreaParamPO, quotetionFunctionAreaParamVO);

			quotetionFunctionAreaVO.setQuotetionFunctionAreaParam(quotetionFunctionAreaParamVO);
		}

		quotetionFunctionAreaVO.setQuotetionFunctionAreaItems(quotetionFunctionAreaItemVOs);

		return quotetionFunctionAreaVO;
	}

	private QuotetionPO checkQuotetionForStatusByEnabled(long qid) throws FLException {

		QuotetionPO quotetionPO = quotetionDao.get(qid);

		if (quotetionPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotetionPO;
	}

}
