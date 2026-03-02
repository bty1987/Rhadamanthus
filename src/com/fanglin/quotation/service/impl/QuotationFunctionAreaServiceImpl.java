/**
 * @File Name		: QuotationFunctionAreaServiceImpl.java
 * @Package   	: com.fanglin.quotation.service.impl
 * @Version		: 1.0
 * @Date			: 2016-6-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

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
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationPricePO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.QuotationPriceDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.quotation.dao.AddReduceItemDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaParamDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationFunctionAreaParamPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationFunctionAreaService;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaParamVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("quotationFunctionAreaService")
@Transactional(readOnly = true)
public class QuotationFunctionAreaServiceImpl implements QuotationFunctionAreaService {

	@Autowired
	private FunctionAreaDao functionAreaDao;

	@Autowired
	private QuotationPriceDao quotationPriceDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private ExtensionItemDao extensionItemDao;

	@Autowired
	private AddReduceItemDao addReduceItemDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private QuotationFunctionAreaParamDao quotationFunctionAreaParamDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public List<QuotationFunctionAreaVO> queryQuotationFunctionAreaByQuotationId(QuotationVO quotationVO) throws FLException {

		QuotationFunctionAreaVO autogeneration = null;

		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {

			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();

			BeanUtil.copyProperties(quotationFunctionAreaPO, quotationFunctionAreaVO);

			QuotationFunctionAreaParamPO quotationFunctionAreaParamPO = quotationFunctionAreaParamDao.queryQuotationFunctionAreaParam(quotationFunctionAreaPO.getQfaId());

			if (quotationFunctionAreaParamPO != null) {
				quotationFunctionAreaVO.setQuotationFunctionAreaParam(new QuotationFunctionAreaParamVO());

				BeanUtil.copyPropertie(quotationFunctionAreaParamPO, quotationFunctionAreaVO.getQuotationFunctionAreaParam());
			}

			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();

			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaPO.getQfaId());

			for (QuotationFunctionAreaItemPO quotationFunctionAreaItemPO : quotationFunctionAreaItemPOs) {

				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();

				BeanUtil.copyProperties(quotationFunctionAreaItemPO, quotationFunctionAreaItemVO, Arrays.asList("quotationFunctionArea", "quotationItem"));

				quotationFunctionAreaItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());

				if (quotationFunctionAreaItemPO.getQuotationItem() != null) {

					QuotationItemPO quotationItemPO = quotationFunctionAreaItemPO.getQuotationItem();

					quotationFunctionAreaItemVO.setQuotationItemId(quotationItemPO.getQiid());
					quotationFunctionAreaItemVO.setContent(quotationItemPO.getComment());
					quotationFunctionAreaItemVO.setExpres(quotationItemPO.getFormula());
					quotationFunctionAreaItemVO.setIsRtem(quotationItemPO.getIsRtem());
					quotationFunctionAreaItemVO.setQuotationRtemId(quotationItemPO.getRtemFlag());
				}

				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}

			quotationFunctionAreaVO.setQuotationFunctionAreaItems(quotationFunctionAreaItemVOs);

			if (String.valueOf(QuotationFunctionAreaPO.TYPE_MANAGEMENT_INT).equals(quotationFunctionAreaVO.getFunctionAreaType())) {
				autogeneration = quotationFunctionAreaVO;
			} else {
				quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
			}
		}

		if (autogeneration != null) {
			quotationFunctionAreaVOs.add(autogeneration);
		}

		return quotationFunctionAreaVOs;
	}

	@Override
	public List<QuotationFunctionAreaVO> queryQuotationFunctionAreaForCommonByQuotationId(QuotationVO quotationVO) throws FLException {

		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();
		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {
			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();

			BeanUtil.copyProperties(quotationFunctionAreaPO, quotationFunctionAreaVO);

			if (QuotationFunctionAreaPO.TYPE_MANAGEMENT_INT != quotationFunctionAreaVO.getType()) {
				quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
			}
		}

		return quotationFunctionAreaVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationFunctionAreaVO> addQuotationFunctionAreaByFunctionAreaIds(List<QuotationFunctionAreaVO> quotationFunctionAreaVOs, QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		List<QuotationFunctionAreaVO> _quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotationFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		for (QuotationFunctionAreaVO quotationFunctionAreaVO : quotationFunctionAreaVOs) {

			FunctionAreaPO functionAreaPO = functionAreaDao.get(quotationFunctionAreaVO.getId());

			if (functionAreaPO == null) continue;

			quotationFunctionAreaVO.setFunctionAreaName(functionAreaPO.getName());
			quotationFunctionAreaVO.setFunctionAreaOrder(functionAreaPO.getFunctionAreaOrder());
			quotationFunctionAreaVO.setFunctionAreaType(functionAreaPO.getFunctionAreaType());
			quotationFunctionAreaVO.setType(functionAreaPO.getType());
			quotationFunctionAreaVO.setTotal(functionAreaPO.getTotal());

			QuotationFunctionAreaPO quotationFunctionAreaPO = new QuotationFunctionAreaPO();

			BeanUtil.copyProperties(quotationFunctionAreaVO, quotationFunctionAreaPO);

			quotationFunctionAreaPO.setIndex(index);
			quotationFunctionAreaPO.setQuotation(quotationPO);

			quotationFunctionAreaDao.saveOrUpdate(quotationFunctionAreaPO);

			if (quotationFunctionAreaVO.getQuotationFunctionAreaParam() != null) {
				QuotationFunctionAreaParamPO quotationFunctionAreaParamPO = new QuotationFunctionAreaParamPO();

				BeanUtil.copyPropertie(quotationFunctionAreaVO.getQuotationFunctionAreaParam(), quotationFunctionAreaParamPO);

				quotationFunctionAreaParamPO.setQfaid(quotationFunctionAreaPO.getQfaId());

				quotationFunctionAreaParamDao.save(quotationFunctionAreaParamPO);

				BeanUtil.copyPropertie(quotationFunctionAreaParamPO, quotationFunctionAreaVO.getQuotationFunctionAreaParam());
			}

			Timestamp updateTime = quotationPO.getUpdateTime();

			if (updateTime == null) {
				updateTime = quotationVO.getUpdateTime();
			}

			if (updateTime == null) {
				updateTime = DateUtil.getDateToTimestamp(new Date());
			}

			List<QuotationPricePO> quotationPricePOs = quotationPriceDao.queryQuotationPrice(functionAreaPO.getFaid(), updateTime);
			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();

			int sort = 1;

			for (QuotationPricePO quotationPricePO : quotationPricePOs) {

				short itemType = QuotationFunctionAreaItemPO.TYPE_COMMON_INT;
				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();

				QuotationItemPO quotationItemPO = quotationPricePO.getQuotationItem();

				if (functionAreaPO.getType() == FunctionAreaPO.TYPE_IGNORE_INT) {
					itemType = QuotationFunctionAreaItemPO.TYPE_IGNORE_INT;
				}

				if (functionAreaPO.getType() == FunctionAreaPO.TYPE_COST_INT) {
					itemType = QuotationFunctionAreaItemPO.TYPE_COST_INT;
				}

				if (functionAreaPO.getType() == FunctionAreaPO.TYPE_UNACHE_INT) {
					itemType = QuotationFunctionAreaItemPO.TYPE_UNACHE_INT;
				}

				if (quotationItemPO.getType() == QuotationItemPO.TYPE_COST_INT) {
					itemType = QuotationFunctionAreaItemPO.TYPE_COST_INT;
				}

				if (quotationItemPO.getType() == QuotationItemPO.TYPE_UNACHE_INT) {
					itemType = QuotationFunctionAreaItemPO.TYPE_UNACHE_INT;
				}

				quotationFunctionAreaItemVO.setQuotationItemId(quotationItemPO.getQiid());
				quotationFunctionAreaItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());

				quotationFunctionAreaItemVO.setItemName(quotationItemPO.getName());
				quotationFunctionAreaItemVO.setMeasurementUnit(quotationItemPO.getMeasurementUnit().getName());
				quotationFunctionAreaItemVO.setWorkType(quotationItemPO.getWorkType().getName());

				quotationFunctionAreaItemVO.setExpres(quotationItemPO.getFormula());
				quotationFunctionAreaItemVO.setFormula(quotationItemPO.getFormula());
				quotationFunctionAreaItemVO.setNum(0);
				quotationFunctionAreaItemVO.setDiscount(quotationItemPO.getDiscount());
				quotationFunctionAreaItemVO.setIsRtem(quotationItemPO.getIsRtem());

				quotationFunctionAreaItemVO.setAddPrice(quotationPricePO.getAddPrice());
				quotationFunctionAreaItemVO.setUnitPrice(quotationPricePO.getUnitPrice());
				quotationFunctionAreaItemVO.setSubPrice(quotationPricePO.getSubPrice());

				quotationFunctionAreaItemVO.setType(itemType);
				quotationFunctionAreaItemVO.setSubtype((short) quotationPricePO.getQuotationItem().getQuotationType().getId());

				quotationFunctionAreaItemVO.setIndex(sort++);
				quotationFunctionAreaItemVO.setContent(quotationItemPO.getComment());

				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}

			quotationFunctionAreaVO.setQfaId(quotationFunctionAreaPO.getQfaId());
			quotationFunctionAreaVO.setQuotationFunctionAreaItems(quotationFunctionAreaItemVOs);

			_quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
		}

		quotationDao.update(quotationPO);

		return _quotationFunctionAreaVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationVO quotation) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotation.getOrderId());

		if (decorationPO == null) {
			throw new FLException(130014, "订单不存在");
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationPO.getOrderId());

		if (quotationPO == null) {
			throw new FLException(200017, "默认报价不存在");
		}

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("quotationFunctionAreaIndex");
		Short index = systemConfigPO == null ? 0 : Short.valueOf(systemConfigPO.getValue());

		FunctionAreaPO functionAreaPO = functionAreaDao.get(quotationFunctionAreaVO.getId());

		QuotationFunctionAreaPO quotationFunctionAreaPO = new QuotationFunctionAreaPO();

		quotationFunctionAreaPO.setIndex(index);
		quotationFunctionAreaPO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
		quotationFunctionAreaPO.setFunctionAreaOrder(functionAreaPO.getFunctionAreaOrder());
		quotationFunctionAreaPO.setFunctionAreaType(functionAreaPO.getFunctionAreaType());
		quotationFunctionAreaPO.setType(functionAreaPO.getType());
		quotationFunctionAreaPO.setTotal(functionAreaPO.getTotal());
		quotationFunctionAreaPO.setQuotation(quotationPO);

		quotationFunctionAreaDao.save(quotationFunctionAreaPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaVO.getQfaId());

		if (quotationFunctionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		quotationFunctionAreaPO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
		quotationFunctionAreaPO.setFunctionAreaOrder(quotationFunctionAreaVO.getFunctionAreaOrder());

		quotationFunctionAreaDao.update(quotationFunctionAreaPO);

		if (quotationFunctionAreaVO.getQuotationFunctionAreaParam() != null) {

			QuotationFunctionAreaParamPO quotationFunctionAreaParamPO = quotationFunctionAreaParamDao.queryQuotationFunctionAreaParam(quotationFunctionAreaPO.getQfaId());

			if (quotationFunctionAreaParamPO == null) {
				quotationFunctionAreaParamPO = new QuotationFunctionAreaParamPO();

				quotationFunctionAreaParamPO.setQfaid(quotationFunctionAreaPO.getQfaId());
			}

			BeanUtil.copyPropertie(quotationFunctionAreaVO.getQuotationFunctionAreaParam(), quotationFunctionAreaParamPO);

			quotationFunctionAreaParamDao.saveOrUpdate(quotationFunctionAreaParamPO);
		}

		quotationDao.update(quotationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());

		long qfaid = quotationFunctionAreaVO.getQfaId();

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(qfaid);

		if (quotationFunctionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		short index = quotationFunctionAreaPO.getIndex();

		if (extensionItemDao.countExtensionItem(qfaid) > 0) {
			throw new FLException(200028, "功能区存在拓展项");
		}

		if (addReduceItemDao.countAddReduceItem(qfaid) > 0) {
			throw new FLException(200032, "功能区存在增减项");
		}

		if (selectionItemDao.countSelectionItem(quotationPO.getOrderId(), qfaid) > 0) {
			throw new FLException(200037, "存在关联选材项");
		}

		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		quotationFunctionAreaDao.delete(quotationFunctionAreaPO);

		String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(qfaid, index);

		quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(tableName, qfaid);

		quotationDao.update(quotationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationFunctionAreaVO copyQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationVO quotationVO) throws FLException {

		// 检查报价状态
		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());
		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		// 查询原功能区
		QuotationFunctionAreaPO quotationFunctionAreaSO = quotationFunctionAreaDao.get(quotationFunctionAreaVO.getQfaId());

		if (quotationFunctionAreaSO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		// 创建新功能区
		QuotationFunctionAreaPO quotationFunctionAreaTO = new QuotationFunctionAreaPO();
		BeanUtil.copyProperties(quotationFunctionAreaSO, quotationFunctionAreaTO);

		// 设置新功能区的名称（原名称_副本）
		String newName = quotationFunctionAreaSO.getFunctionAreaName() + "_副本";
		quotationFunctionAreaTO.setFunctionAreaName(newName);

		// 设置关联的报价单
		quotationFunctionAreaTO.setQuotation(quotationPO);

		// 保存新功能区
		quotationFunctionAreaDao.save(quotationFunctionAreaTO);
		// 立即刷新以确保主键回填（用于后续参数复制）
		quotationFunctionAreaDao.flush();

		// 更新报价
		quotationDao.update(quotationPO);

		// 复制功能区参数
		quotationFunctionAreaParamDao.copyQuotationFunctionAreaParam(quotationFunctionAreaSO.getQfaId(), quotationFunctionAreaTO.getQfaId());

		// 复制报价项（使用 SQL 方式）
		String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTableName(quotationFunctionAreaTO.getQfaId(), quotationFunctionAreaTO.getIndex());
		quotationFunctionAreaItemDao.copyQuotationFunctionAreaItem(tableName, quotationFunctionAreaSO.getQfaId(), quotationFunctionAreaTO.getQfaId());

		// 查询新功能区的所有报价项，用于返回给前端
		List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaTO.getQfaId(), quotationFunctionAreaTO.getIndex()), quotationFunctionAreaTO.getQfaId());
		List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();

		if (quotationFunctionAreaItemPOs != null && !quotationFunctionAreaItemPOs.isEmpty()) {
			for (QuotationFunctionAreaItemPO quotationFunctionAreaItemPO : quotationFunctionAreaItemPOs) {
				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();
				BeanUtil.copyProperties(quotationFunctionAreaItemPO, quotationFunctionAreaItemVO, Arrays.asList("quotationFunctionArea", "quotationItem"));

				quotationFunctionAreaItemVO.setQuotationFunctionAreaId(quotationFunctionAreaTO.getQfaId());

				if (quotationFunctionAreaItemPO.getQuotationItem() != null) {
					QuotationItemPO quotationItemPO = quotationFunctionAreaItemPO.getQuotationItem();
					quotationFunctionAreaItemVO.setQuotationItemId(quotationItemPO.getQiid());
					quotationFunctionAreaItemVO.setContent(quotationItemPO.getComment());
					quotationFunctionAreaItemVO.setExpres(quotationItemPO.getFormula());
					quotationFunctionAreaItemVO.setIsRtem(quotationItemPO.getIsRtem());
					quotationFunctionAreaItemVO.setQuotationRtemId(quotationItemPO.getRtemFlag());
				}

				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}
		}

		quotationFunctionAreaVO.setQfaId(quotationFunctionAreaTO.getQfaId());
		quotationFunctionAreaVO.setFunctionAreaName(quotationFunctionAreaTO.getFunctionAreaName());
		quotationFunctionAreaVO.setQuotationFunctionAreaItems(quotationFunctionAreaItemVOs);

		return quotationFunctionAreaVO;
	}

	private QuotationPO checkQuotationForStatusByEnabled(long qid) throws FLException {
		QuotationPO quotationPO = quotationDao.get(qid);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() != QuotationPO.STATUS_INIT_INT) {
			throw new FLException(200030, "报价不可操作");
		}

		return quotationPO;
	}

}
