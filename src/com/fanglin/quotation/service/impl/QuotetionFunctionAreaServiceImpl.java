package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

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
				}

				quotetionFunctionAreaItemVOs.add(quotetionFunctionAreaItemVO);
			}

			quotetionFunctionAreaVO.setQuotetionFunctionAreaItems(quotetionFunctionAreaItemVOs);

			// 加载功能区参数
			QuotetionFunctionAreaParamPO paramPO = quotetionFunctionAreaParamDao.queryQuotetionFunctionAreaParam(quotetionFunctionAreaPO.getQfaId());
			if (paramPO != null) {
				QuotetionFunctionAreaParamVO paramVO = new QuotetionFunctionAreaParamVO();
				paramVO.setQfapId(paramPO.getQfapId());
				paramVO.setQfaId(paramPO.getQfaId());
				paramVO.setGirth(paramPO.getGirth());
				paramVO.setArea(paramPO.getArea());
				paramVO.setHeight(paramPO.getHeight());
				paramVO.setHoleLength(paramPO.getHoleLength());
				paramVO.setHoleHeight(paramPO.getHoleHeight());
				paramVO.setWindowLength(paramPO.getWindowLength());
				paramVO.setWindowHeight(paramPO.getWindowHeight());
				paramVO.setBeamLength(paramPO.getBeamLength());
				paramVO.setBeamHeight(paramPO.getBeamHeight());
				quotetionFunctionAreaVO.setQuotetionFunctionAreaParam(paramVO);
				quotetionFunctionAreaVO.setQfapId(paramPO.getQfapId());
			}

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
	public List<QuotetionFunctionAreaVO> addQuotetionFuctionArea(List<Long> functionAreaIds, QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);

		List<QuotetionFunctionAreaVO> quotetionFunctionAreaVOs = new ArrayList<QuotetionFunctionAreaVO>();

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotetionFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (Long functionAreaId : functionAreaIds) {

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

			quotetionFunctionAreaVOs.add(quotetionFunctionAreaVO);
		}

		quotetionDao.update(quotetionPO);

		return quotetionFunctionAreaVOs;
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
			saveQuotetionFunctionAreaParam(quotetionFunctionAreaVO.getQfaId(), quotetionFunctionAreaVO.getQuotetionFunctionAreaParam());
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
		QuotetionFunctionAreaPO sourceFunctionArea = quotetionFunctionAreaDao.get(quotetionFunctionAreaVO.getQfaId());

		if (sourceFunctionArea == null) {
			throw new FLException(200012, "功能区不存在");
		}

		// 创建新功能区
		QuotetionFunctionAreaPO newFunctionArea = new QuotetionFunctionAreaPO();
		BeanUtil.copyProperties(sourceFunctionArea, newFunctionArea);

		// 设置新功能区的名称（原名称_副本）
		String newName = sourceFunctionArea.getName() + "_副本";
		newFunctionArea.setName(newName);

		// 保存新功能区
		quotetionFunctionAreaDao.saveOrUpdate(newFunctionArea);

		// 复制功能区参数（如果存在）
		QuotetionFunctionAreaParamPO sourceParam = quotetionFunctionAreaParamDao.queryQuotetionFunctionAreaParam(sourceFunctionArea.getQfaId());
		if (sourceParam != null) {
			QuotetionFunctionAreaParamPO newParam = new QuotetionFunctionAreaParamPO();
			BeanUtil.copyProperties(sourceParam, newParam);
			newParam.setQfapId(UUID.randomUUID().toString());
			newParam.setQfaId(newFunctionArea.getQfaId());
			newParam.setCreateTime(new Date());
			quotetionFunctionAreaParamDao.save(newParam);
		}

		// 查询原功能区的所有报价项
		List<QuotetionFunctionAreaItemPO> sourceItems = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(sourceFunctionArea.getQfaId(), sourceFunctionArea.getIndex()), sourceFunctionArea.getQfaId());

		List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItemVOs = new ArrayList<QuotetionFunctionAreaItemVO>();

		// 复制所有报价项
		if (sourceItems != null && !sourceItems.isEmpty()) {
			for (QuotetionFunctionAreaItemPO sourceItem : sourceItems) {
				// 创建新的报价项
				QuotetionFunctionAreaItemPO newItem = new QuotetionFunctionAreaItemPO();
				BeanUtil.copyProperties(sourceItem, newItem);

				// 重新设置ID和功能区ID
				newItem.setQfaiId(newFunctionArea.getQfaId());
				// qfaiId 会自动生成

				// 保存新报价项
				quotetionFunctionAreaItemDao.save(newItem);

				QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO = new QuotetionFunctionAreaItemVO();

				BeanUtil.copyProperties(newItem, quotetionFunctionAreaItemVO, "");

				quotetionFunctionAreaItemVOs.add(quotetionFunctionAreaItemVO);
			}
		}

		// 更新报价
		quotetionDao.update(quotetionPO);

		quotetionFunctionAreaVO.setQuotetionFunctionAreaItems(quotetionFunctionAreaItemVOs);

		return quotetionFunctionAreaVO;
	}

	/**
	 * 保存功能区参数
	 * 
	 * @param qfaId 功能区ID
	 * @param paramVO 参数VO
	 * @return 参数ID
	 */
	private String saveQuotetionFunctionAreaParam(Long qfaId, QuotetionFunctionAreaParamVO paramVO) {

		// 查询是否已存在参数
		QuotetionFunctionAreaParamPO existingParam = quotetionFunctionAreaParamDao.queryQuotetionFunctionAreaParam(qfaId);

		QuotetionFunctionAreaParamPO paramPO;

		if (existingParam != null) {
			// 更新参数
			paramPO = existingParam;
		} else {
			// 新增参数
			paramPO = new QuotetionFunctionAreaParamPO();
			paramPO.setQfapId(UUID.randomUUID().toString());
			paramPO.setQfaId(qfaId);
			paramPO.setCreateTime(new Date());
		}

		// 设置参数值
		paramPO.setGirth(paramVO.getGirth());
		paramPO.setArea(paramVO.getArea());
		paramPO.setHeight(paramVO.getHeight());
		paramPO.setHoleLength(paramVO.getHoleLength());
		paramPO.setHoleHeight(paramVO.getHoleHeight());
		paramPO.setWindowLength(paramVO.getWindowLength());
		paramPO.setWindowHeight(paramVO.getWindowHeight());
		paramPO.setBeamLength(paramVO.getBeamLength());
		paramPO.setBeamHeight(paramVO.getBeamHeight());
		paramPO.setUpdateTime(new Date());

		// 保存
		if (existingParam != null) {
			quotetionFunctionAreaParamDao.update(paramPO);
		} else {
			quotetionFunctionAreaParamDao.save(paramPO);
		}

		return paramPO.getQfapId();
	}

	private QuotetionPO checkQuotetionForStatusByEnabled(long qid) throws FLException {

		QuotetionPO quotetionPO = quotetionDao.get(qid);

		if (quotetionPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotetionPO;
	}

}
